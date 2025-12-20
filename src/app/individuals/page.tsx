// src/app/individuals/page.tsx
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import FAQSection from '@/components/individuals/FAQSection';
import FinalCTA from '@/components/individuals/FinalCTA';
import TransformationsGallery from '@/components/individuals/TransformationsGallery';

// Mobile Components
import MobileHeader from '@/components/individuals/MobileHeader';
import PackageCarousel from '@/components/individuals/PackageCarousel';
import ProcessAccordion from '@/components/individuals/ProcessAccordion';
import StickyBottomBar from '@/components/individuals/StickyBottomBar';

// Desktop Components (for larger screens)
import HeroSection from '@/components/individuals/HeroSection';
import PackageShowcase from '@/components/individuals/PackageShowcase';
import ProcessSection from '@/components/individuals/ProcessSection';

import { getTransformations } from '@/lib/google-sheets';

// Mock transformations
const mockTransformations = [
  {
    beforeUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=600&fit=crop",
    service: "Personal Branding",
    visible: true
  },
  {
    beforeUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=500&h=600&fit=crop",
    service: "Personal Branding",
    visible: true
  },
  {
    beforeUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=600&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop",
    service: "Personal Branding",
    visible: true
  }
];

async function fetchTransformations() {
  try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const transformations = await getTransformations();
      return transformations && transformations.length > 0 ? transformations : mockTransformations;
    }
    return mockTransformations;
  } catch (error) {
    return mockTransformations;
  }
}

export default async function IndividualsPage() {
  const transformations = await fetchTransformations();

  return (
    <>
      <Navigation />
      <main className="flex-1">
        {/* Mobile View (hidden on desktop) */}
        <div className="block md:hidden">
          {/* <MobileHeader /> */}
          <div id="packages">
            <PackageCarousel />
          </div>
          <ProcessAccordion />
          <TransformationsGallery transformations={transformations} />
          <FAQSection />
          {/* <FinalCTA /> */}
          <StickyBottomBar />
        </div>

        {/* Desktop View (hidden on mobile) */}
        <div className="hidden md:block">
          <HeroSection />
          <PackageShowcase />
          <ProcessSection />
          <TransformationsGallery transformations={transformations} />
          <FAQSection />
          <FinalCTA />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

export const metadata = {
  title: 'Virtual Photoshoots for Individuals - Radikal Creative Technologies',
  description: 'Professional virtual photoshoots for individuals in Ghana. Headshots, graduation photos, social media content, and personal branding without the studio hassle.',
  keywords: 'virtual photoshoot Ghana, professional headshots, graduation photos, personal branding, social media content, WhatsApp photoshoot',
  openGraph: {
    title: 'Virtual Photoshoots for Individuals - Radikal',
    description: 'Professional photos without the studio. Perfect for LinkedIn, social media, and personal branding.',
    type: 'website',
    locale: 'en_GH',
  },
};