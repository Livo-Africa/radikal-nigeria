// src/components/individuals/TransformationsGallery.tsx - FIXED
'use client';
import { useState, useEffect } from 'react';

export default function TransformationsGallery({ transformations = [] }: { transformations?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter transformations logic - FIXED: Removed broken 'category' check
  const personalTransformations = transformations.filter(transform => {
    // Must have images
    if (!transform.beforeUrl || !transform.afterUrl) return false;

    // Check service type
    const service = transform.service?.toLowerCase() || '';
    return service.includes('personal') || service.includes('individual');
  });

  // Auto-rotate logic - FIXED: Toggles view instead of just index
  useEffect(() => {
    if (!isMounted || personalTransformations.length === 0) return;

    const interval = setInterval(() => {
      // First toggle after view
      setShowAfter(prev => {
        if (prev) {
          // If currently showing after, switch to next slide and show before
          setCurrentIndex((current) => (current + 1) % personalTransformations.length);
          return false;
        }
        // If showing before, show after
        return true;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [personalTransformations.length, isMounted]);

  // Handle Loading State
  if (!isMounted) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair text-white">
            Personal Transformations
          </h2>
          <div className="animate-pulse flex justify-center">
            <div className="h-96 w-full max-w-4xl bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  // Handle Empty State - FIXED: No longer infinite loading
  if (personalTransformations.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair text-white">
            Personal Transformations
          </h2>
          <p className="text-gray-400">No personal transformations available at the moment.</p>
        </div>
      </section>
    );
  }

  const currentTransform = personalTransformations[currentIndex];

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 font-playfair text-white">
          Personal Transformations
        </h2>

        {/* Transformation Display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-gray-700 bg-gray-900 shadow-2xl">

            {/* Before Image - Always rendered, opacity handles visibility */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${showAfter ? 'opacity-0' : 'opacity-100'}`}
            >
              <img
                src={currentTransform.beforeUrl}
                alt="Before transformation"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1000/333/fff?text=Before+Image+Not+Found';
                }}
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm z-10">
                BEFORE
              </div>
            </div>

            {/* After Image - Always rendered, opacity handles visibility */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${showAfter ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={currentTransform.afterUrl}
                alt="After transformation"
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x1000/666/fff?text=After+Image+Not+Found';
                }}
              />
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-lg font-bold text-sm z-10">
                AFTER
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {personalTransformations.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowAfter(false);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/50'
                  : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                aria-label={`View transformation ${index + 1}`}
              />
            ))}
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