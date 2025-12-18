// src/app/page.tsx - UPDATED WITH ALL MOBILE OPTIMIZATIONS
import Navigation from '@/components/shared/Navigation';
import Hero from '@/components/homepage/Hero';
import AudienceSplit from '@/components/homepage/AudienceSplit';
import Transformations from '@/components/homepage/Transformations';
import Services from '@/components/homepage/Services';
import Testimonials from '@/components/homepage/Testimonials';
import Process from '@/components/homepage/Process';
import Pillars from '@/components/homepage/Pillars';
import FinalCTA from '@/components/homepage/FinalCTA';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Footer from '@/components/shared/Footer';
import MobileStickyBar from '@/components/shared/MobileStickyBar'; // NEW
import { getTestimonials, getTransformations } from '@/lib/google-sheets';

// Add this to prevent build failures if Google Sheets is down
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Enhanced mock data for better fallback experience
const mockTestimonials = [
  {
    name: "Sarah Mensah",
    category: "Individuals",
    text: "The virtual photoshoot experience was incredible! Professional results without leaving home. The team was so helpful and delivered exactly what I needed for my personal branding.",
    imageUrl: "",
    rating: 5,
    visible: true
  },
  {
    name: "Kwame Appiah",
    category: "Business",
    text: "Radikal transformed our product images and boosted our e-commerce sales by 40%. Their attention to detail and fast turnaround is unmatched in Ghana.",
    imageUrl: "",
    rating: 5,
    visible: true
  },
  {
    name: "Ama Serwaa",
    category: "Creators",
    text: "As a content creator, the white-label services have been game-changing. I can now offer professional photography to my clients without the overhead.",
    imageUrl: "",
    rating: 4.5,
    visible: true
  },
  {
    name: "David Osei",
    category: "WhatsApp",
    text: "The WhatsApp service is so convenient! I got my professional headshots delivered in hours without any complicated process. Highly recommended!",
    imageUrl: "",
    rating: 5,
    visible: true
  },
  {
    name: "Esi Boateng",
    category: "Individuals",
    text: "My graduation photos came out perfectly! The virtual studio made it so easy, and the results looked like they were done in a professional studio.",
    imageUrl: "",
    rating: 5,
    visible: true
  },
  {
    name: "Nana Kwaku",
    category: "Business",
    text: "Our corporate headshots have never looked better. The team understood our brand aesthetic and delivered consistent quality across all team members.",
    imageUrl: "",
    rating: 4.5,
    visible: true
  }
];

const mockTransformations = [
  {
    title: "Professional Headshot Transformation",
    beforeUrl: "https://via.placeholder.com/800x1000/333/fff?text=Before%3A%20Basic%20Selfie",
    afterUrl: "https://via.placeholder.com/800x1000/666/fff?text=After%3A%20Studio%20Quality",
    service: "Personal Branding",
    metrics: "98% Client Satisfaction",
    visible: true
  },
  {
    title: "E-commerce Product Enhancement",
    beforeUrl: "https://via.placeholder.com/800x1000/444/fff?text=Before%3A%20Basic%20Product",
    afterUrl: "https://via.placeholder.com/800x1000/666/fff?text=After%3A%20Professional%20Shot",
    service: "Product Photography",
    metrics: "40% Sales Increase",
    visible: true
  },
  {
    title: "Social Media Content Makeover",
    beforeUrl: "https://via.placeholder.com/800x1000/555/fff?text=Before%3A%20Casual%20Photo",
    afterUrl: "https://via.placeholder.com/800x1000/666/fff?text=After%3A%20Engaging%20Content",
    service: "Social Media",
    metrics: "3x More Engagement",
    visible: true
  }
];

