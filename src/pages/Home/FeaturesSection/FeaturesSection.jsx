//src/pages/Home/FeaturesSection/FeaturesSection.jsx
import {Truck, Shield, Users, Package, Globe, Tag} from "lucide-react";
import FadeIn from '../../../components/Animations/FadeIn';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const FeaturesSection = () => {

    const FEATURES = [
        { icon: Tag, title: "Factory Direct Pricing", desc: "Skip middlemen — buy directly from manufacturers and maximize your profit margins on every order.", color: GOLD },
        { icon: Truck, title: "UAE Express Delivery", desc: "2–4 day delivery across all Emirates. Dubai, Abu Dhabi, Sharjah — we ship everywhere.", color: SAGE },
        { icon: Package, title: "Flexible MOQ", desc: "Start small, scale fast. Our minimum order quantities are designed for growing boutiques.", color: "#7C5CBF" },
        { icon: Shield, title: "Quality Assurance", desc: "Every piece is inspected before shipping. We stand behind every garment we supply.", color: "#C0392B" },
        { icon: Users, title: "Dedicated Account Manager", desc: "Your personal B2B specialist helps you source, plan inventory, and grow your business.", color: GOLD },
        { icon: Globe, title: "International Shipping", desc: "Serving retailers across GCC, UK, USA, Canada, Australia and 40+ countries.", color: SAGE },
    ];

    return (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}10` }}>Why Retailers Choose Us</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: CHARCOAL }}>Built for Growing Boutiques</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Every feature is designed to make running your fashion business easier, more profitable, and more reliable.</p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <FadeIn key={f.title} delay={i * 70}>
                  <div className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${f.color}12` }}>
                      <f.icon size={22} style={{ color: f.color }} />
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ color: CHARCOAL }}>{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
    );
};

export default FeaturesSection;