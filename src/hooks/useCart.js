// ============================================
// hooks/useCart.js - IMPROVED (Remove unused code)
// ============================================
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';
import useAuth from './useAuth';

const API_URL = '/api/cart'; // ✅ Use relative path (axiosInstance has baseURL)

const useCart = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const userId = currentUser?.email || 'guest';

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
        const stored = localStorage.getItem('guest_cart');
        return stored ? JSON.parse(stored) : { success: true, items: [] };
      }
      
      const { data } = await axiosInstance.get(`${API_URL}/${userId}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    retry: 1,
    refetchOnWindowFocus: false,
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
  // MUTATIONS
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

      const { data } = await axiosInstance.post(`${API_URL}/${userId}/add`, item);
      return data;
    },
    onSuccess: () => {
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
  // RETURN API
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