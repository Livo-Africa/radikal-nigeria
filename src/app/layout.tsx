// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { inter, playfair } from './fonts'; // ADD THIS LINE


export const metadata: Metadata = {
  title: 'Radikal Creative Technologies',
  description: 'Class • Technology • Future - Transforming Visions into Visual Reality',
  keywords: 'photography, graphic design, video production, creative technology, Ghana',
  authors: [{ name: 'Radikal Creative Technologies' }],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}> {/* CHANGE THIS LINE */}
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