// src/pages/Home/CategoriesSection/CategoriesSection.jsx
// ডাইনামিক: যে মেইন ক্যাটাগরিতে প্রোডাক্ট আছে শুধু সেটাই দেখায়

import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../../components/Animations/FadeIn";
import { useAllProducts } from "../../../hooks/useProducts";
import {
  MAIN_CATEGORIES,
  getMainImage,
  inCategory,
  pickFeatured,
  topLabels,
} from "../../../utils/homeProducts";

const CategoriesSection = () => {
  const { data: products = [], isLoading, isError } = useAllProducts();

  const cards = useMemo(
    () =>
      MAIN_CATEGORIES.map((cat) => {
        const list = products.filter((p) => inCategory(p, cat.slug));
        return {
          ...cat,
          count: list.length,
          image: list.length ? getMainImage(pickFeatured(list, 1)[0]) : null,
          labels: topLabels(list, 3),
        };
      }).filter((cat) => cat.count > 0),
    [products]
  );

  if (isError) return null;
  if (!isLoading && cards.length === 0) return null;

  return (
    <section className="bg-ivory/50 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <FadeIn className="mb-12 text-center sm:mb-14">
          <span className="mb-4 inline-flex items-center rounded-full border border-gold/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            Browse Collections
          </span>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            Explore Our Collections
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Discover thoughtfully selected modest fashion collections for
            boutiques and wholesale retailers.
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold" />
        </FadeIn>

        {/* Category cards */}
        <div
          className={`mx-auto grid gap-5 lg:gap-6 ${
            cards.length === 1 ? "max-w-md grid-cols-1" : "max-w-4xl grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {isLoading &&
            [0, 1].map((i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}

          {!isLoading &&
            cards.map((category, index) => (
              <FadeIn key={category.slug} delay={index * 80}>
                <Link
                  to={`/${category.slug}`}
                  aria-label={`Explore ${category.name} collection`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-emerald shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={category.image}
                    alt={`${category.name} collection`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-emerald/95" />
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-500 group-hover:w-full" />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="mb-3 h-0.5 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-14" />

                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      {category.name} Collection
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-white/75 sm:text-sm">
                      {category.blurb}
                    </p>

                    {category.labels.length > 0 && (
                      <p className="mt-2 text-[11px] font-medium text-white/60">
                        {category.labels.join(" · ")}
                      </p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/80">
                        {category.count} {category.count === 1 ? "style" : "styles"}
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-all duration-300 group-hover:gap-3">
                        Explore Collection
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
        </div>

      </div>
    </section>
  );
};

export default CategoriesSection;