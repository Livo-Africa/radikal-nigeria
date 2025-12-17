// src/components/homepage/Transformations.tsx - FIXED VERSION
'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';
import { Transformation } from '@/types';

interface TransformationsProps {
  transformations?: Transformation[];
}

type DisplayPhase = 'before' | 'after';

export default function Transformations({ transformations = [] }: TransformationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [displayPhase, setDisplayPhase] = useState<DisplayPhase>('before');
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const pathname = usePathname();
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchCooldownRef = useRef<NodeJS.Timeout | null>(null);
  const loadedImagesRef = useRef<Set<string>>(new Set());

  // Constants
  const AUTO_PLAY_INTERVAL = 5000; // 5 seconds total
  const SWIPE_THRESHOLD = 50;

  // Safe mount detection
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      if (touchCooldownRef.current) clearTimeout(touchCooldownRef.current);
    };
  }, []);

  // VALIDATION: Filter transformations
  const validatedTransformations = useMemo(() => {
    return transformations.filter(t => {
      // Must be visible
      if (t.visible === false) return false;

      // Must have both URLs
      if (!t.beforeUrl || !t.afterUrl) return false;

      return true;
    });
  }, [transformations]);

  // Filter by service type
  const filteredTransformations = useMemo(() => {
    if (activeFilter === 'All') return validatedTransformations;

    return validatedTransformations.filter(t => {
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
    });
  }, [validatedTransformations, activeFilter]);

  // PRELOAD ALL IMAGES ONCE when component mounts
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;

    const preloadAllImages = () => {
      filteredTransformations.forEach((transform, index) => {
        // Preload before image
        const beforeImg = new Image();
        beforeImg.src = transform.beforeUrl;
        beforeImg.onload = () => {
          loadedImagesRef.current.add(`${index}-before`);
        };

        // Preload after image
        const afterImg = new Image();
        afterImg.src = transform.afterUrl;
        afterImg.onload = () => {
          loadedImagesRef.current.add(`${index}-after`);
        };
      });
    };

    preloadAllImages();
  }, [filteredTransformations, isMounted]);

  // SIMPLE & CORRECT AUTO-PLAY LOGIC
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0 || !isPlaying) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    const startAutoPlay = () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);

      autoPlayTimerRef.current = setTimeout(() => {
        if (displayPhase === 'before') {
          // Switch to AFTER view
          setDisplayPhase('after');

          // After showing "after" for 2.5 seconds, move to next
          autoPlayTimerRef.current = setTimeout(() => {
            setCurrentIndex(prev => {
              const nextIndex = (prev + 1) % filteredTransformations.length;
              return nextIndex;
            });
            setDisplayPhase('before');

            // Restart the cycle
            startAutoPlay();
          }, 2500); // 2.5 seconds for AFTER view
        }
      }, displayPhase === 'before' ? 2500 : 0); // 2.5 seconds for BEFORE view
    };

    startAutoPlay();

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [displayPhase, isPlaying, filteredTransformations.length, isMounted]);

  // Reset on filter change
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;

    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);

    setCurrentIndex(0);
    setDisplayPhase('before');
    setIsPlaying(true);
  }, [activeFilter, isMounted, filteredTransformations.length]);

  // Touch handlers - SIMPLIFIED
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      // Pause auto-play on swipe
      setIsPlaying(false);

      if (distance > 0) {
        // Swipe left - next
        setCurrentIndex(prev => (prev + 1) % filteredTransformations.length);
      } else {
        // Swipe right - previous
        setCurrentIndex(prev => (prev - 1 + filteredTransformations.length) % filteredTransformations.length);
      }

      // Always show BEFORE image after swipe
      setDisplayPhase('before');

      // Resume auto-play after 5 seconds of inactivity
      if (touchCooldownRef.current) clearTimeout(touchCooldownRef.current);
      touchCooldownRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 5000);
    }

    setTouchStart(null);
  };

  // Manual toggle view
  const handleToggleView = () => {
    if (displayPhase === 'before') {
      setDisplayPhase('after');
    } else {
      setDisplayPhase('before');
    }
  };

  // Navigation
  const handleNavigation = (index: number) => {
    setCurrentIndex(index);
    setDisplayPhase('before');
    setIsPlaying(false);

    // Resume auto-play after 5 seconds
    if (touchCooldownRef.current) clearTimeout(touchCooldownRef.current);
    touchCooldownRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Filter tabs
  const filters = [
    { id: 'All', name: 'All Work', icon: Sparkles },
    { id: 'Personal', name: 'Personal', icon: Eye },
    { id: 'Product', name: 'Product', icon: Sparkles },
    { id: 'Brand', name: 'Brand', icon: Sparkles },
    { id: 'Video', name: 'Video', icon: Play }
  ];

  // Show loading state during SSR
  if (!isMounted) {
    return (
      <section className="py-12 md:py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
              The Radikal <span className="text-[#D4AF37]">Transformation</span>
            </h2>
            <p className="text-lg md:text-xl text-[#D4AF37] max-w-2xl mx-auto">
              From ordinary to extraordinary across all services
            </p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="text-[#D4AF37] mt-4">Loading transformations...</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTransform = filteredTransformations[currentIndex];
  const isCurrentImageLoaded = loadedImagesRef.current.has(`${currentIndex}-before`) &&
    loadedImagesRef.current.has(`${currentIndex}-after`);

  return (
    <section className="py-12 md:py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            The Radikal <span className="text-[#D4AF37]">Transformation</span>
          </h2>
          <p className="text-lg md:text-xl text-[#D4AF37] max-w-2xl mx-auto">
            From ordinary to extraordinary across all services
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-start md:justify-center mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-2 md:space-x-4 px-4 md:px-0 min-w-max">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeFilter === filter.id
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <filter.icon className="w-4 h-4" />
                <span className="text-sm md:text-base">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredTransformations.length === 0 && (
          <div className="text-center py-8 md:py-12 max-w-2xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-800">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#D4AF37]">
                No Transformations Found
              </h3>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                No transformations available for "{activeFilter}" category.
              </p>
              <button
                onClick={() => setActiveFilter('All')}
                className="bg-[#D4AF37] hover:bg-[#b8941f] text-black px-6 py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
              >
                Show All Transformations
              </button>
            </div>
          </div>
        )}

        {/* Transformation Display */}
        {filteredTransformations.length > 0 && currentTransform && (
          <div className="max-w-4xl mx-auto">
            {/* Image Container */}
            <div
              className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-gray-700 shadow-2xl mb-6 md:mb-8 cursor-pointer bg-gray-900"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={handleToggleView}
            >
              {/* Loading Skeleton */}
              {!isCurrentImageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="inline-block h-12 w-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-[#D4AF37]">Loading images...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Before Image */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${displayPhase === 'before' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
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
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-black/80 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-sm md:text-base">
                  BEFORE
                </div>
              </div>

              {/* After Image */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 ${displayPhase === 'after' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
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
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-[#D4AF37] text-black px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-sm md:text-base">
                  AFTER
                </div>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="absolute top-3 md:top-4 right-3 md:right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
                aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>

              {/* Status Indicator */}
              <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm z-20">
                {isPlaying ? 'Auto' : 'Paused'}
              </div>

              {/* Swipe Hint - Mobile Only */}
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black/60 text-white px-2 py-1 rounded text-xs md:hidden backdrop-blur-sm z-20">
                ← Swipe →
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 z-20">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-100 ease-linear"
                  style={{
                    width: isPlaying ? '100%' : '0%',
                    transitionDuration: isPlaying ? '5000ms' : '0ms'
                  }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 mb-6 md:mb-8">
              {/* Manual Toggle Button */}
              <button
                onClick={handleToggleView}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors border border-gray-600 w-full md:w-auto justify-center"
              >
                {displayPhase === 'after' ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Show Before</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Show After</span>
                  </>
                )}
              </button>

              {/* Navigation Dots */}
              <div className="flex space-x-2 md:space-x-3 order-first md:order-none">
                {filteredTransformations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(index)}
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/50'
                      : 'bg-gray-600 hover:bg-gray-400 hover:scale-110'
                      }`}
                    aria-label={`Go to transformation ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Transformation Info */}
            <div className="text-center bg-gray-900/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-800 hover:border-gray-600 transition-all duration-500 mb-6 md:mb-8">
              <h4 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                {currentTransform.title}
              </h4>
              <div className="flex flex-col md:flex-row justify-center items-center gap-3">
                <span className="bg-[#D4AF37] text-black px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base">
                  {currentTransform.service}
                </span>
                {currentTransform.metrics && (
                  <span className="text-gray-300 text-sm md:text-base">
                    {currentTransform.metrics}
                  </span>
                )}
              </div>
            </div>

            {/* View More Button */}
            <div className="text-center">
              <a
                href="/transformations"
                className="inline-flex items-center space-x-2 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors border border-[#D4AF37] text-sm md:text-base group"
              >
                <span>View More Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}