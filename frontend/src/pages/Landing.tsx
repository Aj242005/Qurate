import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MacbookScroll from '@/components/landing/MacbookScroll';
import FeaturesGrid from '@/components/landing/FeaturesGrid';
import StatsSection from '@/components/landing/StatsSection';
import FooterCTA from '@/components/landing/FooterCTA';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <HeroSection />
      <MacbookScroll />
      <FeaturesGrid />
      <StatsSection />
      <FooterCTA />
    </div>
  );
}
