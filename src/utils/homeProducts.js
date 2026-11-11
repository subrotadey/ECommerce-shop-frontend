// src/utils/homeProducts.js
// হোম পেজের Categories / Abaya / Hijab সেকশনের শেয়ার্ড হেল্পার

export const MAIN_CATEGORIES = [
  {
    slug: "abaya",
    name: "Abaya",
    blurb: "Elegant everyday & occasion wear for your boutique",
  },
  {
    slug: "hijab",
    name: "Hijab",
    blurb: "Khimars, scarves & sets with refined finishing",
  },
];

export const inCategory = (product, slug) =>
  String(product?.mainCategory || "").toLowerCase() === slug;

// পুরোনো string[] ও নতুন object[] দুই schema-ই চলে; Main ছবি আগে
export const getMainImage = (product) => {
  const hasMediaUrl = product?.media?.images?.some((i) => i?.url);
  const list = hasMediaUrl ? product.media.images : product?.images;
  const first = Array.isArray(list)
    ? list.find((i) => i?.isMain && i?.url) || list[0]
    : null;
  return (
    (typeof first === "string" ? first : first?.url) ||
    "https://placehold.co/600x800?text=Image"
  );
};

const isBestSeller = (p) => Array.isArray(p?.tags) && p.tags.includes("Best Seller");

// createdAt না থাকলে MongoDB _id-র সময় ব্যবহার করে
export const stamp = (p) => {
  const t = p?.createdAt ? new Date(p.createdAt).getTime() : NaN;
  if (!Number.isNaN(t)) return t;
  const fromId = parseInt(String(p?._id || "").slice(0, 8), 16);
  return Number.isNaN(fromId) ? 0 : fromId * 1000;
};

// অগ্রাধিকার: স্টকে আছে → Best Seller → সবচেয়ে নতুন
export const pickFeatured = (products, count = 2) =>
  [...products]
    .sort(
      (a, b) =>
        Number((b.stock ?? 0) > 0) - Number((a.stock ?? 0) > 0) ||
        Number(isBestSeller(b)) - Number(isBestSeller(a)) ||
        stamp(b) - stamp(a)
    )
    .slice(0, count);

// সবচেয়ে বেশি ব্যবহৃত উপ-ক্যাটাগরির লেবেল
export const topLabels = (products, limit = 3) => {
  const counts = new Map();
  products.forEach((p) =>
    (p.categories || []).forEach((label) =>
      counts.set(label, (counts.get(label) || 0) + 1)
    )
  );
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
};