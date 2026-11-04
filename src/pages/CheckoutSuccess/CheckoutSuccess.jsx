import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, Clock, MessageCircle, ArrowRight, Loader2, XCircle, Truck } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import axiosInstance from '../../utils/axios';
import { DELIVERY_NOTICE, formatMoney } from '../../utils/wholesale';


const WHATSAPP_NUMBER = '971551896390';

const imageUrl = (img) => (typeof img === 'string' ? img : img?.url || '');

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const { clearCart } = useCart();
  const verifiedRef = useRef(false); // StrictMode-এ দুবার verify ঠেকায়

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!sessionId || !orderId) {
      setError('Invalid session or order ID');
      setLoading(false);
      return;
    }
    if (verifiedRef.current) return;
    verifiedRef.current = true;
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, orderId]);

  const verifyPayment = async () => {
    try {
      // axiosInstance-এর baseURL-এ আগে থেকেই /api আছে
      const response = await axiosInstance.get(`/checkout/verify/${sessionId}`);
      if (response.data.success) {
        setOrder(response.data.order);
        clearCart();
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hello, I need help with my order ${orderId}.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${msg}`, '_blank', 'noopener');
  };

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

  const pricing = order?.pricing || {};
  const isPaid = order?.payment?.status === 'paid';
  const couponDiscount = pricing.couponDiscount ?? pricing.discount ?? 0;
  const addr = order?.customer?.address || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className={`border-b py-12 px-4 ${isPaid ? 'bg-gradient-to-r from-emerald-50 to-slate-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          {isPaid ? (
            <CheckCircle className="w-20 h-20 text-emerald-600 mb-6" strokeWidth={1.5} />
          ) : (
            <Clock className="w-20 h-20 text-amber-500 mb-6" strokeWidth={1.5} />
          )}
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900 mb-3">
            {isPaid ? `Order #${orderId} confirmed!` : `Order #${orderId} received`}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            {isPaid
              ? 'Thank you for your order. Your payment is confirmed and your order is being prepared.'
              : 'Thank you for your order. We are still confirming your payment.'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Items */}
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
                      <th className="px-6 py-4 text-right text-slate-700 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={imageUrl(item.image) || '/placeholder.jpg'}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-slate-900 font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-slate-600">{item.size || 'One Size'}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <span className="px-2 py-1 bg-slate-100 rounded text-xs">{item.color || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-900">{item.qty}</td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-700">
                          {formatMoney(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Financial + status */}
        {order && (
          <div className="mb-12">
            <h2 className="text-2xl font-serif text-slate-900 mb-6">Payment & Order Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8">
                <h3 className="text-xl font-serif text-slate-900 mb-6">Financial Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between pb-4 border-b border-slate-200">
                    <span className="text-slate-700">Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatMoney(pricing.subtotal)}</span>
                  </div>
                  {pricing.bulkDiscount > 0 && (
                    <div className="flex justify-between pb-4 border-b border-slate-200">
                      <span className="text-green-600">Bulk discount ({pricing.bulkDiscountPercent}%)</span>
                      <span className="font-semibold text-green-600">−{formatMoney(pricing.bulkDiscount)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between pb-4 border-b border-slate-200">
                      <span className="text-green-600">Coupon{order.coupon?.code ? ` (${order.coupon.code})` : ''}</span>
                      <span className="font-semibold text-green-600">−{formatMoney(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-4">
                    <span className="text-lg font-semibold text-slate-900">{isPaid ? 'Total Paid' : 'Total'}</span>
                    <span className="text-2xl font-bold text-emerald-700">{formatMoney(pricing.total)}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-slate-600 pt-2">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>{DELIVERY_NOTICE}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`border rounded-xl p-6 ${isPaid ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isPaid ? 'text-green-800' : 'text-amber-800'}`}>Payment Status</p>
                      <p className={`text-sm ${isPaid ? 'text-green-600' : 'text-amber-700'}`}>
                        Via {order.payment?.method?.toUpperCase()}
                      </p>
                    </div>
                    <span className={`px-4 py-2 text-white rounded-full font-semibold text-sm ${isPaid ? 'bg-green-600' : 'bg-amber-500'}`}>
                      {order.payment?.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-blue-800">Order Status</p>
                      <p className="text-sm text-blue-600">Track it any time in My Orders</p>
                    </div>
                    <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm">
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <p className="font-semibold text-slate-800 mb-2">Shipping To</p>
                  <p className="text-slate-700">{addr.fullName || order.customer?.name}</p>
                  {addr.phone && <p className="text-sm text-slate-600">{addr.phone}</p>}
                  {(addr.street || addr.city) && (
                    <p className="text-sm text-slate-600 mt-1">
                      {[addr.street, addr.aptNumber, addr.city, addr.state, addr.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-slate-500 mt-1">{order.customer?.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
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

        {/* Support */}
        <div className="border-t border-slate-200 pt-12">
          <button
            onClick={handleWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}