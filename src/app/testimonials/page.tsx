import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import MobileStickyBar from '@/components/shared/MobileStickyBar';
import TestimonialsGallery from '@/components/testimonials/TestimonialsGallery';
import { getAllTestimonials } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata = {
    title: 'Client Stories | Radikal Creative Technologies',
    description: 'Read what our clients say about their experience with Radikal. Real results, real stories.',
};

export default async function TestimonialsPage() {
    const testimonials = await getAllTestimonials();

    return (
        <>
            <Navigation />

            <main className="flex-1 bg-white min-h-screen pt-20">
                {/* Header Section */}
                <section className="relative py-16 md:py-24 overflow-hidden bg-black text-white">
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
                            Client <span className="text-[#D4AF37]">Stories</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                            Don't just take our word for it. See what our community has to say about the Radikal experience.
                        </p>
                    </div>
                </section>

                {/* Gallery Section */}
                <TestimonialsGallery testimonials={testimonials} />
            </main>

            <Footer />
            <WhatsAppFloat />
            <MobileStickyBar />
        </>
    );
}
