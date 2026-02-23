// src/components/shared/OptimizedImage.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

// Tiny shimmer SVG placeholder for blur effect
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f3f4f6" offset="20%" />
      <stop stop-color="#e5e7eb" offset="50%" />
      <stop stop-color="#f3f4f6" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f3f4f6" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

/**
 * Transform Cloudinary URLs to serve optimized thumbnails.
 * Appends resize/format params so the CDN delivers a smaller image.
 */
function getOptimizedSrc(src: string, width: number, height: number): string {
  if (!src) return src;

  // Cloudinary: insert transformation before the upload path
  if (src.includes('res.cloudinary.com')) {
    // Pattern: https://res.cloudinary.com/<cloud>/image/upload/<version>/<path>
    // Insert transforms after /upload/
    return src.replace(
      /\/upload\//,
      `/upload/c_fill,w_${width},h_${height},q_auto,f_auto/`
    );
  }

  // Unsplash: use URL params
  if (src.includes('images.unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('h', String(height));
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('q', '80');
    url.searchParams.set('fm', 'webp');
    return url.toString();
  }

  return src;
}

export default function OptimizedImage({
  src,
  alt,
  className = "",
  width = 400,
  height = 533,
  priority = false,
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  const optimizedSrc = getOptimizedSrc(src, width, height);

  if (error || !src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-xs text-gray-500 text-center">Failed to load image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={80}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
        className="object-cover transition-opacity duration-300"
        onError={() => setError(true)}
      />
    </div>
  );
}