import BenefitsSection from "../../components/landing/BenefitsSection";
import FAQSection from "../../components/landing/FAQSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import FinalCTA from "../../components/landing/FinalCTA";
import Footer from "../../components/landing/Footer";
import HeroSection from "../../components/landing/HeroSection";
import HowItWorks from "../../components/landing/HowItWorks";
import Navbar from "../../components/landing/Navbar";
import PricingSection from "../../components/landing/PricingSection";
import TrustedFor from "../../components/landing/TrustedFor";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-white text-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedFor />
        <FeaturesSection />
        <HowItWorks />
        <BenefitsSection />
        <PricingSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
