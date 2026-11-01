
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageCircle,
  Factory,
  Globe2,
} from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

const EMERALD = "#123C32";
const GOLD = "#D4AF37";
const CHARCOAL = "#1A1A1A";

const PartnerCTA = () => {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div
            className="relative rounded-3xl overflow-hidden px-6 py-14 sm:px-12 sm:py-16 lg:px-16 text-center"
            style={{ backgroundColor: EMERALD }}
          >
            {/* Decorative Background */}
            <div
              className="absolute -top-32 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10"
              style={{ backgroundColor: GOLD }}
            />

            <div
              className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{ backgroundColor: "#FFFFFF" }}
            />

            {/* Decorative Border */}
            <div
              className="absolute inset-4 rounded-2xl border pointer-events-none"
              style={{ borderColor: `${GOLD}35` }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              {/* Label */}
              <div
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-7"
                style={{
                  color: GOLD,
                  backgroundColor: `${GOLD}18`,
                }}
              >
                <Factory size={15} />
                Wholesale Partnership
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Grow Your Fashion Business with{" "}
                <span style={{ color: GOLD }}>
                  Anis Abaya UAE
                </span>
              </h2>

              {/* Description */}
              <p className="text-white/75 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                Source premium abayas directly from a UAE manufacturer.
                Explore our wholesale collection, choose your preferred
                colors and sizes, and build a reliable sourcing
                relationship with our team.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 mb-10">
                <div className="flex items-center gap-2 text-sm text-white/85">
                  <Factory size={17} style={{ color: GOLD }} />
                  Direct Manufacturer
                </div>

                <div className="flex items-center gap-2 text-sm text-white/85">
                  <Globe2 size={17} style={{ color: GOLD }} />
                  Worldwide Wholesale Enquiries
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 shadow-lg"
                  style={{
                    backgroundColor: GOLD,
                    color: CHARCOAL,
                  }}
                >
                  Create Wholesale Account
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="https://wa.me/971551896390"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border transition-all duration-300 hover:bg-white/10"
                  style={{
                    borderColor: `${GOLD}80`,
                    color: "#FFFFFF",
                  }}
                >
                  <MessageCircle size={18} />
                  Contact on WhatsApp
                </a>
              </div>

              {/* Bottom Note */}
              <p className="text-xs text-white/50 mt-7">
                Wholesale only. Minimum order quantity: 12 pieces per
                individual product and color combination.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PartnerCTA;
