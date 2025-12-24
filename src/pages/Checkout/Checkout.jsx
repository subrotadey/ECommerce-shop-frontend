// src/pages/Checkout/Checkout.jsx
import { useState } from "react";
import useCart from "../../hooks/useCart";
// import { useCart } from "../../contexts/CartContext";

const Checkout = () => {
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  if (!items || items.length === 0) {
    return <div className="max-w-4xl mx-auto py-12 px-4">Your cart is empty</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

      <div className="space-y-4">
        {items.map(it => (
          <div key={it.key} className="flex justify-between border p-4 rounded">
            <span>{it.name} x {it.qty}</span>
            <span>{(it.price * it.qty).toFixed(2)} ৳</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">Subtotal: {subtotal.toFixed(2)} ৳</p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
