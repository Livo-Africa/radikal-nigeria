// src/components/individuals/TransformationsGallery.tsx - UPDATED
'use client';
import { useState, useEffect } from 'react';

export default function TransformationsGallery({ transformations = [] }: { transformations?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter transformations for "personal" or "individual" category
  const personalTransformations = transformations.filter(transform => {
    const category = transform.category?.toLowerCase() || '';
    const service = transform.service?.toLowerCase() || '';
    return category.includes('personal') || category.includes('individual') || 
           service.includes('personal') || service.includes('individual');
  });

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (personalTransformations.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % personalTransformations.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [personalTransformations.length]);

  if (!personalTransformations || personalTransformations.length === 0) {
    return (
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-playfair text-white">
            Personal Transformations
          </h2>
          <p className="text-gray-400">Loading personal transformations...</p>
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

        {/* Transformation Grid - Fixed Aspect Ratio */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Before Image - Fixed Container */}
            <div className="relative group">
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm z-10">
                BEFORE
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-800">
                <img 
                  src={currentTransform.beforeUrl || currentTransform.before}
                  alt="Before transformation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop';
                  }}
                />
              </div>
            </div>
            
            {/* After Image - Fixed Container */}
            <div className="relative group">
              <div className="absolute top-4 left-4 bg-[#D4AF37] text-black px-3 py-1 rounded-lg font-bold text-sm z-10">
                AFTER
              </div>
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-800">
                <img 
                  src={currentTransform.afterUrl || currentTransform.after}
                  alt="After transformation"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=600&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {personalTransformations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#D4AF37] scale-125' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
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