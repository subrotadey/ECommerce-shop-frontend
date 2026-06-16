import { useState } from "react";
import { Link } from "react-router";
import {ArrowRight} from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const UAECoverage = () => {
    const [hover, setHover] = useState(null);

    const UAE_CITIES = [
        { name: "Dubai", x: "62%", y: "68%", stores: "180+" },
        { name: "Abu Dhabi", x: "28%", y: "72%", stores: "95+" },
        { name: "Sharjah", x: "67%", y: "56%", stores: "70+" },
        { name: "Ajman", x: "70%", y: "48%", stores: "45+" },
        { name: "Ras Al Khaimah", x: "72%", y: "28%", stores: "30+" },
        { name: "Fujairah", x: "88%", y: "55%", stores: "25+" },
    ];
    return (
        <section className="py-20" style={{ background: "#FAFAF8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}10` }}>UAE Coverage</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: CHARCOAL }}>We Deliver Across All Emirates</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">From the heart of Dubai to the northern Emirates — we have active retail partners and reliable delivery routes across the entire UAE.</p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {UAE_CITIES.map(city => (
                <div key={city.name}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-all cursor-default"
                  style={{ borderColor: hover === city.name ? GOLD : "#E5E7EB", background: hover === city.name ? `${GOLD}06` : "white" }}
                  onMouseEnter={() => setHover(city.name)}
                  onMouseLeave={() => setHover(null)}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <div>
                    <div className="font-semibold text-sm" style={{ color: CHARCOAL }}>{city.name}</div>
                    <div className="text-xs text-gray-400">{city.stores} partner stores</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/contact"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-white font-semibold shadow-lg hover:opacity-90 transition-all"
              style={{ background: CHARCOAL }}>
              Find Delivery in Your Area
              <ArrowRight size={18} />
            </Link>
          </FadeIn>

          {/* UAE Map illustration */}
          <FadeIn delay={200}>
            <div className="relative bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden" style={{ minHeight: 400 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Stylized UAE outline */}
                <svg viewBox="0 0 400 280" className="w-full h-full opacity-10" style={{ fill: CHARCOAL }}>
                  <path d="M340,20 L380,60 L390,100 L370,140 L340,160 L300,200 L260,220 L200,240 L160,230 L120,210 L80,180 L40,150 L20,120 L30,90 L60,70 L100,50 L150,30 L200,20 L250,15 L300,18 Z" />
                </svg>
                {/* City dots */}
                {UAE_CITIES.map(city => (
                  <div key={city.name} className="absolute" style={{ left: city.x, top: city.y, transform: "translate(-50%,-50%)" }}>
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full border-2 border-white shadow-lg" style={{ background: hover === city.name ? GOLD : CHARCOAL }} />
                      {hover === city.name && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl px-3 py-2 text-xs font-bold whitespace-nowrap border border-gray-100" style={{ color: CHARCOAL }}>
                          {city.name}: {city.stores} stores
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-emerald-50/20" />
              <div className="relative z-10 p-6 text-center mt-8">
                <div className="text-sm font-bold mb-2" style={{ color: CHARCOAL }}>Active UAE Retail Network</div>
                <div className="text-4xl font-black mb-1" style={{ color: GOLD }}>445+</div>
                <div className="text-sm text-gray-500">Partner Stores Across UAE</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
    );
};

export default UAECoverage;