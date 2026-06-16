//src/pages/Home/HowItWorks/HowItWorks.jsx
import {ChevronRight} from "lucide-react";
import FadeIn from '../../../components/Animations/FadeIn';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const HowItWorks = () => {
    const steps = [
        { n: "01", title: "Register Your Business", desc: "Create your free wholesale account in 2 minutes. No upfront fees, no commitments." },
        { n: "02", title: "Browse & Select Styles", desc: "Access 1,000+ styles across Abayas, Hijabs, Khimars, and more at wholesale prices." },
        { n: "03", title: "Place Your Wholesale Order", desc: "Order from as low as 10 pieces. Mix styles, colors, and sizes to suit your store." },
        { n: "04", title: "Receive & Resell at Profit", desc: "We deliver in 2–4 days. You sell at retail and keep margins of 50–80%." },
    ];
    return (
        <section className="py-20" style={{ background: CHARCOAL }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}20` }}>Simple Process</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">How Our Platform Helps You Scale</h2>
            <p className="text-white/50 max-w-2xl mx-auto">From first order to full-time business — here's how retailers across the UAE grow with us.</p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <FadeIn key={s.n} delay={i * 90}>
                <div className="relative p-6 rounded-2xl border h-full" style={{ borderColor: `${GOLD}25`, background: `${GOLD}06` }}>
                  <div className="text-5xl font-black mb-4 opacity-20" style={{ color: GOLD }}>{s.n}</div>
                  <h3 className="font-bold text-base mb-2 text-white">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 z-10">
                      <ChevronRight size={20} style={{ color: GOLD }} />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
    </section>
    );
};

export default HowItWorks;