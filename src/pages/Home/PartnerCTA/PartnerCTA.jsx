//src/pages/Home/PartnerCTA/PartnerCTA.jsx
import { Link } from "react-router";
import { ArrowRight, Phone } from "lucide-react";
import FadeIn from '../../../components/Animations/FadeIn';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const PartnerCTA = () => {
    return (
        <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <div className="rounded-3xl p-12 sm:p-16 relative overflow-hidden" style={{ background: CHARCOAL }}>
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: `radial-gradient(circle at 30% 50%, ${GOLD} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${SAGE} 0%, transparent 50%)` }} />
              <div className="relative z-10">
                <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6 rounded-full" style={{ color: GOLD, background: `${GOLD}20` }}>Join Our Network</div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Ready to Scale Your<br />Fashion Business?
                </h2>
                <p className="text-white/50 mb-10 max-w-xl mx-auto text-lg">
                  Join 500+ UAE retailers who source exclusively from us. Register in 2 minutes and get access to wholesale pricing immediately.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition-all"
                    style={{ background: GOLD, color: CHARCOAL }}>
                    Register Wholesale Account
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border-2 text-white transition-all hover:bg-white/10"
                    style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                    <Phone size={18} />
                    Contact Sales Team
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
    </section>
    );
};

export default PartnerCTA;