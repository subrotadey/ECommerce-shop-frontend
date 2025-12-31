import { useEffect, useState } from "react";
import { CheckCircle, Package, Download, ArrowRight, Loader2, Mail, MapPin } from "lucide-react";

const CheckoutSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]));

    // Get session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrderDetails = async (sessionId) => {
    try {
      const token = localStorage.getItem("firebaseToken");
      
      const response = await fetch(`http://localhost:5000/api/orders/session/${sessionId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrderData(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-slate-700 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center mb-8">
          {/* Success Animation */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <CheckCircle className="w-24 h-24 text-green-600 relative" strokeWidth={2} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-slate-600 text-lg mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {/* Order Details */}
          {orderData?.order && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Order ID</p>
                  <p className="font-bold text-slate-800">{orderData.order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Amount Paid</p>
                  <p className="font-bold text-slate-800">
                    ৳{orderData.order.pricing.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Payment Method</p>
                  <p className="font-bold text-slate-800 capitalize">
                    {orderData.order.payment.method}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Status</p>
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {orderData.order.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info */}
          {orderData?.session && (
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Order Confirmation
              </h3>
              <p className="text-slate-700">
                A confirmation email has been sent to{" "}
                <span className="font-semibold">{orderData.session.customer_email}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = "/orders"}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Package className="w-5 h-5" />
              View Orders
            </button>
            
            <button
              onClick={() => window.location.href = "/"}
              className="flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">What's Next?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Order Processing</h3>
                <p className="text-slate-600 text-sm">
                  We're preparing your order and will update you once it ships.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Shipping Notification</h3>
                <p className="text-slate-600 text-sm">
                  You'll receive a tracking number via email once shipped.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Delivery</h3>
                <p className="text-slate-600 text-sm">
                  Your order will be delivered within 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;