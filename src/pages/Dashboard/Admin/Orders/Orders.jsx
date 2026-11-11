// pages/admin/Orders/Orders.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle, Clock, Download, Eye, Filter, MapPin, MessageCircle, Package,
  Plus, Printer, RefreshCw, RotateCcw, Search, Truck, X, XCircle,
} from 'lucide-react';
import useAuth from '../../../../hooks/useAuth';
import useRole from '../../../../hooks/useRole';
import useOrderManagement from '../../../../hooks/useOrders';
import notify from '../../../../utils/notification';
import { Link } from 'react-router-dom';
import MemoWhatsAppButton, { toWaDigits } from '../../../../components/Admin/MemoWhatsAppButton';
import { DELIVERY_NOTICE, WHATSAPP_DISPLAY, formatMoney } from '../../../../utils/wholesale';

// ── constants (Tailwind 4: ক্লাস নাম পুরো লেখা, জোড়া লাগানো নয়) ─────────────
const STATUS_FILTERS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
const PAYMENT_FILTERS = ['all', 'pending', 'paid', 'refunding', 'refunded'];
const FLOW_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];
const BATCH_STATUSES = ['processing', 'shipped', 'delivered'];

const STATUS_BADGE = {
  pending: 'badge-warning',
  processing: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-error',
  refunded: 'badge-neutral',
};
const PAYMENT_BADGE = {
  paid: 'badge-success',
  pending: 'badge-warning',
  refunding: 'badge-info',
  refunded: 'badge-neutral',
  cancelled: 'badge-ghost',
  failed: 'badge-error',
};
const STATUS_ICON = {
  pending: <Clock className="w-3.5 h-3.5" />,
  processing: <Package className="w-3.5 h-3.5" />,
  shipped: <Truck className="w-3.5 h-3.5" />,
  delivered: <CheckCircle className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
  refunded: <RotateCcw className="w-3.5 h-3.5" />,
};
const METHOD_LABEL = {
  bank_deposit: 'Bank Transfer',
  cod: 'Cash on Delivery',
  stripe: 'Card (Stripe)',
  card: 'Card',
};

// ── helpers ──────────────────────────────────────────────────────────────────
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const money = (n) => formatMoney(n || 0);
const fmtDate = (d, full = false) =>
  d
    ? new Date(d).toLocaleString('en-GB', full
        ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
        : { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

// Invoice HTML-এ ক্রেতার দেওয়া লেখা বসে, তাই সবকিছু escape করতে হয়
const esc = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// image string / {url} / JSON string যেকোনোটি হলে plain URL দেয়
const toImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') {
    if (image.trim().startsWith('{')) {
      try {
        return JSON.parse(image).url || '';
      } catch {
        return '';
      }
    }
    return image;
  }
  return image.url || '';
};

const getAddress = (order) => {
  const a = order.customer?.address;
  if (!a) return null;
  if (typeof a === 'string') {
    return { name: order.customer?.name || '', phone: order.customer?.phone || '', lines: [a] };
  }
  const lines = [
    [a.street, a.aptNumber].filter(Boolean).join(', '),
    [a.city, a.state, a.zipCode].filter(Boolean).join(', '),
    a.country,
    a.landmark ? `Landmark: ${a.landmark}` : '',
    a.deliveryNote ? `Note: ${a.deliveryNote}` : '',
  ].filter(Boolean);
  return {
    name: a.fullName || order.customer?.name || '',
    phone: a.phone || order.customer?.phone || '',
    lines,
  };
};

const isFinal = (o) => ['cancelled', 'refunded'].includes(o.status);
const canMarkPaid = (o) =>
  ['bank_deposit', 'cod'].includes(o.payment?.method) &&
  o.payment?.status === 'pending' &&
  !isFinal(o);
const canCancel = (o) =>
  !isFinal(o) && o.status !== 'delivered' && !['paid', 'refunding'].includes(o.payment?.status);

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('...');
  pages.push(total);
  return pages;
};

