// src/pages/AboutUs/AboutUs.jsx
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Factory,
  Gem,
  Globe,
  MessageCircle,
  PackageCheck,
  Palette,
  Ruler,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../components/Animations/FadeIn";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_DISCOUNT_THRESHOLD,
  DELIVERY_NOTICE,
  MOQ_PER_COLOR,
  WHATSAPP_NUMBER,
} from "../../utils/wholesale";

const FACTS = [
  { value: `${MOQ_PER_COLOR} pcs`, label: "Minimum per colour" },
  { value: `${BULK_DISCOUNT_PERCENT}% off`, label: `On ${BULK_DISCOUNT_THRESHOLD}+ pieces` },
  { value: "6 sizes", label: "S (52) to 3XL (62)" },
  { value: "Worldwide", label: "Wholesale enquiries welcome" },
];

const SUPPLY = [
  "Premium abayas and borkas",
  "Hijabs, khimars and hijab sets",
  "Multiple colours for each design",
  "Six standard sizes, mixable within a colour",
  "Bulk order support for boutiques and retailers",
];

const TERMS = [
  {
    icon: PackageCheck,
    title: `Minimum ${MOQ_PER_COLOR} pieces per colour`,
    desc: "Each product and colour combination has its own minimum. Different colours are counted separately.",
  },
  {
    icon: Ruler,
    title: "Mix sizes freely",
    desc: "Combine S (52), M (54), L (56), XL (58), XXL (60) and 3XL (62) inside the same colour.",
  },
  {
    icon: BadgePercent,
    title: `${BULK_DISCOUNT_PERCENT}% bulk discount`,
    desc: `Orders of ${BULK_DISCOUNT_THRESHOLD} pieces or more get ${BULK_DISCOUNT_PERCENT}% off the merchandise subtotal, counted across the whole order.`,
  },
  {
    icon: MessageCircle,
    title: "Bank transfer via WhatsApp",
    desc: "Place your order, receive your Order ID, then contact our team for the bank transfer details.",
  },
];

const WHY = [
  {
    icon: Factory,
    title: "Direct from the manufacturer",
    desc: "You deal with Anis Abaya UAE directly, with no middlemen between you and the product.",
  },
  {
    icon: Gem,
    title: "Quality you can inspect",
    desc: "Collections are selected with attention to fabric, design and finishing.",
  },
  {
    icon: Palette,
    title: "Colours and sizes that fit your shop",
    desc: "Build each order around the colours and sizes your customers ask for.",
  },
  {
    icon: Globe,
    title: "Open to international buyers",
    desc: "We welcome wholesale enquiries from different countries and discuss shipping with you.",
  },
];

const AboutUs = () => {
  useEffect(() => {
    document.title = "About Us | Anis Abaya UAE";
    return () => {
      document.title = "Anis Abaya UAE";
    };
  }, []);

  return (
    <>
      <Breadcrumb />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory/60 py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <FadeIn>
            <span className="mb-4 inline-flex items-center rounded-full border border-gold/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              About Anis Abaya UAE
            </span>

            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight text-charcoal sm:text-5xl">
              A UAE Abaya Manufacturer
              <span className="block text-emerald">Built for Wholesale</span>
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              We supply abayas and hijabs to boutiques, retailers and fashion
              businesses, with clear wholesale terms and direct support from
              our team.
            </p>

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold" />
          </FadeIn>
        </div>
      </section>

      {/* Facts strip */}
      <section className="bg-emerald">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {FACTS.map((fact) => (
            <div key={fact.label} className="text-center">
              <div className="text-2xl font-bold text-gold sm:text-3xl">{fact.value}</div>
              <div className="mt-1 text-xs text-white/70 sm:text-sm">{fact.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <FadeIn>
            <span className="mb-4 inline-flex rounded-full border border-gold/30 bg-ivory px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Who We Are
            </span>
            <h2 className="mb-5 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Your wholesale partner in the UAE
            </h2>
            <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
              <p>
                Anis Abaya UAE is a wholesale-focused abaya manufacturing and
                supply business. Our collections are made for boutiques,
                retailers and fashion businesses that want dependable styles
                at wholesale prices.
              </p>
              <p>
                Every product page shows the available colours and sizes, the
                price per piece and the exact minimum quantity, so you know
                the terms before you order.
              </p>
              <p>
                Our team is available on WhatsApp for product questions,
                payment details and shipping arrangements.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="h-full rounded-2xl border border-emerald/10 bg-ivory p-6 sm:p-8">
              <h3 className="mb-5 text-lg font-bold text-charcoal">What we supply</h3>
              <ul className="space-y-3">
                {SUPPLY.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700 sm:text-base">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Wholesale terms */}
      <section className="bg-ivory/60 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="mb-4 inline-flex rounded-full border border-gold/30 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Wholesale Terms
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              Clear terms, no surprises
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              {DELIVERY_NOTICE}
            </p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TERMS.map(({ icon: Icon, title, desc }, index) => (
              <FadeIn key={title} delay={index * 80} className="h-full">
                <div className="h-full rounded-2xl border border-emerald/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/10">
                    <Icon size={22} strokeWidth={1.8} className="text-emerald" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-charcoal">{title}</h3>
                  <p className="text-sm leading-6 text-gray-600">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-12 text-center">
            <span className="mb-4 inline-flex rounded-full border border-gold/30 bg-ivory px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">
              Why Anis Abaya UAE
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
              What you can expect from us
            </h2>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2">
            {WHY.map(({ icon: Icon, title, desc }, index) => (
              <FadeIn key={title} delay={index * 80} className="h-full">
                <div className="flex h-full gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                    <Icon size={22} strokeWidth={1.8} className="text-emerald" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-bold text-charcoal">{title}</h3>
                    <p className="text-sm leading-6 text-gray-600">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <FadeIn>
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              Ready to place your wholesale order?
            </h2>
            <p className="mb-8 text-sm leading-7 text-white/70 sm:text-base">
              Browse the collection, or message us to discuss your requirements.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/abaya"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-semibold text-charcoal transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Browse Abayas
                <ArrowRight size={18} />
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
              >
                <MessageCircle size={18} />
                Contact on WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
};

export default AboutUs;