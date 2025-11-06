// src/app/fonts.ts
import localFont from 'next/font/local';

// Define Inter font
export const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter-var.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

// Define Playfair Display font
export const playfair = localFont({
  src: [
    {
      path: '../../public/fonts/playfair-var.woff2', 
      weight: '400 900',
      style: 'normal',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
});