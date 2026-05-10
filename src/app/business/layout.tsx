import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Business Solutions & Corporate Branding | Radikal',
    description: 'Scale your business with high-impact visual content. E-commerce photography, virtual try-ons, motion graphics, and complete brand identity for modern enterprises in Ghana and Nigeria.',
    keywords: ['business photography', 'corporate branding', 'ecommerce visuals', 'motion graphics for business', 'virtual try-on technology', 'product photography Nigeria', 'brand identity Ghana'],
    alternates: {
        canonical: 'https://radikalcreatech.com/business',
    },
    openGraph: {
        title: 'Business Creative Solutions | Radikal Creative Technologies',
        description: 'Advanced visual technology and creative solutions for businesses in Ghana and Nigeria.',
        url: 'https://radikalcreatech.com/business',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=Business Solutions&subtitle=E-commerce Photography %E2%80%A2 Corporate Branding %E2%80%A2 Motion Graphics',
                width: 1200,
                height: 630,
                alt: 'Radikal Creative Technologies - Business Solutions',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Business Solutions & Corporate Branding | Radikal',
        description: 'High-impact visual content and brand identity for businesses across West Africa.',
        images: ['https://radikalcreatech.com/api/og?title=Business Solutions&subtitle=E-commerce Photography %E2%80%A2 Corporate Branding %E2%80%A2 Motion Graphics'],
    },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
