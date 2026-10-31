// src/pages/Home/ConnectSection/ConnectBar.jsx
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";

const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";

const TikTokIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
    <path d="M19.6 6.7a5.3 5.3 0 0 1-3.2-1.1 5.3 5.3 0 0 1-2-3.6h-3.3v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.1a6 6 0 0 0-.8-.1 6 6 0 1 0 6 6V9.3a8.6 8.6 0 0 0 5 1.6V7.6a5.3 5.3 0 0 1-1.8-.9Z" />
  </svg>
);

const LINKS = [
  { name: "WhatsApp", href: "https://wa.me/message/YSYQT53EKGLZN1", icon: MessageCircle, color: "#25D366" },
  { name: "Call", href: "tel:+971551896390", icon: Phone, color: GOLD_LIGHT },
  { name: "Email", href: "mailto:anisabaya290@gmail.com", icon: Mail, color: GOLD_LIGHT },
  { name: "TikTok", href: "https://www.tiktok.com/@anis_abaya_uae?_r=1&_t=ZS-9B1QRfJvLi4", icon: TikTokIcon, color: "#FFFFFF" },
  { name: "Facebook", href: "https://www.facebook.com/share/1CVo1eMHCa/", icon: Facebook, color: "#1877F2" },
  { name: "Instagram", href: "https://www.instagram.com/anis_abaya_uae", icon: Instagram, color: "#E4405F" },
];

const ConnectBar = () => (
  <section
    aria-label="Contact channels"
    className="relative border-y"
    style={{ background: CHARCOAL, borderColor: `${GOLD}40` }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-white/70 text-center md:text-left">
        <span className="font-semibold" style={{ color: GOLD }}>Wholesale enquiries?</span>{" "}
        Reach us instantly on your favourite channel.
      </p>

      <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
        {LINKS.map(({ name, href, icon: Icon, color }) => {
          const external = href.startsWith("http");
          return (
            <a
              key={name}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={name}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            >
              <Icon size={18} color={color} />
              {name}
            </a>
          );
        })}
      </div>
    </div>
  </section>
);

export default ConnectBar;