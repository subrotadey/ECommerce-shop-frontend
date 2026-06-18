// src/pages/ProductDetails/ProductDetails.jsx
// Dubai Wholesale Abaya & Hijab — Premium Product Detail Page
// Palette: White · Warm Gold (#B8922A) · Deep Charcoal (#1A1A1A) · Sage (#4A7C6F)

import { Heart, MapPin, Phone, RefreshCw, Share2, Shield, ShoppingBag, Truck, Star, ChevronLeft, ChevronRight, Check, ZoomIn, Package, ArrowRight, Minus, Plus } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";

import Swal from "sweetalert2";
import ColorSelector from "../../components/Product/ColorSelector";
import ProductInfo from "../../components/Product/ProductInfo";
import ProductPrice from "../../components/Product/ProductPrice";
import QuantitySelector from "../../components/Product/QuantitySelector";
import SizeSelector from "../../components/Product/SizeSelector";
import StockBadge from "../../components/Product/StockBadge";
import Loading from "../../components/Shared/Loading/Loading";
import ShareModal from "../../components/ShareModal/ShareModal";
import useAddToCart from "../../hooks/useAddToCart";
import { useAllProducts } from "../../hooks/useProducts";
import useWishlist from "../../hooks/useWishlist";

// ─── Design tokens ────────────────────────────────────────────────────────────
const GOLD = "#B8922A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

// ─── SEO Head helper ──────────────────────────────────────────────────────────
function updateDocumentMeta(product) {
  if (!product) return;
  document.title = `${product.productName} | Anis Abaya UAE`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute("content", `Buy ${product.productName} wholesale from Dubai. Premium quality ${product.mainCategory} at factory-direct pricing. MOQ 10 pieces. UAE-wide delivery.`);
  }
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ product }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <li><Link to="/" className="hover:text-gray-700 transition-colors">Home</Link></li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li>
            <Link to={`/${product?.mainCategory}`} className="hover:text-gray-700 transition-colors capitalize">
              {product?.mainCategory}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
            {product?.productName}
          </li>
        </ol>
      </div>
    </nav>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images = [], productName, tags = [], discount }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imgRef = useRef(null);

  const isBestSeller = tags?.includes("Best Seller");
  const isExclusive = tags?.includes("Exclusive Collection");

  const prev = useCallback(() => setActive(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive(i => (i + 1) % images.length), [images.length]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <div className="w-full lg:sticky lg:top-24">
      {/* Main Image */}
      <div
        ref={imgRef}
        className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-[3/4] mb-3 cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        role="img"
        aria-label={`${productName} - image ${active + 1} of ${images.length}`}
      >
        <img
          src={images[active] || "https://placehold.co/600x800?text=Image"}
          alt={`${productName} view ${active + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"}`}
          style={zoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {isBestSeller && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white"
              style={{ background: GOLD }}>
              <Star size={11} fill="white" /> BESTSELLER
            </span>
          )}
          {isExclusive && (
            <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full text-white"
              style={{ background: SAGE }}>
              EXCLUSIVE
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-red-500 text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Zoom hint */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn size={14} style={{ color: CHARCOAL }} />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} style={{ color: CHARCOAL }} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-all"
              aria-label="Next image"
            >
              <ChevronRight size={16} style={{ color: CHARCOAL }} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i === active ? CHARCOAL : "rgba(0,0,0,0.25)", width: i === active ? 20 : 6 }}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                i === active ? "border-gray-800 shadow-md" : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`Select image ${i + 1}`}
              aria-pressed={i === active}
            >
              <img src={img} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Trust Badges ─────────────────────────────────────────────────────────────
