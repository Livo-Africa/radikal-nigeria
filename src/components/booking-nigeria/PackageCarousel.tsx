// src/components/booking-nigeria/PackageCarousel.tsx
// Horizontal swipe carousel for package selection with Lucide icons

'use client';
import { useRef, useState } from 'react';
import { Package, PACKAGES_BY_CATEGORY, formatNaira, calculateGroupPrice } from '@/utils/bookingDataNigeria';
import { Camera, Shirt, Zap, Star, Check, ArrowRight } from 'lucide-react';

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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Package
                </h2>
                <div className="flex items-center justify-center gap-2 text-gray-600 animate-pulse">
                    <span className="text-sm font-medium">Swipe to see more</span>
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>

            {/* Group Size Stepper */}
            {isGroupCategory && (
                <div className="flex items-center justify-center gap-4 mb-8 bg-gray-50 rounded-2xl p-4 mx-4">
                    <span className="text-gray-700 font-medium">People:</span>
                    <button
                        onClick={() => handleGroupSizeChange(-1)}
                        disabled={groupSize <= 2}
                        className="w-11 h-11 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-xl font-bold text-[#D4AF37] disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-300 transition-all active:scale-95 bg-white"
                    >
                        −
                    </button>
                    <span className="text-xl font-bold text-gray-900 min-w-[80px] text-center">
                        {groupSize} {groupSize === 1 ? 'Person' : 'People'}
                    </span>
                    <button
                        onClick={() => handleGroupSizeChange(1)}
                        disabled={groupSize >= 5}
                        className="w-11 h-11 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-xl font-bold text-[#D4AF37] disabled:opacity-40 disabled:border-gray-300 disabled:text-gray-300 transition-all active:scale-95 bg-white"
                    >
                        +
                    </button>
                </div>
            )}

            {/* Horizontal Scroll Container */}
            {/* Added pr-12 for peek effect and md:justify-center for desktop */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 px-4 pb-8 snap-x snap-mandatory hide-scrollbar pr-12 md:justify-center md:flex-wrap md:overflow-visible"
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
                flex-shrink-0 w-[85vw] md:w-[300px] min-h-[420px] rounded-3xl overflow-visible cursor-pointer
                transition-all duration-300 transform snap-center relative
                ${isSelected
                                    ? 'border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02] z-10'
                                    : 'border border-gray-800 hover:border-[#D4AF37]/50 hover:shadow-xl'
                                }
                bg-[#1a1a1a] group
              `}
                        >
                            {/* POPULAR RIBBON */}
                            {pkg.popular && (
                                <div className="absolute top-0 left-0 overflow-hidden w-24 h-24 rounded-tl-3xl z-20 pointer-events-none">
                                    <div className="absolute top-0 left-0 bg-gradient-to-r from-[#B91C1C] to-[#7F1D1D] text-white text-[10px] font-bold py-1 w-[150%] text-center -rotate-45 origin-bottom-left translate-y-[22px] -translate-x-[28px] shadow-lg border-b border-[#D4AF37]/30">
                                        POPULAR
                                    </div>
                                </div>
                            )}

                            {/* HANGING PRICE BADGE */}
                            <div className={`
                                absolute -top-4 -right-2 z-30 transition-transform duration-300 ease-out origin-top
                                ${isSelected ? 'scale-110' : 'group-hover:rotate-3'}
                            `}>
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                    {/* Badge Background */}
                                    <div className="absolute inset-0 bg-gradient-radial from-[#F4D03F] to-[#D4AF37] rounded-full shadow-lg border-[3px] border-white"></div>

                                    {/* Price Content */}
                                    <div className="relative z-10 flex flex-col items-center justify-center text-black leading-tight">
                                        <span className="text-xs font-bold opacity-80 uppercase tracking-tighter">Only</span>
                                        <span className="text-xl font-black tracking-tight">{formatNaira(displayPrice)}</span>
                                        {isGroupCategory && pkg.basePrice && groupSize > 2 && (
                                            <span className="text-[10px] line-through opacity-60 font-bold">
                                                {formatNaira(pkg.basePrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex flex-col h-full text-center relative z-0">
                                {/* Subtle gold speckle texture */}
                                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                                {/* Package Name */}
                                <h3 className="text-2xl font-bold text-white mb-8 mt-4 tracking-wide">
                                    {pkg.name}
                                </h3>

                                {/* Features Stack */}
                                <div className="flex-grow space-y-5 flex flex-col items-center justify-center mb-8">
                                    <div className="flex items-center gap-3 text-white/90">
                                        <Camera className="w-5 h-5 text-[#D4AF37]" />
                                        <span className="text-lg font-medium">{pkg.images} Photos</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <Shirt className="w-5 h-5 text-[#D4AF37]" />
                                        <span className="text-lg font-medium">{pkg.outfits} Outfits</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <Zap className="w-5 h-5 text-[#D4AF37]" />
                                        <span className="text-lg font-medium">1-3 Hours</span>
                                    </div>
                                </div>

                                {/* Selection Button */}
                                <button
                                    className={`
                    w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                    ${isSelected
                                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white scale-105'
                                            : 'bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#B91C1C] hover:text-white border border-white/10'
                                        }
                  `}
                                >
                                    {isSelected ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            SELECTED
                                        </>
                                    ) : (
                                        'Select Package'
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Scroll Indicators */}
            {packages.length > 1 && (
                <div className="flex justify-center gap-2 mt-2 md:hidden">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`h-2 rounded-full transition-all duration-300 ${selectedId === pkg.id ? 'bg-[#D4AF37] w-6' : 'bg-gray-300 w-2'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Confetti Animation */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-20px',
                                animationDelay: `${Math.random() * 0.5}s`,
                                backgroundColor: ['#D4AF37', '#B91C1C', '#FFFFFF'][Math.floor(Math.random() * 3)],
                                width: Math.random() > 0.5 ? '8px' : '12px',
                                height: Math.random() > 0.5 ? '8px' : '12px',
                                borderRadius: Math.random() > 0.5 ? '50%' : '2px'
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
            transform: translateY(600px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 1.5s ease-out forwards;
        }
        .bg-gradient-radial {
            background-image: radial-gradient(var(--tw-gradient-stops));
        }
      `}</style>
        </div>
    );
}
