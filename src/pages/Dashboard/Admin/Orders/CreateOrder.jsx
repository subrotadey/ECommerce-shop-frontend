import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Check, Search, Trash2, UserPlus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MemoWhatsAppButton from "../../../../components/Admin/MemoWhatsAppButton";
import { useAllProducts } from "../../../../hooks/useProducts";
import {
  useCreateAdminOrder,
  useCreateOfflineCustomer,
} from "../../../../hooks/useOrders";
import { findCustomersForOrder } from "../../../../services/orderService";
import notify from "../../../../utils/notification";

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];
const MOQ = 12;
const BULK_THRESHOLD = 100;
const BULK_PERCENT = 5;

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const fmt = (n) =>
  `AED ${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const productImage = (p) => p?.media?.images?.[0]?.url || p?.images?.[0]?.url || "";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-800";
const labelCls = "mb-1 block text-xs font-semibold text-gray-600";

// ───────── নতুন অফলাইন ক্রেতার ফর্ম ─────────
const NewCustomerForm = ({ onCreated, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    email: "",
    street: "",
    city: "",
  });
  const create = useCreateOfflineCustomer();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await create.mutateAsync({
        name: form.name,
        phone: form.phone,
        businessName: form.businessName,
        email: form.email,
        address: { street: form.street, city: form.city, country: "UAE" },
      });
      if (res.existing) {
        notify.info("Existing customer", "This phone number was already saved. Using that customer.");
      }
      onCreated(res.customer);
    } catch (err) {
      notify.error("Failed", err?.message || "Could not save customer");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-900">New offline customer</p>
        <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-900">
          <X size={18} />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Name *</label>
          <input className={inputCls} value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <label className={labelCls}>Phone / WhatsApp *</label>
          <input
            className={inputCls}
            value={form.phone}
            onChange={set("phone")}
            placeholder="+971 55 123 4567"
            required
          />
        </div>
        <div>
          <label className={labelCls}>Business name</label>
          <input className={inputCls} value={form.businessName} onChange={set("businessName")} />
        </div>
        <div>
          <label className={labelCls}>Email (optional)</label>
          <input className={inputCls} type="email" value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label className={labelCls}>Street / area</label>
          <input className={inputCls} value={form.street} onChange={set("street")} />
        </div>
        <div>
          <label className={labelCls}>City</label>
          <input className={inputCls} value={form.city} onChange={set("city")} />
        </div>
      </div>
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {create.isPending ? "Saving…" : "Save customer"}
      </button>
    </form>
  );
};

// ───────── ক্রেতা বাছাই ─────────
const CustomerPicker = ({ value, onChange }) => {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 350);
    return () => clearTimeout(t);
  }, [term]);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ["orderCustomers", debounced],
    queryFn: () => findCustomersForOrder(debounced),
    enabled: debounced.length >= 2,
  });

  if (value) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="min-w-0 text-sm text-gray-800">
          <p className="font-bold text-gray-900">
            {value.displayName}
            {value.isOffline && (
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                OFFLINE
              </span>
            )}
          </p>
          {value.businessName && <p>{value.businessName}</p>}
          <p>{value.phoneNumber || "No phone saved"}</p>
          {!value.isOffline && <p className="text-gray-500">{value.email}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className={`${inputCls} pl-9`}
          placeholder="Search customer by name, phone, business or email…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      {debounced.length >= 2 && (
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
          {isFetching && <p className="p-3 text-sm text-gray-500">Searching…</p>}
          {!isFetching && results.length === 0 && (
            <p className="p-3 text-sm text-gray-500">No customer found.</p>
          )}
          {results.map((c) => (
            <button
              type="button"
              key={c._id}
              onClick={() => onChange(c)}
              className="block w-full p-3 text-left text-sm hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-900">{c.displayName}</span>
              {c.isOffline && (
                <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                  OFFLINE
                </span>
              )}
              <span className="block text-xs text-gray-500">
                {[c.businessName, c.phoneNumber, c.isOffline ? c.contactEmail : c.email]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </button>
          ))}
        </div>
      )}

      {showNew ? (
        <NewCustomerForm
          onCreated={(c) => {
            onChange(c);
            setShowNew(false);
          }}
          onCancel={() => setShowNew(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          <UserPlus size={16} /> New offline customer
        </button>
      )}
    </div>
  );
};

// ───────── প্রোডাক্ট বাছাই (color × size grid) ─────────
const ProductPicker = ({ lines, setCell }) => {
  const { data: products = [], isLoading } = useAllProducts();
  const [term, setTerm] = useState("");
  const [openId, setOpenId] = useState(null);

  const list = useMemo(() => {
    const t = term.trim().toLowerCase();
    return products
      .filter(
        (p) =>
          Array.isArray(p.inventory) &&
          p.inventory.length > 0 &&
          (!t ||
            p.productName?.toLowerCase().includes(t) ||
            p.sku?.toLowerCase().includes(t))
      )
      .slice(0, 40);
  }, [products, term]);

  const pickedFor = (id) =>
    Object.values(lines)
      .filter((l) => l.productId === id)
      .reduce((s, l) => s + l.qty, 0);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className={`${inputCls} pl-9`}
          placeholder="Search product by name or SKU…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading products…</p>}

      <div className="space-y-2">
        {list.map((p) => {
          const open = openId === p._id;
          const picked = pickedFor(String(p._id));
          return (
            <div key={p._id} className="rounded-xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : p._id)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                {productImage(p) ? (
                  <img
                    src={productImage(p)}
                    alt=""
                    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-200" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{p.productName}</p>
                  <p className="text-xs text-gray-500">
                    {p.sku} · {fmt(p.newPrice)} / pc · stock {p.stock ?? 0}
                  </p>
                </div>
                {picked > 0 && (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                    {picked}
                  </span>
                )}
              </button>

              {open && (
                <div className="overflow-x-auto border-t border-gray-100 p-3">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500">
                        <th className="py-1 pr-2 font-semibold">Colour</th>
                        {SIZES.map((s) => (
                          <th key={s} className="px-1 py-1 text-center font-semibold">
                            {s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.inventory.map((row) => (
                        <tr key={row.color} className="border-t border-gray-50">
                          <td className="py-1.5 pr-2 font-medium text-gray-900">{row.color}</td>
                          {SIZES.map((size) => {
                            const stock =
                              Number(row.sizes?.find((x) => x.size === size)?.stock) || 0;
                            const key = `${p._id}|${row.color}|${size}`;
                            return (
                              <td key={size} className="px-1 py-1 text-center">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  disabled={stock === 0}
                                  value={lines[key]?.qty ?? ""}
                                  placeholder={stock === 0 ? "–" : `${stock}`}
                                  onChange={(e) => setCell(p, row.color, size, e.target.value, stock)}
                                  onFocus={(e) => e.target.select()}
                                  className="h-9 w-14 rounded-lg border border-gray-300 bg-white text-center text-sm font-semibold text-gray-900 outline-none focus:border-gray-800 disabled:bg-gray-100"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-2 text-xs text-gray-500">
                    Placeholder = available stock. Minimum {MOQ} pieces per colour.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ───────── মূল পেজ ─────────
const CreateOrder = () => {
  const [customer, setCustomer] = useState(null);
  const [lines, setLines] = useState({}); // key: productId|color|size
  const [paymentMethod, setPaymentMethod] = useState("bank_deposit");
  const [source, setSource] = useState("phone");
  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(null);
  const createOrder = useCreateAdminOrder();

  const setCell = (product, color, size, raw, max) => {
    const n = Math.max(0, Math.min(max, Number(String(raw).replace(/\D/g, "")) || 0));
    const key = `${product._id}|${color}|${size}`;
    setLines((prev) => {
      const next = { ...prev };
      if (n === 0) delete next[key];
      else {
        next[key] = {
          productId: String(product._id),
          name: product.productName,
          price: Number(product.newPrice) || 0,
          color,
          size,
          qty: n,
        };
      }
      return next;
    });
  };

  const removeGroup = (productId, color) =>
    setLines((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([, l]) => !(l.productId === productId && l.color === color))
      )
    );

  const items = Object.values(lines);
  const totalQty = items.reduce((s, l) => s + l.qty, 0);
  const subtotal = round2(items.reduce((s, l) => s + l.qty * l.price, 0));
  const bulk = totalQty >= BULK_THRESHOLD ? round2((subtotal * BULK_PERCENT) / 100) : 0;
  const estimated = round2(subtotal - bulk);

  const groups = useMemo(() => {
    const map = new Map();
    for (const l of Object.values(lines)) {
      const k = `${l.productId}|${l.color}`;
      const g = map.get(k) || { productId: l.productId, name: l.name, color: l.color, qty: 0, sizes: [] };
      g.qty += l.qty;
      g.sizes.push(`${l.size}: ${l.qty}`);
      map.set(k, g);
    }
    return [...map.values()];
  }, [lines]);

  const short = groups.filter((g) => g.qty < MOQ);

  const submit = async () => {
    if (!customer) return notify.warning("Customer", "Select or add a customer first");
    if (items.length === 0) return notify.warning("Items", "Add at least one product");
    if (short.length > 0) {
      return notify.warning(
        "Minimum quantity",
        short.map((g) => `${g.name} (${g.color}): ${g.qty}/${MOQ}`).join(", ")
      );
    }

    try {
      const res = await createOrder.mutateAsync({
        customerId: customer._id,
        items: items.map(({ productId, color, size, qty }) => ({ productId, color, size, qty })),
        paymentMethod,
        source,
        note,
        couponCode: coupon.trim() || undefined,
      });
      setDone(res.order);
    } catch (err) {
      notify.error("Order failed", err?.message || "Could not create order");
    }
  };

  const reset = () => {
    setDone(null);
    setCustomer(null);
    setLines({});
    setCoupon("");
    setNote("");
  };

  if (done) {
    return (
      <div className="mx-auto max-w-xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 text-gray-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Check size={20} />
          </div>
          <div>
            <p className="text-lg font-bold">Order created</p>
            <p className="font-mono text-sm text-gray-600">{done.orderId}</p>
          </div>
        </div>
        <div className="space-y-1 rounded-xl bg-gray-50 p-4 text-sm">
          <p>
            <b>{done.customer?.name}</b> · {done.customer?.phone}
          </p>
          <p>
            {done.pricing?.totalQuantity} pcs · <b>{fmt(done.pricing?.total)}</b>
          </p>
          <p className="text-gray-500">Payment: pending ({done.payment?.method})</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <MemoWhatsAppButton order={done} />
          <Link
            to="/admin/orders"
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            View orders
          </Link>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-gray-900">
      <div>
        <h1 className="text-2xl font-bold">New order</h1>
        <p className="text-sm text-gray-600">
          Phone / WhatsApp / walk-in order on behalf of a customer.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">1. Customer</h2>
            <CustomerPicker value={customer} onChange={setCustomer} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">2. Products</h2>
            <ProductPicker lines={lines} setCell={setCell} />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="text-sm font-bold text-gray-900">Order summary</h2>

            {groups.length === 0 ? (
              <p className="text-sm text-gray-500">No items yet.</p>
            ) : (
              <ul className="space-y-2">
                {groups.map((g) => (
                  <li key={`${g.productId}|${g.color}`} className="flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {g.name} · {g.color}
                      </p>
                      <p className="text-xs text-gray-500">{g.sizes.join(" · ")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          g.qty >= MOQ ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {g.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGroup(g.productId, g.color)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {short.length > 0 && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>Minimum {MOQ} pieces needed for: {short.map((g) => `${g.name} (${g.color})`).join(", ")}</span>
              </div>
            )}

            <dl className="space-y-1.5 border-t border-gray-100 pt-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <dt>Pieces</dt>
                <dd>{totalQty}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Subtotal</dt>
                <dd>{fmt(subtotal)}</dd>
              </div>
              {bulk > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Bulk discount ({BULK_PERCENT}%)</dt>
                  <dd>− {fmt(bulk)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-1.5 text-base font-bold text-gray-900">
                <dt>Total</dt>
                <dd>{fmt(estimated)}</dd>
              </div>
            </dl>
            <p className="text-xs text-gray-500">
              Coupon (if any) is applied by the server. Delivery charges are not included.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
            <div>
              <label className={labelCls}>Order source</label>
              <select className={inputCls} value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="phone">Phone call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="walk_in">Walk-in</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Payment method</label>
              <select
                className={inputCls}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="bank_deposit">Bank transfer</option>
                <option value="cod">Cash on delivery</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Payment stays pending until you press “Mark as Paid” on the order.
              </p>
            </div>
            <div>
              <label className={labelCls}>Coupon code (optional)</label>
              <input className={inputCls} value={coupon} onChange={(e) => setCoupon(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Internal note (customer cannot see)</label>
              <textarea
                className={inputCls}
                rows={2}
                maxLength={500}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={createOrder.isPending}
              className="w-full rounded-xl bg-gray-900 py-3 text-sm font-bold text-white hover:bg-black disabled:opacity-50"
            >
              {createOrder.isPending ? "Creating…" : "Create order"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateOrder;