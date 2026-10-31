// src/pages/Home/ConnectSection/ConnectSection.jsx
import { ArrowUpRight, Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";

const TikTokIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M19.6 6.7a5.3 5.3 0 0 1-3.2-1.1 5.3 5.3 0 0 1-2-3.6h-3.3v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.1a6 6 0 0 0-.8-.1 6 6 0 1 0 6 6V9.3a8.6 8.6 0 0 0 5 1.6V7.6a5.3 5.3 0 0 1-1.8-.9Z" />
  </svg>
);

const CHANNELS = [
  {
    name: "WhatsApp",
    label: "Chat with us",
    desc: "Fastest way to get wholesale prices, catalogue & order support.",
    href: "https://wa.me/message/YSYQT53EKGLZN1",
    icon: MessageCircle,
    color: "#25D366",
    featured: true,
  },
  {
    name: "Call",
    label: "+971 55 189 6390",
    desc: "Speak directly with our sales team.",
    href: "tel:+971551896390",
    icon: Phone,
    color: GOLD_LIGHT,
  },
  {
    name: "Email",
    label: "anisabaya290@gmail.com",
    desc: "Send us your requirements or bulk order enquiries.",
    href: "mailto:anisabaya290@gmail.com",
    icon: Mail,
    color: GOLD_LIGHT,
  },
  {
    name: "TikTok",
    label: "@anis_abaya_uae",
    desc: "17K+ followers. Watch factory work, new arrivals & customer reviews.",
    href: "https://www.tiktok.com/@anis_abaya_uae?_r=1&_t=ZS-9B1QRfJvLi4",
    icon: TikTokIcon,
    color: "#FFFFFF",
  },
  {
    name: "Facebook",
    label: "Anis Abaya UAE",
    desc: "12K+ followers. Follow our page for offers & updates.",
    href: "https://www.facebook.com/share/1CVo1eMHCa/",
    icon: Facebook,
    color: "#1877F2",
  },
  {
    name: "Instagram",
    label: "@anis_abaya_uae",
    desc: "Browse our latest collections & Ari work highlights.",
    href: "https://www.instagram.com/anis_abaya_uae",
    icon: Instagram,
    color: "#E4405F",
  },
];

const ChannelCard = ({ channel }) => {
  const Icon = channel.icon;
  const external = channel.href.startsWith("http");

  return (
    <a
      href={channel.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={`${channel.name} - ${channel.label}`}
      className="group relative flex flex-col h-full p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        borderColor: channel.featured ? `${GOLD}70` : "rgba(255,255,255,0.1)",
        background: channel.featured
          ? `linear-gradient(145deg, ${GOLD}22, rgba(255,255,255,0.03))`
          : "rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${channel.color}1F`, color: channel.color }}
        >
          <Icon size={22} color={channel.color} />
        </div>
        <ArrowUpRight
          size={18}
          className="text-white/30 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>

      <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
        {channel.name}
      </div>
      <div className="text-lg font-bold text-white mb-2 break-all">{channel.label}</div>
      <p className="text-sm text-white/50 leading-relaxed">{channel.desc}</p>

      {channel.featured && (
        <span
          className="absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ background: GOLD, color: CHARCOAL }}
        >
          Recommended
        </span>
      )}
    </a>
  );
};

const ConnectSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: CHARCOAL }}>
      {/* Ambient gold glow */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 20%, ${GOLD} 0%, transparent 45%), radial-gradient(circle at 85% 80%, ${GOLD_LIGHT} 0%, transparent 45%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <div
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full"
            style={{ color: GOLD, background: `${GOLD}20` }}
          >
            Connect With Us
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Let's Grow Your Business <span style={{ color: GOLD }}>Together</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto text-base sm:text-lg">
            Questions about wholesale pricing, MOQ or delivery? Reach out on your
            favourite channel — we usually reply within minutes.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CHANNELS.map((channel, i) => (
            <FadeIn key={channel.name} delay={i * 90} className="h-full">
              <ChannelCard channel={channel} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400} className="text-center mt-10">
          <p className="text-xs text-white/30 tracking-wide">
            Anis Abaya UAE · Premium Wholesale Abayas & Hijabs · Serving all Emirates
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default ConnectSection;