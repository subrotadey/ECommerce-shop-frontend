// ============================================
// UPDATED CartProvider.jsx - Better logout handling
// ============================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { CartContext } from "./CartContext";
import useAuth from "../hooks/useAuth";

const CART_KEY = "abaya_shop_cart_v1";

const CartProvider = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const userId = currentUser?._id || null;
    const [items, setItems] = useState([]);
    const [prevUserId, setPrevUserId] = useState(null); // ⭐ Track previous userId
    const navigate = useNavigate();

    console.log("=== CartProvider Debug ===");
    console.log("Auth loading:", loading);
    console.log("Current user:", currentUser);
    console.log("User ID:", userId);
    console.log("Prev User ID:", prevUserId);
    console.log("Cart items:", items.length);
    console.log("========================");

    // ⭐ Detect user logout
    useEffect(() => {
        if (!loading) {
            // If previous user existed but now is null = logout happened
            if (prevUserId && !userId) {
                console.log("🚪 User logged out detected, clearing cart...");
                setItems([]);
                localStorage.removeItem(CART_KEY);
            }
            setPrevUserId(userId);
        }
    }, [userId, loading, prevUserId]);

    // Cart load করার useEffect
    useEffect(() => {
        if (loading) {
            console.log("⏳ Waiting for auth to load...");
            return;
        }

        const loadCart = async () => {
            try {
                if (userId) {
                    console.log("✅ Loading cart from backend for user:", userId);
                    
                    const res = await axiosInstance.get(`/api/cart/${userId}`);
                    const backendItems = res.data.items || [];
                    console.log("Backend cart items:", backendItems.length);

                    const raw = localStorage.getItem(CART_KEY);
                    let guestItems = raw ? JSON.parse(raw) : [];
                    console.log("Guest cart items:", guestItems.length);

                    const merged = [...backendItems];
                    guestItems.forEach(gi => {
                        const ex = merged.find(bi => bi.key === gi.key);
                        if (ex) {
                            ex.qty += gi.qty;
                        } else {
                            merged.push(gi);
                        }
                    });

                    setItems(merged);

                    if (guestItems.length > 0) {
                        await axiosInstance.post(`/api/cart/${userId}`, { items: merged });
                        localStorage.removeItem(CART_KEY);
                        console.log("✅ Guest cart merged and synced");
                    }
                } else {
                    console.log("👤 Guest user, loading from localStorage...");
                    const raw = localStorage.getItem(CART_KEY);
                    if (raw) {
                        const localItems = JSON.parse(raw);
                        setItems(localItems);
                        console.log("Loaded items:", localItems.length);
                    }
                }
            } catch (err) {
                console.error("❌ Failed to load cart:", err);
            }
        };
        
        loadCart();
    }, [userId, loading]);

    // Cart save করার useEffect
    useEffect(() => {
        if (loading) return;

        const timeout = setTimeout(async () => {
            try {
                if (userId) {
                    console.log("💾 Saving cart to backend...");
                    await axiosInstance.post(`/api/cart/${userId}`, { items });
                    console.log("✅ Cart saved to backend");
                } else {
                    if (items.length > 0) {
                        localStorage.setItem(CART_KEY, JSON.stringify(items));
                        console.log("💾 Cart saved to localStorage");
                    }
                }
            } catch (err) {
                console.error("❌ Failed to save cart:", err);
            }
        }, 400);

        return () => clearTimeout(timeout);
    }, [items, userId, loading]);

    const addToCart = (product, { size, color, qty = 1 } = {}) => {
        if (!product || !product._id) {
            console.warn("⚠️ Invalid product", product);
            return;
        }
        
        const key = `${product._id}__${size ?? "NOSIZE"}__${color ?? "NOCOLOR"}`;
        
        setItems((prev) => {
            const existing = prev.find((it) => it.key === key);
            if (existing) {
                console.log("📦 Updated quantity for:", product.productName);
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
            
            console.log("✅ Added to cart:", product.productName);
            return [...prev, newItem];
        });
    };

    const removeItem = (key) => {
        setItems((prev) => prev.filter((it) => it.key !== key));
        console.log("🗑️ Removed item from cart");
    };

    const updateQty = (key, qty) => {
        if (qty <= 0) {
            removeItem(key);
            return;
        }
        setItems((prev) => 
            prev.map((it) => it.key === key ? { ...it, qty } : it)
        );
        console.log("🔄 Updated quantity");
    };

    const clearCart = () => {
        console.log("🧹 Clearing cart manually...");
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