import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital Wardrobe | Virtual Photography Styling',
    description: 'Explore Radikal\'s expansive digital wardrobe. Our virtual photography technology allows for limitless styling possibilities for your photoshoot in Ghana and Nigeria.',
    keywords: [
        'virtual wardrobe', 'digital fashion', 'photoshoot styling Nigeria',
        'virtual styling Ghana', 'creative studio wardrobe', 'AI fashion styling',
        'professional photoshoot outfits'
    ],
    alternates: {
        canonical: 'https://radikalcreatech.com/wardrobe',
    },
    openGraph: {
        title: 'Digital Wardrobe & Virtual Styling | Radikal Creative Technologies',
        description: 'Limitless styling possibilities for your virtual photoshoot. Choose from our professional digital wardrobe.',
        url: 'https://radikalcreatech.com/wardrobe',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=Digital Wardrobe&subtitle=Curated Styles for Your Perfect Virtual Photoshoot',
                width: 1200,
                height: 630,
                alt: 'Radikal Creative Technologies - Digital Wardrobe',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Digital Wardrobe | Virtual Photography Styling',
        description: 'Limitless styling possibilities for your virtual photoshoot in Ghana and Nigeria.',
        images: ['https://radikalcreatech.com/api/og?title=Digital Wardrobe&subtitle=Curated Styles for Your Perfect Virtual Photoshoot'],
    },
};

export default function WardrobeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
