import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Creative Services & Solutions | Virtual Photography & Design',
    description: 'Explore Radikal\'s full creative arsenal: Virtual Photography, Graphic Design, Motion Graphics, and Advanced Creative Technology for brands in Ghana and Nigeria.',
    keywords: [
        'virtual photoshoots', 'brand identity Ghana', 'logo design Nigeria',
        'social media management Accra', 'motion graphics Lagos', '3D product rendering',
        'corporate branding Ghana', 'creative advertising Africa', 'corporate branding Nigeria'
    ],
    alternates: {
        canonical: 'https://radikalcreatech.com/services',
    },
    openGraph: {
        title: 'Creative Services | Radikal Creative Technologies',
        description: 'Professional visual solutions for Individuals, Businesses, and Creators across West Africa.',
        url: 'https://radikalcreatech.com/services',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=Creative Services %26 Solutions&subtitle=Virtual Photography %E2%80%A2 Graphic Design %E2%80%A2 Motion Graphics',
                width: 1200,
                height: 630,
                alt: 'Radikal Creative Technologies - Creative Services',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Creative Services & Solutions | Radikal',
        description: 'Virtual Photography, Graphic Design, Motion Graphics, and Creative Technology for brands in Ghana and Nigeria.',
        images: ['https://radikalcreatech.com/api/og?title=Creative Services %26 Solutions&subtitle=Virtual Photography %E2%80%A2 Graphic Design %E2%80%A2 Motion Graphics'],
    },
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Comprehensive Service + Product Schema for Rich Snippets
    const schemas = [
        // Main Service schema with offer catalog
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": "https://radikalcreatech.com/services/#service",
            "serviceType": "Creative Agency Services",
            "provider": {
                "@type": "LocalBusiness",
                "@id": "https://radikalcreatech.com/#organization",
                "name": "Radikal Creative Technologies",
                "image": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
                "telephone": `+${process.env.WHATSAPP_NUMBER}`,
                "address": [
                    {
                        "@type": "PostalAddress",
                        "addressLocality": "Accra",
                        "addressCountry": "GH"
                    },
                    {
                        "@type": "PostalAddress",
                        "addressLocality": "Lagos",
                        "addressCountry": "NG"
                    }
                ]
            },
            "areaServed": [
                { "@type": "Country", "name": "Ghana" },
                { "@type": "Country", "name": "Nigeria" }
            ],
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Creative Services",
                "itemListElement": [
                    {
                        "@type": "OfferCatalog",
                        "name": "Virtual Photography & Videography",
                        "itemListElement": [
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Profile Headshots",
                                    "description": "Professional headshots perfect for LinkedIn, CVs, and ID cards. Studio-quality results delivered virtually."
                                },
                                "priceSpecification": [
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "GHS",
                                        "price": "30",
                                        "unitText": "per session"
                                    },
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "NGN",
                                        "price": "2500",
                                        "unitText": "per session"
                                    }
                                ],
                                "availability": "https://schema.org/InStock",
                                "deliveryLeadTime": {
                                    "@type": "QuantitativeValue",
                                    "minValue": 1,
                                    "maxValue": 3,
                                    "unitCode": "HUR"
                                }
                            },
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Solo Photography Collection",
                                    "description": "Personal photoshoot with multiple outfits. Basic to premium creative poses with advanced retouching."
                                },
                                "priceSpecification": [
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "GHS",
                                        "price": "50",
                                        "unitText": "starting from"
                                    },
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "NGN",
                                        "price": "4500",
                                        "unitText": "starting from"
                                    }
                                ],
                                "availability": "https://schema.org/InStock",
                                "deliveryLeadTime": {
                                    "@type": "QuantitativeValue",
                                    "minValue": 1,
                                    "maxValue": 3,
                                    "unitCode": "HUR"
                                }
                            },
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Birthday Photography",
                                    "description": "Celebration photoshoots with themed backgrounds, balloons, party props, and custom styling."
                                },
                                "priceSpecification": [
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "GHS",
                                        "price": "40",
                                        "unitText": "starting from"
                                    },
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "NGN",
                                        "price": "4500",
                                        "unitText": "starting from"
                                    }
                                ],
                                "availability": "https://schema.org/InStock",
                                "deliveryLeadTime": {
                                    "@type": "QuantitativeValue",
                                    "minValue": 1,
                                    "maxValue": 3,
                                    "unitCode": "HUR"
                                }
                            },
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Graduation Photography",
                                    "description": "Professional graduation photos with customized gown, cap, and sash. Perfect for commemorating your achievement."
                                },
                                "priceSpecification": [
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "GHS",
                                        "price": "70",
                                        "unitText": "starting from"
                                    },
                                    {
                                        "@type": "PriceSpecification",
                                        "priceCurrency": "NGN",
                                        "price": "7500",
                                        "unitText": "per session"
                                    }
                                ],
                                "availability": "https://schema.org/InStock",
                                "deliveryLeadTime": {
                                    "@type": "QuantitativeValue",
                                    "minValue": 1,
                                    "maxValue": 3,
                                    "unitCode": "HUR"
                                }
                            }
                        ]
                    },
                    {
                        "@type": "OfferCatalog",
                        "name": "Graphic Design & Brand Identity",
                        "itemListElement": [
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Logo & Brand Identity Design",
                                    "description": "Complete brand visual identity including logos, business stationery, social media templates, and brand guidelines."
                                }
                            },
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Social Media Design & Management",
                                    "description": "Content strategy, post scheduling, multi-platform management, and performance analytics."
                                }
                            }
                        ]
                    },
                    {
                        "@type": "OfferCatalog",
                        "name": "Motion Graphics & Animation",
                        "itemListElement": [
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Promotional & Brand Videos",
                                    "description": "Dynamic video content, brand story videos, product showcases, and character animation."
                                }
                            }
                        ]
                    },
                    {
                        "@type": "OfferCatalog",
                        "name": "Digital Editing Services",
                        "itemListElement": [
                            {
                                "@type": "Offer",
                                "itemOffered": {
                                    "@type": "Service",
                                    "name": "Photo Retouching & Enhancement",
                                    "description": "Background replacement, outfit changes, hairstyle changes, body restructuring, and professional retouching."
                                },
                                "priceSpecification": {
                                    "@type": "PriceSpecification",
                                    "priceCurrency": "GHS",
                                    "price": "10",
                                    "unitText": "starting from"
                                },
                                "availability": "https://schema.org/InStock",
                                "deliveryLeadTime": {
                                    "@type": "QuantitativeValue",
                                    "minValue": 1,
                                    "maxValue": 3,
                                    "unitCode": "HUR"
                                }
                            }
                        ]
                    }
                ]
            }
        },
        // Service Bundles as Product offers
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Service Bundles",
            "description": "Save up to 25% with curated service packages.",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@type": "Product",
                        "name": "Startup Launch Package",
                        "description": "Logo & branding, basic website visuals, and social media setup for new businesses.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "GHS",
                            "price": "6000",
                            "priceValidUntil": "2026-12-31",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/services"
                        }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@type": "Product",
                        "name": "Content Creator Package",
                        "description": "Personal photoshoot, social media templates, intro video, and content planning for creators.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "GHS",
                            "price": "4000",
                            "priceValidUntil": "2026-12-31",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/services"
                        }
                    }
                }
            ]
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
            />
            {children}
        </>
    );
}
