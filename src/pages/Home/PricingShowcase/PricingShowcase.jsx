
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

const ITEMS = [
  {
    name: "Premium Crepe Abaya",
    category: "Abaya Collection",
    image:
      "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=700&q=85",
    description: "Elegant designs for everyday and special occasions.",
    slug: "abaya",
  },
  {
    name: "Embroidered Khimar Set",
    category: "Khimar Collection",
    image:
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=700&q=85",
    description: "Graceful modest wear with refined detailing.",
    slug: "hijab",
  },
  {
    name: "Luxury Hijab",
    category: "Hijab Collection",
    image:
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=700&q=85",
    description: "Beautiful styles to complement every outfit.",
    slug: "hijab",
  },
  {
    name: "Designer Borka",
    category: "Borka Collection",
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85",
    description: "Timeless silhouettes with a premium appearance.",
    slug: "abaya",
  },
];

const PricingShowcase = () => {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <FadeIn className="mb-12 text-center sm:mb-14">

          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ivory px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
            <Package size={14} />
            Wholesale Collection
          </span>

          <h2 className="mb-4 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
            Discover Our Featured Styles
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Explore elegant Abayas, Khimars, Borkas and Hijabs.
            Find collections designed for modern modest fashion retailers.
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold" />

        </FadeIn>

        {/* Product cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">

          {ITEMS.map((item, index) => (
            <FadeIn
              key={item.name}
              delay={index * 80}
            >

              <div className="group h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">

                {/* Product image */}
                <Link
                  to={`/${item.slug}`}
                  aria-label={`Explore ${item.name}`}
                  className="relative block aspect-[3/4] overflow-hidden bg-ivory"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald backdrop-blur-sm sm:text-xs">
                    {item.category}
                  </span>

                  <div className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-emerald shadow-lg transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                    <ArrowRight size={17} />
                  </div>
                </Link>

                {/* Product information */}
                <div className="p-3 sm:p-4">

                  <h3 className="text-sm font-bold leading-snug text-charcoal sm:text-base">
                    {item.name}
                  </h3>

                  <p className="mt-2 min-h-[40px] text-[11px] leading-relaxed text-gray-500 sm:text-xs">
                    {item.description}
                  </p>

                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <Link
                      to={`/${item.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald transition-colors hover:text-gold sm:text-sm"
                    >
                      Explore Collection
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                </div>

              </div>

            </FadeIn>
          ))}

        </div>

        {/* Bottom wholesale CTA */}
        <FadeIn className="mt-12 text-center">

          <div className="rounded-2xl border border-emerald/10 bg-ivory px-5 py-8 sm:px-10 sm:py-10">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-emerald">
              <ShoppingBag size={23} />
            </div>

            <h3 className="text-xl font-bold text-charcoal sm:text-2xl">
              Looking for Wholesale Collections?
            </h3>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Explore our catalogue and contact us for product details
              and wholesale enquiries.
            </p>

            <Link
              to="/abaya"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-light"
            >
              View Wholesale Catalogue
              <ArrowRight size={18} />
            </Link>

          </div>

        </FadeIn>

      </div>
    </section>
  );
};

export default PricingShowcase;
