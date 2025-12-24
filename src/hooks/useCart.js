// // src/hooks/useCart.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import useAuth from './useAuth';

const API_URL = 'http://localhost:5000/api/cart';

const useCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.email || 'guest';

  // ============================================
  // QUERIES
  // ============================================

  // Fetch cart items
  const { 
    data: cartData = { items: [] }, 
    isLoading, 
    isError,
    error
  } = useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (userId === 'guest') {
        // Guest mode: load from localStorage
        const stored = localStorage.getItem('guest_cart');
        return stored ? JSON.parse(stored) : { success: true, items: [] };
      }
      
      // Logged-in user: load from backend
      const { data } = await axiosInstance.get(`${API_URL}/${userId}`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Important for cart
    onError: (error) => {
      console.error('Cart fetch error:', error);
    }
  });

  // Get cart count
  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cartCount', userId],
    queryFn: async () => {
      if (userId === 'guest') {
        const stored = localStorage.getItem('guest_cart');
        if (!stored) return 0;
        const data = JSON.parse(stored);
        return data.items?.reduce((sum, item) => sum + item.qty, 0) || 0;
      }
      
      const { data } = await axiosInstance.get(`${API_URL}/${userId}/count`);
      return data.count || 0;
    },
    staleTime: 1000 * 60 * 2,
    retry: 1
  });

  // ============================================
  // 🔄 MUTATIONS
  // ============================================

  // Add to cart
  const addToCartMutation = useMutation({
    mutationFn: async ({ product, size, color, qty = 1 }) => {
      const key = `${product._id}__${size ?? "NOSIZE"}__${color ?? "NOCOLOR"}`;
      
      const item = {
        key,
        productId: product._id,
        sku: product.sku || "",
        name: product.productName,
        price: product.newPrice,
        oldPrice: product.oldPrice,
        image: product.images?.[0] ?? "",
        size: size ?? null,
        color: color ?? null,
        qty
      };

      if (userId === 'guest') {
        // Guest mode: update localStorage
        const stored = localStorage.getItem('guest_cart');
        const currentCart = stored ? JSON.parse(stored) : { success: true, items: [] };
        
        const existingIndex = currentCart.items.findIndex(i => i.key === key);
        if (existingIndex !== -1) {
          currentCart.items[existingIndex].qty += qty;
        } else {
          currentCart.items.push(item);
        }
        
        localStorage.setItem('guest_cart', JSON.stringify(currentCart));
        return currentCart;
      }

      // Logged-in user: save to backend
      const { data } = await axiosInstance.post(`${API_URL}/${userId}/add`, item);
      return data;
    },
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['cart', userId]);

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(['cart', userId]);

      // Optimistically update
      queryClient.setQueryData(['cart', userId], (old = { items: [] }) => {
        const key = `${newItem.product._id}__${newItem.size ?? "NOSIZE"}__${newItem.color ?? "NOCOLOR"}`;
        const existingIndex = old.items.findIndex(i => i.key === key);
        
        if (existingIndex !== -1) {
          const updated = [...old.items];
          updated[existingIndex].qty += newItem.qty;
          return { ...old, items: updated };
        }
        
        return { 
          ...old, 
          items: [...old.items, {
            key,
            productId: newItem.product._id,
            name: newItem.product.productName,
            price: newItem.product.newPrice,
            oldPrice: newItem.product.oldPrice,
            image: newItem.product.images?.[0],
            size: newItem.size,
            color: newItem.color,
            qty: newItem.qty
          }]
        };
      });

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      // Rollback on error
      queryClient.setQueryData(['cart', userId], context.previousCart);
      console.error('Add to cart error:', err);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(['cart', userId]);
      queryClient.invalidateQueries(['cartCount', userId]);
    }
  });

  // Update quantity
  const updateQtyMutation = useMutation({
    mutationFn: async ({ key, qty }) => {
      if (userId === 'guest') {
        const stored = localStorage.getItem('guest_cart');
        const currentCart = stored ? JSON.parse(stored) : { success: true, items: [] };
        
        if (qty <= 0) {
          currentCart.items = currentCart.items.filter(i => i.key !== key);
        } else {
          const item = currentCart.items.find(i => i.key === key);
          if (item) item.qty = qty;
        }
        
        localStorage.setItem('guest_cart', JSON.stringify(currentCart));
        return currentCart;
      }

      const { data } = await axiosInstance.patch(`${API_URL}/${userId}/update/${key}`, { qty });
      return data;
    },
    onMutate: async ({ key, qty }) => {
      await queryClient.cancelQueries(['cart', userId]);
      const previousCart = queryClient.getQueryData(['cart', userId]);

      queryClient.setQueryData(['cart', userId], (old = { items: [] }) => {
        if (qty <= 0) {
          return { ...old, items: old.items.filter(i => i.key !== key) };
        }
        return {
          ...old,
          items: old.items.map(i => i.key === key ? { ...i, qty } : i)
        };
      });

      return { previousCart };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart', userId], context.previousCart);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart', userId]);
      queryClient.invalidateQueries(['cartCount', userId]);
    }
  });

  // Remove item
  const removeItemMutation = useMutation({
    mutationFn: async (key) => {
      if (userId === 'guest') {
        const stored = localStorage.getItem('guest_cart');
        const currentCart = stored ? JSON.parse(stored) : { success: true, items: [] };
        currentCart.items = currentCart.items.filter(i => i.key !== key);
        localStorage.setItem('guest_cart', JSON.stringify(currentCart));
        return currentCart;
      }

      const { data } = await axiosInstance.delete(`${API_URL}/${userId}/remove/${key}`);
      return data;
    },
    onMutate: async (key) => {
      await queryClient.cancelQueries(['cart', userId]);
      const previousCart = queryClient.getQueryData(['cart', userId]);

      queryClient.setQueryData(['cart', userId], (old = { items: [] }) => ({
        ...old,
        items: old.items.filter(i => i.key !== key)
      }));

      return { previousCart };
    },
    onError: (err, key, context) => {
      queryClient.setQueryData(['cart', userId], context.previousCart);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cart', userId]);
      queryClient.invalidateQueries(['cartCount', userId]);
    }
  });

  // Clear cart
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (userId === 'guest') {
        localStorage.removeItem('guest_cart');
        return { success: true, items: [] };
      }

      const { data } = await axiosInstance.delete(`${API_URL}/${userId}/clear`);
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(['cart', userId], { success: true, items: [] });
      queryClient.invalidateQueries(['cartCount', userId]);
    }
  });

  // ============================================
  // 🎯 RETURN API
  // ============================================

  return {
    // Data
    items: cartData.items || [],
    cartCount,
    isLoading,
    isError,
    error,
    
    // Actions
    addToCart: (product, options = {}) => addToCartMutation.mutate({ product, ...options }),
    updateQty: (key, qty) => updateQtyMutation.mutate({ key, qty }),
    removeItem: (key) => removeItemMutation.mutate(key),
    clearCart: () => clearCartMutation.mutate(),
    
    // Loading states
    isAdding: addToCartMutation.isPending,
    isUpdating: updateQtyMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isClearing: clearCartMutation.isPending
  };
};

export default useCart;