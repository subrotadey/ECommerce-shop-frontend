// src/components/Shared/ProductsGrid/ProductsGrid.jsx
// Premium Dubai Wholesale — Abaya & Hijab Category Page
// White base · Gold accent · Charcoal text · Sage green touch

import {
    ChevronDown,
    ChevronRight,
    Eye,
    Grid,
    Heart,
    Home,
    Package,
    Search,
    Shield,
    SlidersHorizontal,
    Sparkles,
    Star,
    Tag,
    Truck,
    X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import useWishlist from "../../../hooks/useWishlist";
import { formatMoney } from "../../../utils/currency";
import { stamp } from "../../../utils/homeProducts";
import {
    BULK_DISCOUNT_PERCENT,
    BULK_DISCOUNT_THRESHOLD,
    MOQ_PER_COLOR,
} from "../../../utils/wholesale";
import { ProductGridSkeleton } from "../Loading/Loading";
import QuickViewModal from "../QuickViewModal/QuickViewModal";

// ─── Design tokens ─────────────────────────────────────────────────────────
const GOLD = "#B8922A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";
const money0 = (n) => formatMoney(n, { minimumFractionDigits: 0 });

// ─── Tiny InView hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Category hero config ──────────────────────────────────────────────────
const HERO_CONFIG = {
  Abaya: {
    headline: "Premium Abaya Collection",
    subline: "Wholesale pricing for UAE boutiques & global retailers",
    badge: "Wholesale Ready",
    bg: "from-stone-900 via-neutral-800 to-stone-900",
    accent: GOLD,
    images: [
      "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=85",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85",
    ],
    tags: ["Dubai Style", "Crepe Fabric", "Embroidered", "Eid Collection"],
  },
  Hijab: {
    headline: "Luxury Hijab Collection",
    subline: "Curated scarves, khimars & hijab sets at wholesale rates",
    badge: "New Season",
    bg: "from-emerald-950 via-teal-900 to-emerald-950",
    accent: "#7ECDC0",
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=85",
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=85",
    ],
    tags: ["Chiffon", "Jersey", "Silk Blend", "Printed Sets"],
  },
  Shop: {
    headline: "Shop the Full Collection",
    subline: "Abayas, hijabs and more at wholesale rates",
    badge: "Wholesale Ready",
    bg: "from-stone-900 via-neutral-800 to-stone-900",
    accent: GOLD,
    images: [
      "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=85",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85",
    ],
    tags: ["Abaya", "Hijab", "Wholesale"],
  },
  "New Arrivals": {
    headline: "New Arrivals",
    subline: "Our latest styles, fresh for your boutique",
    badge: "Just Landed",
    bg: "from-stone-900 via-neutral-800 to-stone-900",
    accent: GOLD,
    images: [
      "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=85",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85",
    ],
    tags: ["Latest Styles", "Wholesale"],
  },
  "Best Sellers": {
    headline: "Best Sellers",
    subline: "Our most popular styles among retailers",
    badge: "Top Picks",
    bg: "from-stone-900 via-neutral-800 to-stone-900",
    accent: GOLD,
    images: [
      "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=85",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85",
    ],
    tags: ["Popular", "Wholesale"],
  },
};

