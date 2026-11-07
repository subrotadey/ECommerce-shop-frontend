// src/pages/Dashboard/Admin/DashboardHome/DashboardHome.jsx
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useDashboardStats from "../../../../hooks/useDashboardStats";
import { CURRENCY, formatMoney } from "../../../../utils/wholesale";

// ── helpers ───────────────────────────────────────────────────────────────────

const fmt = (n) => {
  const v = Number(n) || 0;
  if (v >= 1_000_000) return `${CURRENCY} ${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${CURRENCY} ${(v / 1_000).toFixed(1)}k`;
  return formatMoney(v);
};

const fmtNum = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}k`
    : `${n ?? 0}`;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

// ছবি কখনো string, কখনো { url } অবজেক্ট
const toImg = (img) => (typeof img === "string" ? img : img?.url || "");

const GrowthChip = ({ value }) => {
  if (value === null || value === undefined) {
    return <p className="mt-2 text-xs text-gray-400">No data for last month</p>;
  }
  const up = value >= 0;
  return (
    <div className="flex items-center mt-2 gap-1">
      {up ? (
        <ArrowUpRight className="w-4 h-4 text-green-600" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
        {up ? "+" : ""}{value}%
      </span>
      <span className="text-sm text-gray-500 ml-0.5">from last month</span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    delivered: "bg-green-100 text-green-700",
    processing: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-purple-100 text-purple-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-700",
    refunding: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`badge badge-sm px-2 py-1 rounded-md font-medium ${map[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
};

const StatSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-40" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
    </div>
  </div>
);

// ── Revenue Bar Chart ────────────────────────────────────────────────────────
const CHART_HEIGHT = 200;

