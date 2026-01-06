// pages/CheckoutSuccess.jsx
import axios from "axios";
import { ArrowRight, CheckCircle, Loader2, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError("Invalid session or order ID");
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [sessionId, orderId]);

  const verifyPayment = async () => {
    try {
      const token = localStorage.getItem("firebaseToken");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/checkout/verify/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError("Payment verification failed");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setError(err.response?.data?.message || "Failed to verify payment");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifying Payment...</h2>
          <p className="text-slate-600">Please wait while we confirm your order</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-12 text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Payment Verification Failed</h2>
          <p className="text-slate-600 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/cart")}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Payment Successful!
          </h1>

          <p className="text-xl text-slate-600 mb-2">
            Thank you for your purchase
          </p>

          <p className="text-lg text-slate-500">
            Order ID: <span className="font-mono font-bold text-blue-600">{orderId}</span>
          </p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              Order Details
            </h2>

            {/* Customer Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-slate-800 mb-2">Customer Information</h3>
              <p className="text-slate-700">{order.customer.name}</p>
              <p className="text-slate-600">{order.customer.email}</p>
              {order.customer.phone && (
                <p className="text-slate-600">{order.customer.phone}</p>
              )}
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 border border-slate-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{item.name}</h4>
                      <p className="text-sm text-slate-600">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-slate-600">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">${item.price * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-6">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span>${order.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Tax</span>
                  <span>${order.pricing.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Shipping</span>
                  <span>
                    {order.pricing.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${order.pricing.shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-800 pt-4 border-t">
                <span>Total Paid</span>
                <span>${order.pricing.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-800">Payment Status</p>
                  <p className="text-sm text-green-600">
                    Paid via {order.payment.method.toUpperCase()}
                  </p>
                </div>
                <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold">
                  {order.payment.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Order Status */}
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-800">Order Status</p>
                  <p className="text-sm text-blue-600">
                    Your order is being processed
                  </p>
                </div>
                <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate(`/profile/orders`)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white border-2 border-slate-300 text-slate-800 px-6 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-2">
            A confirmation email has been sent to <span className="font-semibold">{order?.customer.email}</span>
          </p>
          <p className="text-sm text-slate-500">
            You can track your order status in your profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;