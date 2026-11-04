// pages/Cart/Cart.jsx
import { AlertTriangle, Minus, Plus, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import Loading from "../../components/Shared/Loading/Loading";
import useCart from "../../hooks/useCart";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_DISCOUNT_THRESHOLD,
  DELIVERY_NOTICE,
  MOQ_PER_COLOR,
  formatMoney,
  summarizeCart,
} from "../../utils/wholesale";

const toast = (icon, title, timer = 1500) =>
  Swal.fire({
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer,
    toast: true,
  });

// টাইপ করার সময় server call নয়; Enter বা বাইরে ক্লিক করলে সেভ হয়
const QtyInput = ({ value, disabled, onCommit }) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const n = Math.floor(Number(draft));
    if (!Number.isFinite(n) || n < 1) {
      setDraft(String(value));
      return;
    }
    if (n !== value) onCommit(n);
  };

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      inputMode="numeric"
      disabled={disabled}
      className="w-14 text-center border-x px-2 py-2 focus:outline-none"
      aria-label="Quantity"
    />
  );
};

const Cart = () => {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    isLoading,
    isError,
    isUpdating,
    isRemoving,
    isClearing,
  } = useCart();

  const navigate = useNavigate();
  const summary = summarizeCart(items);

  const handleRemoveItem = (key, label) => {
    Swal.fire({
      title: "Remove from cart?",
      text: `Remove ${label} from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(key);
        toast("success", "Removed from cart");
      }
    });
  };

  const handleQtyChange = (item, newQty) => {
    if (newQty < 1) {
      handleRemoveItem(item.key, `size ${item.size ?? ""} of "${item.name}"`);
      return;
    }
    updateQty(item.key, newQty);
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear entire cart?",
      text: `Remove all ${summary.totalQuantity} pieces from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, clear cart",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        toast("success", "Cart cleared");
      }
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast("warning", "Cart is empty", 2000);
      return;
    }
    if (!summary.moqOk) {
      Swal.fire({
        icon: "warning",
        title: `Minimum ${MOQ_PER_COLOR} pieces per color`,
        html: summary.invalidGroups
          .map(
            (g) =>
              `<p style="margin:4px 0"><b>${g.name}</b>${
                g.color ? ` (${g.color})` : ""
              }: add ${g.moqShort} more</p>`
          )
          .join(""),
        confirmButtonColor: "#111827",
      });
      return;
    }
    navigate("/checkout");
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <>
        <Breadcrumb />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl mb-4">Error loading cart</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!items || items.length === 0) {
    return (
      <>
        <Breadcrumb />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Start adding products you love!</p>
            <Link
              to="/abaya"
              className="inline-block bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
            >
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
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {summary.totalQuantity} pieces · {summary.groups.length}{" "}
                {summary.groups.length === 1 ? "color group" : "color groups"}
              </p>
            </div>
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
            >
              {isClearing ? "Clearing..." : "Clear cart"}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Groups */}
            <div className="lg:col-span-2 space-y-4">
              {summary.groups.map((group) => {
                const pct = Math.min(100, (group.qty / MOQ_PER_COLOR) * 100);
                return (
                  <div
                    key={group.key}
                    className={`bg-white rounded-lg shadow-sm p-4 border ${
                      group.moqMet ? "border-transparent" : "border-amber-300"
                    }`}
                  >
                    <div className="flex gap-4">
                      <Link to={`/product/${group.productId}`} className="shrink-0">
                        <img
                          src={group.image || "/placeholder.jpg"}
                          alt={group.name}
                          className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-lg bg-gray-100"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${group.productId}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-gray-600 line-clamp-2">
                            {group.name}
                          </h3>
                        </Link>
                        {group.color && (
                          <p className="text-sm text-gray-600 mt-0.5">
                            Color: <span className="font-medium">{group.color}</span>
                          </p>
                        )}

                        {/* MOQ progress */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span
                              className={
                                group.moqMet ? "text-green-700 font-medium" : "text-amber-700 font-medium"
                              }
                            >
                              {group.moqMet
                                ? `Minimum met (${group.qty} pcs)`
                                : `${group.qty}/${MOQ_PER_COLOR} pcs, add ${group.moqShort} more`}
                            </span>
                            <span className="text-gray-500">Min {MOQ_PER_COLOR} per color</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${group.moqMet ? "bg-green-500" : "bg-amber-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          {!group.moqMet && (
                            <Link
                              to={`/product/${group.productId}`}
                              className="inline-block mt-2 text-xs font-medium text-gray-900 underline"
                            >
                              Add more sizes
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Size rows */}
                    <div className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
                      {group.items.map((item) => (
                        <div
                          key={item.key}
                          className="flex flex-wrap items-center gap-3 py-3"
                        >
                          <div className="w-16">
                            <p className="text-xs text-gray-500">Size</p>
                            <p className="font-semibold text-gray-900">
                              {item.size && item.size !== "NOSIZE" ? item.size : "-"}
                            </p>
                          </div>

                          <div className="text-sm text-gray-600">
                            {item.oldPrice > item.price && (
                              <span className="text-xs text-gray-400 line-through mr-1">
                                {formatMoney(item.oldPrice)}
                              </span>
                            )}
                            <span className="font-medium text-gray-900">
                              {formatMoney(item.price)}
                            </span>
                            <span className="text-xs text-gray-400"> / pc</span>
                          </div>

                          <div className="flex items-center border rounded-lg ml-auto">
                            <button
                              onClick={() => handleQtyChange(item, item.qty - 1)}
                              disabled={isUpdating}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <QtyInput
                              value={item.qty}
                              disabled={isUpdating}
                              onCommit={(n) => handleQtyChange(item, n)}
                            />
                            <button
                              onClick={() => handleQtyChange(item, item.qty + 1)}
                              disabled={isUpdating}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <p className="w-28 text-right font-bold text-gray-900">
                            {formatMoney(item.price * item.qty)}
                          </p>

                          <button
                            onClick={() =>
                              handleRemoveItem(
                                item.key,
                                `size ${item.size ?? ""} of "${item.name}"`
                              )
                            }
                            disabled={isRemoving}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Remove"
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total pieces</span>
                  <span className="font-medium text-gray-900">{summary.totalQuantity}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatMoney(summary.subtotal)}</span>
                </div>
                {summary.bulkDiscountPercent > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Bulk discount ({summary.bulkDiscountPercent}%)</span>
                    <span className="font-medium">−{formatMoney(summary.bulkDiscount)}</span>
                  </div>
                )}
              </div>

              {summary.bulkDiscountPercent === 0 && (
                <div className="mt-3 flex gap-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <Tag size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Add <b>{summary.piecesToBulk}</b> more pieces to get{" "}
                    {BULK_DISCOUNT_PERCENT}% off (orders of {BULK_DISCOUNT_THRESHOLD}+ pieces).
                  </span>
                </div>
              )}

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatMoney(summary.afterBulk)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Coupon (if any) is applied at checkout. Final amount is confirmed by the server.
              </p>

              <div className="mt-3 flex gap-2 text-xs text-gray-600">
                <Truck size={14} className="shrink-0 mt-0.5" />
                <span>{DELIVERY_NOTICE}</span>
              </div>

              {!summary.moqOk && (
                <div className="mt-4 flex gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Minimum {MOQ_PER_COLOR} pieces per color is required. Please complete the
                    highlighted groups.
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-5">
                <button
                  onClick={handleCheckout}
                  disabled={!summary.moqOk}
                  className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
                <Link
                  to="/abaya"
                  className="w-full text-center bg-white border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;