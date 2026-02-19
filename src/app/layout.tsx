//src/app/layout.tsx
import type { Metadata } from 'next';
import { inter, playfair } from './fonts';
import './globals.css';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL('https://radikalcreatech.com'),
  title: {
    default: 'Radikal Creative Technologies',
    template: '%s | Radikal Creative Technologies'
  },
  description: 'Class • Technology • Future - Transforming Visions into Visual Reality across West Africa.',
  keywords: [
    'virtual photography', 'graphic design', 'motion graphics', 'video animation',
    'advertising agency', 'brand identity', 'creative technology', 'Ghana', 'Nigeria',
    'Lagos', 'Accra', 'virtual studio', 'professional headshots', 'digital marketing'
  ],
  authors: [{ name: 'Radikal Creative Technologies' }, { name: 'Kelvin Quaicoo' }],
  creator: 'Radikal Creative Technologies',
  openGraph: {
    title: 'Radikal Creative Technologies',
    description: 'Transforming Visions into Visual Reality - Premium Creative Agency in Ghana & Nigeria',
    url: 'https://radikalcreatech.com',
    siteName: 'Radikal Creative Technologies',
    locale: 'en_GH',
    alternateLocale: ['en_NG'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Radikal Creative Technologies',
    description: 'Class • Technology • Future - Transforming Visions into Visual Reality',
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Radikal Creative Technologies",
              "url": "https://radikalcreatech.com",
              "logo": "https://i.postimg.cc/3NNYCZgm/radikal-logo.jpg",
              "sameAs": [
                "https://www.instagram.com/radikal.io",
                "https://wa.me/2349027065853"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+2349027065853",
                "contactType": "customer service",
                "areaServed": ["GH", "NG"],
                "availableLanguage": "en"
              },
              "description": "Premium virtual photography, graphic design, and creative technology solutions across West Africa."
            })
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