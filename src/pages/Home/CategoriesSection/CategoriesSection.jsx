// src/pages/Home/CategoriesSection/CategoriesSection.jsx
import { Link } from "react-router";
import FadeIn from "../../../components/Animations/FadeIn";

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const CategoriesSection = () => {
    const CATEGORIES = [
          { name: "Premium Abayas", slug: "abaya", emoji: "🧕", count: "240+", img: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=400&q=80" },
          { name: "Luxury Borkas", slug: "abaya", emoji: "✨", count: "180+", img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80" },
          { name: "Khimars", slug: "hijab", emoji: "🌙", count: "120+", img: "https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80" },
          { name: "Hijab Sets", slug: "hijab", emoji: "💎", count: "200+", img: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&q=80" },
        //   { name: "Prayer Wear", slug: "abaya", emoji: "🤍", count: "90+", img: "https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&q=80" },
        //   { name: "Kids Collection", slug: "abaya", emoji: "⭐", count: "75+", img: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&q=80" },
          { name: "New Arrivals", slug: "abaya", emoji: "🆕", count: "50+", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80" },
          { name: "Exclusive Collection", slug: "abaya", emoji: "👑", count: "35+", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80" },
        ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn className="text-center mb-12">
                <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}10` }}>Browse Collections</div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: CHARCOAL }}>Shop by Category</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">From everyday abayas to exclusive designer pieces — source your entire catalogue in one place.</p>
              </FadeIn>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {CATEGORIES.map((cat, i) => (
                  <FadeIn key={cat.name} delay={i * 60}>
                    <Link to={`/${cat.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] block shadow-sm hover:shadow-xl transition-all duration-300">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="text-white font-bold text-sm sm:text-base mb-0.5">{cat.name}</div>
                        <div className="text-white/70 text-xs">{cat.count} styles</div>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: CHARCOAL }}>
                        Shop →
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
        </section>
    );
};

export default CategoriesSection;