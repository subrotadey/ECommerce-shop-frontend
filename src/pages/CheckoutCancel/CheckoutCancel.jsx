// pages/CheckoutCancel.jsx
import { useNavigate } from "react-router-dom";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Payment Cancelled
        </h1>

        {/* Message */}
        <p className="text-xl text-slate-600 mb-8">
          Your payment was cancelled. No charges were made.
        </p>

        {/* Additional Info */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-slate-800 mb-3">What happened?</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>You chose to cancel the payment process</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>Your cart items are still saved</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>You can try again anytime</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Return to Cart
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-white border-2 border-slate-300 text-slate-800 px-6 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-slate-500 mt-8">
          Need help? Contact our support team at support@example.com
        </p>
      </div>
    </div>
  );
};

export default CheckoutCancel;