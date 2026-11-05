// pages/Checkout/Checkout.jsx
import {
    AlertTriangle,
    ArrowRight,
    Banknote,
    Briefcase,
    Check,
    CheckCircle,
    ChevronRight,
    CreditCard,
    Home,
    Landmark,
    Loader2, Mail,
    MapPin,
    MessageCircle,
    Plus,
    ShoppingBag,
    Star,
    Tag,
    Trash2, Truck,
    Warehouse,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddressForm from "../../components/Address/AddressForm";
import Loading from "../../components/Shared/Loading/Loading";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import axiosInstance from "../../utils/axios";
import { authenticatedFetch } from "../../utils/tokenHelper";
import {
    BULK_DISCOUNT_PERCENT, BULK_DISCOUNT_THRESHOLD, DELIVERY_NOTICE,
    MOQ_PER_COLOR, formatMoney, round2, summarizeCart, WHATSAPP_NUMBER
} from "../../utils/wholesale";

// ── Config ──
const ENABLE_STRIPE = false; // কোড অক্ষত, UI-তে লুকানো
const ENABLE_COD = false;    // কোড অক্ষত, UI-তে লুকানো

// ─── helpers ────────────────────────────────────────────────────────────────

const PAY_STYLE = {
  green: "border-green-500 bg-green-50",
  blue:  "border-blue-500 bg-blue-50",
};

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

const buildWhatsAppMessage = ({ orderId, total, items }) => {
  const groups = new Map();
  (items || []).forEach((i) => {
    const key = `${i.productId}__${i.color || ""}`;
    if (!groups.has(key)) groups.set(key, { name: i.name, color: i.color, sizes: [], qty: 0 });
    const g = groups.get(key);
    g.sizes.push(`${i.size && i.size !== "NOSIZE" ? i.size : "-"}×${i.qty}`);
    g.qty += Number(i.qty) || 0;
  });

  const pieces = [...groups.values()].reduce((s, g) => s + g.qty, 0);
  const lines = [...groups.values()].map((g) => {
    const name = (g.name || "").length > 45 ? `${g.name.slice(0, 45)}…` : g.name;
    const color = g.color && g.color !== "NOCOLOR" ? ` (${g.color})` : "";
    return `• ${name}${color}: ${g.sizes.join(", ")} = ${g.qty} pcs`;
  });

  return [
    "Hello Anis Abaya",
    "I have placed a wholesale order.",
    "",
    `*Order ID:* ${orderId}`,
    `*Total:* ${formatMoney(total)}`,
    `*Total pieces:* ${pieces}`,
    "",
    "*Items*",
    ...lines,
    "",
    "Please share the bank details. I will send the transfer receipt here.",
    "Thank you!",
  ].join("\n");
};

// ─── AddressSelector ─────────────────────────────────────────────────────────

const AddressSelector = ({ selectedId, onSelect, onAddNew, onEdit }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axiosInstance.get("/addresses")
      .then(res => {
        if (res.data.success) {
          const list = res.data.addresses || [];
          setAddresses(list);
          if (!selectedId && list.length > 0) {
            onSelect(list.find(a => a.isDefault) || list[0]);
          }
        }
      })
      .catch(err => console.error("Address fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // keepId থাকলে (Edit-এর পর) সেই ঠিকানাই নির্বাচিত থাকে
  const refresh = (keepId) => {
    setLoading(true);
    axiosInstance.get("/addresses")
      .then(res => {
        if (res.data.success) {
          const list = res.data.addresses || [];
          setAddresses(list);
          if (list.length > 0) {
            const keep = typeof keepId === "string" && list.find(a => (a.id || a._id) === keepId);
            onSelect(keep || list.find(a => a.isDefault) || list[list.length - 1]);
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
              const meta = LABEL_ICON[addr.label] || LABEL_ICON.other;
              const Icon = meta.icon;
              const addrId = addr.id || addr._id;
              const isSelected = selectedId === addrId;

              return (
                <div
                  key={addrId}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(addr)}
                  onKeyDown={e => (e.key === "Enter" || e.key === " ") && onSelect(addr)}
                  className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color} ${meta.border}`}>
                      <Icon size={11} />
                      <span className="capitalize">{addr.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={e => { e.stopPropagation(); onEdit(addr, refresh); }}
                        onKeyDown={e => { if (e.key === "Enter") { e.stopPropagation(); onEdit(addr, refresh); } }}
                        className="px-2 py-0.5 text-[11px] font-semibold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-100"
                      >
                        Edit
                      </span>
                      {addr.isDefault && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-medium">
                          <Star size={9} fill="currentColor" /> Default
                        </span>
                      )}
                      {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>

                  <p className="font-semibold text-gray-900 text-sm">{addr.fullName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>

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
                </div>
              );
            })}
          </div>

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
  const { items, updateQty, removeItem, clearCart, isLoading } = useCart();
  const { currentUser } = useAuth();

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [afterAddCallback, setAfterAddCallback] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // ── Pricing (শুধু preview; আসল হিসাব backend-এ) ──
  const summary = summarizeCart(items);
  const couponDiscount = appliedCoupon
    ? Math.min(round2(appliedCoupon.discount || 0), summary.afterBulk)
    : 0;
  const total = round2(summary.afterBulk - couponDiscount);

  // cart বদলালে coupon-এর হিসাব পুরোনো হয়ে যায়, তাই সরিয়ে দিই
  useEffect(() => {
    if (appliedCoupon) {
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("Cart changed. Please apply the coupon again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.afterBulk]);

  const buildOrderAddress = (addr) => {
    if (!addr) return {};
    return {
      fullName: addr.fullName, phone: addr.phone, altPhone: addr.altPhone || "",
      street: addr.street, aptNumber: addr.aptNumber || "", city: addr.city,
      state: addr.state, zipCode: addr.zipCode, country: addr.country,
      label: addr.label, landmark: addr.landmark || "",
      deliveryNote: addr.deliveryNote || "", timePreference: addr.timePreference || "",
    };
  };

  const errMsg = (err, fallback) =>
    err?.response?.data?.message || err?.message || fallback;

  // ── Coupon ──
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    setValidatingCoupon(true);
    setCouponError("");
    try {
      // bulk discount-এর পরের টাকার ওপর (backend-এর ক্রম অনুযায়ী)
      const res = await axiosInstance.post("/coupons/validate", {
        code: couponCode.toUpperCase(),
        cartTotal: summary.afterBulk,
      });
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        Swal.fire({ position: "top-end", icon: "success", title: "Coupon applied!", showConfirmButton: false, timer: 1500, toast: true });
      }
    } catch (err) {
      setCouponError(errMsg(err, "Invalid or expired coupon"));
      setAppliedCoupon(null);
    } finally { setValidatingCoupon(false); }
  };

  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponCode(""); setCouponError(""); };

  // ── Address save ──
    const handleSaveAddress = async (formData) => {
    if (savingAddress) return;
    const isEdit = Boolean(editingAddress);
    const id = editingAddress?.id || editingAddress?._id;
    setSavingAddress(true);
    try {
      const res = isEdit
        ? await axiosInstance.put(`/addresses/${id}`, formData)
        : await axiosInstance.post("/addresses", formData);
      if (res.data.success) {
        setShowAddressForm(false);
        setEditingAddress(null);
        Swal.fire({ position: "top-end", icon: "success", title: isEdit ? "Address updated!" : "Address saved!", showConfirmButton: false, timer: 1500, toast: true });
        if (afterAddCallback) afterAddCallback(isEdit ? id : undefined);
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: errMsg(err, "Could not save address.") });
    } finally { setSavingAddress(false); }
  };

  const orderPayload = () => ({
    items,
    shippingAddress: buildOrderAddress(selectedAddress),
    coupon: appliedCoupon ? { code: appliedCoupon.code } : null,
  });

  // ── Bank transfer (প্রধান পদ্ধতি) ──
  const handleBankCheckout = async () => {
    setProcessing(true);
    try {
      const res = await axiosInstance.post("/orders/bank-deposit", orderPayload());
      if (res.data.success) {
        const orderId = res.data.orderId;
        const paid = res.data.order?.pricing?.total ?? total;
        clearCart();
        const msg = encodeURIComponent(
          buildWhatsAppMessage({ orderId, total: paid, items })
        );
        const r = await Swal.fire({
          icon: "success",
          title: "Order placed!",
          html: `<p>Order <b>${orderId}</b></p><p>Total: <b>${formatMoney(paid)}</b></p>
                 <p style="margin-top:8px">Please pay by bank transfer and send the receipt on WhatsApp. Your order is confirmed after payment is verified.</p>`,
          confirmButtonText: "Send receipt on WhatsApp",
          confirmButtonColor: "#16a34a",
          showCancelButton: true,
          cancelButtonText: "View my orders",
          allowOutsideClick: false,
        });
        if (r.isConfirmed) {
          window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${msg}`, "_blank", "noopener");
        }
        navigate("/orders");
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Order failed", text: errMsg(err, "Failed to place order") });
    } finally { setProcessing(false); }
  };

  // ── COD (flag বন্ধ; কোড অক্ষত) ──
  const handleCODCheckout = async () => {
    setProcessing(true);
    try {
      const res = await axiosInstance.post("/orders/cod", orderPayload());
      if (res.data.success) {
        clearCart();
        Swal.fire({ icon: "success", title: "Order Placed!", text: `Order ${res.data.orderId} confirmed. Pay on delivery.`, confirmButtonColor: "#3B82F6" })
          .then(() => navigate("/orders"));
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: errMsg(err, "Failed to place order") });
    } finally { setProcessing(false); }
  };

  // ── Stripe (flag বন্ধ; কোড অক্ষত) ──
  const handleStripeCheckout = async () => {
    setProcessing(true);
    try {
      const sanitizedItems = items.map(item => ({ ...item, image: extractImageUrl(item.image) }));
      const res = await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({
            items: sanitizedItems,
            userId: currentUser.email,
            customerEmail: currentUser.email,
            shippingAddress: buildOrderAddress(selectedAddress),
            coupon: appliedCoupon ? { code: appliedCoupon.code, type: appliedCoupon.type, discount: couponDiscount } : null,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create checkout session");
      }
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Failed to create checkout session");
      }
    } catch (err) {
      setProcessing(false);
      Swal.fire({ icon: "error", title: "Checkout Failed", text: err.message, confirmButtonColor: "#3B82F6" });
    }
  };

  const handleCheckout = () => {
    if (!currentUser?.email) { navigate("/login"); return; }
    if (!selectedAddress) {
      Swal.fire({ icon: "warning", title: "Address Required", text: "Please select a delivery address." });
      return;
    }
    if (!summary.moqOk) {
      Swal.fire({ icon: "warning", title: `Minimum ${MOQ_PER_COLOR} pieces per color`, text: "Please complete the highlighted color groups in your cart." });
      return;
    }
    if (paymentMethod === "cod" && ENABLE_COD) handleCODCheckout();
    else if (paymentMethod === "online" && ENABLE_STRIPE) handleStripeCheckout();
    else handleBankCheckout();
  };

  const handleUpdateQuantity = (key, qty) => { if (qty < 1) return; updateQty(key, qty); };
  const handleRemoveItem = (key, name) => {
    Swal.fire({
      title: "Remove item?", text: `Remove "${name}"?`, icon: "question",
      showCancelButton: true, confirmButtonColor: "#EF4444", confirmButtonText: "Yes, remove",
    }).then(r => { if (r.isConfirmed) removeItem(key); });
  };

  if (isLoading) return <Loading />;

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

  const stepBadge = (n) => (
    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{n}</div>
  );

  const payOption = (value, color, Icon, title, desc) => (
    <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === value ? PAY_STYLE[color] : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
      <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="w-4 h-4" />
      <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-slate-700" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </label>
  );

  const buttonDisabled = processing || !selectedAddress || !summary.moqOk;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Checkout</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
            <span className="text-blue-600 font-medium cursor-pointer" onClick={() => navigate("/cart")}>Cart</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-800">Checkout</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">

            {/* STEP 1 — Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                {stepBadge(1)}
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
                    setEditingAddress(null);
                    setAfterAddCallback(() => refreshFn);
                    setShowAddressForm(true);
                  }}
                  onEdit={(addr, refreshFn) => {
                    setEditingAddress(addr);
                    setAfterAddCallback(() => refreshFn);
                    setShowAddressForm(true);
                  }}
                />
              </div>
            </div>

            {/* STEP 2 — Items (Product + Color গ্রুপ) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                {stepBadge(2)}
                <h2 className="text-lg font-bold text-slate-800">Order Items</h2>
                <span className="ml-auto text-sm text-slate-500">{summary.totalQuantity} pieces</span>
              </div>

              {summary.groups.map(group => (
                <div key={group.key} className="border-b border-gray-100 last:border-0">
                  <div className="flex gap-4 px-6 pt-4">
                    <img
                      src={extractImageUrl(group.image) || "/placeholder.jpg"}
                      alt={group.name}
                      className="w-16 h-20 rounded-lg object-cover bg-gray-100 border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-sm line-clamp-2">{group.name}</h3>
                      {group.color && <p className="text-xs text-slate-500 mt-0.5">Color: {group.color}</p>}
                      <p className={`text-xs mt-1 font-medium ${group.moqMet ? "text-green-700" : "text-amber-700"}`}>
                        {group.moqMet
                          ? `${group.qty} pcs (minimum met)`
                          : `${group.qty}/${MOQ_PER_COLOR} pcs, add ${group.moqShort} more`}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50 mt-2">
                    {group.items.map(item => (
                      <div key={item.key} className="flex items-center gap-3 px-6 py-3">
                        <span className="w-12 text-sm font-semibold text-slate-700">
                          {item.size && item.size !== "NOSIZE" ? item.size : "-"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.key, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                          >−</button>
                          <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.key, item.qty + 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 hover:bg-gray-100"
                          >+</button>
                        </div>
                        <span className="ml-auto text-sm font-bold text-slate-800">{formatMoney(item.price * item.qty)}</span>
                        <button
                          onClick={() => handleRemoveItem(item.key, item.name)}
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-lg"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-start gap-3">
                <Truck className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">{DELIVERY_NOTICE}</p>
              </div>
            </div>

            {/* STEP 3 — Payment */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
                {stepBadge(3)}
                <h2 className="text-lg font-bold text-slate-800">Payment Method</h2>
              </div>
              <div className="px-6 py-5 space-y-3">
                {payOption("bank", "green", Landmark, "Bank Transfer + WhatsApp",
                  "Place the order, pay by bank transfer, then send the receipt on WhatsApp.")}
                {ENABLE_STRIPE && payOption("online", "blue", CreditCard, "Online Payment",
                  "Pay securely with Credit/Debit Card via Stripe")}
                {ENABLE_COD && payOption("cod", "green", Banknote, "Cash on Delivery",
                  "Pay in cash when your order arrives")}

                {paymentMethod === "bank" && (
                  <div className="flex gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <MessageCircle size={14} className="shrink-0 mt-0.5" />
                    <span>Bank details are shared on WhatsApp after you place the order. The order is confirmed once our team verifies your payment.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ═══ Summary ═══ */}
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
                      className="flex-1 min-w-0 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm uppercase"
                      disabled={validatingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 text-sm font-semibold"
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
                          {appliedCoupon.type === "fixed" && `${formatMoney(appliedCoupon.value)} OFF`}
                          {appliedCoupon.type === "free_shipping" && "No discount (shipping is not charged by us)"}
                        </p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({summary.totalQuantity} pcs)</span>
                  <span className="font-medium">{formatMoney(summary.subtotal)}</span>
                </div>
                {summary.bulkDiscountPercent > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Bulk discount ({summary.bulkDiscountPercent}%)</span>
                    <span className="font-medium">−{formatMoney(summary.bulkDiscount)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-medium">−{formatMoney(couponDiscount)}</span>
                  </div>
                )}

                {summary.bulkDiscountPercent === 0 && (
                  <div className="py-2 px-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                    Add {summary.piecesToBulk} more pieces for {BULK_DISCOUNT_PERCENT}% off ({BULK_DISCOUNT_THRESHOLD}+ pieces).
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="text-2xl font-bold text-slate-800">{formatMoney(total)}</span>
                </div>
                <p className="text-xs text-slate-500">{DELIVERY_NOTICE}</p>
                <p className="text-xs text-slate-400">Final amount is confirmed by the server when you place the order.</p>
              </div>

              {!summary.moqOk && (
                <div className="mb-4 flex gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    Minimum {MOQ_PER_COLOR} pieces per color is required.{" "}
                    <Link to="/cart" className="underline font-medium">Back to cart</Link>
                  </span>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={buttonDisabled}
                className="w-full py-4 rounded-xl font-bold text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                ) : !selectedAddress ? (
                  <><MapPin className="w-5 h-5" /> Select Delivery Address</>
                ) : paymentMethod === "online" ? (
                  <><CreditCard className="w-5 h-5" /> Proceed to Pay</>
                ) : paymentMethod === "cod" ? (
                  <><Banknote className="w-5 h-5" /> Place Order (Pay on Delivery)</>
                ) : (
                  <><MessageCircle className="w-5 h-5" /> Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressForm && (
        <AddressForm
          initialData={editingAddress}
          currentUser={currentUser}
          submitting={savingAddress}
          onSave={handleSaveAddress}
          onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
        />
      )}
    </div>
  );
};

export default Checkout;