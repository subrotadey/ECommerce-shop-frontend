
import {
  Factory,
  Ruler,
  BadgePercent,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

import FadeIn from "../../../components/Animations/FadeIn";

const COMMITMENTS = [
  {
    icon: Factory,
    title: "Manufacturer Direct",
    description:
      "Source wholesale abaya collections directly from Anis Abaya UAE.",
    points: [
      "Wholesale-focused business",
      "Abaya manufacturing and supply",
    ],
  },
  {
    icon: Ruler,
    title: "Flexible Size Selection",
    description:
      "Choose different sizes within the same product color to build your order.",
    points: [
      "Six standard sizes",
      "Multiple available colors",
    ],
  },
  {
    icon: BadgePercent,
    title: "Transparent Wholesale Terms",
    description:
      "Understand the minimum order quantity and discount structure before placing an order.",
    points: [
      "12 pieces minimum per product color",
      "5% discount on 100+ total pieces",
    ],
  },
];

const Testimonials = () => {
  return (
    <section className="bg-[#F7F5EF] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <FadeIn className="mb-12 text-center sm:mb-14">
          <span className="mb-4 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8C6B16]">
            Our Commitment
          </span>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-[#123C32] sm:text-4xl lg:text-5xl">
            A Wholesale Partnership You Can Understand
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-[#666666] sm:text-base">
            At Anis Abaya UAE, we keep our wholesale ordering process
            clear, flexible, and focused on the needs of fashion retailers.
          </p>
        </FadeIn>

        {/* Commitment Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {COMMITMENTS.map((item, index) => {
            const Icon = item.icon;

            return (
              <FadeIn key={item.title} delay={index * 100}>
                <div className="group h-full rounded-2xl border border-[#123C32]/10 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#123C32]/5 sm:p-8">

                  {/* Icon */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#123C32]/[0.07] transition-colors duration-300 group-hover:bg-[#123C32]">
                    <Icon
                      size={25}
                      strokeWidth={1.7}
                      className="text-[#123C32] transition-colors duration-300 group-hover:text-[#D4AF37]"
                    />
                  </div>

                  {/* Accent */}
                  <div className="mb-4 h-[2px] w-9 rounded-full bg-[#D4AF37] transition-all duration-300 group-hover:w-16" />

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-[#123C32]">
                    {item.title}
                  </h3>

                  <p className="mb-6 text-sm leading-7 text-[#666666]">
                    {item.description}
                  </p>

                  {/* Points */}
                  <div className="space-y-3 border-t border-[#123C32]/10 pt-5">
                    {item.points.map((point) => (
                      <div key={point} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-[#B8922A]"
                        />

                        <span className="text-sm leading-6 text-[#555555]">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* WhatsApp Contact CTA */}
        <FadeIn className="mt-10">
          <div className="flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#123C32] p-7 text-center sm:flex-row sm:px-9 sm:text-left">

            <div>
              <h3 className="text-xl font-semibold text-white">
                Have Questions About Wholesale Orders?
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Contact our team to discuss products, colors, sizes,
                and wholesale ordering requirements.
              </p>
            </div>

            <a
              href="https://wa.me/971551896390"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact Anis Abaya UAE on WhatsApp"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#123C32] transition-all duration-300 hover:bg-[#E5C76A] hover:shadow-lg"
            >
              <MessageCircle size={18} />
              Contact on WhatsApp
            </a>

          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default Testimonials;
