// pages/Dashboard/Admin/Customers/Customers.jsx
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Ban,
    Calendar,
    CheckCircle,
    Download,
    Eye,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    MessageSquare,
    Phone,
    Search,
    Shield,
    ShoppingBag,
    Trash2,
    UserCog,
    Users,
    Wallet,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuth from '../../../../hooks/useAuth';
import useCustomerManagement, { useCustomer } from '../../../../hooks/useCustomers';
import useDebounce from '../../../../hooks/useDebounce';
import useRole from '../../../../hooks/useRole';
import notify from '../../../../utils/notification';

const PAGE_SIZE = 10;

// ─── Helpers ─────────────────────────────────────────────────────────
const formatMoney = (value) =>
  `AED ${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '—';

const isActiveUser = (customer) => customer?.isActive !== false;
const customerKey = (customer) => customer._id || customer.uid;

const ROLE_BADGE = { admin: 'badge-error', staff: 'badge-warning', user: 'badge-info' };

const ORDER_STATUS_BADGE = {
  delivered: 'badge-success',
  cancelled: 'badge-error',
  pending: 'badge-warning',
  processing: 'badge-info',
  shipped: 'badge-info'
};

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest', icon: Calendar, title: 'Recently joined', defaultOrder: 'desc' },
  { value: 'totalSpent', label: 'Top Spenders', icon: Wallet, title: 'Highest paid total first', defaultOrder: 'desc' },
  { value: 'orderCount', label: 'Most Orders', icon: ShoppingBag, title: 'Highest order count', defaultOrder: 'desc' },
  { value: 'displayName', label: 'Name A–Z', icon: ArrowUpDown, title: 'Sort by name', defaultOrder: 'asc' },
  { value: 'lastLogin', label: 'Recently Active', icon: Users, title: 'Last login time', defaultOrder: 'desc' }
];

const ROLE_TABS = [
  { id: 'all', label: 'All Users', icon: Users },
  { id: 'user', label: 'Customers', icon: Users },
  { id: 'admin', label: 'Admins', icon: Shield },
  { id: 'staff', label: 'Staff', icon: UserCog }
];

const useEscape = (handler) => {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && handler();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [handler]);
};

const Avatar = ({ name, src, className = 'h-10 w-10', textClass = 'text-sm' }) => {
  const [failed, setFailed] = useState(false);
  const initial = (name || 'U').trim().charAt(0).toUpperCase() || 'U';

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={name || 'User'}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} ${textClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white`}
    >
      {initial}
    </div>
  );
};

