import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Get in Touch with Radikal',
    description: 'Ready to transform your vision into reality? Contact Radikal Creative Technologies today for virtual photography, design, and motion graphics inquiries in Ghana and Nigeria.',
    alternates: {
        canonical: 'https://radikalcreatech.com/contact',
    },
    openGraph: {
        title: 'Contact Radikal Creative Technologies',
        description: 'Get in touch for premium creative solutions in Ghana, Nigeria, and beyond.',
        url: 'https://radikalcreatech.com/contact',
        images: [
            {
                url: 'https://radikalcreatech.com/api/og?title=Get in Touch&subtitle=Let%27s Transform Your Vision into Reality',
                width: 1200,
                height: 630,
                alt: 'Contact Radikal Creative Technologies',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Radikal Creative Technologies',
        description: 'Get in touch for premium creative solutions in Ghana, Nigeria, and beyond.',
        images: ['https://radikalcreatech.com/api/og?title=Get in Touch&subtitle=Let%27s Transform Your Vision into Reality'],
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