// ─── Breadcrumb ────────────────────────────────────────────────────────────
function Breadcrumb({ breadcrumbs = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
        <li>
          <Link to="/" className="flex items-center gap-1 transition-colors hover:text-gray-900">
            <Home size={12} aria-hidden="true" /> Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-gray-300" aria-hidden="true" />
            {crumb.link ? (
              <Link to={crumb.link} className="transition-colors hover:text-gray-900">{crumb.label}</Link>
            ) : (
              <span aria-current="page" className="font-medium text-gray-800">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Category Hero ─────────────────────────────────────────────────────────
function CategoryHero({ category, count }) {
  const cfg = HERO_CONFIG[category] || HERO_CONFIG.Abaya;

  const stats = [
    { label: "Styles", value: `${count}` },
    { label: "Min. per colour", value: `${MOQ_PER_COLOR} pcs` },
    { label: `Bulk discount (${BULK_DISCOUNT_THRESHOLD}+ pcs)`, value: `${BULK_DISCOUNT_PERCENT}% off` },
  ];

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${cfg.bg}`}>
      {/* Image collage — fades in from the right (desktop only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-3/5 grid-cols-2 gap-2 opacity-50 md:grid [mask-image:linear-gradient(to_left,black_35%,transparent)] [-webkit-mask-image:linear-gradient(to_left,black_35%,transparent)]"
      >
        {cfg.images.map((img, i) => (
          <img key={i} src={img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ))}
      </div>

      {/* Readability overlay + soft accent glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: cfg.accent }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold"
            style={{ color: cfg.accent, borderColor: `${cfg.accent}40`, background: `${cfg.accent}15` }}
          >
            <Sparkles size={12} aria-hidden="true" />
            {cfg.badge}
          </div>

          <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {cfg.headline}
          </h1>
          <p className="mb-6 text-base text-white/70 sm:text-lg">{cfg.subline}</p>

          {/* Tag pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            {cfg.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <dl className="inline-grid grid-cols-3 divide-x divide-white/15 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm">
            {stats.map((st) => (
              <div key={st.label} className="px-4 py-3 sm:px-6">
                <dd className="text-xl font-bold sm:text-2xl" style={{ color: cfg.accent }}>{st.value}</dd>
                <dt className="mt-0.5 text-[11px] leading-tight text-white/60">{st.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Accent hairline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}99, transparent)` }}
      />
    </section>
  );
}

// ─── Image helper (supports old string[] & new object[] schema) ───────────
function getFirstImage(product) {
  const hasMediaUrl = product.media?.images?.some((i) => i?.url);
  const list = hasMediaUrl ? product.media.images : product.images;
  const first = Array.isArray(list)
    ? (list.find((i) => i?.isMain && i?.url) || list[0])
    : null;
  return (typeof first === "string" ? first : first?.url) || "https://placehold.co/400x533?text=Image";
}

// ─── Product Card ──────────────────────────────────────────────────────────
// Puro card clickable: product name er link "stretched" kora hoyeche (after:inset-0).
// Wishlist ar Quick View button z-20 diye uporey thake, tai alada kaj kore.
function ProductCard({ product, idx, onQuickView }) {
  const { isInWishlist, toggleWishlist, isToggling } = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef(null);
  const productId = product._id || product.sku;
  const inWish = isInWishlist(productId);
  const href = `/product/${productId}`;

  // cached image onLoad er age load hoye gele opacity-0 e atke thake — eta thik kore
  useEffect(() => {
    if (imgRef.current?.complete) setImgLoaded(true);
  }, []);

const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // guest check + success/error toast useWishlist hook er bhitore kora ache
    toggleWishlist(productId);
  };

  const price = Number(product.newPrice) || 0;
  const oldPrice = Number(product.oldPrice) || 0;
  const discount = oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const isBestSeller = product.tags?.includes("Best Seller");
  const isNew = product.tags?.includes("New") || product.tags?.includes("New Arrival");

  return (
    <FadeIn delay={(idx % 4) * 60} className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_18px_40px_-18px_rgba(26,26,26,0.28)] focus-within:ring-2 focus-within:ring-[#B8922A]/40">

        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {/* Badges */}
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {isBestSeller && (
              <span className="rounded-lg px-2.5 py-1 text-[10px] font-bold text-white" style={{ background: GOLD }}>BESTSELLER</span>
            )}
            {isNew && (
              <span className="rounded-lg px-2.5 py-1 text-[10px] font-bold text-white" style={{ background: SAGE }}>NEW IN</span>
            )}
            {discount > 0 && (
              <span className="rounded-lg bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">{discount}% OFF</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
            disabled={isToggling}
            aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={inWish}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-md transition-all hover:scale-110"
          >
            <Heart
              size={16}
              className="transition-all"
              fill={inWish ? "#ef4444" : "none"}
              color={inWish ? "#ef4444" : "#9CA3AF"}
              strokeWidth={2}
            />
          </button>

          {/* Product image */}
          <img
            ref={imgRef}
            src={getFirstImage(product)}
            alt={product.productName}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://placehold.co/400x533?text=Image";
              setImgLoaded(true);
            }}
            className={`h-full w-full object-contain transition-all duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
          {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-gray-100" />}

          {/* Quick View — mobile e sobsomoy, desktop e hover e dekhay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center bg-gradient-to-t from-black/35 to-transparent px-3 pb-3 pt-12 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.productName}`}
              className="pointer-events-auto flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold shadow-lg transition-all hover:bg-gray-50 sm:px-5 sm:py-2.5"
              style={{ color: CHARCOAL }}
            >
              <Eye size={14} aria-hidden="true" /> Quick View
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Category */}
          {product.categories?.length > 0 && (
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {product.categories.slice(0, 2).join(" · ")}
            </p>
          )}

          {/* Name — stretched link: pura card click korle product details e jay */}
          <h3 className="text-sm font-semibold leading-snug" style={{ color: CHARCOAL }}>
            <Link
              to={href}
              className="line-clamp-2 transition-colors after:absolute after:inset-0 after:content-[''] hover:text-[#B8922A] focus:outline-none"
            >
              {product.productName}
            </Link>
          </h3>

          {/* Price */}
          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-4">
            <span className="text-lg font-bold sm:text-xl" style={{ color: CHARCOAL }}>
              {formatMoney(price)} <small className="text-xs font-normal text-gray-400">/piece</small>
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatMoney(oldPrice)}</span>
            )}
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
function EmptyState({ onClear }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-white">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${GOLD}10` }}>
        <Package size={28} style={{ color: GOLD }} />
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: CHARCOAL }}>No products match your filters</h3>
      <p className="text-gray-400 text-sm mb-6 max-w-xs">Try adjusting your filters or clearing them to browse the full collection.</p>
      <button
        onClick={onClear}
        className="px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
        style={{ background: CHARCOAL }}
      >
        Clear All Filters
      </button>
    </div>
  );
}

