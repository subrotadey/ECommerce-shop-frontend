
import React from "react";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const trustPoints = [
    "Wholesale Only",
    "Direct UAE Manufacturer",
    "Bulk Order Support",
    "Worldwide Delivery",
  ];

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-24">

      {/* Background Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 60px)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left: Content */}
          <div className="max-w-2xl">

            {/* Brand Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-ivory px-4 py-2 text-xs font-semibold tracking-wide text-emerald sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-gold" />
              UAE ABAYA MANUFACTURER & WHOLESALER
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-charcoal sm:text-5xl lg:text-[3.5rem]">
              Premium Quality Abayas,

              <span className="block text-emerald">
                Direct from UAE
              </span>

              <span className="block">
                Manufacturer
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 max-w-xl text-base leading-8 text-gray-500 sm:text-lg">
              Discover premium abaya collections crafted for boutiques,
              retailers and fashion businesses. Explore wholesale
              collections with multiple colors, standard sizes and
              international order support.
            </p>

            {/* Business Highlights */}
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.12em] text-emerald sm:text-sm">
              Wholesale Only
              <span className="mx-2 text-gold">|</span>
              Competitive Prices
              <span className="mx-2 text-gold">|</span>
              Worldwide Delivery
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                to="/abaya"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald/15 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-light hover:shadow-xl"
              >
                Explore Collection
                <ArrowRight size={18} />
              </Link>

              <a
                href="https://wa.me/971551896390"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald/30 bg-white px-7 py-4 text-sm font-semibold text-emerald transition-all duration-300 hover:border-gold hover:bg-ivory"
              >
                <MessageCircle size={18} />
                Contact on WhatsApp
              </a>

            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap gap-3">
              {trustPoints.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm sm:text-sm"
                >
                  <Check
                    size={14}
                    className="shrink-0 text-emerald"
                  />
                  {item}
                </div>
              ))}
            </div>

          </div>

          {/* Right: Image Collage */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">

            <div className="grid h-[380px] grid-cols-2 gap-3 sm:h-[500px] sm:gap-4">

              {/* Main Image */}
              <div className="row-span-2 overflow-hidden rounded-2xl bg-ivory shadow-xl">
                <img
                  src="https://i.ibb.co.com/xK1GfQh2/1.webp"
                  alt="Premium Anis Abaya collection"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              {/* Top Right Image */}
              <div className="overflow-hidden rounded-2xl bg-ivory shadow-lg">
                <img
                  src="https://i.ibb.co.com/k2GVTwvx/6.webp"
                  alt="Elegant abaya design"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Bottom Right Image */}
              <div className="overflow-hidden rounded-2xl bg-ivory shadow-lg">
                <img
                  src="https://i.ibb.co.com/q3J6rLsR/3.webp"
                  alt="Premium abaya fashion collection"
                  className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>

            </div>

            {/* Decorative Accent */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl"
            />

            {/* Floating Brand Card */}
            <div className="absolute -bottom-5 left-3 rounded-xl border border-gray-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm sm:-left-5 sm:bottom-10">

              <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                ANIS ABAYA UAE
              </div>

              <div className="text-lg font-bold text-emerald sm:text-xl">
                Elegance in Every Detail
              </div>

              <div className="mt-1 text-xs text-gray-500">
                Premium Wholesale Collections
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
