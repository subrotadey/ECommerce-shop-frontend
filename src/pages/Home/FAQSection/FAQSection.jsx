//src/pages/Home/FAQSection/FAQSection.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from '../../../components/Animations/FadeIn';

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Palette: White base, Warm Gold accent, Deep Charcoal text, Sage Green touch
const GOLD = "#B8922A";
const GOLD_LIGHT = "#D4AA4A";
const CHARCOAL = "#1A1A1A";
const SAGE = "#4A7C6F";

const FAQS = [
  { q: "What is the minimum order quantity (MOQ)?", a: "Our MOQ starts at just 10 pieces per style, making it accessible for boutiques of all sizes. Volume discounts apply at 50+ and 200+ pieces." },
  { q: "How long does UAE delivery take?", a: "Standard delivery across UAE is 2–4 business days. Express overnight delivery is available for Dubai, Abu Dhabi, and Sharjah." },
  { q: "Do you offer bulk discount pricing?", a: "Yes. We offer tiered pricing: 10–49 pcs at wholesale rate, 50–199 pcs gets 8% off, 200+ pcs gets 15% off. Custom pricing for orders above $5,000." },
  { q: "Can I become a regional distributor?", a: "Absolutely. Our Distributor Program gives you exclusive territory rights, priority stock access, and co-marketing support. Contact our sales team to apply." },
  { q: "Do you ship internationally outside UAE?", a: "Yes. We ship to GCC countries, UK, USA, Canada, Australia, and 40+ countries. International shipping quotes provided at checkout." },
  { q: "What payment methods do you accept?", a: "We accept Bank Transfer, Credit/Debit Cards, PayPal, and Letter of Credit (LC) for large wholesale orders. All transactions are USD." },
];

const FAQSection = () => {
    const [open, setOpen] = useState(null);
    return (
        <section className="py-20" style={{ background: "#FAFAF8" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <div className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 mb-4 rounded-full" style={{ color: GOLD, background: `${GOLD}10` }}>Common Questions</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: CHARCOAL }}>Frequently Asked Questions</h2>
            </FadeIn>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FadeIn key={i} delay={i * 50}>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="w-full flex items-center justify-between p-6 text-left gap-4">
                      <span className="font-semibold text-sm sm:text-base" style={{ color: CHARCOAL }}>{faq.q}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${open === i ? "rotate-180" : ""}`}
                        style={{ background: open === i ? CHARCOAL : "#F3F4F6" }}>
                        <ChevronDown size={14} color={open === i ? "white" : "#6B7280"} />
                      </div>
                    </button>
                    {open === i && (
                      <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">{faq.a}</div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
    );
};

export default FAQSection;