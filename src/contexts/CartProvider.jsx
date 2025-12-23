// src/contexts/CartProvider.jsx - COMPLETE FIX
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { CartContext } from "./CartContext";
import useAuth from "../hooks/useAuth";
import notify from "../utils/notification";

const CART_KEY = "abaya_shop_cart_v1";

const CartProvider = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const userId = currentUser?.email || null;
    
    const [items, setItems] = useState([]);
    const [prevUserId, setPrevUserId] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const isSavingRef = useRef(false);
    const navigate = useNavigate();

    // ⭐ Detect user logout
    useEffect(() => {
        if (!loading) {
            if (prevUserId && !userId) {
                console.log('🔓 User logged out - clearing cart');
                setItems([]);
                localStorage.removeItem(CART_KEY);
            }
            setPrevUserId(userId);
        }
    }, [userId, loading, prevUserId]);

    // ✅ Cart LOAD করার useEffect
    useEffect(() => {
        if (loading) {
            console.log('⏳ Auth loading...');
            return;
        }

        const loadCart = async () => {
            console.log('📥 Starting cart load...');
            setIsInitialLoad(true);
            isSavingRef.current = true; // Prevent save during load

            try {
                if (userId) {
                    console.log('👤 Loading cart for user:', userId);
                    
                    const res = await axiosInstance.get(`/api/cart/${userId}`);
                    console.log('📦 Backend cart response:', res.data);
                    
                    const backendItems = res.data.items || [];
                    console.log('📊 Backend items count:', backendItems.length);

                    // Merge guest cart if exists
                    const raw = localStorage.getItem(CART_KEY);
                    let guestItems = raw ? JSON.parse(raw) : [];

                    if (guestItems.length > 0) {
                        console.log('🔄 Merging guest cart:', guestItems.length, 'items');
                    }

                    const merged = [...backendItems];
                    guestItems.forEach(gi => {
                        const ex = merged.find(bi => bi.key === gi.key);
                        if (ex) {
                            ex.qty += gi.qty;
                        } else {
                            merged.push(gi);
                        }
                    });

                    console.log('✅ Final cart items:', merged.length);
                    setItems(merged);

                    // Save merged cart to backend
                    if (guestItems.length > 0) {
                        console.log('💾 Saving merged cart to backend');
                        await axiosInstance.post(`/api/cart/${userId}`, { items: merged });
                        localStorage.removeItem(CART_KEY);
                    }
                } else {
                    console.log('👥 Guest mode - loading from localStorage');
                    const raw = localStorage.getItem(CART_KEY);
                    if (raw) {
                        const localItems = JSON.parse(raw);
                        console.log('📦 Guest cart loaded:', localItems.length, 'items');
                        setItems(localItems);
                    } else {
                        console.log('📦 No guest cart found');
                        setItems([]);
                    }
                }
            } catch (err) {
                console.error("❌ Failed to load cart:", err);
                console.error("Error details:", err.response?.data);
                
                // Fallback to localStorage on error
                const raw = localStorage.getItem(CART_KEY);
                if (raw) {
                    const localItems = JSON.parse(raw);
                    console.log('📦 Fallback: loaded from localStorage');
                    setItems(localItems);
                } else {
                    setItems([]);
                }
            } finally {
                // Allow saving after initial load completes
                setTimeout(() => {
                    setIsInitialLoad(false);
                    isSavingRef.current = false;
                    console.log('✅ Cart load complete, save enabled');
                }, 500);
            }
        };

        loadCart();
    }, [userId, loading]);

    // ✅ Cart SAVE করার useEffect - WITH GUARD
    useEffect(() => {
        // Skip if loading or during initial load
        if (loading || isInitialLoad || isSavingRef.current) {
            console.log('⏭️ Skipping save:', { loading, isInitialLoad, isSaving: isSavingRef.current });
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                if (userId) {
                    console.log('💾 Saving cart to backend:', items.length, 'items');
                    isSavingRef.current = true;
                    
                    await axiosInstance.post(`/api/cart/${userId}`, { items });
                    console.log('✅ Cart saved successfully to backend');
                    
                    isSavingRef.current = false;
                } else {
                    // Guest mode
                    if (items.length > 0) {
                        console.log('💾 Saving cart to localStorage:', items.length, 'items');
                        localStorage.setItem(CART_KEY, JSON.stringify(items));
                    } else {
                        console.log('🗑️ Removing empty cart from localStorage');
                        localStorage.removeItem(CART_KEY);
                    }
                }
            } catch (err) {
                console.error("❌ Failed to save cart:", err);
                console.error("Error details:", err.response?.data);
                isSavingRef.current = false;
            }
        }, 500); // Increased debounce time

        return () => clearTimeout(timeout);
    }, [items, userId, loading, isInitialLoad]);

    const addToCart = (product, { size, color, qty = 1 } = {}) => {
        if (!product || !product._id) {
            console.warn("⚠️ Invalid product", product);
            return;
        }

        const key = `${product._id}__${size ?? "NOSIZE"}__${color ?? "NOCOLOR"}`;

        setItems((prev) => {
            const existing = prev.find((it) => it.key === key);
            if (existing) {
                notify.success('Cart updated', `Increased quantity of "${product.productName}" in your cart`, 1500);
                return prev.map((it) =>
                    it.key === key ? { ...it, qty: it.qty + qty } : it
                );
            }

            const newItem = {
                key,
                productId: product._id,
                sku: product.sku || "",
                name: product.productName,
                price: product.newPrice,
                oldPrice: product.oldPrice,
                image: product.images?.[0] ?? "",
                size: size ?? null,
                color: color ?? null,
                qty,
            };
            
            notify.success('Added to cart', `"${product.productName}" has been added to your cart`, 1500);
            return [...prev, newItem];
        });
    };

    const removeItem = (key) => {
        setItems((prev) => prev.filter((it) => it.key !== key));
        notify.success('Item removed', 'Item has been removed from cart', 1500);
    };

    const updateQty = (key, qty) => {
        if (qty <= 0) {
            removeItem(key);
            return;
        }
        setItems((prev) =>
            prev.map((it) => it.key === key ? { ...it, qty } : it)
        );
    };

    const clearCart = () => {
        console.log('🗑️ Clearing cart');
        setItems([]);
        localStorage.removeItem(CART_KEY);
    };

    const goToCart = () => navigate("/cart");

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeItem,
                updateQty,
                clearCart,
                goToCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;