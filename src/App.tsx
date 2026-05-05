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

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-emerald-200 overflow-x-hidden">
      <Header />
      <HeroSection />
      
      {/* Thêm phần chạy ngang text ở giữa */}
      <SponsorMarquee />

      <FootballFieldSection />

      <TournamentGallerySection />

      <LeaderboardSection />
      <TransparencySection />
      <BudgetTimelineSection />
      <PaymentSection />
      <Footer />
    </div>
  );
}
