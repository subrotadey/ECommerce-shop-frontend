// src/pages/MyOrders/MyOrders.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  Eye,
  X,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import axiosInstance from "../../utils/axios";
import useAuth from "../../hooks/useAuth";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import Loading from "../../components/Shared/Loading/Loading";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ─── ORDER STATUS CONFIG ─────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock,
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-500",
  },
  processing: {
    label: "Processing",
    icon: Package,
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    icon: RefreshCw,
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
    dot: "bg-gray-400",
  },
};

// ─── PAYMENT STATUS CONFIG ───────────────────────────────────────────────────
// Separate config for payment status badge
const PAYMENT_STATUS_CONFIG = {
  paid: {
    label: "Paid",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
  },
  refunded: {
    label: "Refunded",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  failed: {
    label: "Failed",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.pending;

const getPaymentStatusConfig = (status) =>
  PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.pending;

// ─── StatusBadge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status, size = "sm" }) => {
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

// ─── PaymentBadge ─────────────────────────────────────────────────────────────
const PaymentBadge = ({ status, size = "sm" }) => {
  const cfg = getPaymentStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold border
        ${cfg.bg} ${cfg.text} ${cfg.border}
        ${size === "sm" ? "text-xs" : "text-sm"}`}
    >
      {cfg.label}
    </span>
  );
};

// ─── OrderDetailModal ─────────────────────────────────────────────────────────

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const timeline = [
    { label: "Order placed", done: true, date: order.createdAt },
    {
      label: "Payment confirmed",
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-sm text-gray-500 font-mono">{order.orderId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* status + date */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <StatusBadge status={order.status} size="md" />
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={14} />
              {formatDate(order.createdAt)}
            </span>
          </div>

          {/* timeline */}
          {order.status !== "cancelled" && order.status !== "refunded" && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-start gap-0">
                {timeline.map((step, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="flex items-center w-full">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                          ${step.done ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`}
                      >
                        {step.done && (
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {i < timeline.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 ${step.done ? "bg-green-400" : "bg-gray-200"}`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-xs mt-1.5 text-center leading-tight
                        ${step.done ? "text-green-700 font-medium" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Items ordered</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 border border-gray-200 rounded-xl"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <div className="flex gap-2 mt-0.5 text-xs text-gray-500">
                      {item.size && item.size !== "NOSIZE" && (
                        <span>Size: {item.size}</span>
                      )}
                      {item.color && item.color !== "NOCOLOR" && (
                        <span>· Color: {item.color}</span>
                      )}
                      <span>· Qty: {item.qty}</span>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* pricing */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${order.pricing?.subtotal?.toFixed(2)}</span>
            </div>
            {order.pricing?.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount {order.coupon?.code && `(${order.coupon.code})`}</span>
                <span>-${order.pricing.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax</span>
              <span>${order.pricing?.tax?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>
                {order.pricing?.shipping === 0
                  ? "Free"
                  : `$${order.pricing?.shipping?.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>${order.pricing?.total?.toFixed(2)}</span>
            </div>
          </div>

          {/* payment + address */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard size={16} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">
                  Payment
                </span>
              </div>
              <p className="text-sm text-gray-600 capitalize mb-1.5">
                {order.payment?.method || "Stripe"}
              </p>
              {/* ✅ Use PaymentBadge instead of StatusBadge for payment */}
              <PaymentBadge status={order.payment?.status} size="sm" />
            </div>

            {order.customer?.address &&
              (order.customer.address.city || order.customer.address.street) && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      Delivery address
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.customer.address.street && (
                      <span className="block">
                        {order.customer.address.street}
                      </span>
                    )}
                    {order.customer.address.city && (
                      <span>
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
  );
};

// ─── MyOrders (main page) ─────────────────────────────────────────────────────

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const LIMIT = 8;

  const userId = currentUser?.email;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["myOrders", userId, statusFilter, page],
    queryFn: async () => {
      const params = { page, limit: LIMIT };
      if (statusFilter !== "all") params.status = statusFilter;
      const { data } = await axiosInstance.get(`/api/users/${userId}/orders`, {
        params,
      });
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const statusOptions = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (isLoading) return <Loading />;

  return (
    <>
      <Breadcrumb
        customBreadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "My Orders" },
        ]}
      />

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-1">
                {total > 0 ? `${total} orders total` : "No orders yet"}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
          </div>

          {/* filter tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex flex-wrap gap-1">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                  ${
                    statusFilter === s
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {s === "all" ? "All orders" : s}
              </button>
            ))}
          </div>

          {/* error state */}
          {isError && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Failed to load orders</p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Try again
              </button>
            </div>
          )}

          {/* empty state */}
          {!isError && orders.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {statusFilter === "all" ? "No orders yet" : `No ${statusFilter} orders`}
              </h3>
              <p className="text-gray-500 mb-6">
                {statusFilter === "all"
                  ? "When you place an order, it will appear here."
                  : "Try a different filter to see other orders."}
              </p>
              {statusFilter === "all" ? (
                <Link
                  to="/abaya"
                  className="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              ) : (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  View all orders
                </button>
              )}
            </div>
          )}

          {/* orders list */}
          {orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => {
                const cfg = getStatusConfig(order.status);
                const paymentCfg = getPaymentStatusConfig(order.payment?.status);
                const itemCount = order.items?.length || 0;

                return (
                  <div
                    key={order._id || order.orderId}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* order card header */}
                    <div className="flex items-center gap-4 p-4 border-b border-gray-100">
                      <div className={`w-2 h-10 rounded-full ${cfg.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 font-mono text-sm truncate">
                          {order.orderId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      {/* Order status */}
                      <StatusBadge status={order.status} />
                    </div>

                    {/* order body */}
                    <div className="p-4 flex items-center gap-4">
                      {/* thumbnail stack */}
                      <div className="flex -space-x-2 flex-shrink-0">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <img
                            key={i}
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                            style={{ zIndex: 3 - i }}
                          />
                        ))}
                        {itemCount > 3 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600 z-0">
                            +{itemCount - 3}
                          </div>
                        )}
                      </div>

                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          {order.items
                            ?.slice(0, 2)
                            .map((i) => i.name)
                            .join(", ")}
                          {itemCount > 2 && ` +${itemCount - 2} more`}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>

                      {/* total + payment status + action */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${order.pricing?.total?.toFixed(2)}
                          </p>
                          {/* ✅ PaymentBadge — shows green "Paid" after Stripe payment */}
                          <div className="mt-1">
                            <PaymentBadge status={order.payment?.status} size="sm" />
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 bg-white rounded-xl border border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default MyOrders;