// src/pages/Cart/Cart.jsx (IMPROVED)

import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import notify from "../../utils/notification";

const Cart = () => {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  // Handle quantity change with validation
  const handleQtyChange = (key, newQty) => {
    if (newQty < 1) {
      notify.warning('Quantity must be at least 1', '', 1500);
      return;
    }
    updateQty(key, newQty);
  };

  // Handle item removal with confirmation
  const handleRemoveItem = async (key, itemName) => {
    const confirmed = await notify.confirm(
      'Remove from cart?',
      `Remove "${itemName}" from your cart?`,
      'Yes, remove',
      'Cancel'
    );

    if (confirmed) {
      removeItem(key);
      notify.success('Item removed', `"${itemName}" removed from cart`, 1500);
    }
  };

  // Handle clear cart with confirmation
  const handleClearCart = async () => {
    const confirmed = await notify.confirm(
      'Clear entire cart?',
      `Remove all ${items.length} items from your cart?`,
      'Yes, clear cart',
      'Cancel'
    );

    if (confirmed) {
      clearCart();
      notify.success('Cart cleared', 'All items removed from cart');
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      notify.warning('Cart is empty', 'Add items to cart before checkout');
      return;
    }
    navigate("/checkout");
  };

  if (!items || items.length === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Shopping Cart</h2>
          <span className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.key} className="flex items-center gap-4 border p-4 rounded-lg hover:shadow-md transition-shadow">
              <img 
                src={it.image} 
                alt={it.name} 
                className="w-24 h-24 object-cover rounded" 
              />

              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{it.name}</h3>
                <p className="text-sm text-gray-600">
                  Size: {it.size ?? "—"} | Color: {it.color ?? "—"}
                </p>
                <p className="mt-1 font-semibold text-gray-900">৳ {it.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQtyChange(it.key, it.qty - 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
                  disabled={it.qty <= 1}
                >
                  -
                </button>
                <input
                  value={it.qty}
                  onChange={(e) => {
                    const v = Math.max(1, Number(e.target.value || 1));
                    handleQtyChange(it.key, v);
                  }}
                  className="w-16 text-center border rounded px-2 py-1"
                  type="number"
                  min={1}
                />
                <button
                  onClick={() => handleQtyChange(it.key, it.qty + 1)}
                  className="px-3 py-1 border rounded hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold text-gray-900">
                  ৳ {(it.price * it.qty).toFixed(2)}
                </p>
                <button 
                  onClick={() => handleRemoveItem(it.key, it.name)} 
                  className="text-red-600 text-sm hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center border-t pt-6">
          <button 
            onClick={handleClearCart} 
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Clear cart
          </button>

          <div className="text-right">
            <p className="text-lg text-gray-600">
              Subtotal: <span className="font-semibold text-gray-900">৳ {subtotal.toFixed(2)}</span>
            </p>
            <button
              onClick={handleCheckout}
              className="mt-3 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
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