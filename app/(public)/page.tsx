import { CTA } from '@/components/Landing/CTA';
import { Features } from '@/components/Landing/Features';
import HeroSection from '@/components/hero-section';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Features />
      <CTA />
    </main>
  );
}
