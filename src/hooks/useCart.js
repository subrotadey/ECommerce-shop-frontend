// hooks/useCart.js
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";
import useAuth from "./useAuth";

const API_URL = "/cart";
const GUEST_KEY = "guest_cart";

// ── helpers ──────────────────────────────────────────────────────────────────

// image যেকোনো রূপে (string / {url} / JSON string) আসুক, plain URL ফেরত দেয়
const toImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") {
    if (image.trim().startsWith("{")) {
      try {
        return JSON.parse(image).url || "";
      } catch {
        return "";
      }
    }
    return image;
  }
  return image.url || "";
};

const pickMain = (list) =>
  Array.isArray(list) ? list.find((i) => i?.isMain && i?.url) || list[0] : null;

const getProductImage = (product) =>
  toImageUrl(pickMain(product?.media?.images)) ||
  toImageUrl(pickMain(product?.images)) ||
  "";

const makeKey = (productId, size, color) =>
  `${productId}__${size ?? "NOSIZE"}__${color ?? "NOCOLOR"}`;

const buildItem = (product, { size, color, qty = 1 }) => ({
  key: makeKey(product._id, size, color),
  productId: product._id,
  sku: product.sku || "",
  name: product.productName,
  price: product.newPrice,
  oldPrice: product.oldPrice,
  image: getProductImage(product),
  size: size ?? null,
  color: color ?? null,
  qty,
});

const readGuest = () => {
  try {
    const stored = localStorage.getItem(GUEST_KEY);
    return stored ? JSON.parse(stored) : { success: true, items: [] };
  } catch {
    return { success: true, items: [] };
  }
};

const writeGuest = (cart) => {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(cart));
  } catch {
    /* storage বন্ধ থাকলে চুপচাপ এড়িয়ে যাই */
  }
};

// একই লগইনে একাধিক হুক-ইনস্ট্যান্স যেন দুইবার merge না করে
let mergePromise = null;

// ── hook ─────────────────────────────────────────────────────────────────────

const useCart = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const userId = currentUser?.email || "guest";

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    queryClient.invalidateQueries({ queryKey: ["cartCount", userId] });
  };

  // ── Guest cart → লগইনের পর server cart-এ merge ─────────────────────────────
  useEffect(() => {
    if (userId === "guest") return;
    const guest = readGuest();
    if (!guest.items?.length || mergePromise) return;

    mergePromise = (async () => {
      try {
        for (const item of guest.items) {
          await axiosInstance.post(`${API_URL}/${userId}/add`, {
            ...item,
            image: toImageUrl(item.image),
          });
        }
        localStorage.removeItem(GUEST_KEY);
        queryClient.invalidateQueries({ queryKey: ["cart", userId] });
        queryClient.invalidateQueries({ queryKey: ["cartCount", userId] });
      } catch (err) {
        // ব্যর্থ হলে guest cart রেখে দিই, পরের বার আবার চেষ্টা হবে
        console.error("Guest cart merge failed:", err);
      } finally {
        mergePromise = null;
      }
    })();
  }, [userId, queryClient]);

  // ── Queries ────────────────────────────────────────────────────────────────

  const {
    data: cartData = { items: [] },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (userId === "guest") return readGuest();
      const { data } = await axiosInstance.get(`${API_URL}/${userId}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const { data: cartCount = 0 } = useQuery({
    queryKey: ["cartCount", userId],
    queryFn: async () => {
      if (userId === "guest") {
        return readGuest().items?.reduce((sum, i) => sum + i.qty, 0) || 0;
      }
      const { data } = await axiosInstance.get(`${API_URL}/${userId}/count`);
      return data.count || 0;
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────

  // এক বা একাধিক লাইন (size/color) একসাথে যোগ করে। await করা যায়।
  const addItemsMutation = useMutation({
    mutationFn: async ({ product, lines }) => {
      const items = lines
        .filter((l) => Number(l.qty) > 0)
        .map((l) => buildItem(product, { ...l, qty: Number(l.qty) }));

      if (items.length === 0) throw new Error("No items to add");

      if (userId === "guest") {
        const cart = readGuest();
        for (const item of items) {
          const idx = cart.items.findIndex((i) => i.key === item.key);
          if (idx !== -1) cart.items[idx].qty += item.qty;
          else cart.items.push(item);
        }
        writeGuest(cart);
        return cart;
      }

      // ক্রমানুসারে পাঠাই, যাতে server-এ একই cart document-এ race না হয়
      let data;
      for (const item of items) {
        ({ data } = await axiosInstance.post(`${API_URL}/${userId}/add`, item));
      }
      return data;
    },
    onSuccess: refresh,
  });

  const updateQtyMutation = useMutation({
    mutationFn: async ({ key, qty }) => {
      if (userId === "guest") {
        const cart = readGuest();
        if (qty <= 0) {
          cart.items = cart.items.filter((i) => i.key !== key);
        } else {
          const item = cart.items.find((i) => i.key === key);
          if (item) item.qty = qty;
        }
        writeGuest(cart);
        return cart;
      }
      const { data } = await axiosInstance.patch(
        `${API_URL}/${userId}/update/${key}`,
        { qty }
      );
      return data;
    },
    onSuccess: refresh,
  });

  const removeItemMutation = useMutation({
    mutationFn: async (key) => {
      if (userId === "guest") {
        const cart = readGuest();
        cart.items = cart.items.filter((i) => i.key !== key);
        writeGuest(cart);
        return cart;
      }
      const { data } = await axiosInstance.delete(
        `${API_URL}/${userId}/remove/${key}`
      );
      return data;
    },
    onSuccess: refresh,
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (userId === "guest") {
        localStorage.removeItem(GUEST_KEY);
        return { success: true, items: [] };
      }
      const { data } = await axiosInstance.delete(`${API_URL}/${userId}/clear`);
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart", userId], { success: true, items: [] });
      queryClient.setQueryData(["cartCount", userId], 0);
    },
  });

  // ── API ────────────────────────────────────────────────────────────────────

  // পুরোনো cart item-এ image object থাকতে পারে; সবসময় string করে দিই
  const items = (cartData.items || []).map((i) => ({
    ...i,
    image: toImageUrl(i.image),
  }));

  return {
    items,
    cartCount,
    isLoading,
    isError,
    error,

    // আগের API (অক্ষত): একটি লাইন, await করা যায় না
    addToCart: (product, options = {}) =>
      addItemsMutation.mutate({ product, lines: [options] }),

    // নতুন: await করা যায়। lines = [{ size, color, qty }, ...]
    addItems: (product, lines) =>
      addItemsMutation.mutateAsync({ product, lines }),

    updateQty: (key, qty) => updateQtyMutation.mutate({ key, qty }),
    removeItem: (key) => removeItemMutation.mutate(key),
    clearCart: () => clearCartMutation.mutate(),

    isAdding: addItemsMutation.isPending,
    isUpdating: updateQtyMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};

export default useCart;