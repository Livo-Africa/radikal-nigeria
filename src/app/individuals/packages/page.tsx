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

