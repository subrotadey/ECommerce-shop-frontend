
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "../../../components/Animations/FadeIn";

const EMERALD = "#123C32";
const GOLD = "#D4AF37";
const CHARCOAL = "#1A1A1A";
const IVORY = "#F7F5EF";

const FAQS = [
  {
    q: "What is the minimum order quantity (MOQ)?",
    a: "The minimum order quantity is 12 pieces per product per color. For example, if you select one color of a particular product, you must order at least 12 pieces in that color. You can mix different available sizes within those 12 pieces.",
  },
  {
    q: "Can I order multiple colors of the same product?",
    a: "Yes. You can select multiple available colors, including 10 or more colors, depending on product availability. However, each color requires a separate minimum order of 12 pieces. For example, 1 color requires 12 pieces, 2 colors require 24 pieces, 3 colors require 36 pieces, and 5 colors require 60 pieces. Each color must independently meet the 12-piece MOQ.",
  },
  {
    q: "Can I mix different sizes within the minimum order?",
    a: "Yes. You can mix different available sizes within the same product and color. For example, you can order 3 pieces of S (52), 3 pieces of M (54), 2 pieces of L (56), 2 pieces of XL (58), 1 piece of XXL (60), and 1 piece of 3XL (62), making a total of 12 pieces for that color.",
  },
  {
    q: "What sizes are available?",
    a: "Our standard size options are S (52), M (54), L (56), XL (58), XXL (60), and 3XL (62). Available sizes may vary depending on the product and stock.",
  },
  {
    q: "Do you offer discounts on bulk orders?",
    a: "Yes. Orders containing 12–99 pieces receive the standard wholesale pricing. Orders with a total quantity of 100 pieces or more receive an additional 5% discount on the merchandise subtotal. The total quantity is calculated across all products and colors in one order. Delivery charges are excluded from the discount calculation.",
  },
  {
    q: "Do you accept international wholesale orders?",
    a: "Yes. Anis Abaya UAE welcomes wholesale enquiries from international buyers, boutiques, retailers, and fashion businesses. Please contact our team through WhatsApp to discuss shipping arrangements for your destination.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Currently, we accept payment through manual bank transfer arranged via WhatsApp. After placing your order, you will receive your Order ID and payment instructions from our team. Once you complete the transfer, send your payment proof through WhatsApp for manual verification.",
  },
  {
    q: "Are delivery charges included in the product price?",
    a: "No. Delivery charges are not included. Shipping costs are payable by the customer. Please contact our team through WhatsApp to discuss shipping arrangements.",
  },
  {
    q: "How can I track my order?",
    a: "After successfully placing your order, you will receive a unique Order ID. You can use this Order ID along with your registered WhatsApp number or email address to check your order status through the order tracking page.",
  },
  {
    q: "How can I contact Anis Abaya UAE?",
    a: "You can contact our team directly through WhatsApp at +971 55 189 6390 or email us at anisabaya290@gmail.com for wholesale enquiries, payment assistance, and shipping arrangements.",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState(null);

  return (
    <section
      className="py-20 sm:py-24"
      style={{ backgroundColor: IVORY }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <FadeIn>
          <div className="text-center mb-12">
            <div
              className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 mb-4 rounded-full"
              style={{
                color: EMERALD,
                backgroundColor: `${EMERALD}10`,
              }}
            >
              Common Questions
            </div>

            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ color: CHARCOAL }}
            >
              Frequently Asked Questions
            </h2>

            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Everything you need to know about wholesale ordering,
              minimum quantities, color selection, bulk discounts,
              payments, and delivery.
            </p>
          </div>
        </FadeIn>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;

            return (
              <FadeIn key={faq.q} delay={i * 40}>
                <div
                  className="bg-white rounded-2xl border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isOpen ? `${GOLD}80` : "#EAE8E1",
                    boxShadow: isOpen
                      ? "0 8px 25px rgba(18, 60, 50, 0.05)"
                      : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left"
                  >
                    <span
                      className="font-semibold text-sm sm:text-base leading-relaxed"
                      style={{
                        color: isOpen ? EMERALD : CHARCOAL,
                      }}
                    >
                      {faq.q}
                    </span>

                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: isOpen ? EMERALD : IVORY,
                        color: isOpen ? "#FFFFFF" : EMERALD,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <ChevronDown size={17} />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${i}`}
                      className="px-5 sm:px-6 pb-6"
                    >
                      <div
                        className="border-t pt-4 text-sm text-gray-600 leading-7"
                        style={{ borderColor: "#F0EEE8" }}
                      >
                        {faq.a}
                      </div>
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Contact Note */}
        <FadeIn delay={200}>
          <div className="text-center mt-10">
            <p className="text-sm text-gray-500 mb-4">
              Still have questions about wholesale orders?
            </p>

            <a
              href="https://wa.me/971551896390"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm transition-opacity hover:opacity-75"
              style={{ color: EMERALD }}
            >
              Contact Us on WhatsApp
              <ChevronDown
                size={16}
                className="-rotate-90"
                style={{ color: GOLD }}
              />
            </a>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default FAQSection;
