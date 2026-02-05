'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type MainFilterType = 'All' | 'Birthday' | 'Solo' | 'Headshots' | 'Products' | 'Creative' | 'Video';

interface CollageTransformation {
    id: string;
    imageUrl: string;
    category: string;
    package?: string;
}

interface CollageGalleryProps {
    transformations: CollageTransformation[];
}

// Sub-filter definitions
const SUB_FILTERS: Record<string, string[]> = {
    Birthday: ['All', 'Basic', 'Deluxe', 'Royal'],
    Solo: ['All', 'Standard', 'Medium', 'Supreme'],
};

const MAIN_FILTERS: MainFilterType[] = ['All', 'Birthday', 'Solo', 'Headshots', 'Products', 'Creative', 'Video'];

export default function CollageGallery({ transformations = [] }: CollageGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<MainFilterType>('All');
    const [activeSubFilter, setActiveSubFilter] = useState<string>('All');
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedImage, setSelectedImage] = useState<CollageTransformation | null>(null);

    // Get available sub-filters for the current main filter
    const currentSubFilters = SUB_FILTERS[activeFilter] || null;

    // Filtering Logic
    const filteredTransformations = useMemo(() => {
        let filtered = transformations;

        if (activeFilter !== 'All') {
            filtered = filtered.filter(t => {
                const category = (t.category || '').toLowerCase();

                switch (activeFilter) {
                    case 'Birthday':
                        return category.includes('birthday');
                    case 'Solo':
                        return category.includes('solo') || category.includes('personal') || category.includes('individual');
                    case 'Headshots':
                        return category.includes('headshot') || category.includes('corporate') || category.includes('professional') || category.includes('brand') || category.includes('business');
                    case 'Products':
                        return category.includes('product') || category.includes('commercial');
                    case 'Creative':
                        return category.includes('creative') || category.includes('art') || category.includes('editorial');
                    case 'Video':
                        return category.includes('video') || category.includes('reel') || category.includes('motion');
                    default:
                        return true;
                }
            });
        }

        // Sub-filter by package
        if (currentSubFilters && activeSubFilter !== 'All') {
            filtered = filtered.filter(t => {
                const pkg = (t.package || '').toLowerCase();
                return pkg === activeSubFilter.toLowerCase();
            });
        }

        return filtered;
    }, [transformations, activeFilter, activeSubFilter, currentSubFilters]);

    const visibleItems = filteredTransformations.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTransformations.length;

    const handleLoadMore = useCallback(() => {
        setVisibleCount(prev => prev + 12);
    }, []);

    const handleMainFilterChange = useCallback((filter: MainFilterType) => {
        setActiveFilter(filter);
        setActiveSubFilter('All');
        setVisibleCount(12);
    }, []);

    const handleSubFilterChange = useCallback((subFilter: string) => {
        setActiveSubFilter(subFilter);
        setVisibleCount(12);
    }, []);

    // Lightbox navigation
    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        if (!selectedImage) return;
        const currentIndex = filteredTransformations.findIndex(t => t.id === selectedImage.id);
        if (direction === 'next' && currentIndex < filteredTransformations.length - 1) {
            setSelectedImage(filteredTransformations[currentIndex + 1]);
        } else if (direction === 'prev' && currentIndex > 0) {
            setSelectedImage(filteredTransformations[currentIndex - 1]);
        }
    }, [selectedImage, filteredTransformations]);

    return (
        <div className="bg-black min-h-screen">
            {/* Mobile Header */}
            <div className="md:hidden pt-6 pb-3 text-center px-4">
                <h1 className="text-2xl font-bold font-playfair text-white">
                    The RAdikal <span className="text-[#D4AF37]">Difference</span>
                </h1>
            </div>

            {/* Filters - Sticky */}
            <div className="sticky top-16 md:top-0 z-30 bg-black border-b border-gray-800 py-3">
                <div className="container mx-auto px-4">
                    {/* Main Filters */}
                    <div className="overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none' }}>
                        <div className="flex md:justify-center gap-2 w-max md:w-auto mx-auto">
                            {MAIN_FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => handleMainFilterChange(filter)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap
                                        ${activeFilter === filter
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'bg-gray-900 text-gray-400 border border-gray-700'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sub-Filters */}
                    {currentSubFilters && (
                        <div className="mt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            <div className="flex md:justify-center gap-2 w-max md:w-auto mx-auto">
                                <span className="text-gray-500 text-xs uppercase tracking-wider mr-1 hidden md:flex items-center">Package</span>
                                {currentSubFilters.map((subFilter) => (
                                    <button
                                        key={subFilter}
                                        onClick={() => handleSubFilterChange(subFilter)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase
                                            ${activeSubFilter === subFilter
                                                ? 'bg-white text-black'
                                                : 'bg-gray-900 text-gray-400 border border-gray-700'
                                            }`}
                                    >
                                        {subFilter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery */}
            <div className="container mx-auto px-3 md:px-4 py-6">
                {/* Results Count */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-500 text-sm">
                        <span className="text-white font-semibold">{filteredTransformations.length}</span> results
                        {activeFilter !== 'All' && (
                            <span className="ml-1">in <span className="text-[#D4AF37]">{activeFilter}</span></span>
                        )}
                    </p>
                    {activeFilter !== 'All' && (
                        <button
                            onClick={() => handleMainFilterChange('All')}
                            className="text-xs text-gray-500 hover:text-white"
                        >
                            Clear filter
                        </button>
                    )}
                </div>

                {/* Image Grid - Simple, fast loading */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                    {visibleItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative aspect-[4/5] bg-gray-900 rounded-lg overflow-hidden cursor-pointer border border-gray-800"
                            onClick={() => setSelectedImage(item)}
                        >
                            <Image
                                src={item.imageUrl}
                                alt={item.category || 'Transformation'}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                className="object-cover"
                                loading={index < 6 ? 'eager' : 'lazy'}
                                quality={60}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDBAURAAYhBxITMUFR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ANVu3UHb1LQT1FJDI1wt4qnIJxiUmNQPYGSM4+6jbLpGH/9k="
                            />
                            {/* Simple category label */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                                <span className="text-[#D4AF37] text-xs font-medium truncate block">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTransformations.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-gray-400 mb-4">Try a different category.</p>
                        <button
                            onClick={() => handleMainFilterChange('All')}
                            className="px-6 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg"
                        >
                            View All
                        </button>
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-gray-900 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-lg"
                        >
                            Load More ({filteredTransformations.length - visibleCount} remaining)
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Modal - Simple */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 z-50 p-2 bg-white/10 rounded-full"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Navigation Arrows */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hidden md:block"
                        onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hidden md:block"
                        onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    {/* Image */}
                    <div
                        className="relative max-w-4xl w-full mx-4 max-h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.category}
                            className="max-w-full max-h-[85vh] mx-auto object-contain rounded-lg"
                        />
                        <div className="mt-4 text-center">
                            <span className="px-3 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/50 rounded-full text-[#D4AF37] text-sm font-semibold">
                                {selectedImage.category}
                            </span>
                            {selectedImage.package && (
                                <span className="ml-2 px-3 py-1 bg-white/10 rounded-full text-white text-sm">
                                    {selectedImage.package}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
