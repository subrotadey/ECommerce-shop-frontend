
import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

const TikTokIcon = ({ size = 18, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    aria-hidden="true"
  >
    <path d="M19.6 6.7a5.3 5.3 0 0 1-3.2-1.1 5.3 5.3 0 0 1-2-3.6h-3.3v13.1a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.1a6 6 0 0 0-.8-.1 6 6 0 1 0 6 6V9.3a8.6 8.6 0 0 0 5 1.6V7.6a5.3 5.3 0 0 1-1.8-.9Z" />
  </svg>
);

const LINKS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/message/YSYQT53EKGLZN1",
    icon: MessageCircle,
    color: "#25D366",
  },
  {
    name: "Call",
    href: "tel:+971551896390",
    icon: Phone,
    color: "#D4AF37",
  },
  {
    name: "Email",
    href: "mailto:anisabaya290@gmail.com",
    icon: Mail,
    color: "#D4AF37",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@anis_abaya_uae?_r=1&_t=ZS-9B1QRfJvLi4",
    icon: TikTokIcon,
    color: "#FFFFFF",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1CVo1eMHCa/",
    icon: Facebook,
    color: "#1877F2",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/anis_abaya_uae",
    icon: Instagram,
    color: "#E4405F",
  },
];

const ConnectBar = () => {
  return (
    <section
      aria-label="Contact channels"
      className="relative border-y border-gold/20 bg-emerald"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:px-8">

        {/* Contact message */}
        <div className="text-center lg:text-left">
          <p className="text-sm font-semibold text-gold">
            Wholesale Enquiries?
          </p>

          <p className="mt-1 text-sm text-white/75">
            Connect with Anis Abaya through your preferred channel.
          </p>
        </div>

        {/* Contact links */}
        <div className="flex w-full flex-wrap justify-center gap-2 lg:w-auto">
          {LINKS.map(({ name, href, icon: Icon, color }) => {
            const external = href.startsWith("http");

            return (
              <a
                key={name}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={`Contact us on ${name}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/10 sm:px-4 sm:text-sm"
              >
                <Icon
                  size={17}
                  color={color}
                  aria-hidden="true"
                />

                <span>{name}</span>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ConnectBar;
