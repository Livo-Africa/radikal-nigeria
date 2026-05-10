import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Individual Photography & Personal Branding | Radikal',
    description: 'Elevate your personal brand with studio-quality virtual photography. Professional headshots, creative portraits, and social media content delivered in hours across Ghana and Nigeria.',
    keywords: ['virtual photography', 'professional headshots', 'personal branding', 'creative portraits', 'online photoshoot', 'virtual photoshoot Ghana', 'professional headshots Nigeria'],
    alternates: {
        canonical: 'https://radikalcreatech.com/individuals',
    },
    openGraph: {
        title: 'Individual Creative Solutions | Radikal Creative Technologies',
        description: 'Premium virtual photography and personal branding for individuals across West Africa.',
        url: 'https://radikalcreatech.com/individuals',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=Personal Photography&subtitle=Professional Headshots %E2%80%A2 Creative Portraits %E2%80%A2 Delivered in Hours',
                width: 1200,
                height: 630,
                alt: 'Radikal Creative Technologies - Individual Photography',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Individual Photography & Personal Branding | Radikal',
        description: 'Professional virtual photoshoots for individuals. Headshots, portraits, and social media content.',
        images: ['https://radikalcreatech.com/api/og?title=Personal Photography&subtitle=Professional Headshots %E2%80%A2 Creative Portraits %E2%80%A2 Delivered in Hours'],
    },
};

export default function IndividualsLayout({ children }: { children: React.ReactNode }) {
    // Generate FAQ Schema for Rich Snippets
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How does the virtual photoshoot work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply choose your package, upload your selfies or photos, select your preferred styles and outfits from our virtual wardrobe, and we'll transform them into studio-quality professional photos delivered directly to your WhatsApp in 1-3 hours."
                }
            },
            {
                "@type": "Question",
                "name": "What kind of photos should I upload?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Upload clear, well-lit selfies or photos taken against a plain background. Make sure your face is clearly visible and you're not wearing hats or sunglasses that obscure your features."
                }
            },
            {
                "@type": "Question",
                "name": "How long does delivery take?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most orders are delivered within 1-3 hours. We offer rush delivery options (1 hour or less) for an additional fee if you need your photos urgently."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use these photos for professional purposes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely! Our photos are perfect for LinkedIn profiles, professional portfolios, business websites, and corporate branding."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            {children}
        </>
    );
}

