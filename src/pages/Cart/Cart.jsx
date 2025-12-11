
import { useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";

const Cart = () => {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate(); // ✅ add this

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Shopping Cart</h2>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.key} className="flex items-center gap-4 border p-4 rounded">
            <img src={it.image} alt={it.name} className="w-24 h-24 object-cover rounded" />

            <div className="flex-1">
              <h3 className="font-medium">{it.name}</h3>
              <p className="text-sm text-gray-600">Size: {it.size ?? "—"} | Color: {it.color ?? "—"}</p>
              <p className="mt-1 font-semibold">{it.price} ৳</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(it.key, Math.max(1, it.qty - 1))}
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <input
                value={it.qty}
                onChange={(e) => {
                  const v = Math.max(1, Number(e.target.value || 1));
                  updateQty(it.key, v);
                }}
                className="w-12 text-center border rounded px-2 py-1"
                type="number"
                min={1}
              />
              <button
                onClick={() => updateQty(it.key, it.qty + 1)}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-semibold">{(it.price * it.qty).toFixed(2)} ৳</p>
              <button onClick={() => removeItem(it.key)} className="text-red-600 text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button onClick={clearCart} className="text-sm text-red-600">
          Clear cart
        </button>

        <div className="text-right">
          <p className="text-lg">Subtotal: <span className="font-semibold">{subtotal.toFixed(2)} ৳</span></p>
          <button
            onClick={() => navigate("/checkout")} // ✅ now it works
            className="mt-3 bg-black text-white px-6 py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
