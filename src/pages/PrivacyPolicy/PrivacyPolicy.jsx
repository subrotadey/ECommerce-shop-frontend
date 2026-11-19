import InfoPage from "../../components/Shared/InfoPage/InfoPage";

const EMAIL = "anisabaya290@gmail.com";

const sections = [
  {
    heading: "Information we collect",
    items: [
      "Account details you give us, such as your name, email address and phone number.",
      "Order details, such as the products, quantities, delivery information and order history.",
      "Messages you send us through the contact form, WhatsApp or email.",
    ],
  },
  {
    heading: "How we use it",
    items: [
      "To create and manage your account and to process and fulfil your wholesale orders.",
      "To contact you about your orders, payments and shipping arrangements.",
      "To improve our website and respond to your enquiries.",
    ],
  },
  {
    heading: "Payments",
    paragraphs: [
      "Payments are made by manual bank transfer. We do not collect or store card details on this website.",
    ],
  },
  {
    heading: "Service providers",
    paragraphs: [
      "We use trusted third-party services to run the website, such as authentication, hosting, image delivery and shipping partners. They receive only the information needed to provide their service. We do not sell your personal information.",
    ],
  },
  {
    heading: "Cookies and local storage",
    paragraphs: [
      "The website may store small pieces of data in your browser, such as your login session, cart or wishlist, so the site works as expected.",
    ],
  },
  {
    heading: "Your choices",
    paragraphs: [
      `You can ask us to view, correct or delete your personal information by contacting us at ${EMAIL}.`,
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. The latest version will always be available on this page.",
    ],
  },
];

const PrivacyPolicy = () => (
  <InfoPage
    title="Privacy Policy"
    subtitle="How Anis Abaya UAE collects, uses and protects your information."
    updated="November 2026"
    sections={sections}
  />
);

export default PrivacyPolicy;