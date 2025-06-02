import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { LiveDemoSection } from "@/components/sections/live-demo";
import { FeaturesSection } from "@/components/sections/features";
import { PricingSection } from "@/components/sections/pricing";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { FaqSection } from "@/components/sections/faq-section";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <LiveDemoSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <Footer />
    </main>
  );
}