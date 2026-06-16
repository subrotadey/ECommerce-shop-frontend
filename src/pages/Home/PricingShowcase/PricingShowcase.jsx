// src/pages/Home/PricingShowcase/PricingShowcase.jsx
import React from 'react';
import { Link } from "react-router";
import {ArrowRight, Package} from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const PricingShowcase = () => {
    const items = [
          { name: "Premium Crepe Abaya", img: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&q=80", retail: 95, wholesale: 38, moq: 10 },
          { name: "Embroidered Khimar Set", img: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80", retail: 75, wholesale: 29, moq: 15 },
          { name: "Luxury Silk Hijab", img: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&q=80", retail: 45, wholesale: 16, moq: 20 },
          { name: "Designer Borka Dubai", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80", retail: 120, wholesale: 48, moq: 10 },
        ];
    return (
        <section className="py-20" style={{ background: "#FAFAF8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}10` }}>Pricing That Works</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: CHARCOAL }}>Wholesale vs Retail Pricing</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">See exactly what you save when you buy wholesale. These are real margins our retailers are making today.</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const saving = Math.round(((item.retail - item.wholesale) / item.retail) * 100);
            return (
                <FadeIn key={item.name} delay={i * 80}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">{saving}% OFF retail</div>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-sm mb-3" style={{ color: CHARCOAL }}>{item.name}</div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <div className="text-xs text-gray-400 line-through">Retail ${item.retail}</div>
                          <div className="text-2xl font-bold" style={{ color: CHARCOAL }}>${item.wholesale}</div>
                          <div className="text-xs text-gray-500">wholesale / piece</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: `${SAGE}15`, color: SAGE }}>
                            +${item.retail - item.wholesale}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">per piece profit</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 border-t border-gray-50 pt-3">
                        <Package size={11} />
                        MOQ: {item.moq} pieces
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn className="text-center mt-10">
            <Link to="/abaya" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold shadow-lg hover:opacity-90 transition-all" style={{ background: CHARCOAL }}>
              View Full Wholesale Catalogue
              <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
    </section>
    );
};

export default PricingShowcase;