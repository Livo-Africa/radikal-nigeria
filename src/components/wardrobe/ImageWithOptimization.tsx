// components/wardrobe/ImageWithOptimization.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Loader2, ImageOff } from 'lucide-react';

interface ImageWithOptimizationProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function ImageWithOptimization({ 
  src, 
  alt, 
  className = "", 
  width = 400, 
  height = 500,
  priority = false 
}: ImageWithOptimizationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Optimized image URL with CDN parameters
  const optimizedSrc = isInView 
    ? `${src}?w=${width}&h=${height}&fit=crop&auto=format&q=80&fm=webp` 
    : 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // 1x1 transparent pixel

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <ImageOff className="w-8 h-8 mx-auto mb-2" />
            <span className="text-xs">Failed to load</span>
          </div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoading ? 'opacity-0' : 'opacity-100'}
            ${hasError ? 'hidden' : 'block'}
          `}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}