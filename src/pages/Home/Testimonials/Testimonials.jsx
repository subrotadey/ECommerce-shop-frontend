//src/pages/Home/Testimonials/Testimonials.jsx
import FadeIn from '../../../components/Animations/FadeIn';
import { useState } from "react";
import {Star, MapPin } from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const Testimonials = () => {

    const TESTIMONIALS = [
  {
    name: "Fatima Al-Rashidi",
    store: "Elegant Modest, Dubai Mall",
    rating: 5,
    text: "We've been sourcing our entire Abaya line from here for 2 years. The quality is consistently excellent and our customers keep coming back. Profit margins are 60% better than our previous supplier.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80",
    location: "Dubai, UAE"
  },
  {
    name: "Sarah Mohammad",
    store: "Hijab House, Sharjah",
    rating: 5,
    text: "The wholesale pricing makes it possible for us to compete with bigger stores. Fast delivery, beautiful packaging, and the quality speaks for itself. My customers love the collections.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80",
    location: "Sharjah, UAE"
  },
  {
    name: "Aisha Karimi",
    store: "Modesty & Grace, Abu Dhabi",
    rating: 5,
    text: "Exceptional supplier. We placed our first order of 50 pieces and were blown away. Now we order 300+ monthly. The account manager understands our business like a true partner.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
    location: "Abu Dhabi, UAE"
  },
];

    const [active, setActive] = useState(0);
    const t = TESTIMONIALS[active];
    return (
        <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}10` }}>Real Results</div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: CHARCOAL }}>What Our Retail Partners Say</h2>
        </FadeIn>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 relative overflow-hidden mb-6">
            {/* Quote mark */}
            <div className="absolute top-6 right-8 text-8xl font-serif leading-none opacity-10" style={{ color: GOLD }}>"</div>
            <div className="flex gap-1 mb-6">
              {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill={GOLD} color={GOLD} />)}
            </div>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 italic">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
              <div>
                <div className="font-bold" style={{ color: CHARCOAL }}>{t.name}</div>
                <div className="text-sm text-gray-500">{t.store}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={11} />{t.location}</div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{ width: active === i ? 24 : 8, height: 8, background: active === i ? CHARCOAL : "#D1D5DB" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
    );
};

export default Testimonials;