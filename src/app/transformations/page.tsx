import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import MobileStickyBar from '@/components/shared/MobileStickyBar';
import CollageGallery from '@/components/transformations/CollageGallery';
import { getCollageTransformations } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export const metadata = {
    title: 'Our Work | Radikal Creative Transformations',
    description: 'Explore our portfolio of transformations across personal branding, product photography, and creative editing.',
};

export default async function TransformationsPage() {
    const transformations = await getCollageTransformations();

    return (
        <>
            <Navigation />

            <main className="flex-1 bg-black min-h-screen pt-20">
                {/* Header Section - DESKTOP ONLY */}
                {/* User Request: "ON MOBILE: No hero or long description at the top." */}
                <section className="relative py-16 md:py-24 overflow-hidden hidden md:block">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black to-black z-0"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair text-white">
                            The RAdikal <span className="text-[#D4AF37]">Difference</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                            Explore our gallery of transformations. From raw inputs to polished, professional masterpieces.
                            Filter by category to see what we can do for you.
                        </p>
                    </div>
                </section>

                {/* Gallery Section */}
                <CollageGallery transformations={transformations} />
            </main>

            <Footer />
            <WhatsAppFloat />
            <MobileStickyBar />
        </>
    );
}
