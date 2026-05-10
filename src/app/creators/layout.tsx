import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Solutions for Creators & Agencies | Radikal',
    description: 'Empower your creative process with Radikal. White-label photography, high-end photo enhancement, and concept development for content creators and agencies across West Africa.',
    keywords: ['creators solutions', 'agency white label', 'photo enhancement', 'content creator tools', 'creative partnership', 'creator services Ghana', 'white-label photography Nigeria'],
    alternates: {
        canonical: 'https://radikalcreatech.com/creators',
    },
    openGraph: {
        title: 'Creative Solutions for Content Creators | Radikal Creative Technologies',
        description: 'White-label services and creative tools for West African creators and agencies.',
        url: 'https://radikalcreatech.com/creators',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=For Creators %26 Agencies&subtitle=White-Label Photography %E2%80%A2 Photo Enhancement %E2%80%A2 Creative Tools',
                width: 1200,
                height: 630,
                alt: 'Radikal Creative Technologies - Creator Solutions',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Solutions for Creators & Agencies | Radikal',
        description: 'White-label photography and creative tools for content creators and agencies.',
        images: ['https://radikalcreatech.com/api/og?title=For Creators %26 Agencies&subtitle=White-Label Photography %E2%80%A2 Photo Enhancement %E2%80%A2 Creative Tools'],
    },
};

export default function CreatorsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
