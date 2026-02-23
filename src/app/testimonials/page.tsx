import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import MobileStickyBar from '@/components/shared/MobileStickyBar';
import TestimonialsGallery from '@/components/testimonials/TestimonialsGallery';
import { getAllTestimonials } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata = {
    title: 'Client Reviews & Testimonials | Radikal Creative',
    description: 'Read 5-star reviews from our clients across Ghana and Nigeria. See why top brands trust Radikal for their creative technology and virtual photography needs.',
    keywords: ['Radikal reviews', 'creative agency testimonials', 'virtual photography reviews', 'client stories Africa'],
    openGraph: {
        title: 'Client Reviews & Stories | Radikal Creative Technologies',
        description: 'Read 5-star reviews from our clients across Ghana and Nigeria.',
        url: 'https://radikalcreatech.com/testimonials',
    },
};

export default async function TestimonialsPage() {
    const testimonials = await getAllTestimonials();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Radikal Creative Technologies",
                        "url": "https://radikalcreatech.com",
                        "image": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "120"
                        },
                        "review": [
                            {
                                "@type": "Review",
                                "author": { "@type": "Person", "name": "Sarah Mensah" },
                                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                                "reviewBody": "The virtual photoshoot experience was incredible! Professional results without leaving home."
                            },
                            {
                                "@type": "Review",
                                "author": { "@type": "Person", "name": "Kwame Appiah" },
                                "reviewRating": { "@type": "Rating", "ratingValue": "5" },
                                "reviewBody": "Radikal transformed our product images and boosted our e-commerce sales by 40%."
                            }
                        ]
                    })
                }}
            />
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
