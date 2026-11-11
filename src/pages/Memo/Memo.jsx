import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPublicMemo } from "../../services/orderService";
import { formatMoney } from "../../utils/currency";

// Use the real info here, otherwise memo will be empty this field is used to display the business info on the memo page. If you want to change the business info, change it here.

const BUSINESS = {
  name: "AnisAbayaUAE",
  address: "",
  phone: "+971 55 189 6390",
  email: "",
  bank: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    iban: "",
    swift: "",
  },
};

const METHOD = { bank_deposit: "Bank transfer", cod: "Cash on delivery", stripe: "Card" };
const fmt = (n) => formatMoney(n);

const Memo = () => {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const key = params.get("k") || "";
  const [memo, setMemo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Memo ${orderId} | ${BUSINESS.name}`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [orderId]);

  useEffect(() => {
    let alive = true;
    getPublicMemo(orderId, key)
      .then((d) => alive && setMemo(d.memo))
      .catch(() => alive && setError("This memo link is invalid or no longer available."));
    return () => {
      alive = false;
    };
  }, [orderId, key]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center text-gray-700">
        {error}
      </div>
    );
  }
  if (!memo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        Loading memo…
      </div>
    );
  }

  const p = memo.pricing || {};
  const addr = memo.customer.address || {};
  const bank = BUSINESS.bank;
  const showBank =
    memo.payment?.method === "bank_deposit" &&
    memo.payment?.status === "pending" &&
    (bank.iban || bank.accountNumber);
  const paid = memo.payment?.status === "paid";

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 text-gray-900 shadow print:rounded-none print:shadow-none sm:p-10">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold">{BUSINESS.name}</h1>
            {BUSINESS.address && <p className="text-sm text-gray-600">{BUSINESS.address}</p>}
            {BUSINESS.phone && <p className="text-sm text-gray-600">{BUSINESS.phone}</p>}
            {BUSINESS.email && <p className="text-sm text-gray-600">{BUSINESS.email}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Memo</p>
            <p className="font-mono text-sm font-bold">{memo.orderId}</p>
            <p className="text-sm text-gray-600">
              {new Date(memo.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${
                paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}
            >
              {paid ? "PAID" : "PAYMENT PENDING"}
            </span>
          </div>
        </div>

        <div className="mb-6 text-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Bill to</p>
          <p className="font-semibold">{memo.customer.name}</p>
          {memo.customer.businessName && <p>{memo.customer.businessName}</p>}
          {memo.customer.phone && <p>{memo.customer.phone}</p>}
          {(addr.street || addr.city) && (
            <p className="text-gray-600">
              {[addr.street, addr.city, addr.country].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="py-2 pr-2">Item</th>
                <th className="py-2 pr-2">Colour</th>
                <th className="py-2 pr-2">Size</th>
                <th className="py-2 pr-2 text-right">Qty</th>
                <th className="py-2 pr-2 text-right">Rate</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {memo.items.map((it, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-2">
                    {it.name}
                    {it.sku && <span className="block text-xs text-gray-400">{it.sku}</span>}
                  </td>
                  <td className="py-2 pr-2">{it.color}</td>
                  <td className="py-2 pr-2">{it.size}</td>
                  <td className="py-2 pr-2 text-right">{it.qty}</td>
                  <td className="py-2 pr-2 text-right">{fmt(it.price)}</td>
                  <td className="py-2 text-right">{fmt(it.price * it.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ml-auto mt-6 w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({p.totalQuantity} pcs)</span>
            <span>{fmt(p.subtotal)}</span>
          </div>
          {p.bulkDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Bulk discount ({p.bulkDiscountPercent}%)</span>
              <span>− {fmt(p.bulkDiscount)}</span>
            </div>
          )}
          {p.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon discount</span>
              <span>− {fmt(p.couponDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
            <span>Total</span>
            <span>{fmt(p.total)}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Delivery charges are not included. Shipping costs are payable by the customer.
        </p>
        <p className="mt-1 text-xs text-gray-500">All amounts are in US Dollars (USD).</p>
        <p className="mt-1 text-xs text-gray-500">
          Payment method: {METHOD[memo.payment?.method] || memo.payment?.method}
        </p>

        {showBank && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
              Bank transfer details
            </p>
            {bank.bankName && <p>Bank: {bank.bankName}</p>}
            {bank.accountName && <p>Account name: {bank.accountName}</p>}
            {bank.accountNumber && <p>Account no.: {bank.accountNumber}</p>}
            {bank.iban && <p>IBAN: {bank.iban}</p>}
            {bank.swift && <p>SWIFT: {bank.swift}</p>}
            <p className="mt-2 text-xs text-gray-500">
              Please send the transfer receipt on WhatsApp with order no. {memo.orderId}.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white print:hidden"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default Memo;