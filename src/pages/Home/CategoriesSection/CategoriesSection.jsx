
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

const CATEGORIES = [
  {
    name: "Premium Abayas",
    subtitle: "Elegant everyday & occasion wear",
    slug: "abaya",
    img: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=700&q=85",
  },
  {
    name: "Luxury Borkas",
    subtitle: "Modest fashion with timeless elegance",
    slug: "abaya",
    img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85",
  },
  {
    name: "Khimars",
    subtitle: "Graceful coverage & comfort",
    slug: "hijab",
    img: "https://images.unsplash.com/photo-1617897903246-719242758050?w=700&q=85",
  },
  {
    name: "Hijab Sets",
    subtitle: "Beautiful coordinated collections",
    slug: "hijab",
    img: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=700&q=85",
  },
  {
    name: "New Arrivals",
    subtitle: "Discover the latest styles",
    slug: "abaya",
    img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=85",
  },
  {
    name: "Exclusive Collection",
    subtitle: "Selected pieces for distinctive boutiques",
    slug: "abaya",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&q=85",
  },
];

const CategoriesSection = () => {
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
            Discover thoughtfully selected Abayas, Hijabs and modest
            fashion collections for boutiques and wholesale retailers.
          </p>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold" />

        </FadeIn>

        {/* Category cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">

          {CATEGORIES.map((category, index) => (
            <FadeIn
              key={category.name}
              delay={index * 60}
            >
              <Link
                to={`/${category.slug}`}
                aria-label={`Explore ${category.name} collection`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-emerald shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:aspect-[4/5] lg:aspect-[4/4.5]"
              >

                {/* Category image */}
                <img
                  src={category.img}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-emerald/95" />

                {/* Gold accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-500 group-hover:w-full" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">

                  <div className="mb-2 h-0.5 w-8 rounded-full bg-gold transition-all duration-300 group-hover:w-14" />

                  <h3 className="text-sm font-bold leading-snug text-white sm:text-lg lg:text-xl">
                    {category.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-white/75 sm:text-xs">
                    {category.subtitle}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-gold transition-all duration-300 group-hover:gap-3 sm:text-sm">
                    Explore Collection
                    <ArrowUpRight size={16} />
                  </div>

                </div>

              </Link>
            </FadeIn>
          ))}

        </div>

        {/* Bottom CTA */}
        <FadeIn className="mt-10 text-center">
          <Link
            to="/abaya"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald/30 bg-white px-6 py-3 text-sm font-semibold text-emerald transition-all duration-300 hover:border-emerald hover:bg-emerald hover:text-white"
          >
            View All Collections
            <ArrowUpRight size={17} />
          </Link>
        </FadeIn>

      </div>
    </section>
  );
};

export default CategoriesSection;
