// hooks/useAddToCart.js - PRODUCTION READY
import { useState } from "react";
import Swal from "sweetalert2";
import useCart from "./useCart";

export default function useAddToCart(product) {
    const { addToCart, isAdding } = useCart();

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

    const handleAddToCart = () => {
        if (!validate()) return false;

        // Add to cart using React Query mutation
        addToCart(product, {
            size: selectedSize,
            color: selectedColor,
            qty: Number(qty),
        });

        // Success notification
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `"${product.productName}" added to cart!`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
            background: "#d4edda",
            color: "#155724",
        });

        return true;
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
        resetSelections,
        isAdding,
        sizes,
        colors
    };
}