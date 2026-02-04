'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Sparkles, User, Camera, Video, Gift, Box, ChevronDown, X } from 'lucide-react';

type FilterType = 'All' | 'Birthday' | 'Solo' | 'Headshots' | 'Creative' | 'Products' | 'Video';

interface CollageTransformation {
    id: string;
    imageUrl: string;
    category: string;
    title?: string;
}

interface CollageGalleryProps {
    transformations: CollageTransformation[];
}

export default function CollageGallery({ transformations = [] }: CollageGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [visibleCount, setVisibleCount] = useState(10);
    const [selectedImage, setSelectedImage] = useState<CollageTransformation | null>(null);

    // Filter Logic
    const filters: { id: FilterType; label: string; icon: any }[] = [
        { id: 'All', label: 'All', icon: Sparkles },
        { id: 'Birthday', label: 'Birthday', icon: Gift },
        { id: 'Solo', label: 'Solo', icon: User },
        { id: 'Headshots', label: 'Headshots', icon: Camera }, // Business, Corporate, Brand
        { id: 'Products', label: 'Products', icon: Box },
        { id: 'Creative', label: 'Creative', icon: Sparkles },
        { id: 'Video', label: 'Video', icon: Video },
    ];

    const filteredTransformations = useMemo(() => {
        if (activeFilter === 'All') return transformations;

        return transformations.filter(t => {
            const category = (t.category || '').toLowerCase();
            const title = (t.title || '').toLowerCase();
            const text = `${category} ${title}`;

            switch (activeFilter) {
                case 'Birthday':
                    return text.includes('birthday');
                case 'Solo':
                    return text.includes('solo') || text.includes('personal') || text.includes('individual') || text.includes('portrait');
                case 'Headshots':
                    return text.includes('headshot') || text.includes('business') || text.includes('corporate') || text.includes('brand') || text.includes('professional');
                case 'Products':
                    return text.includes('product') || text.includes('merch') || text.includes('commercial');
                case 'Creative':
                    return text.includes('creative') || text.includes('art') || text.includes('editorial') || text.includes('edit');
                case 'Video':
                    return text.includes('video') || text.includes('reel') || text.includes('motion');
                default:
                    return true;
            }
        });
    }, [transformations, activeFilter]);

    const visibleItems = filteredTransformations.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTransformations.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setVisibleCount(10); // Reset count on filter change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Close lightbox on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="bg-black min-h-screen">
            {/* Mobile Header - "The RAdikal Difference" */}
            <div className="md:hidden pt-8 pb-4 text-center px-4">
                <h1 className="text-3xl font-bold font-playfair text-white">
                    The RAdikal <span className="text-[#D4AF37]">Difference</span>
                </h1>
            </div>

            {/* Filters - Sticky on Mobile */}
            <div className="sticky top-16 md:top-0 z-30 bg-black/95 backdrop-blur-sm border-b border-gray-800 py-4 transition-all">
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:justify-center md:flex-wrap gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterChange(filter.id)}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border ${activeFilter === filter.id
                                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105'
                                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                                    }`}
                            >
                                <filter.icon className="w-4 h-4" />
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Results Count */}
                <div className="mb-6 text-gray-500 text-sm text-center md:text-left">
                    Showing {visibleItems.length} of {filteredTransformations.length} results
                </div>

                {/* Gallery Layout */}
                {/* Mobile: Single Column, Desktop: 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {visibleItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer group hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 border border-gray-800 hover:border-[#D4AF37]/50"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative w-full">
                                {/* Using <img> for better flexibility with varying aspect ratios of collages, 
                                    or Next.js Image with 'width/height: auto' style */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title || 'Transformation'}
                                    className="w-full h-auto object-cover display-block"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-black/60 backdrop-blur-md p-3 rounded-full text-white">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            {(item.title || item.category !== 'General') && (
                                <div className="p-4 border-t border-gray-800">
                                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
                                        {item.category}
                                    </p>
                                    {item.title && (
                                        <h3 className="text-white font-medium text-sm md:text-base">
                                            {item.title}
                                        </h3>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTransformations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
                            <Sparkles className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-gray-400">Try selecting a different category.</p>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                    <div className="mt-12 text-center pb-20">
                        <button
                            onClick={handleLoadMore}
                            className="inline-flex items-center space-x-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group"
                        >
                            <span>View More</span>
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 md:top-8 md:right-8 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title || 'Full size'}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        {(selectedImage.title || selectedImage.category) && (
                            <div className="mt-4 text-center">
                                <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider mr-2">
                                    {selectedImage.category}
                                </span>
                                {selectedImage.title && (
                                    <span className="text-white text-lg font-medium">
                                        | {selectedImage.title}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
