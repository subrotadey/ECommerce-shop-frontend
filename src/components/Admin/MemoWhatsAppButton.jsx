import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { getMemoLink } from "../../services/orderService";
import notify from "../../utils/notification";
import { formatMoney } from "../../utils/currency";

// wa.me এর জন্য শুধু সংখ্যা (UAE: 05xxxxxxxx → 971xxxxxxxx)
export const toWaDigits = (raw) => {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 && d.startsWith("05")) d = "971" + d.slice(1);
  return d;
};

const MemoWhatsAppButton = ({ order, label = "Send memo on WhatsApp", className = "", compact = false }) => {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (!order?.orderId || busy) return;

    let digits = toWaDigits(order.customer?.phone);
    if (digits.length < 8) {
      const typed = window.prompt("Customer WhatsApp number (with country code, e.g. 971551234567)");
      digits = toWaDigits(typed);
      if (digits.length < 8) return;
    }

    // ক্লিকের সাথে সাথে ট্যাব খুলি, নইলে ব্রাউজার popup আটকায়
    const win = window.open("", "_blank");
    setBusy(true);
    try {
      const { token } = await getMemoLink(order.orderId);
      const link = `${window.location.origin}/memo/${order.orderId}?k=${token}`;
      const text = [
        `Hello ${order.customer?.name || ""},`,
        ``,
        `Thank you for your order with AnisAbayaUAE.`,
        `Order: ${order.orderId}`,
        `Pieces: ${order.pricing?.totalQuantity ?? ""}`,
        `Total: ${formatMoney(order.pricing?.total)}`,,
        ``,
        `Your memo (invoice): ${link}`,
      ].join("\n");

      const url = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
      if (win) win.location.href = url;
      else window.location.href = url;
    } catch (e) {
      if (win) win.close();
      notify.error("Memo", e?.message || "Could not create memo link");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 ${
        compact ? "rounded-md px-2.5 py-1 text-xs" : "rounded-xl px-4 py-2.5 text-sm"
      } ${className}`}
    >
      <MessageCircle size={16} />
      {busy ? "Preparing…" : label}
    </button>
  );
};

export default MemoWhatsAppButton;