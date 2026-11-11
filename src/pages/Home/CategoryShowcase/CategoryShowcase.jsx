// src/pages/Home/CategoryShowcase/CategoryShowcase.jsx
// এক মেইন ক্যাটাগরির ২টা প্রোডাক্ট + "Browse all" বোতাম। প্রোডাক্ট না থাকলে কিছুই দেখায় না।

import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/Animations/FadeIn";
import { useAllProducts } from "../../../hooks/useProducts";
import { formatMoney } from "../../../utils/currency";
import { getMainImage, inCategory, pickFeatured } from "../../../utils/homeProducts";

const ShowcaseCard = ({ product, index }) => {
  const price = Number(product.newPrice) || 0;
  const oldPrice = Number(product.oldPrice) || 0;
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const isBest = product.tags?.includes("Best Seller");
  const to = `/product/${product._id || product.sku}`;

  return (
    <FadeIn delay={index * 80} className="h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
        <Link to={to} className="relative block aspect-[3/4] overflow-hidden bg-ivory">
          <img
            src={getMainImage(product)}
            alt={product.productName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {isBest && (
              <span className="rounded-lg bg-gold px-2.5 py-1 text-[10px] font-bold text-white">
                BESTSELLER
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-lg bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                {discount}% OFF
              </span>
            )}
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <Link to={to}>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-charcoal hover:text-gray-600 sm:text-base">
              {product.productName}
            </h3>
          </Link>

          <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-bold text-charcoal">{formatMoney(price)}</span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatMoney(oldPrice)}</span>
            )}
          </div>
          <p className="text-[11px] text-gray-500">per piece · wholesale</p>

          {product.colors?.length > 0 && (
            <p className="mt-1 text-[11px] text-gray-500">
              {product.colors.length} {product.colors.length === 1 ? "colour" : "colours"}
            </p>
          )}

          <div className="mt-auto border-t border-gray-100 pt-3">
            <Link
              to={to}
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald transition-colors hover:text-gold sm:text-sm"
            >
              View details
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

const CategoryShowcase = ({
  category,        // "abaya" | "hijab"
  eyebrow,
  title,
  description,
  buttonLabel,
  tone = "white",  // "white" | "ivory" (পাশাপাশি দুই সেকশনে বদল করতে)
}) => {
  const { data: products = [], isLoading, isError } = useAllProducts();

  const items = useMemo(
    () => pickFeatured(products.filter((p) => inCategory(p, category)), 2),
    [products, category]
  );

  if (isError) return null;
  if (!isLoading && items.length === 0) return null;

  return (
    <section
      className={`py-16 sm:py-20 lg:py-24 ${tone === "ivory" ? "bg-ivory/60" : "bg-white"}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <FadeIn className="mb-10 text-center sm:mb-12">
          <span className="mb-4 inline-flex items-center rounded-full border border-gold/30 bg-ivory px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            {eyebrow}
          </span>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            {description}
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold" />
        </FadeIn>

        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:gap-6">
          {isLoading
            ? [0, 1].map((i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200" />
              ))
            : items.map((product, index) => (
                <ShowcaseCard key={product._id || product.sku} product={product} index={index} />
              ))}
        </div>

        {!isLoading && (
          <FadeIn className="mt-10 text-center">
            <Link
              to={`/${category}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-light"
            >
              {buttonLabel}
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        )}

      </div>
    </section>
  );
};

export default CategoryShowcase;