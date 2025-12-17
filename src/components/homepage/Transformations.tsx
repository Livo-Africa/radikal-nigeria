// src/components/homepage/Transformations.tsx - ALL FIXES APPLIED
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
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathname = usePathname();
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preloadedIndices = useRef<Set<number>>(new Set());

  // Constants
  const BEFORE_DURATION = 2500; // 2.5 seconds
  const AFTER_DURATION = 2500; // 2.5 seconds
  const INACTIVITY_RESUME_DELAY = 5000; // 5 seconds before resuming auto-play
  const SWIPE_THRESHOLD = 50; // Minimum swipe distance

  // Safe mount detection
  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Cleanup on unmount
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  // CLIENT-SIDE VALIDATION: Filter transformations with your requirements
  const validatedTransformations = useMemo(() => {
    return transformations.filter(t => {
      // Must be visible
      if (!t.visible) return false;

      // Must have both URLs
      if (!t.beforeUrl || !t.afterUrl) return false;

      // Basic URL validation
      try {
        new URL(t.beforeUrl);
        new URL(t.afterUrl);
        return true;
      } catch {
        return false;
      }
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

  // PRELOAD IMAGES to eliminate flickering
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;

    const preloadImages = async (index: number) => {
      if (preloadedIndices.current.has(index)) return;

      const current = filteredTransformations[index];
      if (!current) return;

      const urls = [current.beforeUrl, current.afterUrl];

      try {
        await Promise.all(
          urls.map(url =>
            new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(true);
              img.onerror = () => reject(new Error(`Failed to load: ${url}`));
              img.src = url;
            })
          )
        );

        preloadedIndices.current.add(index);
        setImagesLoaded(prev => new Set(prev).add(index));
      } catch (error) {
        console.warn('Failed to preload images for index:', index, error);
      }
    };

    // Preload current, next, and previous images
    const indicesToPreload = [
      currentIndex,
      (currentIndex + 1) % filteredTransformations.length,
      (currentIndex - 1 + filteredTransformations.length) % filteredTransformations.length
    ];

    indicesToPreload.forEach(index => {
      if (index >= 0 && index < filteredTransformations.length) {
        preloadImages(index);
      }
    });
  }, [currentIndex, filteredTransformations, isMounted]);

  // FIXED AUTO-PLAY LOGIC: 5-second cycle with proper state management
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0 || !isPlaying || isTouchActive) {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      return;
    }

    const startAutoPlay = () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);

      const duration = displayPhase === 'before' ? BEFORE_DURATION : AFTER_DURATION;

      autoPlayRef.current = setTimeout(() => {
        setIsTransitioning(true);

        requestAnimationFrame(() => {
          if (displayPhase === 'before') {
            setDisplayPhase('after');
          } else {
            setDisplayPhase('before');
            setCurrentIndex(prev => {
              const nextIndex = (prev + 1) % filteredTransformations.length;
              // Preload the next-next image
              const nextNextIndex = (nextIndex + 1) % filteredTransformations.length;
              if (!preloadedIndices.current.has(nextNextIndex)) {
                const nextTransform = filteredTransformations[nextNextIndex];
                if (nextTransform) {
                  const img = new Image();
                  img.src = nextTransform.beforeUrl;
                  img.src = nextTransform.afterUrl;
                  preloadedIndices.current.add(nextNextIndex);
                }
              }
              return nextIndex;
            });
          }

          requestAnimationFrame(() => {
            setIsTransitioning(false);
            startAutoPlay();
          });
        });
      }, duration);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [displayPhase, isPlaying, isTouchActive, filteredTransformations, isMounted]);

  // Handle user inactivity and resume auto-play
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    if (!isPlaying) {
      setIsTouchActive(true);
      inactivityTimerRef.current = setTimeout(() => {
        setIsTouchActive(false);
        setIsPlaying(true);
      }, INACTIVITY_RESUME_DELAY);
    }
  }, [isPlaying]);

  // Handle route changes
  useEffect(() => {
    if (isMounted && pathname === '/') {
      setDisplayPhase('before');
      setCurrentIndex(0);
      setIsPlaying(true);
      setIsTouchActive(false);
    }
  }, [pathname, isMounted]);

  // Reset when filter changes
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;

    setDisplayPhase('before');
    setCurrentIndex(0);
    setIsPlaying(true);
    setIsTouchActive(false);
    resetInactivityTimer();
  }, [activeFilter, isMounted, filteredTransformations.length, resetInactivityTimer]);

  // Touch handlers with debouncing
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPlaying(false);
    setIsTouchActive(true);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      setIsTransitioning(true);

      requestAnimationFrame(() => {
        if (distance > 0) {
          // Swipe left - next
          setCurrentIndex(prev => {
            const nextIndex = (prev + 1) % filteredTransformations.length;
            return nextIndex;
          });
        } else {
          // Swipe right - previous
          setCurrentIndex(prev => {
            const prevIndex = (prev - 1 + filteredTransformations.length) % filteredTransformations.length;
            return prevIndex;
          });
        }

        setDisplayPhase('before');

        requestAnimationFrame(() => {
          setIsTransitioning(false);
          resetInactivityTimer();
        });
      });
    }

    setTouchStart(null);
  };

  // Manual toggle
  const handleToggleView = useCallback(() => {
    setIsPlaying(false);
    setIsTouchActive(true);
    setIsTransitioning(true);

    requestAnimationFrame(() => {
      setDisplayPhase(prev => prev === 'before' ? 'after' : 'before');

      requestAnimationFrame(() => {
        setIsTransitioning(false);
        resetInactivityTimer();
      });
    });
  }, [resetInactivityTimer]);

  // Navigation with debouncing
  const handleNavigation = useCallback((index: number) => {
    if (index === currentIndex || isTransitioning) return;

    setIsPlaying(false);
    setIsTouchActive(true);
    setIsTransitioning(true);

    requestAnimationFrame(() => {
      setCurrentIndex(index);
      setDisplayPhase('before');

      requestAnimationFrame(() => {
        setIsTransitioning(false);
        resetInactivityTimer();
      });
    });
  }, [currentIndex, isTransitioning, resetInactivityTimer]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      setIsTouchActive(true);
    } else {
      setIsPlaying(true);
      setIsTouchActive(false);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    }
  }, [isPlaying]);

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
  const isCurrentImageLoaded = imagesLoaded.has(currentIndex);

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
                onClick={() => {
                  setActiveFilter(filter.id);
                }}
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
            {/* Image Container - FLICKER FIXED */}
            <div
              className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-gray-700 shadow-2xl mb-6 md:mb-8 cursor-pointer bg-gray-900"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={handleToggleView}
            >
              {/* Skeleton while loading */}
              {!isCurrentImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                  </div>
                </div>
              )}

              {/* Before Image - NO FLICKER: Always in DOM */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${displayPhase === 'before' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{ transition: isTransitioning ? 'opacity 300ms ease-in-out, visibility 300ms ease-in-out' : 'none' }}
              >
                <img
                  src={currentTransform.beforeUrl}
                  alt="Before transformation"
                  className="w-full h-full object-cover"
                  loading={isCurrentImageLoaded ? 'lazy' : 'eager'}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1000/333/fff?text=Before+Image+Not+Found';
                  }}
                />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-black/80 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-sm md:text-base">
                  BEFORE
                </div>
              </div>

              {/* After Image - NO FLICKER: Always in DOM */}
              <div
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${displayPhase === 'after' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                style={{ transition: isTransitioning ? 'opacity 300ms ease-in-out, visibility 300ms ease-in-out' : 'none' }}
              >
                <img
                  src={currentTransform.afterUrl}
                  alt="After transformation"
                  className="w-full h-full object-cover"
                  loading={isCurrentImageLoaded ? 'lazy' : 'eager'}
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
                className="absolute top-3 md:top-4 right-3 md:right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm z-10"
                aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>

              {/* Status Indicator */}
              <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm z-10">
                {isPlaying ? 'Auto' : 'Paused'}
              </div>

              {/* Swipe Hint - Mobile Only */}
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black/60 text-white px-2 py-1 rounded text-xs md:hidden backdrop-blur-sm z-10">
                ← Swipe →
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 mb-6 md:mb-8">
              {/* Manual Toggle Button */}
              <button
                onClick={handleToggleView}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors border border-gray-600 w-full md:w-auto justify-center"
                disabled={isTransitioning}
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
                    disabled={isTransitioning}
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