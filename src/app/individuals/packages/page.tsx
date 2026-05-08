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
    alternates: {
        canonical: 'https://radikalcreatech.com/individuals/packages',
    },
    openGraph: {
        title: 'All Packages - Radikal',
        description: 'Browse all our virtual photoshoot packages for Ghana and Nigeria.',
        type: 'website',
        url: 'https://radikalcreatech.com/individuals/packages',
        locale: 'en_GH',
        images: [
            {
                url: 'https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Radikal Creative Technologies - Photography Packages',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'All Packages - Radikal Creative Technologies',
        description: 'Virtual photoshoot packages for Ghana and Nigeria.',
        images: ['https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg'],
    },
};
