// src/pages/ProductDetails/ProductDetails.jsx
// Anis Abaya UAE — Wholesale Product Details
//
// Business rules (handover §3 / project instructions §5–§8):
//  - MOQ: প্রতি Product + Color ≥ 12 (size mix চলবে, ভিন্ন color যোগ হবে না)
//  - Bulk discount: পুরো অর্ডারের মোট qty ≥ 100 হলে 5%, শুধু merchandise subtotal-এ
//  - Currency AED, delivery charge মোটে যোগ হয় না
//  - Sizes: S=52, M=54, L=56, XL=58, XXL=60, 3XL=62
//  এখানকার সব অঙ্ক শুধু preview। চূড়ান্ত হিসাব backend করে।
//
// Cart integration: useAddToCart(product) থেকে `addColorGroup` দরকার।
//   addColorGroup({ color: "Blue", sizes: [{ size: "S", qty: 3 }, ...] })
//   প্রতিটি size একটি cart line (key = product + color + size)।

import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Minus,
  Package,
  Percent,
  Play,
  Plus,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  Zap,
  ZoomIn,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

import Loading from "../../components/Shared/Loading/Loading";
import ShareModal from "../../components/ShareModal/ShareModal";
import useAddToCart from "../../hooks/useAddToCart";
import { useAllProducts } from "../../hooks/useProducts";
import useWishlist from "../../hooks/useWishlist";
import { optimizedVideoUrl } from "../../config/cloudinary";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD = "#B8922A";
const CHARCOAL = "#1A1A1A";
const EMERALD = "#0F5C4A";

// ─── Business constants ───────────────────────────────────────────────────────
const MOQ = 12;
const BULK_THRESHOLD = 100;
const BULK_PERCENT = 5;
const CURRENCY = "AED";
const WHATSAPP_NUMBER = "971551896390"; // পরে Admin Settings থেকে আসবে
const DELIVERY_NOTICE =
  "Delivery charges are not included. Shipping costs are payable by the customer.";

const SIZE_CHART = [
  { size: "S", length: 52 },
  { size: "M", length: 54 },
  { size: "L", length: 56 },
  { size: "XL", length: 58 },
  { size: "XXL", length: 60 },
  { size: "3XL", length: 62 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const fmtAed = (n) =>
  `${CURRENCY} ${Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const isCssColor = (name) =>
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("color", String(name).trim().toLowerCase());

const toast = (icon, title, timer = 1500) =>
  Swal.fire({
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer,
    toast: true,
  });

const buildWhatsAppLink = (product) => {
  const message =
    `Hello Anis Abaya UAE,\n\nI am interested in this product for wholesale:\n` +
    `${product?.productName || ""}\nSKU: ${product?.sku || ""}\n` +
    `${typeof window !== "undefined" ? window.location.href : ""}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

// ─── SEO ──────────────────────────────────────────────────────────────────────
function updateDocumentMeta(product) {
  if (!product) return;
  document.title = `${product.productName} | Anis Abaya UAE`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute(
      "content",
      `${product.productName} — wholesale ${product.mainCategory} from a UAE manufacturer. Minimum ${MOQ} pieces per colour. Worldwide delivery.`
    );
  }
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ product }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <li>
            <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li>
            <Link
              to={`/${product?.mainCategory}`}
              className="hover:text-gray-700 transition-colors capitalize"
            >
              {product?.mainCategory}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li
            className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-xs"
            aria-current="page"
          >
            {product?.productName}
          </li>
        </ol>
      </div>
    </nav>
  );
}

// ─── Media helpers (পুরোনো ও নতুন schema দুটোই) ───────────────────────────────
export function getImageUrls(product) {
  if (!product) return [];
  const toUrl = (i) => (typeof i === "string" ? i : i?.url);
  const fromMedia = product.media?.images?.map(toUrl).filter(Boolean) || [];
  if (fromMedia.length) return fromMedia;
  return (Array.isArray(product.images) ? product.images : []).map(toUrl).filter(Boolean);
}

