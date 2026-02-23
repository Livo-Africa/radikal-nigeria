import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Digital Wardrobe | Virtual Photography Styling',
    description: 'Explore Radikal\'s expansive digital wardrobe. Our virtual photography technology allows for limitless styling possibilities for your photoshoot in Ghana and Nigeria.',
    keywords: [
        'virtual wardrobe', 'digital fashion', 'photoshoot styling Nigeria',
        'virtual styling Ghana', 'creative studio wardrobe', 'AI fashion styling',
        'professional photoshoot outfits'
    ],
    openGraph: {
        title: 'Digital Wardrobe & Virtual Styling | Radikal Creative Technologies',
        description: 'Limitless styling possibilities for your virtual photoshoot. Choose from our professional digital wardrobe.',
        url: 'https://radikalcreatech.com/wardrobe',
    },
};

export default function WardrobeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
