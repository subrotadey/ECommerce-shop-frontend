import { ArrowRight, Check, Truck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router";

const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const HeroSection = () => {
    
    const [count, setCount] = useState(0);
    useEffect(() => {
      const timer = setInterval(() => {
        setCount(c => { if (c >= 500) { clearInterval(timer); return 500; } return c + 5; });
      }, 20);
      return () => clearInterval(timer);
    }, []);
    return (
        <section className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle grid bg */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 60px)" }} />

      {/* Gold accent blob top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{ background: `radial-gradient(circle, ${GOLD} 0%, transparent 70%)`, transform: "translate(30%, -30%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border text-sm font-medium"
              style={{ borderColor: `${GOLD}40`, color: GOLD, background: `${GOLD}08` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GOLD }} />
              Trusted by {count}+ UAE Retailers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.1] tracking-tight mb-6" style={{ color: CHARCOAL }}>
              Premium Wholesale<br />
              <span style={{ color: GOLD }}>Abayas & Hijabs</span><br />
              for Modern UAE Retailers
            </h1>

            <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-xl">
              Source luxury-quality Islamic fashion directly from trusted manufacturers. Grow your boutique with better margins, faster restock, and exclusive collections you won't find anywhere else.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/abaya"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-white font-semibold text-sm shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                style={{ background: CHARCOAL }}>
                Shop Wholesale Collection
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-gray-50"
                style={{ borderColor: CHARCOAL, color: CHARCOAL }}>
                Become a Distributor
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3">
              {["UAE Wide Delivery", "MOQ from 10 pcs", "Bulk Pricing", "Premium Quality"].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <Check size={13} style={{ color: SAGE }} />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Fashion collage */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4 h-[520px]">
              {/* Main tall image */}
              <div className="row-span-2 rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://i.ibb.co.com/xK1GfQh2/1.webp" alt="Premium Abaya" className="w-full h-full object-cover" />
              </div>
              {/* Top right */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="https://i.ibb.co.com/k2GVTwvx/6.webp" alt="Hijab" className="" />
              </div>
              {/* Bottom right */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="https://i.ibb.co.com/q3J6rLsR/3.webp?" alt="Collection" className="w-full" />
              </div>
            </div>

            {/* Floating wholesale price card */}
            <div className="absolute -left-6 bottom-20 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 min-w-[180px]">
              <div className="text-xs text-gray-500 font-medium mb-1">Wholesale Price</div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold" style={{ color: CHARCOAL }}>$38</span>
                <span className="text-sm text-gray-400 line-through mb-0.5">$95</span>
              </div>
              <div className="text-xs font-semibold mt-1 px-2 py-1 rounded-md inline-block" style={{ background: `${SAGE}15`, color: SAGE }}>60% margin potential</div>
            </div>

            {/* Floating delivery badge */}
            <div className="absolute -right-4 top-12 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${GOLD}15` }}>
                <Truck size={18} style={{ color: GOLD }} />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: CHARCOAL }}>2-4 Day Delivery</div>
                <div className="text-xs text-gray-400">Across UAE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
};

export default HeroSection;
