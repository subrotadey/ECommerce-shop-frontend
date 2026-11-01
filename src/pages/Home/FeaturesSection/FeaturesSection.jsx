
import {
  Factory,
  Gem,
  Palette,
  Ruler,
  PackageCheck,
  Globe,
} from "lucide-react";

import FadeIn from "../../../components/Animations/FadeIn";

const FEATURES = [
  {
    icon: Factory,
    title: "Direct UAE Manufacturer",
    desc: "Source abayas directly from Anis Abaya UAE, your wholesale manufacturing and supply partner.",
  },
  {
    icon: Gem,
    title: "Premium Quality Abayas",
    desc: "Explore elegant abaya collections selected with attention to fabric, design, and finishing.",
  },
  {
    icon: Palette,
    title: "Multiple Color Options",
    desc: "Choose from available product colors and build your wholesale order around your preferences.",
  },
  {
    icon: Ruler,
    title: "Six Standard Sizes",
    desc: "Mix sizes from S-52 to 3XL-62 within the same color to meet your customers' requirements.",
  },
  {
    icon: PackageCheck,
    title: "Wholesale MOQ & Discount",
    desc: "Order at least 12 pieces per product color. Get 5% off your merchandise subtotal on orders of 100 pieces or more.",
  },
  {
    icon: Globe,
    title: "Worldwide Wholesale Orders",
    desc: "Place wholesale enquiries from different countries and contact our team to discuss shipping arrangements.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-[#F7F5EF] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <FadeIn className="mb-12 text-center sm:mb-14">
          <span className="mb-4 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8C6B16]">
            Why Anis Abaya UAE
          </span>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-[#123C32] sm:text-4xl lg:text-5xl">
            Wholesale Fashion Made Simple
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#666666] sm:text-base">
            Discover premium abaya collections, flexible size selection,
            and wholesale benefits designed for retailers and boutique owners.
          </p>
        </FadeIn>

        {/* Features Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <FadeIn key={feature.title} delay={index * 70}>
                <div className="group h-full rounded-2xl border border-[#123C32]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#123C32]/5 sm:p-7">

                  {/* Icon */}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123C32]/[0.07] transition-all duration-300 group-hover:bg-[#123C32]">
                    <Icon
                      size={25}
                      strokeWidth={1.7}
                      className="text-[#123C32] transition-colors duration-300 group-hover:text-[#D4AF37]"
                    />
                  </div>

                  {/* Gold Accent */}
                  <div className="mb-4 h-[2px] w-9 rounded-full bg-[#D4AF37] transition-all duration-300 group-hover:w-16" />

                  {/* Content */}
                  <h3 className="mb-3 text-lg font-semibold text-[#123C32]">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#666666]">
                    {feature.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* MOQ Notice */}
        <FadeIn className="mt-10">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#D4AF37]/30 bg-white p-5 text-center sm:flex-row sm:px-7 sm:text-left">
            <div>
              <p className="font-semibold text-[#123C32]">
                Wholesale Ordering Policy
              </p>
              <p className="mt-1 text-sm leading-6 text-[#666666]">
                Minimum 12 pieces per individual product-color combination.
                Mix all six available sizes within each color.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#123C32] px-5 py-2.5 text-sm font-bold text-[#D4AF37]">
              MOQ: 12 Pieces
            </span>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