// ─── Message modal ───────────────────────────────────────────────────
const MessageModal = ({ customer, isSending, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEscape(onClose);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!subject.trim() || !message.trim()) {
      notify.warning('Missing fields', 'Please write a subject and a message');
      return;
    }
    onSend({ subject: subject.trim(), message: message.trim() });
  };

  return (
    <div className="modal modal-open" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="modal-box max-w-lg bg-white"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Send message</h3>
            <p className="text-sm text-gray-600">
              To {customer.displayName || customer.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={100}
            placeholder="Subject"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Write your message..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <p className="text-xs text-gray-500">
            The customer sees this in their notification bell. It is not sent by email.
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSending && <Loader2 size={15} className="animate-spin" />}
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Details modal ───────────────────────────────────────────────────
const CustomerDetailsModal = ({
  customerId,
  currentEmail,
  isAdmin,
  busy,
  onClose,
  onMessage,
  onToggleStatus,
  onDelete
}) => {
  const { data, isLoading, isError, error } = useCustomer(customerId);
  useEscape(onClose);

  const customer = data?.customer;
  const stats = customer?.stats || {};

  const isSelf =
    !!customer &&
    String(customer.email || '').toLowerCase() === String(currentEmail || '').toLowerCase();
  const canManage = isAdmin && !!customer && !isSelf && customer.role !== 'admin';

  const whatsappNumber = String(customer?.phoneDigits || customer?.phoneNumber || '').replace(/\D/g, '');
  const location = [customer?.address?.city, customer?.address?.country].filter(Boolean).join(', ');

  return (
    <div className="modal modal-open" onClick={onClose}>
      <div
        onClick={(event) => event.stopPropagation()}
        className="modal-box max-w-4xl bg-white"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Customer Details</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError || !customer ? (
          <p className="py-10 text-center text-sm text-red-600">
            {error?.message || 'Could not load this customer.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: profile */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <Avatar
                  name={customer.displayName}
                  src={customer.photoURL}
                  className="mb-3 h-24 w-24"
                  textClass="text-3xl"
                />
                <h4 className="text-xl font-bold text-gray-900">
                  {customer.displayName || 'Unknown'}
                </h4>
                <div className="mt-2 flex gap-2">
                  <span className={`badge ${isActiveUser(customer) ? 'badge-success' : 'badge-warning'}`}>
                    {isActiveUser(customer) ? 'Active' : 'Inactive'}
                  </span>
                  <span className={`badge ${ROLE_BADGE[customer.role] || 'badge-ghost'}`}>
                    {customer.role || 'user'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-gray-400" />
                  <span className="break-all text-gray-700">
                    {customer.isOffline
                      ? customer.contactEmail || 'No email (offline customer)'
                      : customer.email}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-gray-400" />
                  <span className="text-gray-700">{customer.phoneNumber || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="shrink-0 text-gray-400" />
                  <span className="text-gray-700">{location || 'Location not set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="shrink-0 text-gray-400" />
                  <span className="text-gray-700">Joined {formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={16} className="shrink-0 text-gray-400" />
                  <span className="text-gray-700">Last login {formatDate(customer.lastLogin)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {!customer.isOffline && (
                  <button
                    type="button"
                    onClick={() => onMessage(customer)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <MessageSquare size={16} />
                    Send message
                  </button>
                )}

                {whatsappNumber.length >= 10 && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                )}

                {canManage && (
                  <>
                    {isActiveUser(customer) ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onToggleStatus(customer, false)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
                      >
                        <Ban size={16} />
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onToggleStatus(customer, true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                      >
                        <CheckCircle size={16} />
                        Activate
                      </button>
                    )}

                    {customer.role === 'user' && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onDelete(customer)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right: stats + orders */}
            <div className="space-y-4 lg:col-span-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders || 0}</p>
                  <p className="text-sm text-gray-600">Orders</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.paidOrders || 0}</p>
                  <p className="text-sm text-gray-600">Paid orders</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-xl font-bold text-gray-900">{formatMoney(stats.totalSpent)}</p>
                  <p className="text-sm text-gray-600">Total spent (paid)</p>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Average paid order {formatMoney(stats.averageOrderValue)} · Wishlist{' '}
                {stats.wishlistCount || 0} item(s)
              </p>

              <div>
                <h4 className="mb-2 font-semibold text-gray-900">Recent orders</h4>
                <div className="max-h-64 divide-y divide-gray-200 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                  {customer.recentOrders?.length > 0 ? (
                    customer.recentOrders.map((order) => (
                      <div
                        key={order.orderId}
                        className="flex items-center justify-between gap-3 p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {order.orderId}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatMoney(order.pricing?.total)}
                          </p>
                          <div className="mt-1 flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-gray-500">
                              {order.payment?.status || 'pending'}
                            </span>
                            <span
                              className={`badge badge-sm ${
                                ORDER_STATUS_BADGE[order.status] || 'badge-info'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-sm text-gray-500">No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-action">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────
const Customers = () => {
  const { currentUser } = useAuth();
  const { isAdmin } = useRole(currentUser?.email);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [detailsId, setDetailsId] = useState(null);
  const [messageTarget, setMessageTarget] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 400);
  const isTyping = searchTerm !== debouncedSearch;

  const {
    customers,
    pagination,
    stats,
    isLoading,
    isFetching,
    error,
    refetch,
    updateStatus,
    deleteCustomer,
    sendMessage,
    exportCustomers,
    batchUpdateStatus,
    isUpdating,
    isDeleting,
    isSending,
    isExporting,
    isBatchUpdating
  } = useCustomerManagement({
    page,
    limit: PAGE_SIZE,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    search: debouncedSearch.trim() || undefined,
    sortBy,
    sortOrder
  });

  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 1;
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  // শেষ পেজের সব ক্রেতা মোছা হলে আগের পেজে ফিরে যায়
  useEffect(() => {
    if (pagination.totalPages && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination.totalPages, page]);

  const roleCount = {
    all: stats.totalUsers ?? 0,
    user: stats.regularUsers ?? 0,
    admin: stats.adminCount ?? 0,
    staff: stats.staffCount ?? 0
  };

  // ─── selection ───
  const selectableIds = customers.filter((c) => c.role !== 'admin').map(customerKey);
  const allSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () => setSelectedIds(allSelected ? [] : selectableIds);

  const resetPaging = () => {
    setPage(1);
    setSelectedIds([]);
  };

  // ─── handlers ───
  const handleSortChange = (option) => {
    if (sortBy === option.value) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(option.value);
      setSortOrder(option.defaultOrder);
    }
    resetPaging();
  };

  const handleToggleStatus = async (customer, makeActive) => {
    const confirmed = await notify.confirm(
      `${makeActive ? 'Activate' : 'Deactivate'} customer?`,
      makeActive
        ? 'This customer will be able to sign in and place orders again.'
        : 'This customer will be signed out and blocked from logging in and placing orders.',
      'Yes, proceed',
      'Cancel'
    );
    if (confirmed) updateStatus(customerKey(customer), makeActive);
  };

  const handleDelete = async (customer) => {
    const confirmed = await notify.confirm(
      'Delete customer?',
      'This permanently deletes the account. A customer with orders cannot be deleted.',
      'Yes, delete',
      'Cancel'
    );
    if (confirmed) {
      deleteCustomer(customerKey(customer), { onSuccess: () => setDetailsId(null) });
    }
  };

  const handleBatch = async (makeActive) => {
    if (selectedIds.length === 0) return;

    const confirmed = await notify.confirm(
      `${makeActive ? 'Activate' : 'Deactivate'} ${selectedIds.length} customer(s)?`,
      makeActive
        ? 'They will be able to sign in and order again.'
        : 'They will be blocked from logging in and placing orders.',
      'Yes, proceed',
      'Cancel'
    );

    if (confirmed) {
      batchUpdateStatus(selectedIds, makeActive, { onSuccess: () => setSelectedIds([]) });
    }
  };

  const openMessage = (customer) => {
    setDetailsId(null);
    setMessageTarget(customer);
  };

  const handleSendMessage = (payload) => {
    sendMessage(customerKey(messageTarget), payload, {
      onSuccess: () => setMessageTarget(null)
    });
  };

  const handleExport = () =>
    exportCustomers({
      role: roleFilter !== 'all' ? roleFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: debouncedSearch.trim() || undefined
    });

  // ─── states ───
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error && customers.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <p className="mb-4 text-sm text-red-700">
          {error.message || 'Failed to load customers.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-600">Manage your customer base</p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-60"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export CSV
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Customers</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalCustomers || 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Active</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{stats.activeCustomers || 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.inactiveCustomers || 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">New This Month</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{stats.newUsersThisMonth || 0}</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Role tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200">
          {ROLE_TABS.map(({ id, label, icon: Icon }) => {
            const active = roleFilter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setRoleFilter(id);
                  resetPaging();
                }}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-4 text-sm font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
                <span className={`badge badge-sm ${active ? 'badge-primary' : 'badge-ghost'}`}>
                  {roleCount[id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, filter, batch, sort */}
        <div className="space-y-4 p-4">
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  resetPaging();
                }}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              {(isTyping || isFetching) && (
                <Loader2
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                />
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                resetPaging();
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {isAdmin && selectedIds.length > 0 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isBatchUpdating}
                  onClick={() => handleBatch(true)}
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  Activate ({selectedIds.length})
                </button>
                <button
                  type="button"
                  disabled={isBatchUpdating}
                  onClick={() => handleBatch(false)}
                  className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
                >
                  Deactivate ({selectedIds.length})
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = sortBy === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  title={option.title}
                  onClick={() => handleSortChange(option)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary text-primary-content'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={14} />
                  {option.label}
                  {active && (sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto transition-opacity ${isFetching ? 'opacity-60' : ''}`}>
          {customers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500">No customers found</p>
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="text-black">
                  {isAdmin && (
                    <th>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </th>
                  )}
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const id = customerKey(customer);
                  return (
                    <tr key={id} className="hover">
                      {isAdmin && (
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            disabled={customer.role === 'admin'}
                            checked={selectedIds.includes(id)}
                            onChange={() => toggleSelect(id)}
                            aria-label={`Select ${customer.displayName || customer.email}`}
                          />
                        </td>
                      )}
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.displayName} src={customer.photoURL} />
                          <span className="font-medium text-gray-900">
                            {customer.displayName || 'Unknown'}
                          </span>
                          {customer.isOffline && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                              OFFLINE
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {customer.isOffline
                              ? customer.businessName || customer.contactEmail || 'Offline customer'
                              : customer.email}
                          </div>
                          <div className="text-gray-500">{customer.phoneNumber || 'N/A'}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${ROLE_BADGE[customer.role] || 'badge-ghost'}`}>
                          {customer.role || 'user'}
                        </span>
                      </td>
                      <td className="font-medium text-gray-900">{customer.stats?.orderCount ?? 0}</td>
                      <td className="whitespace-nowrap font-semibold text-gray-900">
                        {formatMoney(customer.stats?.totalSpent)}
                      </td>
                      <td className="whitespace-nowrap text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            isActiveUser(customer) ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {isActiveUser(customer) ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setDetailsId(id)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing {from}–{to} of {total} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setSelectedIds([]);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            >
              «
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((p) => p + 1);
                setSelectedIds([]);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {detailsId && (
        <CustomerDetailsModal
          customerId={detailsId}
          currentEmail={currentUser?.email}
          isAdmin={isAdmin}
          busy={isUpdating || isDeleting}
          onClose={() => setDetailsId(null)}
          onMessage={openMessage}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      {messageTarget && (
        <MessageModal
          customer={messageTarget}
          isSending={isSending}
          onClose={() => setMessageTarget(null)}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
};

export default Customers;