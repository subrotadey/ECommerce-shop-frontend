
import {
  UserPlus,
  Search,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";
import FadeIn from "../../../components/Animations/FadeIn";

const STEPS = [
  {
    n: "01",
    icon: UserPlus,
    title: "Create Your Account",
    desc: "Register on Anis Abaya UAE to get started with our wholesale shopping experience.",
    details: [
      "Create your customer account",
      "Access wholesale collections",
    ],
  },
  {
    n: "02",
    icon: Search,
    title: "Explore & Select Products",
    desc: "Browse abaya collections, choose available colors, and select your preferred sizes.",
    details: [
      "Explore available product colors",
      "Choose from six standard sizes",
    ],
  },
  {
    n: "03",
    icon: ShoppingBag,
    title: "Place Your Wholesale Order",
    desc: "Order at least 12 pieces for each product-color combination. Mix sizes within the same color.",
    details: [
      "Minimum 12 pieces per color",
      "5% discount on 100+ total pieces",
    ],
  },
  {
    n: "04",
    icon: MessageCircle,
    title: "Complete Payment via WhatsApp",
    desc: "Place your order, receive your Order ID, and contact our team to get bank transfer details.",
    details: [
      "Receive your order confirmation",
      "Share bank transfer proof via WhatsApp",
    ],
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-[#123C32] py-16 sm:py-20 lg:py-24">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#D4AF37]/10" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full border border-[#D4AF37]/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <FadeIn className="mb-12 text-center sm:mb-14">
          <span className="mb-4 inline-flex items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C76A]">
            Simple Wholesale Process
          </span>

          <h2 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            How to Order from Anis Abaya
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            From exploring our collections to completing your bank transfer,
            follow four simple steps to place your wholesale order.
          </p>
        </FadeIn>

        {/* Steps Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <FadeIn key={step.n} delay={index * 90}>
                <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:bg-white/[0.07] sm:p-7">

                  {/* Number & Icon */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-5xl font-black tracking-tight text-[#D4AF37]/30 transition-colors duration-300 group-hover:text-[#D4AF37]/60">
                      {step.n}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 transition-colors duration-300 group-hover:bg-[#D4AF37]">
                      <Icon
                        size={23}
                        strokeWidth={1.7}
                        className="text-[#D4AF37] transition-colors duration-300 group-hover:text-[#123C32]"
                      />
                    </div>
                  </div>

                  {/* Accent */}
                  <div className="mb-4 h-[2px] w-9 rounded-full bg-[#D4AF37] transition-all duration-300 group-hover:w-16" />

                  {/* Content */}
                  <h3 className="mb-3 text-lg font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mb-6 text-sm leading-7 text-white/60">
                    {step.desc}
                  </p>

                  {/* Step Details */}
                  <div className="mt-auto space-y-3 border-t border-white/10 pt-5">
                    {step.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-[#D4AF37]"
                        />

                        <span className="text-xs leading-5 text-white/70">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Connector */}
                  {index !== STEPS.length - 1 && (
                    <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:flex">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-[#123C32]">
                        <ChevronRight
                          size={17}
                          className="text-[#D4AF37]"
                        />
                      </div>
                    </div>
                  )}

                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <FadeIn className="mt-12 text-center">
          <p className="mb-5 text-sm text-white/65">
            Ready to explore our wholesale collections?
          </p>

          <Link
            to="/abaya"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-7 py-3.5 text-sm font-bold text-[#123C32] transition-all duration-300 hover:bg-[#E5C76A] hover:shadow-lg hover:shadow-black/20"
          >
            Explore Collections
            <ChevronRight size={18} />
          </Link>
        </FadeIn>

      </div>
    </section>
  );
};

export default HowItWorks;
