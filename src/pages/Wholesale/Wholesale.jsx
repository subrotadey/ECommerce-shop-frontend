import { Link } from "react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import InfoPage from "../../components/Shared/InfoPage/InfoPage";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_DISCOUNT_THRESHOLD,
  CURRENCY,
  DELIVERY_NOTICE,
  MOQ_PER_COLOR,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "../../utils/wholesale";

const sections = [
  {
    heading: "Minimum order",
    items: [
      `Minimum ${MOQ_PER_COLOR} pieces per product, per colour.`,
      "Sizes can be mixed freely within the same colour to reach the minimum.",
      "Each colour of a product is counted separately.",
    ],
  },
  {
    heading: "Bulk discount",
    paragraphs: [
      `Orders of ${BULK_DISCOUNT_THRESHOLD}+ pieces in total (across all products) receive ${BULK_DISCOUNT_PERCENT}% off the order subtotal.`,
    ],
  },
  {
    heading: "Pricing",
    items: [
      `All prices are shown in ${CURRENCY}, per piece.`,
      "No tax is added on the website.",
      DELIVERY_NOTICE,
    ],
  },
  {
    heading: "How to order",
    items: [
      "Create an account or log in. An account is required to place an order.",
      "Open a product, choose your colours and sizes, and add them to your cart.",
      "Review your cart and place your order at checkout to receive your order ID.",
      "Pay by bank transfer and confirm with our team on WhatsApp.",
    ],
  },
  {
    heading: "Payment & shipping",
    items: [
      "Payment is made by manual bank transfer. Our team shares the details and confirms your payment on WhatsApp.",
      "Shipping arrangements are confirmed separately through WhatsApp.",
    ],
  },
];

const Wholesale = () => (
  <InfoPage
    title="Wholesale Information"
    subtitle="Everything you need to know before placing a wholesale order with Anis Abaya UAE."
    sections={sections}
  >
    <div className="rounded-2xl border border-gold/30 bg-ivory p-6 sm:p-8">
      <h2 className="text-lg font-bold text-charcoal">Questions about wholesale?</h2>
      <p className="mt-2 text-sm text-charcoal/70">
        Message our team on WhatsApp ({WHATSAPP_DISPLAY}) and we will help you choose.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={whatsappLink("Hello, I would like to ask about wholesale orders.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-charcoal px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
        >
          <MessageCircle size={16} /> WhatsApp Us
        </a>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-charcoal px-6 py-3 text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  </InfoPage>
);

export default Wholesale;