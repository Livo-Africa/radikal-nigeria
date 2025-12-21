// src/components/individuals/TransformationsGallery.tsx - TYPE-SAFE VERSION
'use client';
import { useState, useEffect, useRef } from 'react';

// Create a more flexible type for the individuals page
interface GalleryTransformation {
  title?: string;
  beforeUrl: string;
  afterUrl: string;
  service?: string;
  metrics?: string;
  visible?: boolean;
}

export default function TransformationsGallery({ transformations = [] }: { transformations?: GalleryTransformation[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, []);

  // FIXED: Handle transformations with optional fields
  const personalTransformations = transformations
    .filter(transform => {
      // Skip if explicitly set to not visible
      if (transform.visible === false) return false;

      // Must have both URLs
      if (!transform.beforeUrl || !transform.afterUrl) return false;

      // Check service type for personal/individual
      const service = transform.service?.toLowerCase() || '';
      return service.includes('personal') || service.includes('individual');
    })
    .map(transform => ({
      // Provide defaults for optional fields
      title: transform.title || 'Personal Transformation',
      beforeUrl: transform.beforeUrl,
      afterUrl: transform.afterUrl,
      service: transform.service || 'Personal',
      metrics: transform.metrics || '',
      visible: transform.visible !== false,
    }));

  // Preload current images
  useEffect(() => {
    if (!isMounted || personalTransformations.length === 0) return;

    const current = personalTransformations[currentIndex];
    if (!current) return;

    const beforeKey = `${currentIndex}-before`;
    if (!imageCacheRef.current.has(beforeKey)) {
      const beforeImg = new Image();
      beforeImg.src = current.beforeUrl;
      imageCacheRef.current.set(beforeKey, beforeImg);
    }

    const afterKey = `${currentIndex}-after`;
    if (!imageCacheRef.current.has(afterKey)) {
      const afterImg = new Image();
      afterImg.src = current.afterUrl;
      imageCacheRef.current.set(afterKey, afterImg);
    }
  }, [currentIndex, personalTransformations, isMounted]);

  // Auto-rotate logic
  useEffect(() => {
    if (!isMounted || personalTransformations.length === 0) return;

    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);

    autoPlayTimerRef.current = setTimeout(() => {
      setIsTransitioning(true);

      requestAnimationFrame(() => {
        if (showAfter) {
          setCurrentIndex((current) => (current + 1) % personalTransformations.length);
          setShowAfter(false);
        } else {
          setShowAfter(true);
        }

        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      });
    }, 3000);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [showAfter, personalTransformations.length, isMounted]);

  // Handle Loading State
  if (!isMounted) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair text-white">
            Individual Results
          </h2>
          <div className="animate-pulse flex justify-center">
            <div className="h-96 w-full max-w-4xl bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  // Handle Empty State
  if (personalTransformations.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair text-white">
            Individual Results
          </h2>
          <p className="text-gray-400">No individual transformations available at the moment.</p>
        </div>
      </section>
    );
  }

  const currentTransform = personalTransformations[currentIndex];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-playfair text-white">
          Individual Results
        </h2>

        {/* Transformation Display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gray-700 bg-gray-900 shadow-2xl">

            {/* Before Image */}
            <div className={`absolute inset-0 ${showAfter ? 'hidden' : 'block'}`}>
              <img
                src={currentTransform.beforeUrl}
                alt="Before transformation"
                className="w-full h-full object-cover"
                loading="eager"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.opacity = '1';
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1000/333/fff?text=Before+Image+Not+Found';
                  (e.target as HTMLImageElement).style.opacity = '1';
                }}
                style={{
                  opacity: 0,
                  transition: isTransitioning ? 'opacity 0.5s ease-in-out' : 'none'
                }}
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm z-10">
                BEFORE
              </div>
            </div>

            {/* After Image */}
            <div className={`absolute inset-0 ${showAfter ? 'block' : 'hidden'}`}>
              <img
                src={currentTransform.afterUrl}
                alt="After transformation"
                className="w-full h-full object-cover"
                loading="eager"
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.opacity = '1';
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1000/666/fff?text=After+Image+Not+Found';
                  (e.target as HTMLImageElement).style.opacity = '1';
                }}
                style={{
                  opacity: 0,
                  transition: isTransitioning ? 'opacity 0.5s ease-in-out' : 'none'
                }}
              />
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-lg font-bold text-sm z-10">
                AFTER
              </div>
            </div>

            {/* Loading Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center bg-gray-900 transition-opacity duration-300 ${isTransitioning ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col items-center">
                <div className="inline-block h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#D4AF37] text-sm">Loading...</p>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {personalTransformations.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isTransitioning) return;
                  setCurrentIndex(index);
                  setShowAfter(false);
                }}
                className={`.dot-indicator w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/50'
                  : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                aria-label={`View transformation ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>

          {/* Manual Toggle Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (isTransitioning) return;
                setShowAfter(!showAfter);
              }}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors border border-gray-600"
              disabled={isTransitioning}
            >
              {showAfter ? (
                <>
                  <span>Show Before</span>
                </>
              ) : (
                <>
                  <span>Show After</span>
                </>
              )}
            </button>
          </div>

          {/* View All Transformations Link */}
          <div className="text-center mt-8">
            <a
              href="/transformations"
              className="inline-block bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors border border-[#D4AF37]"
            >
              View All Transformations →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}