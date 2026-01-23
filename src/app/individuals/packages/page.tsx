// src/app/individuals/packages/page.tsx
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import AllPackagesGrid from '@/components/individuals/AllPackagesGrid';

export default function PackagesPage() {
    return (
        <>
            <Navigation />
            <main className="flex-1 pt-20">
                <AllPackagesGrid />
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    );
}

export const metadata = {
    title: 'All Packages - Radikal Creative Technologies',
    description: 'Browse all our virtual photoshoot packages for Ghana and Nigeria. From solo portraits to group sessions, find the perfect package for your needs.',
    keywords: 'virtual photoshoot packages, Ghana photography prices, Nigeria photography prices, professional headshots, birthday photos, group photos',
    openGraph: {
        title: 'All Packages - Radikal',
        description: 'Browse all our virtual photoshoot packages for Ghana and Nigeria.',
        type: 'website',
        locale: 'en_GH',
    },
};
