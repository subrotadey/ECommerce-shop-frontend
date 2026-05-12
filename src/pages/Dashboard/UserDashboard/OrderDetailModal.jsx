// ============================================
// components/UserDashboard/OrderDetailModal.jsx
// Shared modal — used in RecentOrdersWidget & MyOrders
// ============================================
import {
  X,
  Calendar,
  CreditCard,
  MapPin,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useEffect } from "react";

// ─── helpers ──────────────────────────────────────────────────────────────────

export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
  },
  processing: {
    label: "Processing",
    icon: Package,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
    bar: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-400",
    bar: "bg-red-400",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
    dot: "bg-gray-400",
    bar: "bg-gray-400",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;

// ─── StatusBadge ──────────────────────────────────────────────────────────────

export const StatusBadge = ({ status, size = "sm" }) => {
  const cfg = getStatusConfig(status);
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold border
        ${cfg.bg} ${cfg.text} ${cfg.border}
        ${size === "sm" ? "text-xs" : "text-sm"}`}
    >
      <Icon size={size === "sm" ? 12 : 14} />
      {cfg.label}
    </span>
  );
};

// ─── OrderDetailModal ─────────────────────────────────────────────────────────

const OrderDetailModal = ({ order, onClose }) => {
  // close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    // lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!order) return null;

  const timeline = [
    { label: "Order Placed", done: true, date: order.createdAt },
    {
      label: "Payment Confirmed",
      done: order.payment?.status === "paid",
      date: order.payment?.paidAt,
    },
    {
      label: "Processing",
      done: ["processing", "shipped", "delivered"].includes(order.status),
    },
    {
      label: "Shipped",
      done: ["shipped", "delivered"].includes(order.status),
    },
    { label: "Delivered", done: order.status === "delivered" },
  ];

  const showTimeline =
    order.status !== "cancelled" && order.status !== "refunded";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      {/* click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* panel */}
      <div
        className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-t-3xl"
        style={{ animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
        `}</style>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
              Order Details
            </p>
            <h2 className="text-base font-bold text-gray-900 font-mono leading-tight">
              {order.orderId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* status + date row */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <StatusBadge status={order.status} size="md" />
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={13} />
                {formatDate(order.createdAt)}
              </span>
            </div>

            {/* ── Timeline ── */}
            {showTimeline && (
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Delivery Progress
                </p>
                <div className="flex items-start">
                  {timeline.map((step, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center relative">
                      {/* connector line */}
                      {i < timeline.length - 1 && (
                        <div
                          className={`absolute top-3 left-1/2 w-full h-0.5 ${
                            step.done ? "bg-emerald-400" : "bg-gray-200"
                          }`}
                          style={{ left: "50%" }}
                        />
                      )}
                      {/* dot */}
                      <div
                        className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                          step.done
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {step.done && (
                          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {/* label */}
                      <p
                        className={`text-[10px] mt-2 text-center leading-tight px-1 font-medium ${
                          step.done ? "text-emerald-700" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Items ── */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Items Ordered
              </p>
              <div className="space-y-2.5">
                {order.items?.length > 0 ? (
                  order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-gray-200"
                        onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap gap-x-2 mt-1 text-xs text-gray-500">
                          {item.size && item.size !== "NOSIZE" && (
                            <span>Size: {item.size}</span>
                          )}
                          {item.color && item.color !== "NOCOLOR" && (
                            <span>Color: {item.color}</span>
                          )}
                          <span>Qty: {item.qty}</span>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900 text-sm flex-shrink-0 self-start pt-0.5">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <ShoppingBag size={28} className="mx-auto mb-2 opacity-40" />
                    No item details available
                  </div>
                )}
              </div>
            </div>

            {/* ── Pricing ── */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Total Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""})</span>
                  <span>${order.pricing?.subtotal?.toFixed(2) ?? "—"}</span>
                </div>
                {order.pricing?.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-${order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.pricing?.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${order.pricing.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {order.pricing?.shipping === 0
                      ? "Free"
                      : `$${order.pricing?.shipping?.toFixed(2) ?? "—"}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>${order.pricing?.total?.toFixed(2) ?? "—"}</span>
                </div>
                {order.payment?.method && (
                  <p className="text-xs text-gray-400 text-right pt-0.5">
                    Paid via {order.payment.method}
                  </p>
                )}
              </div>
            </div>

            {/* ── Payment + Address ── */}
            <div className="grid sm:grid-cols-2 gap-3">
              {/* Payment */}
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard size={14} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 capitalize mb-1.5">
                  {order.payment?.method || "Stripe"}
                </p>
                <StatusBadge status={order.payment?.status} size="sm" />
              </div>

              {/* Address */}
              {order.customer?.address &&
                (order.customer.address.city || order.customer.address.street) && (
                  <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                        <MapPin size={14} className="text-amber-600" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Delivery Address
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {order.customer.address.street && (
                        <span className="block font-medium">{order.customer.address.street}</span>
                      )}
                      {order.customer.address.city && (
                        <span className="text-gray-500">
                          {order.customer.address.city}
                          {order.customer.address.country &&
                            `, ${order.customer.address.country}`}
                        </span>
                      )}
                    </p>
                  </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;