// ─── Sort + View toolbar ───────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
  { value: "popularity", label: "Bestsellers First" },
  { value: "latest", label: "Latest Arrivals" },
];

// Mobile e 2 column (e-commerce standard), desktop e 3 ba 4
const gridClass = (cols) =>
  cols === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2 lg:grid-cols-4";

// ─── Main ProductsGrid Component ──────────────────────────────────────────
export default function ProductsGrid({
  products = [],
  isLoading = false,
  isError = false,
  category = "Products",
  breadcrumbs = [],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [gridCols, setGridCols] = useState(3); // 3 or 4

  // Extract filter options
  const allCategories = useMemo(() => [...new Set(products.flatMap(p => p.categories || []))], [products]);
  const allColors = useMemo(() => [...new Set(products.flatMap(p => p.colors || []))], [products]);
  const allTags = useMemo(() => [...new Set(products.flatMap(p => p.tags || []))], [products]);
  const maxPrice = useMemo(() => {
    if (!products.length) return 500;
    return Math.ceil(Math.max(...products.map(p => p.newPrice)) / 50) * 50;
  }, [products]);

  useEffect(() => {
    if (products.length && priceRange[1] === 10000) setPriceRange([0, maxPrice]);
  }, [maxPrice, products.length]);

  // Filtered & sorted
  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = p.productName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = !selectedCategories.length || selectedCategories.some(c => p.categories?.includes(c));
      const matchColor = !selectedColors.length || selectedColors.some(c => p.colors?.includes(c));
      const matchTag = !selectedTags.length || selectedTags.some(t => p.tags?.includes(t));
      const matchPrice = p.newPrice >= priceRange[0] && p.newPrice <= priceRange[1];
      return matchSearch && matchCat && matchColor && matchTag && matchPrice;
    });

    switch (sortBy) {
      case "price-low": return [...list].sort((a, b) => a.newPrice - b.newPrice);
      case "price-high": return [...list].sort((a, b) => b.newPrice - a.newPrice);
      case "discount": return [...list].sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - a.newPrice) / a.oldPrice : 0;
        const db = b.oldPrice ? (b.oldPrice - b.newPrice) / b.oldPrice : 0;
        return db - da;
      });
      case "popularity": return [...list].sort((a, b) =>
        (b.tags?.includes("Best Seller") ? 1 : 0) - (a.tags?.includes("Best Seller") ? 1 : 0));
      case "latest": return [...list].sort((a, b) => stamp(b) - stamp(a));
      default: return list;
    }
  }, [products, searchQuery, selectedCategories, selectedColors, selectedTags, priceRange, sortBy]);

  const activeFilterCount =
    selectedCategories.length + selectedColors.length + selectedTags.length +
    (searchQuery ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const clearAll = () => {
    setSearchQuery(""); setSelectedCategories([]); setSelectedColors([]);
    setSelectedTags([]); setPriceRange([0, maxPrice]); setSortBy("default");
  };

  const toggle = (list, setList, val) =>
    setList(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  if (isError) return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: `${GOLD}14` }}>
          <Package size={28} style={{ color: GOLD }} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold" style={{ color: CHARCOAL }}>We couldn't load the products</h2>
        <p className="mt-2 text-sm text-gray-500">Please check your connection and try again.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: CHARCOAL }}
        >
          Try again
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Hero */}
      <CategoryHero category={category} count={isLoading ? "…" : products.length} />

      {/* Trust strip */}
      <div className="border-b border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-x-8 overflow-x-auto py-3.5 text-xs font-medium text-gray-600 lg:justify-between [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { icon: Package, text: isLoading ? "Loading styles…" : `${products.length} ${products.length === 1 ? "style" : "styles"} available` },
              { icon: Tag, text: `Min. ${MOQ_PER_COLOR} pcs per colour` },
              { icon: Star, text: `${BULK_DISCOUNT_PERCENT}% off on ${BULK_DISCOUNT_THRESHOLD}+ pieces` },
              { icon: Truck, text: "Worldwide wholesale orders" },
              { icon: Shield, text: "Direct UAE manufacturer" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex shrink-0 items-center gap-2 whitespace-nowrap">
                <Icon size={14} style={{ color: GOLD }} aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside
            className={`
              fixed lg:sticky top-0 left-0 h-full lg:h-auto w-72
              bg-white z-50 lg:z-auto border-r lg:border lg:rounded-2xl lg:border-gray-100
              overflow-y-auto flex-shrink-0 shadow-2xl lg:shadow-none
              transition-transform duration-300 lg:translate-x-0
              ${showFilters ? "translate-x-0" : "-translate-x-full"}
            `}
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            <div className="p-5">
              {/* Sidebar header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-base" style={{ color: CHARCOAL }}>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white" style={{ background: GOLD }}>
                      {activeFilterCount}
                    </span>
                  )}
                </h3>
                <div className="flex gap-2">
                  {activeFilterCount > 0 && (
                    <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="lg:hidden p-1">
                    <X size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  aria-label="Search products"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={13} className="text-gray-400" />
                  </button>
                )}
              </div>

              {/* Price */}
              <div className="mb-5 pb-5 border-b border-gray-50">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</h4>
                <input
                  type="range" min={0} max={maxPrice} step={5}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([0, +e.target.value])}
                  className="w-full h-1.5 rounded-full accent-[#B8922A]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{money0(0)}</span><span className="font-semibold text-gray-700">{money0(priceRange[1])}</span>
                </div>
              </div>

              {/* Categories */}
              {allCategories.length > 0 && (
                <div className="mb-5 pb-5 border-b border-gray-50">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Category</h4>
                  <div className="space-y-1.5">
                    {allCategories.map(cat => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggle(selectedCategories, setSelectedCategories, cat)}
                          className="w-4 h-4 rounded border-gray-300 accent-[#B8922A]"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {allColors.length > 0 && (
                <div className="mb-5 pb-5 border-b border-gray-50">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Color</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {allColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggle(selectedColors, setSelectedColors, color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          selectedColors.includes(color)
                            ? "text-white border-transparent"
                            : "text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                        style={selectedColors.includes(color) ? { background: CHARCOAL } : {}}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {allTags.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Style Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggle(selectedTags, setSelectedTags, tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          selectedTags.includes(tag)
                            ? "text-white border-transparent"
                            : "text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                        style={selectedTags.includes(tag) ? { background: GOLD } : {}}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Backdrop */}
          {showFilters && (
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setShowFilters(false)} />
          )}

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">

            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 py-3 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Mobile filter trigger */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all"
                    style={{ borderColor: CHARCOAL, color: CHARCOAL }}
                  >
                    <SlidersHorizontal size={14} />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center text-white" style={{ background: GOLD }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {isLoading ? (
                    <span className="text-sm text-gray-400">Loading products…</span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      <span className="font-bold" style={{ color: CHARCOAL }}>{filtered.length}</span>
                      {" "}of {products.length} products
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Grid toggle */}
                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                    {[3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setGridCols(n)}
                        aria-label={`Show ${n} columns`}
                        aria-pressed={gridCols === n}
                        className={`p-1.5 rounded transition-all ${gridCols === n ? "bg-gray-100" : "hover:bg-gray-50"}`}
                      >
                        <Grid size={14} className={gridCols === n ? "text-gray-900" : "text-gray-400"} />
                      </button>
                    ))}
                  </div>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      aria-label="Sort products"
                      className="appearance-none text-sm border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-gray-400 bg-white font-medium cursor-pointer"
                      style={{ color: CHARCOAL }}
                    >
                      {SORT_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active filter pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-50">
                  {searchQuery && (
                    <FilterPill label={`"${searchQuery}"`} onRemove={() => setSearchQuery("")} />
                  )}
                  {selectedCategories.map(c => (
                    <FilterPill key={c} label={c} onRemove={() => toggle(selectedCategories, setSelectedCategories, c)} />
                  ))}
                  {selectedColors.map(c => (
                    <FilterPill key={c} label={c} onRemove={() => toggle(selectedColors, setSelectedColors, c)} />
                  ))}
                  {selectedTags.map(t => (
                    <FilterPill key={t} label={t} onRemove={() => toggle(selectedTags, setSelectedTags, t)} />
                  ))}
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <FilterPill label={`${money0(0)}–${money0(priceRange[1])}`} onRemove={() => setPriceRange([0, maxPrice])} />
                  )}
                </div>
              )}
            </div>

            {/* Grid */}
            {isLoading ? (
              <ProductGridSkeleton
                count={6}
                className={`grid gap-3 sm:gap-5 ${gridClass(gridCols)}`}
              />
            ) : filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div className={`grid gap-3 sm:gap-5 ${gridClass(gridCols)}`}>
                {filtered.map((product, idx) => (
                  <ProductCard
                    key={product._id || product.sku || idx}
                    product={product}
                    idx={idx}
                    onQuickView={setSelectedProduct}
                  />
                ))}
              </div>
            )}

            {/* Load more hint */}
            {filtered.length > 0 && (
              <div className="text-center mt-12 py-8 border-t border-gray-50">
                <p className="text-sm text-gray-400">
                  Showing all <span className="font-semibold text-gray-600">{filtered.length}</span> products
                  {activeFilterCount > 0 && " matching your filters"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
          <QuickViewModal 
              product={selectedProduct} 
              onClose={() => setSelectedProduct(null)} 
          />
      )}
    </div>
  );
}

// ─── Filter Pill ───────────────────────────────────────────────────────────
function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
      {label}
      <button onClick={onRemove} className="hover:text-red-500 transition-colors ml-0.5">
        <X size={11} />
      </button>
    </span>
  );
}