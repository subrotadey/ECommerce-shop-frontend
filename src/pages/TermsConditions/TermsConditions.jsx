import InfoPage from "../../components/Shared/InfoPage/InfoPage";
import {
  BULK_DISCOUNT_PERCENT,
  BULK_DISCOUNT_THRESHOLD,
  CURRENCY,
  DELIVERY_NOTICE,
  MOQ_PER_COLOR,
} from "../../utils/wholesale";

const sections = [
  {
    heading: "About these terms",
    paragraphs: [
      "By using this website and placing an order, you agree to these terms. Anis Abaya UAE is a wholesale supplier, and this website is intended for business customers.",
    ],
  },
  {
    heading: "Accounts",
    items: [
      "You must log in to place an order.",
      "You are responsible for keeping your account details accurate and secure.",
    ],
  },
  {
    heading: "Minimum order and discounts",
    items: [
      `Minimum order is ${MOQ_PER_COLOR} pieces per product, per colour.`,
      `Orders of ${BULK_DISCOUNT_THRESHOLD}+ pieces in total receive ${BULK_DISCOUNT_PERCENT}% off the subtotal.`,
    ],
  },
  {
    heading: "Prices",
    items: [
      `All prices are in ${CURRENCY}, per piece.`,
      "No tax is added on the website.",
      DELIVERY_NOTICE,
      "We may change prices and product availability at any time. Your order total is confirmed when you place the order.",
    ],
  },
  {
    heading: "Payment",
    paragraphs: [
      "Payment is made by manual bank transfer. Our team shares the payment details and confirms your payment with you on WhatsApp.",
    ],
  },
  {
    heading: "Shipping",
    paragraphs: [
      "Shipping costs are payable by the customer. Shipping arrangements are confirmed separately through WhatsApp.",
    ],
  },
  {
    heading: "Product information",
    paragraphs: [
      "We try to show colours and details accurately. Colours may look slightly different depending on your screen.",
    ],
  },
  {
    heading: "Returns, exchanges and cancellations",
    paragraphs: [
      "Please contact our team on WhatsApp before placing your order if you have questions about returns, exchanges or cancellations.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. The latest version will always be available on this page.",
    ],
  },
];

const TermsConditions = () => (
  <InfoPage
    title="Terms & Conditions"
    subtitle="The terms that apply when you order from Anis Abaya UAE."
    updated="November 2026"
    sections={sections}
  />
);

export default TermsConditions;