function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-3 py-5 border-t border-b border-gray-100">
      {[
        { icon: Truck, label: "2–4 Day UAE Delivery" },
        { icon: Shield, label: "Quality Guaranteed" },
        { icon: RefreshCw, label: "7-Day Returns" },
      ].map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 text-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}12` }}>
            <Icon size={16} style={{ color: GOLD }} />
          </div>
          <span className="text-xs text-gray-500 font-medium leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Wholesale Pricing Callout ────────────────────────────────────────────────
function WholesaleCallout({ price }) {
  const tiers = [
    { qty: "10–49 pcs", price: price },
    { qty: "50–199 pcs", price: Math.round(price * 0.92) },
    { qty: "200+ pcs", price: Math.round(price * 0.85) },
  ];
  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-400"
        style={{ background: `${GOLD}08` }}>
        Wholesale Tiered Pricing
      </div>
      <div className="divide-y divide-gray-50">
        {tiers.map((tier, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              {i === 0 && <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />}
              {i === 1 && <span className="w-1.5 h-1.5 rounded-full" style={{ background: SAGE }} />}
              {i === 2 && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
              <span className="text-sm text-gray-600">{tier.qty}</span>
              {i === 2 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${SAGE}15`, color: SAGE }}>
                  BEST VALUE
                </span>
              )}
            </div>
            <div className="font-bold text-sm" style={{ color: CHARCOAL }}>
              ${tier.price}
              {i > 0 && (
                <span className="ml-1 text-xs font-normal" style={{ color: SAGE }}>
                  ({i === 1 ? "-8%" : "-15%"})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function ProductTabs({ product }) {
  const [activeTab, setActiveTab] = useState("description");
  const tabs = ["description", "details", "contact"];

  return (
    <div className="mt-16 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-4 text-sm font-semibold capitalize transition-all relative"
            style={{
              color: activeTab === tab ? CHARCOAL : "#9CA3AF",
            }}
          >
            {tab}
            {activeTab === tab && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full transition-all"
                style={{ background: GOLD }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {/* Description */}
        {activeTab === "description" && (
          <div
            className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
            style={{ "--tw-prose-body": "#4B5563", "--tw-prose-headings": CHARCOAL }}
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml || "<p>No description available.</p>" }}
          />
        )}

        {/* Details */}
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-bold mb-5" style={{ color: CHARCOAL }}>Product Specifications</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Fabric", value: product.additionalInfo?.fabric },
                { label: "Work Type", value: product.additionalInfo?.workType },
                { label: "Wash Care", value: product.additionalInfo?.washCare },
                { label: "Country of Origin", value: product.additionalInfo?.countryOfOrigin },
                { label: "Hijab Included", value: product.additionalInfo?.hijabIncluded ? "Yes" : "No" },
                { label: "SKU", value: product.sku },
              ].filter(s => s.value).map(spec => (
                <div key={spec.label} className="flex items-start justify-between p-4 rounded-xl"
                  style={{ background: `${GOLD}06` }}>
                  <span className="text-sm text-gray-500">{spec.label}</span>
                  <span className="text-sm font-semibold text-right ml-4" style={{ color: CHARCOAL }}>{spec.value}</span>
                </div>
              ))}
            </div>

            {product.categories?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-gray-500 mb-2 font-medium">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {product.categories.map(cat => (
                    <span key={cat} className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ background: CHARCOAL }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact */}
        {activeTab === "contact" && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold" style={{ color: CHARCOAL }}>Visit Our Showrooms</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { city: "Mohammadpur, Dhaka", address: "Tokyo Square, Shop No. 563, 5th Floor" },
                { city: "Magura", address: "Noorjahan Plaza, 2nd Floor" },
              ].map(loc => (
                <div key={loc.city} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${SAGE}12` }}>
                    <MapPin size={16} style={{ color: SAGE }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: CHARCOAL }}>{loc.city}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between p-5 rounded-2xl text-white"
              style={{ background: CHARCOAL }}>
              <div>
                <p className="text-xs opacity-60 mb-1">24/7 Customer Support</p>
                <p className="text-xl font-bold tracking-wide">01757777765</p>
              </div>
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: `rgba(255,255,255,0.1)` }}>
                <Phone size={20} className="text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────
function RelatedProducts({ products = [], currentId, category }) {
  const related = products
    .filter(p => p._id !== currentId && p.mainCategory === category)
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
        {related.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id || product.sku}`}
            className="group block"
          >
            <div className="rounded-xl overflow-hidden bg-gray-50 aspect-[3/4] mb-2">
              <img
                src={product.images?.[0] || "https://placehold.co/300x400?text=Image"}
                alt={product.productName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-xs text-gray-500 truncate">{product.categories?.[0]}</p>
            <p className="text-sm font-semibold truncate mt-0.5" style={{ color: CHARCOAL }}>
              {product.productName}
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: GOLD }}>${product.newPrice}</p>
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
  const product = allProducts.find(p => p._id === id || p.sku === id);

  const {
    selectedSize, setSelectedSize,
    selectedColor, setSelectedColor,
    qty, setQty,
    error,
    handleAddToCart,
    sizes, colors,
  } = useAddToCart(product);

  // Update document meta for SEO
  useEffect(() => {
    if (product) updateDocumentMeta(product);
    return () => { document.title = "Anis Abaya UAE"; };
  }, [product]);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (userId === "guest") {
      Swal.fire({
        position: "top-end", icon: "warning",
        title: "Please log in to save items",
        showConfirmButton: false, timer: 1800, toast: true,
        background: "#fff8f0", color: "#92400e",
      });
      return;
    }
    toggleWishlist(product._id, {
      onSuccess: (data) => {
        Swal.fire({
          position: "top-end", icon: "success",
          title: data.inWishlist ? "Added to wishlist" : "Removed from wishlist",
          showConfirmButton: false, timer: 1000, toast: true,
          background: "#f0fdf4", color: "#166534",
        });
      },
      onError: () => {
        Swal.fire({
          position: "top-end", icon: "error",
          title: "Failed to update wishlist",
          showConfirmButton: false, timer: 1500, toast: true,
        });
      },
    });
  };

  if (isLoading) return <Loading />;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${GOLD}10` }}>
            <Package size={28} style={{ color: GOLD }} />
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>Product not found</h1>
          <p className="text-gray-500 text-sm mb-6">This item may have been removed or the link is incorrect.</p>
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

  const discount = product.oldPrice && product.oldPrice > product.newPrice
    ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
    : 0;

  const inWishlist = isInWishlist(product._id || product.sku);

  // Resolve images from old or new schema
  const images = product.media?.images?.map(i => i.url) ||
    (Array.isArray(product.images) && typeof product.images[0] === "string"
      ? product.images
      : product.images?.map(i => i.url || i) || []);

  return (
    <>
      {/* SEO structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.productName,
        "description": product.descriptionHtml?.replace(/<[^>]*>/g, "").slice(0, 200),
        "sku": product.sku,
        "image": images[0],
        "offers": {
          "@type": "Offer",
          "price": product.newPrice,
          "priceCurrency": "USD",
          "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
      })}} />

      <Breadcrumb product={product} />

      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

            {/* ── Left: Gallery ── */}
            <ImageGallery
              images={images}
              productName={product.productName}
              tags={product.tags}
              discount={discount}
            />

            {/* ── Right: Product Info ── */}
            <div className="space-y-5">

              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: GOLD }}>
                    {product.mainCategory}
                  </span>
                  <span className="text-gray-300">·</span>
                  <StockBadge stock={product.stock} />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-3"
                  style={{ color: CHARCOAL }}>
                  {product.productName}
                </h1>

                {/* Price */}
                <ProductPrice
                  newPrice={product.newPrice}
                  oldPrice={product.oldPrice}
                  className="mb-3"
                />

                {/* Tags */}
                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info strip */}
              <ProductInfo
                additionalInfo={product.additionalInfo}
                className="rounded-xl border border-gray-100 px-4 py-3"
              />

              {/* Size */}
              <SizeSelector
                sizes={sizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
              />

              {/* Color */}
              <ColorSelector
                colors={colors}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />

              {/* Quantity */}
              <QuantitySelector
                qty={qty}
                onQtyChange={setQty}
                max={product.stock}
              />

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                  style={{ background: product.stock === 0 ? "#9CA3AF" : CHARCOAL, boxShadow: product.stock > 0 ? `0 4px 20px ${CHARCOAL}30` : "none" }}
                >
                  <ShoppingBag size={18} />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
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
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-600 transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]"
                  >
                    <Share2 size={17} />
                    Share
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <TrustBadges />

              {/* Wholesale Pricing */}
              <WholesaleCallout price={product.newPrice} />

              {/* SKU */}
              <p className="text-xs text-gray-400">
                SKU: <span className="font-mono text-gray-600">{product.sku}</span>
              </p>
            </div>
          </div>

          {/* Tabs */}
          <ProductTabs product={product} />

          {/* Related */}
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