const RevenueBarChart = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="w-full select-none">
      <div className="flex justify-between text-[10px] text-gray-400 mb-1 px-1">
        <span>{fmt(max)}</span>
        <span>{fmt(max / 2)}</span>
        <span>{CURRENCY} 0</span>
      </div>

      <div
        className="relative w-full border-b border-l border-gray-200"
        style={{ height: CHART_HEIGHT }}
      >
        {[0.25, 0.5, 0.75].map((pct) => (
          <div
            key={pct}
            className="absolute w-full border-t border-dashed border-gray-100"
            style={{ bottom: `${pct * 100}%` }}
          />
        ))}

        <div className="absolute inset-0 flex items-end gap-[3px] px-1 pb-0">
          {data.map((d, i) => {
            const barHeightPct = Math.max((d.revenue / max) * 100, d.revenue > 0 ? 1 : 0);
            const isHovered = hoveredIdx === i;

            return (
              <div
                key={i}
                className="relative flex-1 flex flex-col justify-end items-center h-full"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div
                  className="absolute z-10 pointer-events-none transition-opacity duration-150"
                  style={{
                    bottom: `${barHeightPct}%`,
                    left: "50%",
                    transform: "translateX(-50%) translateY(-8px)",
                    opacity: isHovered ? 1 : 0,
                  }}
                >
                  <div className="bg-gray-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
                    <div className="font-bold">{fmt(d.revenue)}</div>
                    <div className="text-gray-300">{d.orders} orders</div>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        bottom: -5,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid #111827",
                      }}
                    />
                  </div>
                </div>

                <div
                  className="w-full rounded-t-[3px] transition-all duration-200 cursor-pointer"
                  style={{
                    height: `${barHeightPct}%`,
                    minHeight: d.revenue > 0 ? 4 : 0,
                    background: isHovered
                      ? "linear-gradient(to top, #2563eb, #7c3aed)"
                      : "linear-gradient(to top, #3b82f6, #8b5cf6)",
                    opacity: isHovered ? 1 : 0.85,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-[3px] px-1 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span
              className={`text-[10px] font-medium transition-colors ${
                hoveredIdx === i ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {d.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

const DashboardHome = () => {
  const {
    stats,
    recentOrders,
    chartData,
    topProducts,
    topCustomers,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDashboardStats();

  const kpiCards = stats
    ? [
        {
          label: "Awaiting Payment",
          value: fmtNum(stats.awaitingPayment),
          sub: `${fmt(stats.awaitingAmount)} to collect`,
          icon: Wallet,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          to: "/admin/orders",
        },
        {
          label: "Processing",
          value: fmtNum(stats.processingOrders),
          sub: "Orders being prepared",
          icon: Package,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          to: "/admin/orders",
        },
        {
          label: "Revenue This Month",
          value: fmt(stats.thisMonthRevenue),
          growth: stats.revenueGrowth,
          sub: `${fmt(stats.totalRevenue)} total (paid orders)`,
          icon: TrendingUp,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          showGrowth: true,
        },
        {
          label: "Customers",
          value: fmtNum(stats.totalCustomers),
          sub: `${stats.thisMonthCustomers} new this month`,
          icon: Users,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          to: "/admin/customers",
        },
      ]
    : [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-600 text-lg">Failed to load dashboard data.</p>
        <button onClick={() => refetch()} className="btn btn-primary gap-2">
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
                <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : kpiCards.map((card) => {
              const Wrapper = card.to ? Link : "div";
              const wrapperProps = card.to ? { to: card.to } : {};
              return (
                <Wrapper
                  key={card.label}
                  {...wrapperProps}
                  className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2 tabular-nums">{card.value}</p>
                      {card.showGrowth && <GrowthChip value={card.growth} />}
                      <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                    </div>
                    <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
                      <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                    </div>
                  </div>
                </Wrapper>
              );
            })}
      </div>

      {/* Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <p className="text-xs text-gray-400 mt-0.5">Paid orders, last 12 months — hover a bar for details</p>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ) : chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              No revenue data yet.
            </div>
          ) : (
            <RevenueBarChart data={chartData} />
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
            <p className="text-xs text-gray-400 mt-0.5">Paid orders only · all time · ranked by revenue</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No paid orders yet.</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p, idx) => {
                const img = toImg(p.image);
                return (
                  <div key={p.productId ?? idx} className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                        {img ? (
                          <img
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}
                      </div>
                      <span className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-gray-800 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name || "Unknown Product"}</p>
                                            <p className="text-xs text-gray-500">
                        {p.sales} pcs sold
                        {p.inCatalog === false && (
                          <span className="ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                            not in catalog
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{fmt(p.revenue)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Top Customers</h3>
            <p className="text-xs text-gray-400 mt-0.5">Paid orders only · all time · ranked by pieces bought</p>
          </div>
          <Link to="/admin/customers" className="text-sm text-primary hover:underline flex items-center gap-1">
            All customers <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : topCustomers.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No paid orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr className="text-black">
                  <th>#</th>
                  <th>Customer</th>
                  <th>Orders</th>
                  <th>Pieces</th>
                  <th>Total Spent</th>
                  <th>Last Order</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, idx) => (
                  <tr key={c.email} className="hover">
                    <td className="font-bold text-gray-500">{idx + 1}</td>
                    <td>
                      <p className="font-medium text-sm text-gray-900">{c.name || "Guest"}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="tabular-nums">{c.orders}</td>
                    <td className="font-semibold tabular-nums">{c.pieces} pcs</td>
                    <td className="font-semibold text-gray-900 tabular-nums">{formatMoney(c.spent)}</td>
                    <td className="text-sm text-gray-500">{fmtDate(c.lastOrderAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse items-center py-2">
                <div className="h-4 bg-gray-200 rounded w-28" />
                <div className="h-4 bg-gray-200 rounded w-32 flex-1" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr className="text-black">
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 8).map((order) => {
                  const ps =
                    order.status === "cancelled"
                      ? "cancelled"
                      : order.payment?.status ?? "pending";
                  const payCls =
                    {
                      paid: "badge-success",
                      pending: "badge-warning",
                      refunding: "badge-info",
                      refunded: "badge-neutral",
                      cancelled: "badge-ghost",
                    }[ps] || "badge-ghost";

                  return (
                    <tr key={order._id ?? order.orderId} className="hover">
                      <td className="font-mono text-sm font-medium text-gray-900">{order.orderId}</td>
                      <td>
                        <p className="font-medium text-sm text-gray-900">
                          {order.customer?.address?.fullName || order.customer?.name || "Guest"}
                        </p>
                        <p className="text-xs text-gray-400">{order.customer?.email}</p>
                      </td>
                      <td className="font-semibold text-gray-900 tabular-nums">
                        {formatMoney(order.pricing?.total)}
                      </td>
                      <td><StatusBadge status={order.status} /></td>
                      <td><span className={`badge badge-sm ${payCls}`}>{ps}</span></td>
                      <td className="text-sm text-gray-500">{fmtDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;