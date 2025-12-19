// hooks/useAddToCart.js
import { useState } from "react";
import Swal from "sweetalert2";
import useCart from "./useCart";

export default function useAddToCart(product) {
    const { addToCart } = useCart();

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
        return true;
    };

    const handleAddToCart = () => {
        if (!validate()) return;

        addToCart(product, {
            size: selectedSize,
            color: selectedColor,
            qty: Number(qty),
        });

        // SweetAlert
        Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Added to wishlist!",
                    showConfirmButton: false,
                    timer: 1000,
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
        sizes,
        colors
    };
}