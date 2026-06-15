import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck, Award, MessageCircle, RotateCcw, Download, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import axiosInstance from '../../utils/axios';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError('Invalid session or order ID');
      setLoading(false);
      return;
    }
    verifyPayment();
  }, [sessionId, orderId]);

  const verifyPayment = async () => {
    try {
      const response = await axiosInstance.get(`/api/checkout/verify/${sessionId}`);
      
      if (response.data.success) {
        setOrder(response.data.order);
        clearCart();
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      const message = err.response?.data?.message || 'Failed to verify payment';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/971501234567', '_blank');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-emerald-600 mx-auto mb-4" />
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
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate('/cart')}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Success Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border-b border-emerald-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
              <CheckCircle className="w-20 h-20 text-yellow-500 relative z-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-3">
              Order #{orderId} Successfully Placed!
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Thank you for partnering with us. Your retail inventory is now being prepared for shipping.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Order Summary Table */}
        {order && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">Order Summary</h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Product</th>
                      <th className="px-6 py-4 text-center text-slate-700 font-semibold">Size</th>
                      <th className="px-6 py-4 text-left text-slate-700 font-semibold">Color</th>
                      <th className="px-6 py-4 text-center text-slate-700 font-semibold">Qty</th>
                      <th className="px-6 py-4 text-right text-slate-700 font-semibold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-slate-900 font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600">{item.size || 'One Size'}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                            {item.color || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-900">{item.qty}</td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-700">${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Financial Summary */}
        {order && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">Payment & Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Financial Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <h3 className="text-xl font-serif text-slate-900 mb-6">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between pb-4 border-b border-slate-200">
                    <span className="text-slate-700">Subtotal</span>
                    <span className="font-semibold text-slate-900">${order.pricing?.subtotal?.toFixed(2)}</span>
                  </div>
                  {order.pricing?.discount > 0 && (
                    <div className="flex justify-between pb-4 border-b border-slate-200">
                      <span className="text-green-600">Discount</span>
                      <span className="font-semibold text-green-600">-${order.pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pb-4 border-b border-slate-200">
                    <span className="text-slate-700">Tax</span>
                    <span className="font-semibold text-slate-900">${order.pricing?.tax?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-4 border-b border-slate-200">
                    <span className="text-slate-700">Shipping</span>
                    <span className="font-semibold text-slate-900">
                      {order.pricing?.shipping === 0 ? 'FREE' : `$${order.pricing?.shipping?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4">
                    <span className="text-lg font-semibold text-slate-900">Total Paid</span>
                    <span className="text-2xl font-bold text-emerald-700">${order.pricing?.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="space-y-4">
                {/* Payment Status */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800">Payment Status</p>
                      <p className="text-sm text-green-600">Paid via {order.payment?.method?.toUpperCase()}</p>
                    </div>
                    <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold text-sm">
                      {order.payment?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-blue-800">Order Status</p>
                      <p className="text-sm text-blue-600">Your order is being processed</p>
                    </div>
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm">
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <p className="font-semibold text-slate-800 mb-2">Shipping To</p>
                  <p className="text-slate-700">{order.customer?.name}</p>
                  <p className="text-sm text-slate-600">{order.customer?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-12 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-md"
          >
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white border-2 border-slate-300 text-slate-800 font-semibold py-4 px-6 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        {/* Support Section */}
        <div className="border-t border-slate-200 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button 
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-md">
              <Download className="w-5 h-5" />
              Download Invoice
            </button>
          </div>
          <p className="text-center text-slate-600 text-sm">
            A confirmation email has been sent to <span className="font-semibold">{order?.customer?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
