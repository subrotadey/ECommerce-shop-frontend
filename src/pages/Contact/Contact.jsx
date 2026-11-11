// src/pages/Contact/Contact.jsx
import {
  ArrowUpRight,
  CheckCircle2,
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import FadeIn from "../../components/Animations/FadeIn";
import Breadcrumb from "../../components/Shared/Breadcrumb/Breadcrumb";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_DISCOUNT_THRESHOLD,
  DELIVERY_NOTICE,
  MOQ_PER_COLOR,
  WHATSAPP_NUMBER,
} from "../../utils/wholesale";

const EMAIL = "anisabaya290@gmail.com";

const TikTokIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.6 6.7a5.3 5.3 0 0 1-3.2-1.1 5.3 5.3 0 0 1-2-3.6h-3.3v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.1a6 6 0 0 0-.8-.1 6 6 0 1 0 6 6V9.3a8.6 8.6 0 0 0 5 1.6V7.6a5.3 5.3 0 0 1-1.8-.9Z" />
  </svg>
);

const CHANNELS = [
  {
    name: "WhatsApp",
    label: "Chat with us",
    desc: "The fastest way to get wholesale prices, catalogue and order support.",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: MessageCircle,
    featured: true,
  },
  {
    name: "Call",
    label: "+971 55 189 6390",
    desc: "Speak directly with our sales team.",
    href: `tel:+${WHATSAPP_NUMBER}`,
    icon: Phone,
  },
  {
    name: "Email",
    label: EMAIL,
    desc: "Send your requirements or bulk order enquiries.",
    href: `mailto:${EMAIL}`,
    icon: Mail,
  },
  {
    name: "Instagram",
    label: "@anis_abaya_uae",
    desc: "Browse our latest collections and work highlights.",
    href: "https://www.instagram.com/anis_abaya_uae",
    icon: Instagram,
  },
  {
    name: "Facebook",
    label: "Anis Abaya UAE",
    desc: "Follow our page for offers and updates.",
    href: "https://www.facebook.com/AnisAbayauae",
    icon: Facebook,
  },
  {
    name: "TikTok",
    label: "@anis_abaya_uae",
    desc: "Watch our work, new arrivals and customer reviews.",
    href: "https://www.tiktok.com/@anis_abaya_uae",
    icon: TikTokIcon,
  },
];

const TERMS = [
  `Minimum ${MOQ_PER_COLOR} pieces for each product and colour`,
  `${BULK_DISCOUNT_PERCENT}% off orders of ${BULK_DISCOUNT_THRESHOLD}+ pieces`,
  "Payment by bank transfer, arranged through WhatsApp",
  DELIVERY_NOTICE,
];

const INCLUDE = [
  "Product names or SKUs you are interested in",
  "Colours and sizes you need",
  "Approximate quantity",
  "Your country, for shipping",
];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-gray-400 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20";

const ChannelCard = ({ channel }) => {
  const Icon = channel.icon;
  const external = channel.href.startsWith("http");
  const dark = channel.featured;

  return (
    <a
      href={channel.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={`${channel.name}: ${channel.label}`}
      className={`group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        dark
          ? "border-gold/50 bg-emerald text-white"
          : "border-gray-100 bg-white text-charcoal hover:border-gold/50"
      }`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            dark ? "bg-gold/20 text-gold" : "bg-emerald/10 text-emerald"
          }`}
        >
          <Icon size={22} />
        </div>
        <ArrowUpRight
          size={18}
          className={`transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
            dark ? "text-white/50 group-hover:text-white" : "text-gray-300 group-hover:text-emerald"
          }`}
        />
      </div>

      <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${dark ? "text-gold" : "text-emerald"}`}>
        {channel.name}
      </div>
      <h3 className="mb-2 break-words text-lg font-bold">{channel.label}</h3>
      <p className={`text-sm leading-6 ${dark ? "text-white/70" : "text-gray-500"}`}>{channel.desc}</p>

      {channel.featured && (
        <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">
          Recommended
        </span>
      )}
    </a>
  );
};

const Contact = () => {
  const [form, setForm] = useState({ name: "", business: "", country: "", message: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Contact Us | Anis Abaya UAE";
    return () => {
      document.title = "Anis Abaya UAE";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // ব্যাকএন্ড লাগে না: বার্তা তৈরি করে WhatsApp খুলে দেয়
  const handleSubmit = (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const message = form.message.trim();
    if (!name || !message) {
      setError("Please enter your name and message.");
      return;
    }

    const lines = ["Hello Anis Abaya UAE,", "", `Name: ${name}`];
    if (form.business.trim()) lines.push(`Business: ${form.business.trim()}`);
    if (form.country.trim()) lines.push(`Country: ${form.country.trim()}`);
    lines.push("", message);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <Breadcrumb />

      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald py-16 sm:py-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-gold/10" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full border border-gold/10" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <FadeIn>
            <span className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Contact Us
            </span>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
              Let's Talk Wholesale
            </h1>
            <p className="text-sm leading-7 text-white/70 sm:text-base">
              Questions about prices, minimum quantities or shipping? Reach us
              on the channel that suits you. We serve boutiques and retailers
              across the UAE and worldwide.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Channels */}
      <section className="bg-ivory/60 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((channel, index) => (
              <FadeIn key={channel.name} delay={index * 60} className="h-full">
                <ChannelCard channel={channel} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Form + info */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:gap-12 lg:px-8">

          {/* Form */}
          <FadeIn className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-1 text-2xl font-bold text-charcoal">Send us your enquiry</h2>
              <p className="mb-6 text-sm text-gray-500">
                Fill in the details and we will open WhatsApp with your message
                ready to send.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Your name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full name"
                      autoComplete="name"
                      maxLength={80}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="business" className="mb-1.5 block text-sm font-medium text-gray-700">
                      Business name
                    </label>
                    <input
                      id="business"
                      name="business"
                      type="text"
                      value={form.business}
                      onChange={handleChange}
                      placeholder="Boutique or company"
                      autoComplete="organization"
                      maxLength={80}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Where should we ship?"
                    autoComplete="country-name"
                    maxLength={60}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you are looking for"
                    maxLength={1000}
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-light sm:w-auto"
                >
                  <MessageCircle size={18} />
                  Send on WhatsApp
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Info */}
          <div className="space-y-6 lg:col-span-2">
            <FadeIn delay={100}>
              <div className="rounded-2xl border border-emerald/10 bg-ivory p-6">
                <h3 className="mb-4 text-lg font-bold text-charcoal">Wholesale terms at a glance</h3>
                <ul className="space-y-3">
                  {TERMS.map((term) => (
                    <li key={term} className="flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={180}>
              <div className="rounded-2xl border border-gold/30 bg-white p-6">
                <h3 className="mb-4 text-lg font-bold text-charcoal">Helpful to include</h3>
                <ul className="space-y-3">
                  {INCLUDE.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-gray-700">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>
    </>
  );
};

export default Contact;