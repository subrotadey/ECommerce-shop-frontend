// utils/wholesale.js
// Wholesale নিয়ম (শুধু preview)। আসল হিসাব ও যাচাই backend-এ হয়।
// backend-এর MOQ_PER_COLOR / BULK_DISCOUNT_* এর সাথে মিল রাখতে হবে।

export const CURRENCY = "AED";
export const MOQ_PER_COLOR = 12;
export const BULK_DISCOUNT_THRESHOLD = 100;
export const BULK_DISCOUNT_PERCENT = 5;
export const DELIVERY_NOTICE =
  "Delivery charges are not included. Shipping costs are payable by the customer.";

// দোকানের একটিই WhatsApp নম্বর। সব পেজ এখান থেকে নেবে।
export const WHATSAPP_NUMBER = "971551896390"; // শুধু অঙ্ক (wa.me-র জন্য)
export const WHATSAPP_DISPLAY = "+971 55 189 6390";
export const whatsappLink = (text = "") =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const round2 = (n) =>
  Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;

export const formatMoney = (n) =>
  `${CURRENCY} ${round2(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// cart item-গুলোকে Product + Color অনুযায়ী ভাগ করে
export function groupByProductColor(items = []) {
  const map = new Map();
  for (const item of items) {
    const color = item.color ?? "NOCOLOR";
    const gKey = `${item.productId}__${color}`;
    if (!map.has(gKey)) {
      map.set(gKey, {
        key: gKey,
        productId: item.productId,
        name: item.name,
        image: item.image,
        color: item.color && item.color !== "NOCOLOR" ? item.color : null,
        items: [],
        qty: 0,
        subtotal: 0,
      });
    }
    const g = map.get(gKey);
    g.items.push(item);
    g.qty += Number(item.qty) || 0;
    g.subtotal += (Number(item.price) || 0) * (Number(item.qty) || 0);
  }
  return [...map.values()].map((g) => ({
    ...g,
    subtotal: round2(g.subtotal),
    moqMet: g.qty >= MOQ_PER_COLOR,
    moqShort: Math.max(0, MOQ_PER_COLOR - g.qty),
  }));
}

// পুরো cart-এর সারাংশ
export function summarizeCart(items = []) {
  const groups = groupByProductColor(items);
  const totalQuantity = groups.reduce((s, g) => s + g.qty, 0);
  const subtotal = round2(groups.reduce((s, g) => s + g.subtotal, 0));
  const bulkDiscountPercent =
    totalQuantity >= BULK_DISCOUNT_THRESHOLD ? BULK_DISCOUNT_PERCENT : 0;
  const bulkDiscount = round2((subtotal * bulkDiscountPercent) / 100);
  const afterBulk = round2(subtotal - bulkDiscount);
  const invalidGroups = groups.filter((g) => !g.moqMet);

  return {
    groups,
    totalQuantity,
    subtotal,
    bulkDiscountPercent,
    bulkDiscount,
    afterBulk,
    invalidGroups,
    moqOk: invalidGroups.length === 0,
    piecesToBulk: Math.max(0, BULK_DISCOUNT_THRESHOLD - totalQuantity),
  };
}