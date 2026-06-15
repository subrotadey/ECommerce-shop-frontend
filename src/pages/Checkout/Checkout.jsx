// pages/Checkout/Checkout.jsx
import {
  ArrowRight, CreditCard, Loader2, Mail, Package,
  Shield, ShoppingBag, Trash2, Truck, Tag, X, Check,
  Banknote, MapPin, Phone, User, Edit2, ChevronRight,
  Plus, Star, CheckCircle, Home, Briefcase, Warehouse
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { authenticatedFetch } from "../../utils/tokenHelper";
import axiosInstance from "../../utils/axios";
import AddressForm from "../../components/Address/AddressForm";

// ─── helpers ────────────────────────────────────────────────────────────────

const LABEL_ICON = {
  home:      { icon: Home,      color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200"   },
  work:      { icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  warehouse: { icon: Warehouse, color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200"  },
  other:     { icon: MapPin,    color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-200"   },
};

const extractImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") {
    try {
      const parsed = JSON.parse(image);
      return parsed.url || "";
    } catch {
      return image; // already a plain URL
    }
  }
  if (typeof image === "object") return image.url || "";
  return "";
};

// ─── AddressSelector ─────────────────────────────────────────────────────────

const AddressSelector = ({ selectedId, onSelect, onAddNew }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axiosInstance.get("/api/addresses")
      .then(res => {
        if (res.data.success) {
          const list = res.data.addresses || [];
          setAddresses(list);

          // Auto-select default or first
          if (!selectedId && list.length > 0) {
            const def = list.find(a => a.isDefault) || list[0];
            onSelect(def);
          }
        }
      })
      .catch(err => console.error("Address fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Re-select after adding a new address
  const refresh = () => {
    setLoading(true);
    axiosInstance.get("/api/addresses")
      .then(res => {
        if (res.data.success) {
          const list = res.data.addresses || [];
          setAddresses(list);
          // Select newly added address (last one) or keep current
          if (list.length > 0) {
            const def = list.find(a => a.isDefault) || list[list.length - 1];
            onSelect(def);
          }
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-6 text-gray-400 text-sm">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Loading addresses…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <MapPin className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500 mb-3">No saved addresses yet</p>
          <button
            onClick={() => onAddNew(refresh)}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={15} /> Add Address
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map(addr => {
              const meta   = LABEL_ICON[addr.label] || LABEL_ICON.other;
              const Icon   = meta.icon;
              const isSelected = selectedId === (addr.id || addr._id);

              return (
                <button
                  key={addr.id || addr._id}
                  onClick={() => onSelect(addr)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {/* Label row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color} ${meta.border}`}>
                      <Icon size={11} />
                      <span className="capitalize">{addr.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {addr.isDefault && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-medium">
                          <Star size={9} fill="currentColor" /> Default
                        </span>
                      )}
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>

                  {/* Name & phone */}
                  <p className="font-semibold text-gray-900 text-sm">{addr.fullName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>

                  {/* Street */}
                  <div className="flex items-start gap-1.5 mt-2">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {addr.street}{addr.aptNumber ? `, ${addr.aptNumber}` : ""}
                      <br />
                      {addr.city}, {addr.state} {addr.zipCode}
                      <br />
                      {addr.country}
                    </p>
                  </div>

                  {addr.deliveryNote && (
                    <p className="mt-2 text-[11px] text-gray-500 italic bg-white px-2 py-1.5 rounded-lg border border-gray-100">
                      📝 {addr.deliveryNote}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add new */}
          <button
            onClick={() => onAddNew(refresh)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all w-full justify-center"
          >
            <Plus size={15} /> Add New Address
          </button>
        </>
      )}
    </div>
  );
};

// ─── Main Checkout ────────────────────────────────────────────────────────────

const Checkout = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [processing,     setProcessing]     = useState(false);
  const [paymentMethod,  setPaymentMethod]  = useState("online");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [afterAddCallback, setAfterAddCallback] = useState(null);

  // Coupon
  const [couponCode,       setCouponCode]       = useState("");
  const [appliedCoupon,    setAppliedCoupon]    = useState(null);
  const [couponError,      setCouponError]      = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Pricing
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") discount = appliedCoupon.discount || 0;
    else if (appliedCoupon.type === "fixed") {
      discount = appliedCoupon.value;
      if (discount > subtotal) discount = subtotal;
    }
  }
  const tax      = (subtotal - discount) * 0.05;
  const shipping = appliedCoupon?.type === "free_shipping" || subtotal > 1000 ? 0 : 100;
  const total    = subtotal - discount + tax + shipping;

  // Build the address object that goes into the order
  const buildOrderAddress = (addr) => {
    if (!addr) return {};
    return {
      fullName:  addr.fullName,
      phone:     addr.phone,
      altPhone:  addr.altPhone  || "",
      street:    addr.street,
      aptNumber: addr.aptNumber || "",
      city:      addr.city,
      state:     addr.state,
      zipCode:   addr.zipCode,
      country:   addr.country,
      label:     addr.label,
      landmark:  addr.landmark  || "",
      deliveryNote: addr.deliveryNote || "",
      timePreference: addr.timePreference || "",
    };
  };

  // ── Coupon ──────────────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await axiosInstance.post("/api/coupons/validate", {
        code: couponCode.toUpperCase(),
        cartTotal: subtotal,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        Swal.fire({ position: "top-end", icon: "success", title: "Coupon applied!", showConfirmButton: false, timer: 2000, toast: true });
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid or expired coupon");
      setAppliedCoupon(null);
    } finally { setValidatingCoupon(false); }
  };

  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponCode(""); setCouponError(""); };

  // ── Save new address (called from AddressForm) ───────────────────────────
  const handleSaveNewAddress = async (formData) => {
    try {
      const res = await axiosInstance.post("/api/addresses", formData);
      if (res.data.success) {
        setShowAddressForm(false);
        Swal.fire({ position: "top-end", icon: "success", title: "Address saved!", showConfirmButton: false, timer: 1500, toast: true });
        if (afterAddCallback) afterAddCallback(); // refresh address list
      }
    } catch (err) {
      console.error("Save address error:", err);
      Swal.fire({ icon: "error", title: "Failed", text: err.response?.data?.message || "Could not save address." });
    }
  };

  // ── COD ─────────────────────────────────────────────────────────────────────
  const handleCODCheckout = async () => {
    if (!selectedAddress) {
      Swal.fire({ icon: "warning", title: "Address Required", text: "Please select a delivery address." });
      return;
    }
    setProcessing(true);
    try {
      const res = await axiosInstance.post("/api/orders/cod", {
        items,
        userId: currentUser.email,
        customerEmail: currentUser.email,
        shippingAddress: buildOrderAddress(selectedAddress),
        coupon: appliedCoupon
          ? { code: appliedCoupon.code, type: appliedCoupon.type, value: appliedCoupon.value || 0, discount }
          : null,
      });
      if (res.data.success) {
        clearCart();
        Swal.fire({
          icon: "success",
          title: "Order Placed!",
          text: `Order ${res.data.orderId} confirmed. Pay on delivery.`,
          confirmButtonColor: "#3B82F6",
        }).then(() => navigate("/orders"));
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err.message });
    } finally { setProcessing(false); }
  };

  // ── Stripe ──────────────────────────────────────────────────────────────────
  const handleStripeCheckout = async () => {
    if (!selectedAddress) {
      Swal.fire({ icon: "warning", title: "Address Required", text: "Please select a delivery address." });
      return;
    }
    setProcessing(true);
    try {
      const sanitizedItems = items.map(item => ({
        ...item,
        image: extractImageUrl(item.image),
      }));

      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({
            items: sanitizedItems,
            userId: currentUser.email,
            customerEmail: currentUser.email,
            shippingAddress: buildOrderAddress(selectedAddress),
            coupon: appliedCoupon
              ? { code: appliedCoupon.code, type: appliedCoupon.type, discount }
              : null,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create checkout session");
      }

      const data = await res.json();
      if (data.success && data.url) {
        if (appliedCoupon) {
          try { await axiosInstance.post(`/api/coupons/use/${appliedCoupon.code}`); } catch {}
        }
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to create checkout session");
      }
    } catch (err) {
      setProcessing(false);
      Swal.fire({ icon: "error", title: "Checkout Failed", html: `<p>${err.message}</p>`, confirmButtonColor: "#3B82F6" });
    }
  };

  const handleCheckout = () => {
    if (!currentUser?.email) { navigate("/login"); return; }
    if (paymentMethod === "cod") handleCODCheckout();
    else handleStripeCheckout();
  };

  const handleUpdateQuantity = (key, qty) => { if (qty < 1) return; updateQty(key, qty); };
  const handleRemoveItem = (key, name) => {
    Swal.fire({
      title: "Remove item?", text: `Remove "${name}"?`, icon: "question",
      showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Yes, remove",
    }).then(r => { if (r.isConfirmed) removeItem(key); });
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <ShoppingBag className="w-20 h-20 mx-auto text-slate-300 mb-6" />
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Cart is Empty</h2>
          <p className="text-slate-500 mb-8">Add some products to get started!</p>
          <button
            onClick={() => navigate("/abaya")}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
          >
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <span className="text-blue-600 font-medium cursor-pointer" onClick={() => navigate("/cart")}>Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-800">Checkout</span>
            <ChevronRight className="w-4 h-4" />
            <span>Confirmation</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ═══ LEFT COLUMN ═══════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-4">

            {/* STEP 1 — Delivery Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <h2 className="text-lg font-bold text-slate-800">Delivery Address</h2>
                {selectedAddress && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle size={14} /> Selected
                  </span>
                )}
              </div>

              <div className="px-6 py-5">
                <AddressSelector
                  selectedId={selectedAddress?.id || selectedAddress?._id}
                  onSelect={setSelectedAddress}
                  onAddNew={(refreshFn) => {
                    setAfterAddCallback(() => refreshFn);
                    setShowAddressForm(true);
                  }}
                />

                {/* Selected address summary */}
                {selectedAddress && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Delivering to</p>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-slate-700">
                        <p className="font-semibold">{selectedAddress.fullName}</p>
                        <p className="text-slate-500">{selectedAddress.phone}</p>
                        <p className="mt-0.5">
                          {selectedAddress.street}
                          {selectedAddress.aptNumber ? `, ${selectedAddress.aptNumber}` : ""}
                          {", "}{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}, {selectedAddress.country}
                        </p>
                        {selectedAddress.deliveryNote && (
                          <p className="mt-1 italic text-slate-400 text-xs">📝 {selectedAddress.deliveryNote}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* STEP 2 — Order Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h2 className="text-lg font-bold text-slate-800">Order Items</h2>
                <span className="ml-auto text-sm text-slate-500">{items.length} item{items.length > 1 ? "s" : ""}</span>
              </div>

              <div className="divide-y divide-gray-50">
                {items.map(item => (
                  <div key={item.key} className="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <img
                        src={extractImageUrl(item.image) || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.size && item.size !== "NOSIZE" && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">Size: {item.size}</span>
                        )}
                        {item.color && item.color !== "NOCOLOR" && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">Color: {item.color}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.key, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center disabled:opacity-40 text-lg font-medium"
                        >−</button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.key, item.qty + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 flex items-center justify-center text-lg font-medium"
                        >+</button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                      <div>
                        {item.oldPrice && <p className="text-xs text-slate-400 line-through">${item.oldPrice}</p>}
                        <p className="font-bold text-slate-800">${(item.price * item.qty).toFixed(2)}</p>
                        <p className="text-xs text-slate-400">${item.price} each</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.key, item.name)}
                        className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg transition-colors mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-green-50 border-t border-green-100 flex items-center gap-3">
                <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Standard Delivery</p>
                  <p className="text-xs text-green-600">Estimated delivery: 3–5 business days</p>
                </div>
                <div className="ml-auto text-sm font-semibold text-green-700">
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </div>
              </div>
            </div>

            {/* STEP 3 — Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
              </div>
              <div className="px-6 py-5 space-y-3">
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "online" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                  <input type="radio" name="payment" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} className="w-4 h-4 accent-blue-600" />
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Online Payment</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pay securely with Credit/Debit Card via Stripe</p>
                  </div>
                  <div className="flex gap-1">
                    {["VISA", "MC", "AMEX"].map(c => (
                      <span key={c} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-slate-600">{c}</span>
                    ))}
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "cod" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="w-4 h-4 accent-green-600" />
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">Cash on Delivery</p>
                    <p className="text-xs text-slate-500 mt-0.5">Pay in cash when your order arrives</p>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Available</span>
                </label>
              </div>
            </div>

            {/* Trust badges */}
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

          {/* ═══ RIGHT COLUMN — Order Summary ══════════════════════════════ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Order Summary</h2>

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
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
                      disabled={validatingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold transition-colors"
                    >
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
                          {appliedCoupon.type === "percentage" && `${appliedCoupon.value}% OFF`}
                          {appliedCoupon.type === "fixed" && `$${appliedCoupon.value} OFF`}
                          {appliedCoupon.type === "free_shipping" && "Free Shipping"}
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

              {/* Price breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Items Total ({items.length} item{items.length > 1 ? "s" : ""})</span>
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

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={processing || !selectedAddress}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  paymentMethod === "cod"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : !selectedAddress ? (
                  <><MapPin className="w-5 h-5" /> Select Delivery Address</>
                ) : paymentMethod === "cod" ? (
                  <><Banknote className="w-5 h-5" /> Place Order (Pay on Delivery)</>
                ) : (
                  <><CreditCard className="w-5 h-5" /> Proceed to Pay</>
                )}
              </button>

              <p className="text-xs text-slate-400 text-center mt-3">
                {paymentMethod === "cod"
                  ? "🔒 Your order is secure. Pay cash on delivery."
                  : "🔒 256-bit SSL encrypted. Powered by Stripe."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          initialData={null}
          onSave={handleSaveNewAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      )}
    </div>
  );
};

export default Checkout;