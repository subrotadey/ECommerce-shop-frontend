// src/components/Shared/QuickViewModal/QuickViewModal.jsx
// শুধু প্রিভিউ। হোলসেল অর্ডার (MOQ, size-wise qty) ProductDetails পেজে হয়।
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_DISCOUNT_THRESHOLD,
  DELIVERY_NOTICE,
  MOQ_PER_COLOR,
} from "../../../utils/wholesale";
import ProductInfo from "../../Product/ProductInfo";
import ProductPrice from "../../Product/ProductPrice";
import StockBadge from "../../Product/StockBadge";

const PLACEHOLDER = "https://placehold.co/600x800?text=Image";

// পুরোনো string[] ও নতুন object[] দুই ধরনের ছবিই চলে; Main ছবি আগে
function getImageUrls(product) {
  const hasMedia = product?.media?.images?.some((i) => i?.url);
  const list = hasMedia ? product.media.images : product?.images;
  const arr = Array.isArray(list) ? list : [];
  const main = arr.find((i) => i?.isMain && i?.url);
  const ordered = main ? [main, ...arr.filter((i) => i !== main)] : arr;
  return ordered.map((i) => (typeof i === "string" ? i : i?.url)).filter(Boolean);
}

function Chips({ title, items }) {
  if (!items.length) return null;
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function QuickViewModal({ product, onClose }) {
  // { id, index }: প্রোডাক্ট বদলালে আপনা-আপনি প্রথম ছবিতে ফেরে
  const [picked, setPicked] = useState({ id: null, index: 0 });
  const closeRef = useRef(null);

  // Escape দিয়ে বন্ধ + পেছনের পেজ স্ক্রল বন্ধ
  useEffect(() => {
    if (!product) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  // খোলার সময় একবার বন্ধ বোতামে ফোকাস
  useEffect(() => {
    if (product) closeRef.current?.focus();
  }, [product]);

  if (!product) return null;

  const images = getImageUrls(product);
  const active = picked.id === product._id ? picked.index : 0;
  const mainImage = images[active] || images[0] || PLACEHOLDER;

  const colors = product.colors?.length
    ? product.colors
    : (product.inventory || [])
        .filter((row) => (row.sizes || []).some((s) => s.stock > 0))
        .map((row) => row.color);
  const sizes = product.sizes ?? [];

  const outOfStock = (product.stock ?? 0) <= 0;
  const detailsPath = `/product/${product._id || product.sku}`;

  // Portal: Navbar বা অন্য parent-এর stacking context আটকাতে পারে না।
  // z-[200]: Navbar (z-[100]) ও তার drawer-এর ওপরে।
    return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.productName}`}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white lg:h-[min(90vh,720px)] lg:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col lg:h-full lg:flex-row">
          {/* Images */}
          <div className="flex w-full flex-col bg-gray-50 lg:h-full lg:w-1/2">
            <div className="relative aspect-[3/4] max-h-[60vh] w-full bg-white lg:aspect-auto lg:max-h-none lg:min-h-0 lg:flex-1">
              <img
                src={mainImage}
                alt={product.productName}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {images.slice(0, 6).map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setPicked({ id: product._id, index: i })}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === active}
                    className={`h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                      i === active ? "border-gray-900" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex w-full flex-col p-6 text-gray-800 lg:w-1/2 lg:overflow-y-auto lg:p-8">
            <div className="mb-2 flex items-start justify-between gap-3 pr-10">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                {product.mainCategory}
              </span>
              <StockBadge stock={product.stock} />
            </div>

            <h2 className="mb-2 text-xl font-bold leading-snug text-gray-900 lg:text-2xl">
              {product.productName}
            </h2>

            <ProductPrice newPrice={product.newPrice} oldPrice={product.oldPrice} />
            <p className="mt-1 text-xs text-gray-500">per piece · wholesale</p>

            <ProductInfo additionalInfo={product.additionalInfo} className="mt-5" />

            <Chips title="Colours" items={colors} />
            <Chips title="Sizes" items={sizes} />

            <ul className="mt-5 space-y-1 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <li>Minimum {MOQ_PER_COLOR} pieces for each colour (mix sizes freely).</li>
              <li>
                {BULK_DISCOUNT_PERCENT}% off when your total order is {BULK_DISCOUNT_THRESHOLD}+ pieces.
              </li>
            </ul>
            <p className="mt-2 text-xs text-gray-500">{DELIVERY_NOTICE}</p>

            <div className="mt-auto pt-6">
              <Link
                to={detailsPath}
                onClick={onClose}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-black"
              >
                {outOfStock ? "View details" : "Choose colours & sizes"}
              </Link>
              <p className="mt-3 text-center text-xs text-gray-400">SKU: {product.sku}</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}