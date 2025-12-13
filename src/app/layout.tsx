import type { Metadata } from 'next';
import { inter, playfair } from './fonts';
import './globals.css';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: 'Radikal Creative Technologies',
  description: 'Class • Technology • Future - Transforming Visions into Visual Reality',
  keywords: 'photography, graphic design, video production, creative technology, Ghana',
  authors: [{ name: 'Radikal Creative Technologies' },
  { name: 'Kelvin Quaicoo' }
  ],
  openGraph: {
    title: 'Radikal Creative Technologies',
    description: 'Class • Technology • Future - Transforming Visions into Visual Reality',
    type: 'website',
    locale: 'en_GH',
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
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col pt-16">
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}