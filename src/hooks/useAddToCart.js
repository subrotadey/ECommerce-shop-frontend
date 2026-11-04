// hooks/useAddToCart.js
import { useState } from "react";
import Swal from "sweetalert2";
import useCart from "./useCart";

export default function useAddToCart(product) {
    const { addToCart, addItems, isAdding } = useCart();

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [qty, setQty] = useState(1);
    const [error, setError] = useState("");

    const sizes = product?.sizes ?? [];
    const colors = product?.colors ?? [];

    const validate = () => {
        setError("");

        if (sizes.length > 0 && !selectedSize) {
            setError("Please select a size.");
            return false;
        }
        if (colors.length > 0 && !selectedColor) {
            setError("Please select a color.");
            return false;
        }
        if (qty < 1) {
            setError("Quantity must be at least 1.");
            return false;
        }
        if (product.stock && qty > product.stock) {
            setError(`Only ${product.stock} items available in stock.`);
            return false;
        }
        return true;
    };

    const toast = (title) =>
        Swal.fire({
            position: "top-end",
            icon: "success",
            title,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            background: "#d4edda",
            color: "#155724",
        });

    // পুরোনো একক-লাইন API (অন্য পেজের জন্য অক্ষত)
    const handleAddToCart = () => {
        if (!validate()) return false;

        addToCart(product, {
            size: selectedSize,
            color: selectedColor,
            qty: Number(qty),
        });

        toast(`"${product.productName}" added to cart!`);
        return true;
    };

    // নতুন: ProductDetails-এর জন্য। একটি রঙের একাধিক size একসাথে যোগ করে।
    // await করা যায়; কোনো toast দেখায় না (ডাকা পেজ নিজে ঠিক করবে)।
    const addColorGroup = async ({ color, sizes: lines }) => {
        await addItems(
            product,
            (lines || []).map(({ size, qty: q }) => ({
                size,
                color,
                qty: Number(q),
            }))
        );
    };

    const resetSelections = () => {
        setSelectedSize("");
        setSelectedColor("");
        setQty(1);
        setError("");
    };

    return {
        selectedSize,
        setSelectedSize,
        selectedColor,
        setSelectedColor,
        qty,
        setQty,
        error,
        handleAddToCart,
        addColorGroup,
        resetSelections,
        isAdding,
        sizes,
        colors,
    };
}