// Performance-optimized data fetching with better error handling
async function fetchData() {
  const startTime = Date.now();

  try {
    // Only fetch in production if credentials exist
    if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {


      const [testimonials, transformations] = await Promise.allSettled([
        getTestimonials(),
        getTransformations()
      ]);

      const fetchTime = Date.now() - startTime;


      // Handle testimonials result
      const finalTestimonials = testimonials.status === 'fulfilled'
        ? testimonials.value
        : (() => {

          return mockTestimonials;
        })();

      // Handle transformations result
      const finalTransformations = transformations.status === 'fulfilled'
        ? transformations.value
        : (() => {

          return mockTransformations;
        })();

      // Validate data structure
      const validatedTestimonials = Array.isArray(finalTestimonials) && finalTestimonials.length > 0
        ? finalTestimonials
        : mockTestimonials;

      const validatedTransformations = Array.isArray(finalTransformations) && finalTransformations.length > 0
        ? finalTransformations
        : mockTransformations;


      return {
        testimonials: validatedTestimonials,
        transformations: validatedTransformations,
        source: testimonials.status === 'fulfilled' && transformations.status === 'fulfilled' ? 'google-sheets' : 'mock-data'
      };
    } else {

      return {
        testimonials: mockTestimonials,
        transformations: mockTransformations,
        source: 'mock-data'
      };
    }
  } catch (error) {

    return {
      testimonials: mockTestimonials,
      transformations: mockTransformations,
      source: 'error-fallback'
    };
  }
}

// Loading component for better UX during data fetching
function LoadingFallback() {
  return (
    <>
      <Navigation />
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="pt-20 min-h-[100dvh] flex items-center justify-center relative overflow-hidden bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <div className="h-12 bg-gray-700 rounded-lg mb-6 mx-auto max-w-2xl animate-pulse"></div>
            <div className="h-6 bg-gray-600 rounded mb-8 mx-auto max-w-md animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="h-12 bg-gray-600 rounded-lg w-48 animate-pulse"></div>
              <div className="h-12 bg-gray-600 rounded-lg w-48 animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Other sections skeleton */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-300 rounded mb-12 mx-auto max-w-md animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default async function Home() {
  // Fetch data with error handling
  const { testimonials, transformations, source } = await fetchData();


  return (
    <>
      <Navigation />
      <main className="flex-1">
        {/* Hero Section - Mobile optimized with 70vh height */}
        <Hero />

        {/* Audience Split - Mobile tabs, desktop grid */}
        <AudienceSplit />

        {/* Transformations - Mobile simplified, desktop full */}
        <Transformations transformations={transformations} />

        {/* Services - Mobile accordion, desktop grid */}
        <Services />

        {/* Testimonials - Mobile swipe carousel, desktop grid */}
        <Testimonials testimonials={testimonials} />

        {/* Process - Mobile accordion steps, desktop grid */}
        <Process />

        {/* Pillars - Mobile simplified icons, desktop cards */}
        <Pillars />

        {/* Final CTA - Hidden on mobile, visible on desktop */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Float */}
      <WhatsAppFloat />

      {/* Mobile Sticky Bar - Only visible on mobile */}
      <MobileStickyBar />
    </>
  );
}

// Enhanced metadata for better SEO
export const metadata = {
  title: 'Radikal Creative Technologies - Virtual Photography Studio',
  description: 'Class • Technology • Future - Professional virtual photoshoots, graphic design, and creative technology solutions in Ghana. Transform your visuals with our premium services.',
  keywords: 'virtual photography, photoshoot Ghana,virtual photoshoot, AI photoshoot, graphic design, video production, creative technology, professional headshots, social media content',
  authors: [{ name: 'Radikal Creative Technologies' }],
  openGraph: {
    title: 'Radikal Creative Technologies - Virtual Photography Studio',
    description: 'Class • Technology • Future - Transforming Visions into Visual Reality',
    type: 'website',
    locale: 'en_GH',
    siteName: 'Radikal Creative Technologies',
    images: [
      {
        url: 'https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Radikal Creative Technologies - Premium Visual Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radikal Creative Technologies',
    description: 'Class • Technology • Future - Virtual Photography Studio',
    images: ['https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Performance optimization hints
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

// Generate static params for better performance
export async function generateStaticParams() {
  return [
    { slug: [''] } // Homepage
  ];
}