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
                url: 'https://radikalcreatech.com/api/og?title=Photography Packages&subtitle=Virtual Photoshoots from %E2%82%B530 %E2%80%A2 Delivered in 1-3 Hours',
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
        images: ['https://radikalcreatech.com/api/og?title=Photography Packages&subtitle=Virtual Photoshoots from %E2%82%B530 %E2%80%A2 Delivered in 1-3 Hours'],
    },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
    // Product Schema with real pricing from both markets + delivery times
    const packageSchema = [
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Virtual Photoshoot Packages - Ghana",
            "description": "Premium virtual photography packages for individuals and groups in Ghana. Photos delivered in 1-3 hours via WhatsApp.",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@type": "Product",
                        "name": "Profile Headshots",
                        "description": "Professional headshots perfect for LinkedIn, CVs, and ID cards. 3 studio-quality images, 1 outfit.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "GHS",
                            "price": "30",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "priceValidUntil": "2026-12-31",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            },
                            "shippingDetails": {
                                "@type": "OfferShippingDetails",
                                "deliveryTime": {
                                    "@type": "ShippingDeliveryTime",
                                    "handlingTime": {
                                        "@type": "QuantitativeValue",
                                        "minValue": 1,
                                        "maxValue": 3,
                                        "unitCode": "HUR"
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@type": "Product",
                        "name": "Solo Standard Collection",
                        "description": "Personal virtual photoshoot with 3 images and 1 outfit. Basic poses with professional editing.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "GHS",
                            "price": "50",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            }
                        }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@type": "Product",
                        "name": "Solo Supreme Collection",
                        "description": "Premium personal photoshoot with 10 images, 3 outfits. Premium creative poses with advanced retouching and priority delivery.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "GHS",
                            "price": "130",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            }
                        }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 4,
                    "item": {
                        "@type": "Product",
                        "name": "Birthday Royal Package",
                        "description": "VIP luxury birthday photoshoot with 9 images, 3 outfits, 2 hairstyles, and custom props. Priority express processing.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "GHS",
                            "price": "100",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            }
                        }
                    }
                }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Virtual Photoshoot Packages - Nigeria",
            "description": "Premium virtual photography packages for individuals and groups in Nigeria. Photos delivered in 1-3 hours via WhatsApp.",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "item": {
                        "@type": "Product",
                        "name": "Profile Headshots",
                        "description": "Professional LinkedIn headshots with 3 studio-quality images. 1 outfit included.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "NGN",
                            "price": "2500",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            }
                        }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "item": {
                        "@type": "Product",
                        "name": "Occupation Shots",
                        "description": "Professional role-based photography for CVs and LinkedIn. 3 images with studio background included.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "NGN",
                            "price": "5000",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            }
                        }
                    }
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "item": {
                        "@type": "Product",
                        "name": "Graduation Shots",
                        "description": "Graduation photography with customized gown and sash. 3 professional images included.",
                        "brand": { "@type": "Brand", "name": "Radikal Creative Technologies" },
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "NGN",
                            "price": "7500",
                            "availability": "https://schema.org/InStock",
                            "url": "https://radikalcreatech.com/individuals/packages",
                            "deliveryLeadTime": {
                                "@type": "QuantitativeValue",
                                "minValue": 1,
                                "maxValue": 3,
                                "unitCode": "HUR"
                            }
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(packageSchema) }}
            />
            {children}
        </>
    );
}
