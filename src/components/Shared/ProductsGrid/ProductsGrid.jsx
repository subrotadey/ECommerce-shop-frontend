// src/components/Shared/ProductsGrid/ProductsGrid.jsx
// Premium Dubai Wholesale — Abaya & Hijab Category Page
// White base · Gold accent · Charcoal text · Sage green touch

import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Heart, Search, SlidersHorizontal, X, ChevronDown,
  ArrowUpDown, Star, Package, Truck, Shield, Eye,
  ArrowRight, Filter, Grid, List, ChevronRight,
  Home, Tag, Sparkles
} from "lucide-react";
import Swal from "sweetalert2";
import useWishlist from "../../../hooks/useWishlist";
import QuickViewModal from "../QuickViewModal/QuickViewModal";
import Loading from "../Loading/Loading";

// ─── Design tokens ─────────────────────────────────────────────────────────
const GOLD = "#B8922A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

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
};

// ─── Breadcrumb ────────────────────────────────────────────────────────────
function Breadcrumb({ breadcrumbs = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400 px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
      <Link to="/" className="hover:text-gray-700 transition-colors flex items-center gap-1">
        <Home size={12} /> Home
      </Link>
      {breadcrumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={11} className="text-gray-300" />
          {crumb.link ? (
            <Link to={crumb.link} className="hover:text-gray-700 transition-colors">{crumb.label}</Link>
          ) : (
            <span className="font-medium text-gray-700">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Category Hero ─────────────────────────────────────────────────────────
function CategoryHero({ category, count }) {
  const cfg = HERO_CONFIG[category] || HERO_CONFIG.Abaya;

  return (
    <div className={`relative bg-gradient-to-r ${cfg.bg} overflow-hidden`}>
      {/* Background image collage */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-2 h-full">
          {cfg.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full h-full object-cover" />
          ))}
        </div>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 border"
            style={{ color: cfg.accent, borderColor: `${cfg.accent}40`, background: `${cfg.accent}15` }}
          >
            <Sparkles size={12} />
            {cfg.badge}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            {cfg.headline}
          </h1>
          <p className="text-white/60 text-base sm:text-lg mb-6">{cfg.subline}</p>

          {/* Tag pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {cfg.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium text-white/70 border border-white/20 bg-white/10">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            {[
              { label: "Products", value: `${count}+` },
              { label: "MOQ", value: "10 pcs" },
              { label: "Delivery", value: "2–4 days" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white" style={{ color: cfg.accent }}>{s.value}</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product, idx, onQuickView }) {
  const { isInWishlist, toggleWishlist, userId } = useWishlist();
  const [imgLoaded, setImgLoaded] = useState(false);
  const inWish = isInWishlist(product._id || product.sku);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userId === "guest") {
      Swal.fire({
        position: "top-end", icon: "warning",
        title: "Please login to save items",
        showConfirmButton: false, timer: 1800, toast: true,
        background: "#fff8f0", color: "#92400e",
      });
      return;
    }
    toggleWishlist(product._id || product.sku);
  };

  const discount = product.oldPrice && product.oldPrice > product.newPrice
    ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
    : 0;

  const isBestSeller = product.tags?.includes("Best Seller");
  const isNew = product.tags?.includes("New") || product.tags?.includes("New Arrival");

  return (
    <FadeIn delay={idx * 40} className="h-full">
      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col">

        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {isBestSeller && (
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-white" style={{ background: GOLD }}>BESTSELLER</span>
            )}
            {isNew && (
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg text-white" style={{ background: SAGE }}>NEW IN</span>
            )}
            {discount > 0 && (
              <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-red-500 text-white">{discount}% OFF</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
            aria-label="Wishlist"
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
          <Link to={`/product/${product._id || product.sku}`}>
            <img
              src={product.images?.[0] || product.media?.images?.[0]?.url || "https://placehold.co/400x533?text=Image"}
              alt={product.productName}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
            {!imgLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
          </Link>

          {/* Quick View overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => onQuickView(product)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-xs font-bold shadow-lg hover:bg-gray-50 transition-all -translate-y-2 group-hover:translate-y-0 duration-300"
              style={{ color: CHARCOAL }}
            >
              <Eye size={14} /> Quick View
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
            {product.categories?.slice(0, 2).join(" · ")}
          </div>

          {/* Name */}
          <Link to={`/product/${product._id || product.sku}`}>
            <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2 hover:text-gray-600 transition-colors" style={{ color: CHARCOAL }}>
              {product.productName}
            </h3>
          </Link>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.colors.slice(0, 4).map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-500">{c}</span>
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-400">+{product.colors.length - 4}</span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-xl font-bold" style={{ color: CHARCOAL }}>${product.newPrice}</div>
              {product.oldPrice > product.newPrice && (
                <div className="text-xs text-gray-400 line-through">${product.oldPrice} retail</div>
              )}
            </div>
            {discount > 0 && (
              <div className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: `${SAGE}12`, color: SAGE }}>
                Save ${product.oldPrice - product.newPrice}
              </div>
            )}
          </div>

          {/* View Details CTA */}
          <Link
            to={`/product/${product._id || product.sku}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold border-2 transition-all hover:text-white group/btn"
            style={{
              borderColor: CHARCOAL,
              color: CHARCOAL,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = CHARCOAL; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = CHARCOAL; }}
          >
            View Details
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────
function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
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
  const [gridCols, setGridCols] = useState(4); // 3 or 4

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
      case "latest": return [...list].reverse();
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

  if (isLoading) return <Loading />;

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2 text-gray-800">Failed to load products</h2>
        <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl text-white font-semibold mt-4" style={{ background: CHARCOAL }}>
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Hero */}
      <CategoryHero category={category} count={products.length} />

      {/* Trust strip */}
      <div className="border-b border-gray-100 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 py-3">
            {[
              { icon: Package, text: `${products.length}+ styles in stock` },
              { icon: Truck, text: "2–4 Day UAE Delivery" },
              { icon: Tag, text: "MOQ from 10 pieces" },
              { icon: Shield, text: "Quality Guaranteed" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Icon size={13} style={{ color: GOLD }} /> {text}
              </div>
            ))}
          </div>
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
                  className="w-full h-1.5 rounded-full accent-gray-900"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>$0</span><span className="font-semibold text-gray-700">${priceRange[1]}</span>
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
                          className="w-4 h-4 rounded border-gray-300 accent-gray-900"
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

                  <span className="text-sm text-gray-500">
                    <span className="font-bold" style={{ color: CHARCOAL }}>{filtered.length}</span>
                    {" "}of {products.length} products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Grid toggle */}
                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                    {[3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setGridCols(n)}
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
                    <FilterPill label={`$0–$${priceRange[1]}`} onRemove={() => setPriceRange([0, maxPrice])} />
                  )}
                </div>
              )}
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <div className={`grid gap-5 ${
                gridCols === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
              }`}>
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