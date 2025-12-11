// src/pages/CheckoutCancel.jsx
import React from "react";
import { Link } from "react-router-dom";

const CheckoutCancel = () => (
  <div className="max-w-4xl mx-auto py-12 px-4 text-center">
    <h2 className="text-2xl font-semibold mb-4">Payment Cancelled</h2>
    <p>Your payment was not completed.</p>
    <Link to="/cart" className="mt-6 inline-block bg-black text-white px-6 py-2 rounded">Back to Cart</Link>
  </div>
);

export default CheckoutCancel;
