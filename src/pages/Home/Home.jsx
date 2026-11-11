// src/pages/Home/Home.jsx
// Premium Dubai B2B Wholesale Abaya & Hijab Homepage
// Currency: USD | Market: UAE Retailers & Distributors

import HeroSection from "./HeroSection/HeroSection";
import TrustBar from "./TrustBar/TrustBar";
import BrandVideoSection from "./BrandVideoSection/BrandVideoSection";
import CategoriesSection from "./CategoriesSection/CategoriesSection";
import AbayaSection from "./AbayaSection/AbayaSection";
import CollectionVideoSection from "./CollectionVideoSection/CollectionVideoSection";
import HijabSection from "./HijabSection/HijabSection";
import FeaturesSection from "./FeaturesSection/FeaturesSection";
import HowItWorks from "./HowItWorks/HowItWorks";
import Testimonials from "./Testimonials/Testimonials";
import UAECoverage from "./UAECoverage/UAECoverage";
import FAQSection from "./FAQSection/FAQSection";
import FloatingWhatsApp from "./FloatingWhatsApp/FloatingWhatsApp";
import ConnectSection from "./ConnectSection/ConnectSection";
import ConnectBar from "./ConnectBar/ConnectBar";

// ─── Main Home Page ───────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div className="bg-white">
      <HeroSection />
      <ConnectBar />
      <TrustBar />
      <BrandVideoSection />
      <CategoriesSection />
      <AbayaSection />
      <CollectionVideoSection />
      <HijabSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <UAECoverage />
      <FAQSection />
      <ConnectSection />
      <FloatingWhatsApp />
    </div>
  );
};

export default Home;