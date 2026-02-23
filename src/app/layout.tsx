//src/app/layout.tsx
import type { Metadata } from 'next';
import { inter, playfair } from './fonts';
import './globals.css';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://radikalcreatech.com'),
  title: {
    default: 'Radikal Creative Technologies | Photography & Motion Graphics',
    template: '%s | Radikal Creative Technologies'
  },
  description: 'Premium Creative Agency in Ghana & Nigeria. Specializing in Virtual Photography, Motion Graphics, Graphic Design, and Brand Identity.',
  keywords: [
    'virtual photography', 'graphic design', 'motion graphics', 'video animation',
    'advertising agency', 'brand identity', 'creative technology', 'Ghana', 'Nigeria',
    'Lagos', 'Accra', 'virtual studio', 'professional headshots', 'digital marketing'
  ],
  authors: [{ name: 'Radikal Creative Technologies' }],
  creator: 'Radikal Creative Technologies',
  openGraph: {
    title: 'Radikal Creative Technologies | Top Agency in Ghana & Nigeria',
    description: 'Transforming Visions into Visual Reality - Premium Virtual Photography, Motion Graphics & Creative Agency.',
    url: 'https://radikalcreatech.com',
    siteName: 'Radikal Creative Technologies',
    locale: 'en_GH',
    alternateLocale: ['en_NG'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radikal Creative Technologies | Creative Agency',
    description: 'Class • Technology • Future - Transforming Visions into Visual Reality across West Africa.',
    creator: '@radikalcreatech',
  },
  alternates: {
    canonical: 'https://radikalcreatech.com',
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
                "url": "https://radikalcreatech.com",
                "logo": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
                "sameAs": [
                  "https://www.instagram.com/radikal.io",
                  "https://wa.me/233207472307"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+233207472307",
                  "contactType": "customer service",
                  "areaServed": ["GH", "NG"],
                  "availableLanguage": "en"
                },
                "description": "Premium virtual photography, graphic design, and creative technology solutions across West Africa."
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