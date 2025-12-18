import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import shoppingBag from "../../assets/icons/shopping-bag.svg";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";

const Cart = () => {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  if (!items || items.length === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4 M7 13L5.4 5M7 13l-2 4h14 m-5 4a1 1 0 11-2 0 m-4 0a1 1 0 11-2 0" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <Link to="/abaya" className="inline-block bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </>

    );
  }

  return (
    <>
      <Breadcrumb />
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
    </>
  );
};

export default Cart;
