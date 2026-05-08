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
                url: 'https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg',
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
        images: ['https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg'],
    },
};

export default function IndividualsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
