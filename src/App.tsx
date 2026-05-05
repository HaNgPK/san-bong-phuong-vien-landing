import Header from "./components/landing/Header";
import HeroSection from "./components/landing/HeroSection";
import SponsorMarquee from "./components/landing/SponsorMarquee";
import TournamentGallerySection from "./components/landing/TournamentGallerySection";
import FootballFieldSection from "./components/landing/FootballFieldSection";
import LeaderboardSection from "./components/landing/LeaderboardSection";
import TransparencySection from "./components/landing/TransparencySection";
import BudgetTimelineSection from "./components/landing/BudgetTimelineSection";
import PaymentSection from "./components/landing/PaymentSection";
import Footer from "./components/landing/Footer";
import { motion, Variants } from "framer-motion";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const ScrollReveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeUpVariant}
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-200 overflow-x-hidden">
      <Header />
      <HeroSection />
      <SponsorMarquee />

      <ScrollReveal>
        <FootballFieldSection />
      </ScrollReveal>

      <ScrollReveal>
        <TournamentGallerySection />
      </ScrollReveal>

      <ScrollReveal>
        <LeaderboardSection />
      </ScrollReveal>
      
      <ScrollReveal>
        <TransparencySection />
      </ScrollReveal>
      
      <ScrollReveal>
        <BudgetTimelineSection />
      </ScrollReveal>
      
      <ScrollReveal>
        <PaymentSection />
      </ScrollReveal>
      
      <Footer />
    </div>
  );
}
