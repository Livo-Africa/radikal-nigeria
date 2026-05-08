import { Metadata } from 'next';

export const metadata: Metadata = {
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

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
    // Generate Product Schema for Packages
    const packageSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Virtual Photoshoot Packages",
        "description": "Premium virtual photography packages for individuals and groups in Ghana and Nigeria.",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Product",
                    "name": "Basic Individual Package",
                    "description": "Professional studio-quality headshots and portraits delivered virtually.",
                    "brand": { "@type": "Brand", "name": "Radikal" },
                    "offers": {
                        "@type": "AggregateOffer",
                        "priceCurrency": "GHS",
                        "lowPrice": "40",
                        "highPrice": "200"
                    }
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Product",
                    "name": "Group & Family Package",
                    "description": "Studio-quality group photos and family portraits.",
                    "brand": { "@type": "Brand", "name": "Radikal" },
                    "offers": {
                        "@type": "AggregateOffer",
                        "priceCurrency": "GHS",
                        "lowPrice": "100",
                        "highPrice": "500"
                    }
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(packageSchema) }}
            />
            {children}
        </>
    );
}