// সব video (সর্বোচ্চ 3টি)। নতুন media.videos আগে, না থাকলে legacy video।
export function getVideos(product) {
  if (!product) return [];

  const normalize = (input) => {
    const list = Array.isArray(input) ? input : input ? [input] : [];
    const seen = new Set();

    return list
      .map((v) => (typeof v === "string" ? { url: v } : v))
      .filter((v) => {
        if (!v?.url || seen.has(v.url)) return false;
        seen.add(v.url);
        return true;
      });
  };

  const candidates = [product.media?.videos, product.videos, product.media?.video, product.video];

  for (const candidate of candidates) {
    const videos = normalize(candidate);
    if (videos.length > 0) return videos.slice(0, 3);
  }

  return [];
}

// ─── Image + Video Gallery ────────────────────────────────────────────────────
function ImageGallery({ images = [], videos = [], productName, tags = [], discount }) {
  const items = [
    ...images.map((url) => ({ type: "image", url })),
    ...videos.map((video) => ({ type: "video", url: video.url, thumb: video.thumbnailUrl })),
  ];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRef = useRef(null);

  const isBestSeller = tags?.includes("Best Seller");
  const isExclusive = tags?.includes("Exclusive Collection");
  const total = items.length;
  const current = items[active] || { type: "image", url: "" };
  const isVideo = current.type === "video";

  const prev = useCallback(() => {
    if (total > 0) setActive((i) => (i - 1 + total) % total);
  }, [total]);
  const next = useCallback(() => {
    if (total > 0) setActive((i) => (i + 1) % total);
  }, [total]);

  const handleMouseMove = (e) => {
    if (!imgRef.current || isVideo) return;
    const rect = imgRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  useEffect(() => {
    const handler = (e) => {
      // quantity input-এ তীর চাপলে gallery বদলাবে না
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <div className="w-full lg:sticky lg:top-24">
      <div
        ref={imgRef}
        className={`relative bg-white border border-gray-100 rounded-2xl overflow-hidden aspect-[3/4] mb-3 group ${
          isVideo ? "" : "cursor-zoom-in"
        }`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isVideo && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        aria-label={`${productName} - ${isVideo ? "video" : `image ${active + 1}`} of ${total}`}
      >
        {isVideo ? (
          <video
            key={current.url}
            src={optimizedVideoUrl(current.url)}
            poster={current.thumb}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img
            src={current.url || "https://placehold.co/600x800?text=Image"}
            alt={`${productName} view ${active + 1}`}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              zoomed ? "scale-150" : "scale-100"
            }`}
            style={zoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
          />
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {isBestSeller && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white"
              style={{ background: GOLD }}
            >
              <Star size={11} fill="white" /> BESTSELLER
            </span>
          )}
          {isExclusive && (
            <span
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full text-white"
              style={{ background: EMERALD }}
            >
              EXCLUSIVE
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-red-500 text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {!isVideo && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn size={14} style={{ color: CHARCOAL }} />
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={16} style={{ color: CHARCOAL }} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={16} style={{ color: CHARCOAL }} />
            </button>
          </>
        )}

        {total > 1 && !isVideo && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setActive(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  background: i === active ? CHARCOAL : "rgba(0,0,0,0.25)",
                  width: i === active ? 20 : 6,
                }}
                aria-label={`View item ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all bg-black ${
                i === active ? "border-gray-800 shadow-md" : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={item.type === "video" ? "Play video" : `Select image ${i + 1}`}
              aria-pressed={i === active}
            >
              {item.type === "video" ? (
                <>
                  {item.thumb && (
                    <img
                      src={item.thumb}
                      alt={`${productName} video`}
                      className="w-full h-full object-contain opacity-80"
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                      <Play size={12} fill={CHARCOAL} style={{ color: CHARCOAL }} />
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={`${productName} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Trust badges (শুধু যাচাইযোগ্য business rule) ─────────────────────────────
function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-gray-100">
      {[
        { icon: Shield, label: "Direct UAE Manufacturer" },
        { icon: Package, label: `Min. ${MOQ} pcs per colour` },
        { icon: Percent, label: `${BULK_PERCENT}% off ${BULK_THRESHOLD}+ pcs` },
      ].map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 text-center">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${EMERALD}12` }}
          >
            <Icon size={16} style={{ color: EMERALD }} />
          </div>
          <span className="text-xs text-gray-500 font-medium leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Wholesale order panel (Color → size-wise quantity matrix) ────────────────
function WholesaleOrderPanel({ product, addColorGroup }) {
  const price = Number(product.newPrice) || 0;

  // inventory: সবসময় ৬টি official size, stock না থাকলে 0
  const inventory = useMemo(
    () =>
      (Array.isArray(product.inventory) ? product.inventory : []).map((row) => ({
        color: row.color,
        sizes: SIZE_CHART.map(({ size, length }) => ({
          size,
          length,
          stock: Number(row.sizes?.find((s) => s.size === size)?.stock) || 0,
        })),
      })),
    [product.inventory]
  );

  const firstAvailable =
    inventory.find((row) => row.sizes.some((s) => s.stock > 0))?.color ?? inventory[0]?.color ?? null;

  const [activeColor, setActiveColor] = useState(firstAvailable);
  const [qtys, setQtys] = useState({}); // { Blue: { S: 3, M: 4 } }
  const [showErrors, setShowErrors] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null); // null | "cart" | "buy"
  const navigate = useNavigate();

  const groups = useMemo(
    () =>
      inventory.map((row) => {
        const lines = row.sizes
          .map((s) => ({ size: s.size, qty: Math.min(qtys[row.color]?.[s.size] || 0, s.stock) }))
          .filter((l) => l.qty > 0);
        const total = lines.reduce((sum, l) => sum + l.qty, 0);
        const stock = row.sizes.reduce((sum, s) => sum + s.stock, 0);
        return { color: row.color, sizes: row.sizes, lines, total, valid: total >= MOQ, stock };
      }),
    [inventory, qtys]
  );

  if (inventory.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-900 mb-1">
          Online ordering is not available for this product yet.
        </p>
        <p className="text-xs text-amber-800 mb-3">Please contact us on WhatsApp to place a wholesale order.</p>
        <a
          href={buildWhatsAppLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: EMERALD }}
        >
          <MessageCircle size={16} /> Contact on WhatsApp
        </a>
      </div>
    );
  }

  const active = groups.find((g) => g.color === activeColor) || groups[0];
  const picked = groups.filter((g) => g.total > 0);
  const invalid = picked.filter((g) => !g.valid);
  const totalQty = picked.reduce((sum, g) => sum + g.total, 0);
  const subtotal = round2(totalQty * price);
  const bulkApplies = totalQty >= BULK_THRESHOLD;
  const discount = bulkApplies ? round2((subtotal * BULK_PERCENT) / 100) : 0;
  const estimatedTotal = round2(subtotal - discount);

  const setQty = (color, size, raw, max) => {
    const cleaned = String(raw).replace(/\D/g, "");
    const n = Math.max(0, Math.min(max, Number(cleaned) || 0));
    setQtys((prev) => ({ ...prev, [color]: { ...(prev[color] || {}), [size]: n } }));
    setShowErrors(false);
    setError("");
  };

    const handleAdd = async (mode = "cart") => {
    if (picked.length === 0) {
      setError("Enter a quantity for at least one size.");
      return;
    }

    if (invalid.length > 0) {
      setShowErrors(true);
      setActiveColor(invalid[0].color);
      setError(
        `Minimum ${MOQ} pieces required per colour: ` +
          invalid.map((g) => `${g.color} (${g.total}/${MOQ})`).join(", ")
      );
      return;
    }

    setAdding(mode);
    setError("");

    try {
      if (typeof addColorGroup !== "function") {
        throw new Error("Cart is not available right now. Please try again later.");
      }

      for (const group of picked) {
        await addColorGroup({ color: group.color, sizes: group.lines });
      }

      // Buy Now: cart-এ যোগ হওয়ার পর সরাসরি checkout-এ
      if (mode === "buy") {
        navigate("/checkout");
        return;
      }

      setQtys({});
      setShowErrors(false);
      toast("success", `${totalQty} pieces added to cart`);
    } catch (err) {
      setError(err?.message || "Could not add to cart. Please try again.");
    } finally {
      setAdding(null);
    }
  };

  return (
    <section aria-label="Wholesale order" className="space-y-5">
      {/* Colour */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold" style={{ color: CHARCOAL }}>
            Colour <span className="font-normal text-gray-400">({inventory.length})</span>
          </h2>
          <span className="text-xs text-gray-500">Min. {MOQ} pcs per colour</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const soldOut = g.stock === 0;
            const selected = g.color === active.color;
            const flagged = showErrors && g.total > 0 && !g.valid;

            return (
              <button
                type="button"
                key={g.color}
                disabled={soldOut}
                onClick={() => setActiveColor(g.color)}
                aria-pressed={selected}
                className={`relative flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-xl border-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  flagged
                    ? "border-red-400 bg-red-50"
                    : selected
                    ? "bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
                style={selected && !flagged ? { borderColor: CHARCOAL } : {}}
              >
                <span
                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                  style={{ background: isCssColor(g.color) ? g.color.toLowerCase() : "#E5E7EB" }}
                />
                <span style={{ color: CHARCOAL }}>{g.color}</span>
                {soldOut && <span className="text-[10px] text-gray-400">Sold out</span>}
                {g.total > 0 && (
                  <span
                    className="ml-0.5 min-w-[22px] h-[18px] px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: g.valid ? EMERALD : GOLD }}
                  >
                    {g.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size-wise matrix */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
          style={{ background: `${GOLD}08` }}
        >
          <h3 className="text-sm font-bold" style={{ color: CHARCOAL }}>
            {active.color} — quantity by size
          </h3>
          <span className="text-xs text-gray-500">{fmtAed(price)} / piece</span>
        </div>

        <div className="divide-y divide-gray-100">
          {active.sizes.map(({ size, length, stock }) => {
            const value = qtys[active.color]?.[size] || 0;
            const out = stock === 0;

            return (
              <div
                key={size}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${out ? "opacity-50" : ""}`}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: CHARCOAL }}>
                    {size} - {length}
                  </p>
                  <p className="text-xs text-gray-400">
                    {out ? "Out of stock" : `${stock.toLocaleString("en-US")} available`}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={out || value <= 0}
                    onClick={() => setQty(active.color, size, value - 1, stock)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Decrease ${active.color} ${size}`}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={out}
                    value={value === 0 ? "" : value}
                    placeholder="0"
                    onChange={(e) => setQty(active.color, size, e.target.value, stock)}
                    onFocus={(e) => e.target.select()}
                    className="w-14 h-9 rounded-lg border border-gray-200 text-center text-sm font-semibold outline-none focus:border-gray-800 disabled:bg-gray-50"
                    aria-label={`${active.color} ${size} quantity`}
                  />
                  <button
                    type="button"
                    disabled={out || value >= stock}
                    onClick={() => setQty(active.color, size, value + 1, stock)}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Increase ${active.color} ${size}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOQ progress for active colour */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500">{active.color} total</span>
            <span
              className="font-bold flex items-center gap-1"
              style={{ color: active.valid ? EMERALD : CHARCOAL }}
            >
              {active.valid && <Check size={12} />}
              {active.total} / {MOQ} pcs
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (active.total / MOQ) * 100)}%`,
                background: active.valid ? EMERALD : GOLD,
              }}
            />
          </div>
          {active.total > 0 && !active.valid && (
            <p className="mt-1.5 text-xs text-amber-700">
              Add {MOQ - active.total} more piece{MOQ - active.total === 1 ? "" : "s"} to reach the minimum for {active.color}.
            </p>
          )}
        </div>
      </div>

      {/* Order summary */}
      {picked.length > 0 && (
        <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-bold" style={{ color: CHARCOAL }}>Your selection</h3>

          <ul className="space-y-1.5">
            {picked.map((g) => (
              <li key={g.color} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveColor(g.color)}
                    className="font-medium underline-offset-2 hover:underline"
                    style={{ color: CHARCOAL }}
                  >
                    {g.color}
                  </button>
                  <p className="text-xs text-gray-400">
                    {g.lines.map((l) => `${l.size}: ${l.qty}`).join(" · ")}
                  </p>
                </div>
                <span
                  className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full"
                  style={
                    g.valid
                      ? { background: `${EMERALD}15`, color: EMERALD }
                      : { background: `${GOLD}20`, color: "#8a6a14" }
                  }
                >
                  {g.total} pcs{g.valid ? "" : ` · need ${MOQ}`}
                </span>
              </li>
            ))}
          </ul>

          <dl className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Total pieces</dt>
              <dd className="font-semibold">{totalQty}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-semibold">{fmtAed(subtotal)}</dd>
            </div>
            {bulkApplies && (
              <div className="flex justify-between" style={{ color: EMERALD }}>
                <dt>Bulk discount ({BULK_PERCENT}%)</dt>
                <dd className="font-semibold">− {fmtAed(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between pt-1.5 border-t border-gray-100">
              <dt className="font-bold" style={{ color: CHARCOAL }}>Estimated total</dt>
              <dd className="font-bold text-base" style={{ color: CHARCOAL }}>{fmtAed(estimatedTotal)}</dd>
            </div>
          </dl>

          <p className="text-xs text-gray-400 leading-relaxed">
            {bulkApplies
              ? `${BULK_PERCENT}% bulk discount applies.`
              : `Add ${BULK_THRESHOLD - totalQty} more piece${
                  BULK_THRESHOLD - totalQty === 1 ? "" : "s"
                } across your order to get ${BULK_PERCENT}% off.`}{" "}
            The bulk discount is calculated on your complete order, and final amounts are confirmed at checkout.
          </p>
        </div>
      )}

      {/* Delivery notice */}
      <div className="flex items-start gap-2.5 rounded-xl px-4 py-3" style={{ background: `${EMERALD}0D` }}>
        <Truck size={16} className="mt-0.5 flex-shrink-0" style={{ color: EMERALD }} />
        <p className="text-xs leading-relaxed" style={{ color: EMERALD }}>{DELIVERY_NOTICE}</p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100"
        >
          <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

            {/* Desktop CTA */}
      <div className="hidden lg:grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleAdd("cart")}
          disabled={Boolean(adding) || totalQty === 0}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base border-2 transition-all hover:bg-gray-50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ borderColor: CHARCOAL, color: CHARCOAL }}
        >
          <ShoppingBag size={18} />
          {adding === "cart" ? "Adding…" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => handleAdd("buy")}
          disabled={Boolean(adding) || totalQty === 0}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          style={{ background: CHARCOAL, boxShadow: `0 4px 20px ${CHARCOAL}30` }}
        >
          <Zap size={18} />
          {adding === "buy" ? "Please wait…" : "Buy Now"}
        </button>
      </div>

      {/* Mobile sticky CTA */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 pt-3 flex items-center gap-2"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="min-w-0 mr-1">
          <p className="text-xs text-gray-500">{totalQty} pcs</p>
          <p className="font-bold text-sm leading-tight" style={{ color: CHARCOAL }}>
            {fmtAed(estimatedTotal)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleAdd("cart")}
          disabled={Boolean(adding) || totalQty === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-bold text-sm border-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{ borderColor: CHARCOAL, color: CHARCOAL }}
        >
          <ShoppingBag size={15} />
          {adding === "cart" ? "Adding…" : "Add"}
        </button>
        <button
          type="button"
          onClick={() => handleAdd("buy")}
          disabled={Boolean(adding) || totalQty === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{ background: CHARCOAL }}
        >
          <Zap size={15} />
          {adding === "buy" ? "Wait…" : "Buy Now"}
        </button>
      </div>
    </section>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TAB_LABELS = {
  description: "Description",
  details: "Details",
  wholesale: "Wholesale Terms",
};

function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-16 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-100" role="tablist">
        {Object.entries(TAB_LABELS).map(([key, label]) => (
          <button
            type="button"
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className="flex-1 py-4 text-sm font-semibold transition-all relative"
            style={{ color: activeTab === key ? CHARCOAL : "#9CA3AF" }}
          >
            {label}
            {activeTab === key && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                style={{ background: GOLD }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {activeTab === "description" && (
          <div
            className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
            style={{ "--tw-prose-body": "#4B5563", "--tw-prose-headings": CHARCOAL }}
            // TODO: নতুন dependency-র অনুমতি পেলে HTML sanitize করুন (handover Priority 2)
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml || "<p>No description available.</p>",
            }}
          />
        )}

        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-bold mb-5" style={{ color: CHARCOAL }}>
              Product Specifications
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Fabric", value: product.additionalInfo?.fabric },
                { label: "Work Type", value: product.additionalInfo?.workType },
                { label: "Wash Care", value: product.additionalInfo?.washCare },
                { label: "Country of Origin", value: product.additionalInfo?.countryOfOrigin },
                { label: "Hijab Included", value: product.additionalInfo?.hijabIncluded ? "Yes" : "No" },
                { label: "SKU", value: product.sku },
              ]
                .filter((s) => s.value)
                .map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-start justify-between p-4 rounded-xl"
                    style={{ background: `${GOLD}06` }}
                  >
                    <span className="text-sm text-gray-500">{spec.label}</span>
                    <span
                      className="text-sm font-semibold text-right ml-4"
                      style={{ color: CHARCOAL }}
                    >
                      {spec.value}
                    </span>
                  </div>
                ))}
            </div>

            {product.categories?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-gray-500 mb-2 font-medium">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ background: CHARCOAL }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "wholesale" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: CHARCOAL }}>
                How wholesale ordering works
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
                  `Minimum ${MOQ} pieces for each product and colour. You can mix sizes within a colour.`,
                  "Different colours are counted separately, so each colour needs its own 12 pieces.",
                  `${BULK_PERCENT}% discount on the merchandise subtotal when your total order is ${BULK_THRESHOLD} pieces or more.`,
                  DELIVERY_NOTICE,
                  "Payment is by manual bank transfer. After you place the order, contact us on WhatsApp for the bank details.",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <Check size={15} className="mt-0.5 flex-shrink-0" style={{ color: EMERALD }} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-3" style={{ color: CHARCOAL }}>Size chart</h4>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-gray-400" style={{ background: `${GOLD}08` }}>
                      <th className="px-4 py-2.5 font-semibold">Size</th>
                      <th className="px-4 py-2.5 font-semibold">Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SIZE_CHART.map(({ size, length }) => (
                      <tr key={size}>
                        <td className="px-4 py-2.5 font-medium" style={{ color: CHARCOAL }}>{size}</td>
                        <td className="px-4 py-2.5 text-gray-600">{length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <a
              href={buildWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 rounded-2xl text-white"
              style={{ background: EMERALD }}
            >
              <div>
                <p className="text-xs opacity-70 mb-1">Questions about this product?</p>
                <p className="text-lg font-bold">Chat with us on WhatsApp</p>
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/15">
                <MessageCircle size={20} />
              </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────
function RelatedProducts({ products = [], currentId, category }) {
  const related = products
    .filter((p) => p._id !== currentId && p.mainCategory === category)
    .slice(0, 4);

  if (!related.length) return null;

  return (
    <section className="mt-16" aria-label="Related products">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold" style={{ color: CHARCOAL }}>You May Also Like</h2>
        <Link
          to={`/${category}`}
          className="flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
          style={{ color: GOLD }}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.map((item) => (
          <Link key={item._id} to={`/product/${item._id || item.sku}`} className="group block">
            <div className="rounded-xl overflow-hidden bg-gray-50 aspect-[3/4] mb-2">
              <img
                src={getImageUrls(item)[0] || "https://placehold.co/300x400?text=Image"}
                alt={item.productName}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-xs text-gray-500 truncate">{item.categories?.[0]}</p>
            <p className="text-sm font-semibold truncate mt-0.5" style={{ color: CHARCOAL }}>
              {item.productName}
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: GOLD }}>{fmtAed(item.newPrice)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();
  const [showShareModal, setShowShareModal] = useState(false);
  const { isInWishlist, toggleWishlist, userId } = useWishlist();

  const { data: allProducts = [], isLoading } = useAllProducts();
  const product = allProducts.find((p) => p._id === id || p.sku === id);

  const { addColorGroup } = useAddToCart(product);

  useEffect(() => {
    if (product) updateDocumentMeta(product);
    return () => {
      document.title = "Anis Abaya UAE";
    };
  }, [product]);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (userId === "guest") {
      toast("warning", "Please log in to save items", 1800);
      return;
    }
    toggleWishlist(product._id, {
      onSuccess: (data) =>
        toast("success", data.inWishlist ? "Added to wishlist" : "Removed from wishlist", 1000),
      onError: () => toast("error", "Failed to update wishlist"),
    });
  };

  if (isLoading) return <Loading />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${GOLD}10` }}
          >
            <Package size={28} style={{ color: GOLD }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>Product not found</h1>
          <p className="text-gray-500 text-sm mb-6">
            This item may have been removed or the link is incorrect.
          </p>
          <Link
            to="/abaya"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: CHARCOAL }}
          >
            Browse Collection <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    );
  }

  const discount =
    product.oldPrice && product.oldPrice > product.newPrice
      ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
      : 0;

  const inWishlist = isInWishlist(product._id || product.sku);
  const inStock = (product.stock ?? 0) > 0;
  const images = getImageUrls(product);
  const videos = getVideos(product);

  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.productName,
    description: product.descriptionHtml?.replace(/<[^>]*>/g, "").slice(0, 200),
    sku: product.sku,
    image: images[0],
    offers: {
      "@type": "Offer",
      price: product.newPrice,
      priceCurrency: CURRENCY,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />

      <Breadcrumb product={product} />

      <main className="bg-white pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
            {/* Left: gallery */}
            <ImageGallery
              images={images}
              videos={videos}
              productName={product.productName}
              tags={product.tags}
              discount={discount}
            />

            {/* Right: info + wholesale order */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                    {product.mainCategory}
                  </span>
                  <span className="text-gray-300">·</span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: inStock ? EMERALD : "#DC2626" }}
                  >
                    {inStock ? "In stock" : "Out of stock"}
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-3xl font-bold leading-tight mb-3"
                  style={{ color: CHARCOAL }}
                >
                  {product.productName}
                </h1>

                <div className="flex items-end flex-wrap gap-x-3 gap-y-1 mb-3">
                  <span className="text-3xl font-bold" style={{ color: CHARCOAL }}>
                    {fmtAed(product.newPrice)}
                  </span>
                  <span className="text-sm text-gray-500 pb-1">per piece · wholesale</span>
                  {discount > 0 && (
                    <del className="text-sm text-gray-400 pb-1">{fmtAed(product.oldPrice)}</del>
                  )}
                </div>

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {inStock ? (
                <WholesaleOrderPanel
                  key={product._id}
                  product={product}
                  addColorGroup={addColorGroup}
                />
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <p className="text-sm font-semibold mb-1" style={{ color: CHARCOAL }}>
                    This product is currently out of stock.
                  </p>
                  <a
                    href={buildWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm font-semibold"
                    style={{ color: EMERALD }}
                  >
                    <MessageCircle size={15} /> Ask about restock on WhatsApp
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border-2 transition-all hover:bg-red-50 active:scale-[0.98]"
                  style={{
                    borderColor: inWishlist ? "#ef4444" : "#E5E7EB",
                    color: inWishlist ? "#ef4444" : "#6B7280",
                  }}
                >
                  <Heart
                    size={17}
                    fill={inWishlist ? "#ef4444" : "none"}
                    color={inWishlist ? "#ef4444" : "currentColor"}
                  />
                  {inWishlist ? "Saved" : "Wishlist"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]"
                >
                  <Share2 size={17} />
                  Share
                </button>
              </div>

              <TrustBadges />

              <p className="text-xs text-gray-400">
                SKU: <span className="font-mono text-gray-600">{product.sku}</span>
              </p>
            </div>
          </div>

          <ProductTabs product={product} />

          <RelatedProducts
            products={allProducts}
            currentId={product._id}
            category={product.mainCategory}
          />
        </div>
      </main>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product}
      />
    </>
  );
}