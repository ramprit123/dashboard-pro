import { Hero } from '@/components/Landing/Hero';
import { Features } from '@/components/Landing/Features';
import { CTA } from '@/components/Landing/CTA';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}
