'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Transformations({ transformations = [] }: { transformations?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAfter, setShowAfter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [componentKey, setComponentKey] = useState(0);
  const pathname = usePathname();

  // Safe mount detection - only runs on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe route change detection
  useEffect(() => {
    if (isMounted && pathname === '/') {
      setComponentKey(prev => prev + 1);
      setShowAfter(false);
      setCurrentIndex(0);
    }
  }, [pathname, isMounted]);

  const filters = ['All', 'Personal', 'Product', 'Brand', 'Video'];

  const filteredTransformations = activeFilter === 'All' 
    ? transformations 
    : transformations.filter(t => {
        const service = t.service?.toLowerCase() || '';
        switch (activeFilter.toLowerCase()) {
          case 'personal':
            return service.includes('personal') || service.includes('individual');
          case 'product':
            return service.includes('product') || service.includes('ecommerce');
          case 'brand':
            return service.includes('brand') || service.includes('business') || service.includes('corporate');
          case 'video':
            return service.includes('video') || service.includes('motion') || service.includes('animation');
          default:
            return true;
        }
      }).filter(t => t.beforeUrl && t.afterUrl);

  // Auto-advance - only when mounted
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;
    
    const interval = setInterval(() => {
      setShowAfter(prev => {
        if (!prev) {
          return true;
        } else {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredTransformations.length);
          return false;
        }
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [filteredTransformations.length, showAfter, isMounted]);

  // Reset when filter changes
  useEffect(() => {
    if (!isMounted) return;
    setShowAfter(false);
    setCurrentIndex(0);
  }, [activeFilter, isMounted]);

  const handleToggleView = () => {
    setShowAfter(!showAfter);
  };

  const handleNavigation = (index: number) => {
    setCurrentIndex(index);
    setShowAfter(false);
  };

  // Show loading state during SSR and before hydration
  if (!isMounted) {
    return (
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 font-playfair">
            The Radikal Transformation
          </h2>
          <p className="text-xl text-center mb-12 text-[#D4AF37]">
            From ordinary to extraordinary across all services
          </p>
          <div className="text-center">
            <p className="text-[#D4AF37]">Loading transformations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!transformations || transformations.length === 0) {
    return (
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 font-playfair">The Radikal Transformation</h2>
          <p className="text-xl text-[#B91C1C] mb-8">No transformations available yet.</p>
        </div>
      </section>
    );
  }

  const currentTransform = filteredTransformations[currentIndex];

  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 font-playfair">
          The Radikal Transformation
        </h2>
        <p className="text-xl text-center mb-12 text-[#B91C1C]">
          From ordinary to extraordinary across all services
        </p>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12 flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentIndex(0);
                setShowAfter(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm md:text-base md:px-6 md:py-3 ${
                activeFilter === filter
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredTransformations.length === 0 && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800">
              <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">No Transformations Found</h3>
              <p className="text-gray-300 mb-6">
                No transformations available for "{activeFilter}" category.
              </p>
              <button 
                onClick={() => setActiveFilter('All')}
                className="bg-[#D4AF37] hover:bg-[#b8941f] text-black px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Show All Transformations
              </button>
            </div>
          </div>
        )}

        {/* Transformation Display */}
        {filteredTransformations.length > 0 && currentTransform && (
          <div className="max-w-4xl mx-auto">
            {/* Image Container - Safe key without Date.now() */}
            <div key={`transform-${currentIndex}-${showAfter}-${componentKey}`} className="relative aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden border-4 border-gray-700 shadow-2xl mb-8">
              {/* Before Image */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                showAfter ? 'opacity-0' : 'opacity-100'
              }`}>
                <img 
                  src={currentTransform.beforeUrl} 
                  alt="Before transformation"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1000/333/fff?text=Before+Image+Not+Found';
                  }}
                />
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg font-semibold">
                  BEFORE
                </div>
              </div>
              
              {/* After Image */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                showAfter ? 'opacity-100' : 'opacity-0'
              }`}>
                <img 
                  src={currentTransform.afterUrl} 
                  alt="After transformation"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1000/666/fff?text=After+Image+Not+Found';
                  }}
                />
                <div className="absolute bottom-4 left-4 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold">
                  AFTER
                </div>
              </div>
            </div>

            {/* Manual Toggle Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleToggleView}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-gray-600"
              >
                {showAfter ? 'Show Before' : 'Show After'}
              </button>
            </div>

           

            {/* Navigation & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Navigation Dots */}
             

              {/* View More Button */}
              <a 
                href="/transformations"
                className="bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors border border-[#D4AF37]"
              >
                View More Work →
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}