// Modal খোলা থাকলে পেছনের পেজ স্ক্রল বন্ধ; onClose দিলে Escape-এও বন্ধ
const useModalLock = (onClose) => {
  useEffect(() => {
        const onKey = (e) =>
      onClose &&
      e.key === 'Escape' &&
      !document.querySelector('.swal2-container') &&
      onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
};

// ── Invoice ──────────────────────────────────────────────────────────────────
const printInvoice = (order) => {
  if (!order) {
    notify.error('Error', 'Order data not found');
    return;
  }
  const w = window.open('', '_blank', 'width=900,height=700');
  if (!w) {
    notify.error('Error', 'Please allow popups to print invoice');
    return;
  }

  const addr = getAddress(order);
  const p = order.pricing || {};
  const payStatus = order.payment?.status || 'pending';

  const rows = (order.items || [])
    .map(
      (item) => `<tr>
        <td>${esc(item.name)}</td>
        <td>${[item.color && `Color: ${esc(item.color)}`, item.size && `Size: ${esc(item.size)}`].filter(Boolean).join(' · ')}</td>
        <td class="c">${esc(item.qty)}</td>
        <td class="r">${money(item.price)}</td>
        <td class="r">${money((item.price || 0) * (item.qty || 0))}</td>
      </tr>`
    )
    .join('');

  const bulkRow = p.bulkDiscount > 0
    ? `<div class="row"><span>Bulk discount (${esc(p.bulkDiscountPercent)}%)</span><span>- ${money(p.bulkDiscount)}</span></div>` : '';
  const couponRow = p.couponDiscount > 0
    ? `<div class="row"><span>Coupon discount</span><span>- ${money(p.couponDiscount)}</span></div>` : '';

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Invoice - ${esc(order.orderId)}</title>
<style>
  *{box-sizing:border-box} body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;color:#111;margin:0;background:#f3f4f6}
  .page{max-width:820px;margin:24px auto;background:#fff;padding:40px;border:1px solid #e5e7eb}
  .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111;padding-bottom:16px;margin-bottom:24px}
  h1{margin:0;font-size:28px} .muted{color:#6b7280;font-size:13px}
  .tag{display:inline-block;background:#111;color:#fff;padding:4px 12px;font-size:12px;letter-spacing:1px;border-radius:4px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
  .box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;font-size:14px;line-height:1.5}
  h3{margin:0 0 6px;font-size:13px;text-transform:uppercase;color:#6b7280}
  table{width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px}
  th{background:#111;color:#fff;text-align:left;padding:8px} td{padding:8px;border-bottom:1px solid #e5e7eb;vertical-align:top}
  .c{text-align:center} .r{text-align:right}
  .tot{margin-left:auto;width:320px} .row{display:flex;justify-content:space-between;padding:4px 0;font-size:14px}
  .grand{border-top:2px solid #111;margin-top:6px;padding-top:8px;font-size:18px;font-weight:700}
  .note{margin-top:24px;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:12px}
  .actions{max-width:820px;margin:16px auto 0;text-align:right} button{padding:6px 14px;cursor:pointer}
  @media print{ body{background:#fff} .page{border:0;margin:0} .actions{display:none} }
</style></head>
<body>
  <div class="actions"><button onclick="window.print()">Print</button> <button onclick="window.close()">Close</button></div>
  <div class="page">
    <div class="top">
      <div><h1>Anis Abaya</h1><div class="muted">WhatsApp: ${esc(WHATSAPP_DISPLAY)}</div></div>
      <div style="text-align:right"><span class="tag">INVOICE</span>
        <div style="margin-top:8px;font-size:14px"><strong>${esc(order.orderId)}</strong></div>
        <div class="muted">${esc(fmtDate(order.createdAt))}</div></div>
    </div>
    <div class="grid">
      <div class="box"><h3>Bill To</h3>
        <strong>${esc(addr?.name || order.customer?.name || 'N/A')}</strong><br>
        ${order.customer?.isOffline ? '' : esc(order.customer?.email || '') + '<br>'}
        ${addr?.phone ? esc(addr.phone) + '<br>' : ''}
        ${addr ? addr.lines.map(esc).join('<br>') : ''}
      </div>
      <div class="box"><h3>Payment</h3>
        Method: ${esc(METHOD_LABEL[order.payment?.method] || order.payment?.method || 'N/A')}<br>
        Payment status: <strong>${esc(payStatus.toUpperCase())}</strong><br>
        Order status: <strong>${esc((order.status || '').toUpperCase())}</strong>
        ${order.payment?.reference ? `<br>Reference: ${esc(order.payment.reference)}` : ''}
      </div>
    </div>
    <table>
      <thead><tr><th>Item</th><th>Details</th><th class="c">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="tot">
      <div class="row"><span>Subtotal (${esc(p.totalQuantity ?? '')} pcs)</span><span>${money(p.subtotal)}</span></div>
      ${bulkRow}${couponRow}
      <div class="row grand"><span>Total</span><span>${money(p.total)}</span></div>
    </div>
    <div class="note">${esc(DELIVERY_NOTICE)}<br>Thank you for your business.</div>
  </div>
</body></html>`;

  w.document.write(html);
  w.document.close();
};

// ── Mark as Paid dialog ──────────────────────────────────────────────────────
const MarkPaidDialog = ({ order, onClose, onSubmit, isSaving }) => {
  const total = order.pricing?.total ?? 0;
  const [reference, setReference] = useState('');
  const [amount, setAmount] = useState(String(total));
  const [note, setNote] = useState('');
  useModalLock(null);

  const received = Number(amount);
  const invalid = !Number.isFinite(received) || received <= 0;
  const mismatch = !invalid && Math.abs(received - total) > 0.009;

  const submit = (e) => {
    e.preventDefault();
    if (invalid || isSaving) return;
    onSubmit({ reference: reference.trim(), note: note.trim(), receivedAmount: received });
  };

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/50">
      <form
        onSubmit={submit}
        className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Mark as Paid</h3>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Order <span className="font-semibold">{order.orderId}</span> — expected{' '}
          <span className="font-semibold">{money(total)}</span> via {METHOD_LABEL[order.payment?.method] || 'N/A'}.
          Confirm only after the money is in your account.
        </p>

        <label className="block text-sm font-medium mb-1">Amount received (USD)</label>
        <input
          type="number" min="0" step="0.01" value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full bg-white border-gray-300 mb-1"
        />
        {mismatch && (
          <p className="text-xs text-amber-600 mb-2">
            Amount differs from the order total. It will be recorded as a mismatch.
          </p>
        )}

        <label className="block text-sm font-medium mb-1 mt-3">Bank reference / transaction ID</label>
        <input
          type="text" value={reference} maxLength={100}
          onChange={(e) => setReference(e.target.value)}
          placeholder="e.g. transfer reference from the bank slip"
          className="input input-bordered w-full bg-white border-gray-300"
        />

        <label className="block text-sm font-medium mb-1 mt-3">Note (optional)</label>
        <textarea
          value={note} maxLength={300} rows={2}
          onChange={(e) => setNote(e.target.value)}
          className="textarea textarea-bordered w-full bg-white border-gray-300"
        />

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="btn">Cancel</button>
          <button type="submit" disabled={invalid || isSaving} className="btn btn-success text-white">
            {isSaving ? 'Saving...' : 'Confirm Payment'}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
};

// ── Order details modal ──────────────────────────────────────────────────────
const OrderDetailsModal = ({
  order, onClose, onUpdateStatus, onCancel, onMarkPaid, onRefund,
  isUpdating, isRefunding, isAdmin,
}) => {
  const addr = getAddress(order);
  const p = order.pricing || {};
  const pay = order.payment || {};
  const final = isFinal(order);
  const waDigits = toWaDigits(addr?.phone);
  useModalLock(onClose);

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white text-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header (স্থির) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-bold text-xl">Order {order.orderId}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle"><X size={20} /></button>
        </div>

        {/* body (স্ক্রল করে) */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5">
          {/* Status */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Order Status</h4>
              <span className={`badge ${STATUS_BADGE[order.status] || 'badge-ghost'} gap-1`}>
                {STATUS_ICON[order.status]} {order.status}
              </span>
            </div>
            {final ? (
              <p className="text-sm text-gray-600">This order is {order.status}; status can no longer be changed.</p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {FLOW_STATUSES.map((s) => {
                  const active = order.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => !active && onUpdateStatus(order, s)}
                      disabled={isUpdating && !active}
                      aria-pressed={active}
                      className={`px-3 py-1 text-xs font-medium rounded-md border capitalize transition-colors ${
                        active
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50'
                      }`}
                    >
                      {active && '✓ '}{s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer */}
          <div>
            <h4 className="font-semibold mb-2">Customer</h4>
            <div className="border border-gray-200 rounded-lg p-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account:</span>
                <span className="font-medium">
                  {order.customer?.isOffline
                    ? `Offline customer${order.customer?.businessName ? ` · ${order.customer.businessName}` : ''}`
                    : order.customer?.email || 'N/A'}
                </span>
              </div>
              {order.internalNote && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Internal note:</span>
                  <span className="font-medium text-right">{order.internalNote}</span>
                </div>
              )}
              <div className="flex justify-between"><span className="text-gray-600">Name:</span><span className="font-medium">{addr?.name || order.customer?.name || 'N/A'}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium flex items-center gap-2">
                  {addr?.phone || 'N/A'}
                  {waDigits && (
                    <a
                      href={`https://wa.me/${waDigits}`}
                      target="_blank" rel="noreferrer"
                      className="text-green-600 hover:text-green-700" title="Open WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                  )}
                </span>
              </div>
              {addr && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600 flex items-center gap-1"><MapPin size={14} />Address:</span>
                  <span className="font-medium text-right">
                    {addr.lines.map((l, i) => <div key={i}>{l}</div>)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-semibold mb-2">Items ({p.totalQuantity ?? order.items?.length ?? 0} pcs)</h4>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {order.items?.map((item, i) => {
                const img = toImageUrl(item.image);
                return (
                  <div key={item.key || i} className="p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        {img && (
                          <img
                            src={img}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {[item.color && `Color: ${item.color}`, item.size && `Size: ${item.size}`, `Qty: ${item.qty}`]
                            .filter(Boolean).join(' • ')}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold whitespace-nowrap">{money(item.price * item.qty)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm space-y-1">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{money(p.subtotal)}</span></div>
            {p.bulkDiscount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Bulk discount ({p.bulkDiscountPercent}%)</span><span>- {money(p.bulkDiscount)}</span>
              </div>
            )}
            {p.couponDiscount > 0 && (
              <div className="flex justify-between text-green-700"><span>Coupon discount</span><span>- {money(p.couponDiscount)}</span></div>
            )}
            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-lg font-bold">
              <span>Total</span><span>{money(p.total)}</span>
            </div>
            <p className="text-xs text-gray-500 pt-1">{DELIVERY_NOTICE}</p>
          </div>

          {/* Payment */}
          <div className="border border-gray-200 rounded-lg p-4 text-sm space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment status</span>
              <span className={`badge ${PAYMENT_BADGE[pay.status] || 'badge-ghost'}`}>{pay.status || 'unknown'}</span>
            </div>
            <div className="flex justify-between"><span className="text-gray-600">Method</span><span className="font-medium">{METHOD_LABEL[pay.method] || pay.method || 'N/A'}</span></div>
            {pay.reference && <div className="flex justify-between"><span className="text-gray-600">Reference</span><span className="font-medium">{pay.reference}</span></div>}
            {pay.paidAt && <div className="flex justify-between"><span className="text-gray-600">Paid at</span><span className="font-medium">{fmtDate(pay.paidAt, true)}</span></div>}
            {pay.receivedAmount != null && (
              <div className="flex justify-between"><span className="text-gray-600">Received</span><span className="font-medium">{money(pay.receivedAmount)}</span></div>
            )}
            {pay.amountMismatch && (
              <p className="text-xs text-amber-600">Received amount differs from the order total.</p>
            )}
            {pay.status === 'pending' && !final && (
              <p className="text-xs text-gray-500">Waiting for the customer's payment. Customer has been asked to send the receipt on WhatsApp.</p>
            )}
          </div>
        </div>

        {/* footer (স্থির) */}
        <div className="flex flex-wrap justify-end gap-2 px-6 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="btn">Close</button>
          {canCancel(order) && (
            <button onClick={() => onCancel(order)} disabled={isUpdating} className="btn btn-outline btn-error">
              Cancel Order
            </button>
          )}
          {isAdmin && pay.status === 'paid' && order.status !== 'refunded' && (
            <button onClick={() => onRefund(order.orderId)} disabled={isRefunding} className="btn btn-error">
              {isRefunding ? 'Processing...' : 'Refund Order'}
            </button>
          )}
          {canMarkPaid(order) && (
            <button onClick={() => onMarkPaid(order)} className="btn btn-success text-white gap-2">
              <CheckCircle size={16} /> Mark as Paid
            </button>
          )}
          <MemoWhatsAppButton order={order} />
          <button onClick={() => printInvoice(order)} className="btn btn-primary gap-2">
            <Printer size={16} /> Print Invoice
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── page ─────────────────────────────────────────────────────────────────────
const Orders = () => {
  const { currentUser } = useAuth();
  const { isAdmin } = useRole(currentUser?.email);

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [payOrder, setPayOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const filters = {
    page,
    limit,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    payment: paymentFilter !== 'all' ? paymentFilter : undefined,
    search: searchTerm || undefined,
  };

  const {
    orders, pagination, stats,
    isLoading, isFetching, isUpdating, isMarkingPaid, isRefunding, isExporting, isBatchUpdating,
    error, updateStatus, markPaid, refundOrder, exportOrders, batchUpdateStatus,
    refetch, refetchStats,
  } = useOrderManagement(filters);

  // Modal সবসময় সর্বশেষ ডেটা দেখায় (স্ট্যাটাস বদলালে নিজে হালনাগাদ হয়)
  const selectedOrder = orders.find((o) => o.orderId === selectedId) || null;

  // টাইপ থামার পর search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
      setSelectedOrders([]);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput.trim());
      setPage(1);
      setSelectedOrders([]);
    }
  };
  const clearSearch = () => { setSearchInput(''); setSearchTerm(''); setPage(1); };
  const handleRefresh = () => Promise.all([refetch(), refetchStats()]);

  const handleStatusFilter = (s) => { setStatusFilter(s); setPage(1); setSelectedOrders([]); };
  const handlePaymentFilter = (s) => { setPaymentFilter(s); setPage(1); setSelectedOrders([]); };

  const handleSelectOrder = (id) =>
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const handleSelectAll = () =>
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map((o) => o.orderId));

  const handleUpdateStatus = async (order, newStatus) => {
    const unpaid = order.payment?.status !== 'paid';
    const warn = unpaid && ['shipped', 'delivered'].includes(newStatus)
      ? `Payment has NOT been received yet. Change status to "${newStatus}" anyway?`
      : `Change status to "${newStatus}"?`;
    const ok = await notify.confirm('Update Order Status?', warn, 'Yes, Update', 'Cancel');
    if (ok) updateStatus(order.orderId, newStatus);
  };

  const handleCancel = async (order) => {
    const ok = await notify.confirm(
      'Cancel this order?',
      'Stock will be returned. This cannot be undone.',
      'Yes, Cancel Order',
      'Keep Order'
    );
    if (ok) updateStatus(order.orderId, 'cancelled');
  };

  const handleRefund = async (orderId) => {
    const { value: reason } = await notify.prompt(
      'Refund Order', 'Please enter refund reason:', 'text', 'Customer request'
    );
    if (reason) {
      refundOrder(orderId, reason);
      setSelectedId(null);
    }
  };

  const handleMarkPaidSubmit = async (payload) => {
    try {
      await markPaid(payOrder.orderId, payload);
      setPayOrder(null);
    } catch {
      /* hook-এর onError notify দেখায়; dialog খোলা থাকে */
    }
  };

  const handleBatchUpdate = async () => {
    if (selectedOrders.length === 0) {
      notify.warning('No Orders Selected', 'Please select orders first');
      return;
    }
    const { value: status } = await notify.select(
      'Batch Update Status', 'Select new status for selected orders:', BATCH_STATUSES
    );
    if (status) {
      batchUpdateStatus(selectedOrders, status);
      setSelectedOrders([]);
    }
  };

  const handleExport = () =>
    exportOrders({
      status: filters.status,
      payment: filters.payment,
      search: filters.search,
    });

  if (error && !orders.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button onClick={() => refetch()} className="btn btn-primary">
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders ?? pagination.total, color: 'text-gray-900' },
    { label: 'Awaiting Payment', value: stats.awaitingPayment, color: 'text-orange-600' },
    { label: 'Pending', value: stats.pendingOrders, color: 'text-yellow-600' },
    { label: 'Processing', value: stats.processingOrders, color: 'text-blue-600' },
    { label: 'Shipped', value: stats.shippedOrders, color: 'text-purple-600' },
    { label: 'Delivered', value: stats.deliveredOrders, color: 'text-green-600' },
    { label: 'Cancelled', value: stats.cancelledOrders, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/orders/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-black"
          >
            <Plus size={16} /> New Order
          </Link>
          {selectedOrders.length > 0 && (
            <button onClick={handleBatchUpdate} disabled={isBatchUpdating} className="btn btn-outline btn-sm gap-2">
              <Filter size={16} /> Batch Update ({selectedOrders.length})
            </button>
          )}
          <button onClick={handleExport} disabled={isExporting || !isAdmin} title={isAdmin ? '' : 'Admin only'} className="btn btn-outline btn-sm gap-2">
            <Download size={16} /> {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="btn btn-sm gap-2 bg-white text-black hover:bg-gray-300"
            title="Reload orders"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order ID, name, phone or email..."
              className="input input-bordered w-full pl-10 pr-10 bg-white border-gray-300 ring ring-blue-200 rounded-lg"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchInput && (
              <button
                type="button" onClick={clearSearch} aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            className="select select-bordered bg-white border-gray-300 ring ring-blue-200 rounded-lg"
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Status' : cap(s)}</option>
            ))}
          </select>
          <select
            className="select select-bordered bg-white border-gray-300 ring ring-blue-200 rounded-lg"
            value={paymentFilter}
            onChange={(e) => handlePaymentFilter(e.target.value)}
          >
            {PAYMENT_FILTERS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All Payments' : cap(s)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-black bg-gray-200">
                <th>
                  <input
                    type="checkbox" className="checkbox checkbox-sm"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && !orders.length ? (
                [...Array(limit)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="9"><div className="skeleton h-12 w-full" /></td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderId} className="hover">
                    <td>
                      <input
                        type="checkbox" className="checkbox checkbox-sm"
                        checked={selectedOrders.includes(order.orderId)}
                        onChange={() => handleSelectOrder(order.orderId)}
                      />
                    </td>
                    <td className="font-medium text-gray-900 whitespace-nowrap">{order.orderId}</td>
                    <td>
                      <div className="font-medium text-gray-900">{order.customer?.address?.fullName || order.customer?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">
                        {order.customer?.isOffline
                          ? [order.customer?.businessName, order.customer?.phone].filter(Boolean).join(' · ') || 'Offline customer'
                          : order.customer?.email || 'N/A'}
                      </div>
                      {order.source && order.source !== 'website' && (
                        <span className="mt-0.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                          {order.source.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="text-gray-600 whitespace-nowrap">
                      {order.pricing?.totalQuantity ?? order.items?.length ?? 0} pcs
                    </td>
                    <td className="font-semibold text-gray-900 whitespace-nowrap">{money(order.pricing?.total)}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[order.status] || 'badge-ghost'} badge-sm gap-1`}>
                        {STATUS_ICON[order.status]} {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${PAYMENT_BADGE[order.payment?.status] || 'badge-ghost'} badge-sm`}>
                        {order.payment?.status || 'unknown'}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">{METHOD_LABEL[order.payment?.method] || ''}</div>
                    </td>
                    <td className="text-gray-600 text-sm whitespace-nowrap">{fmtDate(order.createdAt)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedId(order.orderId)} className="btn btn-ghost btn-xs" title="View Details">
                          <Eye size={16} />
                        </button>
                        {canMarkPaid(order) && (
                          <button onClick={() => setPayOrder(order)} className="btn btn-ghost btn-xs text-green-600" title="Mark as Paid">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => printInvoice(order)} className="btn btn-ghost btn-xs" title="Print Invoice">
                          <Printer size={16} />
                        </button>
                        <MemoWhatsAppButton order={order} label="Memo" compact />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No orders found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Orders will appear here when customers make purchases'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} orders
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 min-w-8 px-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white disabled:cursor-not-allowed"
              >
                «
              </button>
              {getPageNumbers(page, pagination.totalPages).map((p, idx) =>
                p === '...' ? (
                  <span key={`dots-${idx}`} className="px-1 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-current={page === p ? 'page' : undefined}
                    className={`h-8 min-w-8 px-2 text-sm rounded-md border ${
                      page === p
                        ? 'bg-gray-300 border-gray-400 text-gray-900 font-semibold'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="h-8 min-w-8 px-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:hover:bg-white disabled:cursor-not-allowed"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onUpdateStatus={handleUpdateStatus}
          onCancel={handleCancel}
          onMarkPaid={setPayOrder}
          onRefund={handleRefund}
          isUpdating={isUpdating}
          isRefunding={isRefunding}
          isAdmin={isAdmin}
        />
      )}

      {payOrder && (
        <MarkPaidDialog
          order={payOrder}
          onClose={() => setPayOrder(null)}
          onSubmit={handleMarkPaidSubmit}
          isSaving={isMarkingPaid}
        />
      )}
    </div>
  );
};

export default Orders;