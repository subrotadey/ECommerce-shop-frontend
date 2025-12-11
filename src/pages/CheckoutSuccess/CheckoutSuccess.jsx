// src/pages/CheckoutSuccess.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart(); // empty cart after successful payment
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
      <p>Thank you for your purchase.</p>
      <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded">Back to Home</Link>
    </div>
  );
};

export default CheckoutSuccess;
