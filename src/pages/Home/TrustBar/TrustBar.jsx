// src/pages/Home/TrustBar/TrustBar.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Users, Award, Package, TrendingUp, Truck } from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const TrustBar = () => {
    const stats = [
    { icon: Users, value: "500+", label: "Retail Partners" },
    { icon: Package, value: "10K+", label: "Products Delivered" },
    { icon: Truck, value: "UAE Wide", label: "Same-Day Dispatch" },
    { icon: TrendingUp, value: "60%", label: "Avg. Profit Margin" },
    { icon: Award, value: "5★", label: "Verified Reviews" },
  ];

    return (
        <div className="border-y border-gray-100 bg-gray-50/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-gray-100">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex flex-col sm:flex-row items-center gap-3 py-6 px-4 sm:px-6 text-center sm:text-left">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}12` }}>
                      <Icon size={18} style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div className="text-xl font-bold" style={{ color: CHARCOAL }}>{value}</div>
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
    );
};

export default TrustBar;