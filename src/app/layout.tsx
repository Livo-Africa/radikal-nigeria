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
    default: 'Radikal Creative Technologies | Photography & Motion Graphics Studio',
    template: '%s | Radikal Creative Technologies'
  },
  description: 'Radikal Creative Technologies is a premium creative agency across West Africa specializing in virtual photography, motion graphics, and brand identity. We transform your creative visions into stunning visual reality through innovative technology and world-class design.',
  keywords: [
    'virtual photography', 'graphic design', 'motion graphics', 'video animation',
    'advertising agency', 'brand identity', 'creative technology', 'Ghana', 'Nigeria',
    'Lagos', 'Accra', 'virtual studio', 'professional headshots', 'digital marketing'
  ],
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
        url: 'https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Radikal Creative Technologies Branding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radikal Creative Technologies | Creative Agency',
    description: 'Virtual Photography Studio transforming visuals across Africa.',
    images: ['https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg'],
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
                    "addressLocality": "Lagos",
                    "addressCountry": "NG"
                  },
                  {
                    "@type": "PostalAddress",
                    "addressLocality": "Accra",
                    "addressCountry": "GH"
                  }
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+233207472307",
                  "contactType": "customer service",
                  "areaServed": ["GH", "NG"],
                  "availableLanguage": "en"
                },
                "sameAs": [
                  "https://www.instagram.com/radikal_creativetechnologies/",
                  "https://tiktok.com/@radikalcreatechnology",
                  "https://facebook.com/radikalcreativetechnologies",
                  "https://wa.me/233207472307"
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
                "telephone": "+233207472307",
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
                "telephone": "+233207472307",
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