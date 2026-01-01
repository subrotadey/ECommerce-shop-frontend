// pages/Checkout/Checkout.jsx - IMPROVED VERSION
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Package, Mail, Loader2, ShoppingBag, Truck, Shield, ArrowRight, Trash2 } from "lucide-react";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import { authenticatedFetch } from "../../utils/tokenHelper"; // ✅ Use centralized helper
import Swal from "sweetalert2";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem } = useCart();
  const { currentUser } = useAuth(); // ✅ Use currentUser instead of user
  const [processing, setProcessing] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * 0.05;
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + tax + shipping;

  // ✅ IMPROVED: Simplified checkout using centralized token helper
  const handleCheckout = async () => {
    // Validation
    if (!currentUser?.email) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please login to continue",
        confirmButtonColor: "#3B82F6"
      });
      navigate("/login");
      return;
    }

    if (!items || items.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is Empty",
        text: "Add items to cart before checkout",
        confirmButtonColor: "#3B82F6"
      });
      return;
    }

    setProcessing(true);

    try {
      // ✅ Use authenticatedFetch from tokenHelper
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({
            items: items,
            userId: currentUser.email,
            customerEmail: currentUser.email
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to create checkout session");
      }

    } catch (error) {
      console.error("Checkout error:", error);
      setProcessing(false);

      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        html: `
          <p>${error.message}</p>
          <small class="text-gray-500">
            ${error.message.includes("token") || error.message.includes("401") 
              ? "Please try logging out and logging back in." 
              : "Please try again or contact support."}
          </small>
        `,
        confirmButtonColor: "#3B82F6"
      });
    }
  };

  // Update quantity
  const handleUpdateQuantity = (itemKey, newQty) => {
    if (newQty < 1) return;
    updateQty(itemKey, newQty);
  };

  // Remove item with confirmation
  const handleRemoveItem = (itemKey, itemName) => {
    Swal.fire({
      title: 'Remove item?',
      text: `Remove "${itemName}" from cart?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(itemKey);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Item removed",
          showConfirmButton: false,
          timer: 1500,
          toast: true
        });
      }
    });
  };

  // Empty cart UI
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <ShoppingBag className="w-20 h-20 mx-auto text-slate-300 mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-600 mb-8">Add some products to get started!</p>
            <button
              onClick={() => navigate("/abaya")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Checkout
          </h1>
          <p className="text-slate-600 text-lg">Review your order and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                Order Items ({items.length})
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-all group"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 mb-1 truncate">
                        {item.name}
                      </h3>
                      <div className="text-sm text-slate-600 space-y-1">
                        {item.size && item.size !== "NOSIZE" && <p>Size: {item.size}</p>}
                        {item.color && item.color !== "NOCOLOR" && <p>Color: {item.color}</p>}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.key, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.key, item.qty + 1)}
                          className="w-8 h-8 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="text-right flex flex-col justify-between items-end">
                      <div>
                        <p className="text-xl font-bold text-slate-800">
                          ৳{(item.price * item.qty).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-500">
                          ৳{item.price} × {item.qty}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.key, item.name)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <Shield className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Secure Payment</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <Truck className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Fast Delivery</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-md">
                <Package className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Easy Returns</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>

              {/* Customer Info */}
              {currentUser?.email && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{currentUser.email}</span>
                  </div>
                  {currentUser.displayName && (
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="font-medium">{currentUser.displayName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">৳{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-slate-700">
                  <span>Tax (5%)</span>
                  <span className="font-semibold">৳{tax.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-slate-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `৳${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < 1000 && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                    Add ৳{(1000 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-800">
                    <span>Total</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay with Stripe
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                Powered by Stripe • Secure payment processing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;