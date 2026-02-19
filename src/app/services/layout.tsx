import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Creative Services',
    description: 'Explore Radikal\'s full creative arsenal: Virtual Photography, Graphic Design, Motion Graphics, and Advanced Creative Technology for brands in Ghana and Nigeria.',
    keywords: [
        'virtual photoshoots', 'logo design Nigeria', 'brand identity Ghana',
        'motion graphics Lagos', '3D product rendering', 'social media management Accra',
        'creative advertising Africa', 'corporate branding Nigeria'
    ],
    openGraph: {
        title: 'Creative Services | Radikal Creative Technologies',
        description: 'Professional visual solutions for Individuals, Businesses, and Creators across West Africa.',
        url: 'https://radikalcreatech.com/services',
    },
};

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
