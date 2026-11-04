import { useNavigate } from "react-router-dom";
import { XCircle, ShoppingCart, ArrowLeft, MessageCircle } from "lucide-react";

// Checkout.jsx-এর নম্বরের সাথে মিল রাখুন
const WHATSAPP_NUMBER = "971551896390";

const CheckoutCancel = () => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello, I need help with my payment.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${msg}`, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">Payment Cancelled</h1>

        <p className="text-xl text-slate-600 mb-8">
          Your payment was not completed.
        </p>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-slate-800 mb-3">What happened?</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span>The payment process was cancelled before it finished</span>
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

        <button
          onClick={handleWhatsApp}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
        >
          <MessageCircle className="w-4 h-4" />
          Need help? Chat with us on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CheckoutCancel;