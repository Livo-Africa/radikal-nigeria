import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Radikal | Class • Technology • Future',
    description: 'Discover the story behind Radikal Creative Technologies. We blend artistic excellence with cutting-edge technology to redefine creative possibilities across West Africa.',
    alternates: {
        canonical: 'https://radikalcreatech.com/about',
    },
    openGraph: {
        title: 'About Radikal Creative Technologies',
        description: 'Learn about our mission to transform visions into visual reality using innovative technology.',
        url: 'https://radikalcreatech.com/about',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=About Radikal&subtitle=Class %E2%80%A2 Technology %E2%80%A2 Future',
                width: 1200,
                height: 630,
                alt: 'About Radikal Creative Technologies',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Radikal Creative Technologies',
        description: 'Learn about our mission to transform visions into visual reality using innovative technology.',
        images: ['https://radikalcreatech.com/api/og?title=About Radikal&subtitle=Class %E2%80%A2 Technology %E2%80%A2 Future'],
    },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
