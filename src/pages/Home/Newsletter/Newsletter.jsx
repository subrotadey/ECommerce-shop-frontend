// src/pages/Home/Newsletter/Newsletter.jsx
import { useState } from "react";
import { Check, Gift } from "lucide-react";
import FadeIn from '../../../components/Animations/FadeIn';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);
    
    const submit = (e) => {
      e.preventDefault();
      if (email) setDone(true);
    };
    return (
        <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <FadeIn>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: `${GOLD}12` }}>
            <Gift size={24} style={{ color: GOLD }} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: CHARCOAL }}>Get Exclusive Wholesale Offers</h2>
          <p className="text-gray-500 mb-8">Weekly deals, new arrivals, and trade-only pricing delivered to your inbox. Join 3,000+ retailers.</p>

          {done ? (
            <div className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-semibold" style={{ background: `${SAGE}12`, color: SAGE }}>
              <Check size={20} /> You're on the list! Watch your inbox.
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@store.com"
                className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-gray-400 text-sm"
                required />
              <button type="submit"
                className="px-6 py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all flex-shrink-0"
                style={{ background: CHARCOAL }}>
                Subscribe
              </button>
            </form>
          )}
          <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime. Trade offers only.</p>
        </FadeIn>
      </div>
    </section>
    );
};

export default Newsletter;