// src/components/booking-nigeria/PackageCarousel.tsx
// Horizontal swipe carousel for package selection

'use client';
import { useRef, useState, useEffect } from 'react';
import { Package, PACKAGES_BY_CATEGORY, formatNaira, calculateGroupPrice } from '@/utils/bookingDataNigeria';

interface PackageCarouselProps {
    category: string;
    selectedId: string | null;
    onSelect: (pkg: Package) => void;
    groupSize?: number;
    onGroupSizeChange?: (size: number) => void;
}

export default function PackageCarousel({
    category,
    selectedId,
    onSelect,
    groupSize = 2,
    onGroupSizeChange
}: PackageCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const packages = PACKAGES_BY_CATEGORY[category] || [];
    const isGroupCategory = category === 'group';

    const handleSelect = (pkg: Package) => {
        onSelect(pkg);
        // Trigger confetti animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
    };

    const handleGroupSizeChange = (delta: number) => {
        if (onGroupSizeChange) {
            const newSize = Math.max(2, Math.min(5, groupSize + delta));
            onGroupSizeChange(newSize);
        }
    };

    const getDisplayPrice = (pkg: Package): number => {
        if (isGroupCategory && pkg.basePrice) {
            return calculateGroupPrice(pkg, groupSize);
        }
        return pkg.price;
    };

    if (packages.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No packages available for this category
            </div>
        );
    }

    return (
        <div className="w-full relative">
            {/* Section Header */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Choose Package
                </h2>
                <p className="text-gray-500 text-sm">
                    Swipe to explore options
                </p>
            </div>

            {/* Group Size Stepper (only for group category) */}
            {isGroupCategory && (
                <div className="flex items-center justify-center gap-4 mb-6 bg-gray-50 rounded-2xl p-4 mx-4">
                    <span className="text-gray-700 font-medium">People:</span>
                    <button
                        onClick={() => handleGroupSizeChange(-1)}
                        disabled={groupSize <= 2}
                        className="w-11 h-11 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-xl font-bold text-[#D4AF37] disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-300 transition-all active:scale-95"
                    >
                        −
                    </button>
                    <span className="text-xl font-bold text-gray-900 min-w-[80px] text-center">
                        {groupSize} {groupSize === 1 ? 'Person' : 'People'}
                    </span>
                    <button
                        onClick={() => handleGroupSizeChange(1)}
                        disabled={groupSize >= 5}
                        className="w-11 h-11 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-xl font-bold text-[#D4AF37] disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-300 transition-all active:scale-95"
                    >
                        +
                    </button>
                </div>
            )}

            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {packages.map((pkg) => {
                    const isSelected = selectedId === pkg.id;
                    const displayPrice = getDisplayPrice(pkg);

                    return (
                        <div
                            key={pkg.id}
                            onClick={() => handleSelect(pkg)}
                            className={`
                flex-shrink-0 w-[280px] min-h-[380px] rounded-2xl overflow-hidden cursor-pointer
                transition-all duration-300 transform snap-center
                ${isSelected
                                    ? 'border-2 border-[#D4AF37] shadow-2xl scale-[1.02]'
                                    : 'border-2 border-gray-200 hover:shadow-xl'
                                }
                bg-white
              `}
                        >
                            {/* Popular Badge */}
                            {pkg.popular && (
                                <div className="bg-[#D4AF37] text-black text-xs font-bold px-3 py-1.5 text-center">
                                    ⭐ POPULAR
                                </div>
                            )}

                            {/* Card Content */}
                            <div className="p-6 flex flex-col h-full">
                                {/* Package Name */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {pkg.name}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-500 text-sm mb-4">
                                    {pkg.description}
                                </p>

                                {/* Features */}
                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="text-lg">📸</span>
                                        <span>{pkg.images} Professional Photos</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="text-lg">👔</span>
                                        <span>{pkg.outfits} Outfit{pkg.outfits > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="text-lg">⚡</span>
                                        <span>1-3 Hours Delivery</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {formatNaira(displayPrice)}
                                        </span>
                                        {isGroupCategory && pkg.basePrice && groupSize > 2 && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatNaira(pkg.basePrice)}
                                            </span>
                                        )}
                                    </div>
                                    {isGroupCategory && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            for {groupSize} people
                                        </p>
                                    )}
                                </div>

                                {/* Selection Button */}
                                <button
                                    className={`
                    w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all
                    ${isSelected
                                            ? 'bg-[#D4AF37] text-black'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                  `}
                                >
                                    {isSelected ? '✓ Selected' : 'Select Package'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll Indicators */}
            {packages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {packages.map((pkg, index) => (
                        <div
                            key={pkg.id}
                            className={`w-2 h-2 rounded-full transition-all ${selectedId === pkg.id ? 'bg-[#D4AF37] w-6' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Confetti Animation */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10px',
                                animationDelay: `${Math.random() * 0.5}s`,
                                backgroundColor: ['#D4AF37', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][Math.floor(Math.random() * 5)],
                                width: '8px',
                                height: '8px',
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 1.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
