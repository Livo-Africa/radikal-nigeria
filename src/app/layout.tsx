//src/app/layout.tsx
import type { Metadata } from 'next';
import { inter, playfair } from './fonts';
import './globals.css';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://radikalcreatech.com'),
  title: {
    default: 'Radikal Creative Technologies | AI Photography & Virtual Studio',
    template: '%s | Radikal Creative Technologies'
  },
  description: 'Radikal Creative Technologies is a premium creative agency across West Africa specializing in virtual photography, motion graphics, and brand identity. We transform your creative visions into stunning visual reality through innovative technology and world-class design.',
  keywords: [
    'virtual photography', 'graphic design', 'motion graphics', 'video animation',
    'advertising agency', 'brand identity', 'creative technology', 'Ghana', 'Nigeria',
    'Lagos', 'Accra', 'virtual studio', 'professional headshots', 'digital marketing',
    'AI Photography', 'AI photography in Ghana', 'AI photography in Nigeria', 'AI studio',
    'Virtual photography in Ghana', 'virtual photography in Nigeria', 'virtual photography in Kenya',
    'Creative technology company in Ghana', 'Creative technology company in Nigeria', 'Creative technology company in Kenya',
    'Best creative technology company in Ghana', 'Best creative technology company in Nigeria', 'Best creative technology company in Kenya',
    'Top creative technology company in Ghana', 'Top creative technology company in Nigeria', 'Top creative technology company in Kenya',
    'AI photo studio', 'best AI photo studio in Ghana',
    'best AI photo studio in Nigeria',
    'best AI photo studio in Kenya', 'AI photoshoots in Ghana', 'AI photoshoots in Nigeria', 'AI photoshoots in Kenya', 'AI photography studio in Ghana', 'AI photography studio in Nigeria', 'AI photography studio in Kenya', 'AI portrait studio in Ghana', 'AI portrait studio in Nigeria', 'AI portrait studio in Kenya',
    'Best AI studio', 'Best AI photography company', 'Best virtual photography studio', 'Best creative technology studio',
    'How to create AI images', 'Create AI images online',
    'How to create AI photos',
    'How to create AI portraits',
    'How to create AI headshots',
    'How to create AI fashion',
    'How to create AI models',
    'What is AI photography',
    'What is virtual photography',
    'What is AI studio',
    'What is virtual studio',
    'How to create AI images',
    'How to create AI photos',
    'How to create AI portraits',
    'How to create AI headshots',
    'How to create AI fashion',
    'How to create AI models',
    'What is AI photography',
    'What is virtual photography',
    'What is AI studio',
    'What is virtual studio',],
  authors: [{ name: 'Radikal Creative Technologies' }],
  creator: 'Radikal Creative Technologies',
  publisher: 'Radikal Creative Technologies',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Radikal Creative Technologies | Top Agency in Ghana & Nigeria',
    description: 'Transforming Visions into Visual Reality - Premium Virtual Photography, Motion Graphics & Creative Agency.',
    url: 'https://radikalcreatech.com',
    siteName: 'Radikal Creative Technologies',
    locale: 'en_GH',
    alternateLocale: ['en_NG'],
    type: 'website',
    images: [
      {
        url: 'https://radikalcreatech.com/api/og?title=AI Photography %26 Virtual Studio&subtitle=Premium Creative Agency in Ghana %26 Nigeria',
        width: 1200,
        height: 630,
        alt: 'Radikal Creative Technologies - AI Photography & Virtual Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radikal Creative Technologies | Creative Agency',
    description: 'Virtual Photography Studio transforming visuals across Ghana, Nigeria, Kenya and more.',
    images: ['https://radikalcreatech.com/api/og?title=AI Photography %26 Virtual Studio&subtitle=Premium Creative Agency in Ghana %26 Nigeria'],
  },
  alternates: {
    canonical: 'https://radikalcreatech.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased bg-white text-black overflow-x-hidden`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Radikal Creative Technologies",
                "alternateName": "Radikal Createch",
                "url": "https://radikalcreatech.com",
                "logo": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
                "description": "Radikal Creative Technologies is a premium creative agency specializing in virtual photography, motion graphics, and brand identity across West Africa.",
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
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": `+${process.env.WHATSAPP_NUMBER}`,
                  "contactType": "customer service",
                  "areaServed": ["GH", "NG"],
                  "availableLanguage": "en"
                },
                "sameAs": [
                  "https://www.instagram.com/radikal_creativetechnologies/",
                  "https://tiktok.com/@radikalcreatechnology",
                  "https://facebook.com/radikalcreativetechnologies",
                  `https://wa.me/${process.env.WHATSAPP_NUMBER}`
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Radikal Creative Technologies (Ghana)",
                "image": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "GH",
                  "addressLocality": "Accra"
                },
                "telephone": `+${process.env.WHATSAPP_NUMBER}`,
                "url": "https://radikalcreatech.com"
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Radikal Creative Technologies (Nigeria)",
                "image": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "NG",
                  "addressLocality": "Lagos"
                },
                "url": "https://radikalcreatech.com"
              }
            ])
          }}
        />
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col pt-16">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}