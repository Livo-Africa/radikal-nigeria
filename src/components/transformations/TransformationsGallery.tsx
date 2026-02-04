'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Eye, Sparkles, User, Camera, Video, Gift, Box, ChevronDown } from 'lucide-react';
import { Transformation } from '@/types';

// Extended filter types adding to the base ones
type FilterType = 'All' | 'Birthday' | 'Solo' | 'Headshots' | 'Creative' | 'Products' | 'Video';

interface TransformationsGalleryProps {
    transformations: Transformation[];
}

export default function TransformationsGallery({ transformations = [] }: TransformationsGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [visibleCount, setVisibleCount] = useState(12);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile for initial load optimization
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Adjust initial count based on device
    useEffect(() => {
        if (isMobile) {
            setVisibleCount(6);
        }
    }, [isMobile]);

    const filters: { id: FilterType; label: string; icon: any }[] = [
        { id: 'All', label: 'All', icon: Sparkles },
        { id: 'Birthday', label: 'Birthday', icon: Gift },
        { id: 'Solo', label: 'Solo', icon: User },
        { id: 'Headshots', label: 'Headshots', icon: Camera },
        { id: 'Creative', label: 'Creative', icon: Sparkles },
        { id: 'Products', label: 'Products', icon: Box },
        { id: 'Video', label: 'Video', icon: Video },
    ];

    // Filtering Logic
    const filteredTransformations = useMemo(() => {
        if (activeFilter === 'All') return transformations;

        return transformations.filter(t => {
            const service = (t.service || '').toLowerCase();
            const title = (t.title || '').toLowerCase();
            const combinedText = `${service} ${title}`;

            switch (activeFilter) {
                case 'Birthday':
                    return combinedText.includes('birthday');
                case 'Solo':
                    return combinedText.includes('solo') || combinedText.includes('individual') || combinedText.includes('personal');
                case 'Headshots':
                    return combinedText.includes('headshot') || combinedText.includes('corporate') || combinedText.includes('professional');
                case 'Creative':
                    return combinedText.includes('creative') || combinedText.includes('adjust') || combinedText.includes('edit');
                case 'Products':
                    return combinedText.includes('product') || combinedText.includes('ecommerce') || combinedText.includes('e-commerce');
                case 'Video':
                    return combinedText.includes('video') || combinedText.includes('motion') || combinedText.includes('reel');
                default:
                    return true;
            }
        });
    }, [transformations, activeFilter]);

    const visibleTransformations = filteredTransformations.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTransformations.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setVisibleCount(isMobile ? 6 : 12); // Reset count on filter change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Filters - Sticky on Mobile */}
            <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-sm border-b border-gray-800 py-4 transition-all">
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
                <div className="mb-6 text-gray-400 text-sm">
                    Showing {visibleTransformations.length} of {filteredTransformations.length} transformations
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {visibleTransformations.map((item, index) => (
                        <TransformationCard key={`${item.title}-${index}`} item={item} />
                    ))}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="inline-flex items-center space-x-2 bg-gray-900 border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group"
                        >
                            <span>Load More Work</span>
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredTransformations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
                            <Sparkles className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No transformations found</h3>
                        <p className="text-gray-400">Try selecting a different category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TransformationCard({ item }: { item: Transformation }) {
    const [showAfter, setShowAfter] = useState(false);

    // Determine if URL is a valid string, handle possible missing data gracefully
    const beforeUrl = item.beforeUrl || 'https://via.placeholder.com/800x1000/333/fff?text=No+Image';
    const afterUrl = item.afterUrl || 'https://via.placeholder.com/800x1000/333/fff?text=No+Image';

    return (
        <div
            className="group relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl"
            onMouseEnter={() => setShowAfter(true)}
            onMouseLeave={() => setShowAfter(false)}
            onClick={() => setShowAfter(!showAfter)}
        >
            {/* Aspect Ratio Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden">

                {/* Before Image */}
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${showAfter ? 'opacity-0' : 'opacity-100'}`}
                >
                    <Image
                        src={beforeUrl}
                        alt={`Before ${item.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
                        BEFORE
                    </div>
                </div>

                {/* After Image */}
                <div
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${showAfter ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={afterUrl}
                        alt={`After ${item.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 right-4 bg-[#D4AF37] px-3 py-1 rounded-lg text-xs font-bold text-black shadow-lg">
                        AFTER
                    </div>
                </div>

                {/* Interaction Hint (Mobile usually) */}
                <div className="absolute bottom-4 right-4 md:hidden">
                    <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full text-white/80">
                        <Eye className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Info Content */}
            <div className="p-5 border-t border-gray-800 bg-gray-900">
                <div className="flex items-start justify-between mb-2">
                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                        {item.service}
                    </p>
                    {item.metrics && (
                        <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-0.5 rounded">
                            {item.metrics}
                        </span>
                    )}
                </div>
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                </h3>
            </div>
        </div>
    );
}
