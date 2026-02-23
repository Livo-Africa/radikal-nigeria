import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Creative Services & Solutions | Virtual Photography & Design',
    description: 'Explore Radikal\'s full creative arsenal: Virtual Photography, Graphic Design, Motion Graphics, and Advanced Creative Technology for brands in Ghana and Nigeria.',
    keywords: [
        'virtual photoshoots', 'logo design Nigeria', 'brand identity Ghana',
        'motion graphics Lagos', '3D product rendering', 'social media management Accra',
        'creative advertising Africa', 'corporate branding Nigeria'
    ],
    openGraph: {
        title: 'Creative Services | Radikal Creative Technologies',
        description: 'Professional visual solutions for Individuals, Businesses, and Creators across West Africa.',
        url: 'https://radikalcreatech.com/services',
    },
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Generate Service Schema for Rich Snippets
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Creative Agency Services",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Radikal Creative Technologies",
            "image": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg"
        },
        "areaServed": [
            { "@type": "Country", "name": "Nigeria" },
            { "@type": "Country", "name": "Ghana" }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Creative Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Virtual Photography & Videography"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Graphic Design & Brand Identity"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Motion Graphics & Animation"
                    }
                }
            ]
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
            />
            {children}
        </>
    );
}
