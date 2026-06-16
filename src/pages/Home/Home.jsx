// src/pages/Home/Home.jsx
// Premium Dubai B2B Wholesale Abaya & Hijab Homepage
// Currency: USD | Market: UAE Retailers & Distributors

import HeroSection from "./HeroSection/HeroSection";
import TrustBar from "./TrustBar/TrustBar";
import CategoriesSection from "./CategoriesSection/CategoriesSection";
import PricingShowcase from "./PricingShowcase/PricingShowcase";
import FeaturesSection from "./FeaturesSection/FeaturesSection";
import HowItWorks from "./HowItWorks/HowItWorks";
import Testimonials from "./Testimonials/Testimonials";
import UAECoverage from "./UAECoverage/UAECoverage";
import PartnerCTA from "./PartnerCTA/PartnerCTA";
import FAQSection from "./FAQSection/FAQSection";
import Newsletter from "./Newsletter/Newsletter";
import FloatingWhatsApp from "./FloatingWhatsApp/FloatingWhatsApp";
import BackToTop from "../../components/Shared/BackToTop/BackToTop";

// ─── Main Home Page ───────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div className="bg-white">
      <HeroSection/>
      <TrustBar />
      <CategoriesSection/>
      <PricingShowcase />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <UAECoverage />
      <PartnerCTA />
      <FAQSection />
      <Newsletter />
      <FloatingWhatsApp />
    </div>
  );
};

export default Home;