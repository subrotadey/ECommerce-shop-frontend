// pages/Checkout/Checkout.jsx
import {
  ArrowRight, CreditCard, Loader2, Mail, Package,
  Shield, ShoppingBag, Trash2, Truck, Tag, X, Check,
  Banknote, MapPin, Phone, User, Edit2, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { authenticatedFetch } from "../../utils/tokenHelper";
import axiosInstance from "../../utils/axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Shipping & Billing states
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'UAE'
  });

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Load user profile & prefill address
  useEffect(() => {
    if (currentUser?.email) {
      axiosInstance.get('/users/profile/full')
        .then(res => {
          if (res.data.success) {
            const user = res.data.user;
            setUserProfile(user);
            setShippingAddress({
              fullName: user.displayName || '',
              phone: user.phoneNumber || '',
              street: user.address?.street || '',
              city: user.address?.city || '',
              state: user.address?.state || '',
              zipCode: user.address?.zipCode || '',
              country: user.address?.country || 'UAE'
            });
            // যদি address না থাকে তাহলে form খুলে দাও
            if (!user.address?.street) setShowAddressForm(true);
          }
        })
        .catch(err => console.error('Profile fetch error:', err));
    }
  }, [currentUser]);

  const hasAddress = shippingAddress.street && shippingAddress.city;

  // Pricing
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') discount = appliedCoupon.discount || 0;
    else if (appliedCoupon.type === 'fixed') {
      discount = appliedCoupon.value;
      if (discount > subtotal) discount = subtotal;
    }
  }
  const tax = (subtotal - discount) * 0.05;
  const shipping = appliedCoupon?.type === 'free_shipping' || subtotal > 1000 ? 0 : 100;
  const total = subtotal - discount + tax + shipping;

  // Coupon handlers
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const response = await axiosInstance.post("/api/coupons/validate", {
        code: couponCode.toUpperCase(), cartTotal: subtotal
      });
      if (response.data.success) {
        setAppliedCoupon(response.data.coupon);
        Swal.fire({ position: "top-end", icon: "success", title: `Coupon applied!`, showConfirmButton: false, timer: 2000, toast: true });
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || "Invalid or expired coupon");
      setAppliedCoupon(null);
    } finally { setValidatingCoupon(false); }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null); setCouponCode(""); setCouponError("");
  };

  // Save address to profile
  const handleSaveAddress = async () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city) {
      Swal.fire({ icon: 'warning', title: 'Missing Info', text: 'Please fill in all required fields.', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
      return;
    }
    try {
      await axiosInstance.patch('/api/users/profile', {
        displayName: shippingAddress.fullName,
        phoneNumber: shippingAddress.phone,
        address: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        }
      });
      setShowAddressForm(false);
      Swal.fire({ icon: 'success', title: 'Address saved!', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err) {
      console.error('Save address error:', err);
    }
  };

  // COD Handler
  const handleCODCheckout = async () => {
    if (!hasAddress) {
      Swal.fire({ icon: 'warning', title: 'Address Required', text: 'Please add your shipping address first.' });
      setShowAddressForm(true);
      return;
    }
    setProcessing(true);
    try {
      const response = await axiosInstance.post("/api/orders/cod", {
        items,
        userId: currentUser.email,
        customerEmail: currentUser.email,
        shippingAddress,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value || 0,
          discount
        } : null
      });
      if (response.data.success) {
        clearCart();
        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: `Order ${response.data.orderId} confirmed. Pay on delivery.`,
          confirmButtonColor: "#3B82F6"
        }).then(() => navigate("/orders"));
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Failed", text: error.message });
    } finally { setProcessing(false); }
  };

  // Stripe Handler
  const handleStripeCheckout = async () => {
    if (!hasAddress) {
      Swal.fire({ icon: 'warning', title: 'Address Required', text: 'Please add your shipping address first.' });
      setShowAddressForm(true);
      return;
    }
    setProcessing(true);
    try {
      const response = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({
            items,
            userId: currentUser.email,
            customerEmail: currentUser.email,
            coupon: appliedCoupon ? {
              code: appliedCoupon.code,
              type: appliedCoupon.type,
              discount
            } : null
          })
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }
      const data = await response.json();
      if (data.success && data.url) {
        if (appliedCoupon) {
          try { await axiosInstance.post(`/api/coupons/use/${appliedCoupon.code}`); } catch (e) {}
        }
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      setProcessing(false);
      Swal.fire({
        icon: "error", title: "Checkout Failed",
        html: `<p>${error.message}</p>`,
        confirmButtonColor: "#3B82F6"
      });
    }
  };

  const handleCheckout = () => {
    if (!currentUser?.email) { navigate("/login"); return; }
    if (paymentMethod === 'cod') handleCODCheckout();
    else handleStripeCheckout();
  };

  const handleUpdateQuantity = (itemKey, newQty) => { if (newQty < 1) return; updateQty(itemKey, newQty); };
  const handleRemoveItem = (itemKey, itemName) => {
    Swal.fire({
      title: 'Remove item?', text: `Remove "${itemName}"?`, icon: 'question',
      showCancelButton: true, confirmButtonColor: '#EF4444', confirmButtonText: 'Yes, remove'
    }).then(r => { if (r.isConfirmed) removeItem(itemKey); });
  };

  // Empty cart
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <ShoppingBag className="w-20 h-20 mx-auto text-slate-300 mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Cart is Empty</h2>
          <p className="text-slate-500 mb-8">Add some products to get started!</p>
          <button onClick={() => navigate("/abaya")}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2">
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <span className="text-blue-600 font-medium cursor-pointer" onClick={() => navigate('/cart')}>Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-800">Checkout</span>
            <ChevronRight className="w-4 h-4" />
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-4">

            {/* ═══════════════════════════════════
                SHIPPING & BILLING SECTION
            ═══════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Section Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <h2 className="text-lg font-bold text-slate-800">Shipping & Billing</h2>
                </div>
                {hasAddress && !showAddressForm && (
                  <button onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                )}
              </div>

              <div className="px-6 py-5">
                {/* Address Display (saved) */}
                {hasAddress && !showAddressForm ? (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-slate-800">{shippingAddress.fullName}</p>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          HOME
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm flex items-center gap-1 mb-1">
                        <Phone className="w-3.5 h-3.5" /> {shippingAddress.phone}
                      </p>
                      <p className="text-slate-600 text-sm">
                        {shippingAddress.street}, {shippingAddress.city}
                        {shippingAddress.state && `, ${shippingAddress.state}`}
                        {shippingAddress.zipCode && ` ${shippingAddress.zipCode}`}
                        , {shippingAddress.country}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Address Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text"
                            value={shippingAddress.fullName}
                            onChange={e => setShippingAddress(p => ({ ...p, fullName: e.target.value }))}
                            placeholder="John Doe"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel"
                            value={shippingAddress.phone}
                            onChange={e => setShippingAddress(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+971 50 123 4567"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                      </div>

                      {/* Street Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="text"
                            value={shippingAddress.street}
                            onChange={e => setShippingAddress(p => ({ ...p, street: e.target.value }))}
                            placeholder="Building, Street, Area"
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          City <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={shippingAddress.city}
                          onChange={e => setShippingAddress(p => ({ ...p, city: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          <option value="">Select City</option>
                          <option>Dubai</option>
                          <option>Abu Dhabi</option>
                          <option>Sharjah</option>
                          <option>Ajman</option>
                          <option>Ras Al Khaimah</option>
                          <option>Fujairah</option>
                          <option>Umm Al Quwain</option>
                        </select>
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                        <select
                          value={shippingAddress.country}
                          onChange={e => setShippingAddress(p => ({ ...p, country: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          <option value="UAE">🇦🇪 United Arab Emirates</option>
                          <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                          <option value="Kuwait">🇰🇼 Kuwait</option>
                          <option value="Qatar">🇶🇦 Qatar</option>
                          <option value="Bahrain">🇧🇭 Bahrain</option>
                          <option value="Oman">🇴🇲 Oman</option>
                          <option value="Bangladesh">🇧🇩 Bangladesh</option>
                        </select>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3 pt-2">
                      <button onClick={handleSaveAddress}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                        Save Address
                      </button>
                      {hasAddress && (
                        <button onClick={() => setShowAddressForm(false)}
                          className="px-6 py-2.5 border border-gray-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ═══════════════════════════════════
                ORDER ITEMS SECTION
            ═══════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h2 className="text-lg font-bold text-slate-800">Order Items</h2>
                <span className="ml-auto text-sm text-slate-500">{items.length} item{items.length > 1 ? 's' : ''}</span>
              </div>

              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img src={item.image || "/placeholder.jpg"} alt={item.name}
                        className="w-full h-full object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.size && item.size !== "NOSIZE" && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && item.color !== "NOCOLOR" && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                            Color: {item.color}
                          </span>
                        )}
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleUpdateQuantity(item.key, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center disabled:opacity-40 text-lg font-medium">
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => handleUpdateQuantity(item.key, item.qty + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-lg font-medium">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price + Remove */}
                    <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                      <div>
                        {item.oldPrice && (
                          <p className="text-xs text-slate-400 line-through">${item.oldPrice}</p>
                        )}
                        <p className="font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</p>
                        <p className="text-xs text-slate-400">${item.price} each</p>
                      </div>
                      <button onClick={() => handleRemoveItem(item.key, item.name)}
                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors mt-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}
              <div className="px-6 py-4 bg-green-50 border-t border-green-100 flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Standard Delivery</p>
                  <p className="text-xs text-green-600">Estimated delivery: 3–5 business days</p>
                </div>
                <div className="ml-auto text-sm font-semibold text-green-700">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════
                PAYMENT METHOD SECTION
            ═══════════════════════════════════ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
              </div>

              <div className="px-6 py-5 space-y-3">
                {/* Online Payment */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'online'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="payment" value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-4 h-4 text-blue-600 accent-blue-600" />
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Online Payment</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pay securely with Credit/Debit Card via Stripe</p>
                  </div>
                  <div className="flex gap-1">
                    {['VISA', 'MC', 'AMEX'].map(card => (
                      <span key={card} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-slate-600">
                        {card}
                      </span>
                    ))}
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="payment" value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-green-600 accent-green-600" />
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Cash on Delivery</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pay in cash when your order arrives at your door</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Available
                  </span>
                </label>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Shield className="w-7 h-7 mx-auto text-green-600 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Secure Payment</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Truck className="w-7 h-7 mx-auto text-blue-600 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Fast Delivery</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <Package className="w-7 h-7 mx-auto text-purple-600 mb-2" />
                <p className="text-xs font-semibold text-slate-700">Easy Returns</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Order Summary</h2>

              {/* Customer */}
              {currentUser?.email && (
                <div className="mb-5 p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-600 truncate">{currentUser.email}</span>
                </div>
              )}

              {/* Coupon */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Promotion Code</label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter store code"
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
                      disabled={validatingCoupon} />
                    <button onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold transition-colors">
                      {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-800">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.type === 'percentage' && `${appliedCoupon.value}% OFF`}
                          {appliedCoupon.type === 'fixed' && `$${appliedCoupon.value} OFF`}
                          {appliedCoupon.type === 'free_shipping' && 'Free Shipping'}
                        </p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-400 hover:text-red-600 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Items Total ({items.length} item{items.length > 1 ? 's' : ''})</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-medium">−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium">
                    {shipping === 0
                      ? <span className="text-green-600 font-semibold">FREE</span>
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax (VAT 5%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                {subtotal < 1000 && shipping > 0 && (
                  <div className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                    💡 Add ${(1000 - subtotal).toFixed(2)} more for <strong>free delivery!</strong>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total:</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-800">${total.toFixed(2)}</span>
                    <p className="text-xs text-slate-400">VAT included</p>
                  </div>
                </div>

                {discount > 0 && (
                  <p className="text-center text-xs text-green-600 font-semibold bg-green-50 py-2 rounded-lg">
                    🎉 You're saving ${discount.toFixed(2)} on this order!
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <button onClick={handleCheckout} disabled={processing}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  paymentMethod === 'cod'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : paymentMethod === 'cod' ? (
                  <><Banknote className="w-5 h-5" /> Place Order (Pay on Delivery)</>
                ) : (
                  <><CreditCard className="w-5 h-5" /> Proceed to Pay</>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center mt-3">
                {paymentMethod === 'cod'
                  ? '🔒 Your order is secure. Pay cash on delivery.'
                  : '🔒 256-bit SSL encrypted. Powered by Stripe.'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;