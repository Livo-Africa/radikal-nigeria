import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import HeroSection from '@/components/business/HeroSection';
import ServicesShowcase from '@/components/business/ServicesShowcase';
import ProcessTimeline from '@/components/business/ProcessTimeline';
import ResultsMetrics from '@/components/business/ResultsMetrics';
import BusinessFAQ from '@/components/business/BusinessFAQ';
import BusinessCTA from '@/components/business/BusinessCTA';

export default function BusinessPage() {
  return (
    <>
      {/* Navigation Layer */}
      <Navigation />

      {/* Main Content Layer */}
      <main className="flex-1 bg-black">
        <HeroSection />
        <ServicesShowcase />
        <ProcessTimeline />
        <ResultsMetrics />
        <BusinessFAQ />
        <BusinessCTA />
      </main>

      {/* Footer & Float */}
      <Footer />
      <WhatsAppFloat />
    </>
  );
}