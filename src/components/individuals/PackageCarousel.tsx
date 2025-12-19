// components/individuals/PackageCarousel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Image, Shirt, Clock } from 'lucide-react';

interface Package {
    id: string;
    name: string;
    price: string;
    photos: number;
    outfits: number;
    deliveryTime: string;
    features: string[];
    popular: boolean;
    category: string;
}

export default function PackageCarousel() {
    const [selectedIndex, setSelectedIndex] = useState(1); // Start with middle card
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    const packages: Package[] = [
        {
            id: "profile-headshots",
            name: "Profile Headshots",
            price: "₵30",
            photos: 2,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["Professional quality", "LinkedIn ready", "2 edited photos"],
            popular: false,
            category: "Professional"
        },
        {
            id: "solo-standard",
            name: "Solo Standard",
            price: "₵50",
            photos: 4,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["4 professional photos", "1 outfit", "Basic editing"],
            popular: true,
            category: "Solo"
        },
        {
            id: "birthday-basic",
            name: "Birthday Basic",
            price: "₵40",
            photos: 4,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["Birthday theme", "4 photos", "1 outfit"],
            popular: false,
            category: "Special Occasions"
        },
        {
            id: "graduation-shots",
            name: "Graduation Shots",
            price: "₵70",
            photos: 3,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["Graduation theme", "Gown enhancement", "3 photos"],
            popular: true,
            category: "Special Occasions"
        },
        {
            id: "solo-medium",
            name: "Solo Medium",
            price: "₵90",
            photos: 8,
            outfits: 2,
            deliveryTime: "1-3 hours",
            features: ["8 photos", "2 outfits", "Premium editing"],
            popular: false,
            category: "Solo"
        },
    ];

    const [activeFilter, setActiveFilter] = useState('Most Popular');
    const filters = ['Most Popular', 'Budget', 'Professional', 'Special'];

    // Handle swipe gestures
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;

        const handleMouseDown = (e: MouseEvent) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            carousel.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            isDown = false;
            snapToCenter();
        };

        const handleTouchStart = (e: TouchEvent) => {
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        };

        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        };

        const handleTouchEnd = () => {
            snapToCenter();
        };

        carousel.addEventListener('mousedown', handleMouseDown);
        carousel.addEventListener('mousemove', handleMouseMove);
        carousel.addEventListener('mouseup', handleMouseUp);
        carousel.addEventListener('mouseleave', handleMouseUp);

        carousel.addEventListener('touchstart', handleTouchStart);
        carousel.addEventListener('touchmove', handleTouchMove);
        carousel.addEventListener('touchend', handleTouchEnd);

        return () => {
            carousel.removeEventListener('mousedown', handleMouseDown);
            carousel.removeEventListener('mousemove', handleMouseMove);
            carousel.removeEventListener('mouseup', handleMouseUp);
            carousel.removeEventListener('mouseleave', handleMouseUp);
            carousel.removeEventListener('touchstart', handleTouchStart);
            carousel.removeEventListener('touchmove', handleTouchMove);
            carousel.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const snapToCenter = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const cardWidth = 280; // Card width + gap
        const scrollPos = carousel.scrollLeft;
        const index = Math.round(scrollPos / cardWidth);

        setSelectedIndex(index);
        carousel.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });

        // Haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    const handlePackageSelect = (pkg: Package) => {
        // Save package to localStorage for preselection
        const packageData = {
            package: pkg,
            selectedAt: new Date().toISOString()
        };
        localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));

        // Navigate to style journey
        window.location.href = '/individuals/style-journey?step=2';
    };

    const getFilteredPackages = () => {
        switch (activeFilter) {
            case 'Most Popular':
                return packages.filter(pkg => pkg.popular);
            case 'Budget':
                return packages.filter(pkg => parseInt(pkg.price.replace('₵', '')) < 50);
            case 'Professional':
                return packages.filter(pkg => pkg.category === 'Professional');
            case 'Special':
                return packages.filter(pkg => pkg.category === 'Special Occasions');
            default:
                return packages;
        }
    };

    const filteredPackages = getFilteredPackages();

    return (
        <section className="py-6 bg-white">
            <div className="container mx-auto px-4">
                {/* Filter Tabs */}
                <div className="flex overflow-x-auto pb-3 mb-4 scrollbar-hide">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium mr-2 transition-all ${activeFilter === filter
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Swipe Instruction */}
                <div className="text-center text-gray-500 text-sm mb-4">
                    <span>Swipe ← → to see more</span>
                </div>

                {/* Carousel Container */}
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
                    style={{ scrollBehavior: 'smooth' }}
                >
                    <div className="flex gap-4">
                        {filteredPackages.map((pkg, index) => (
                            <div
                                key={pkg.id}
                                className={`relative flex-shrink-0 w-[280px] rounded-xl p-4 border transition-all duration-300 ${expandedCard === pkg.id ? 'h-auto' : 'h-[320px]'} ${selectedIndex === index
                                    ? 'border-[#D4AF37] shadow-lg scale-[1.02] bg-white'
                                    : 'border-gray-200 bg-gray-50 scale-95'
                                    }`}
                                onClick={() => setExpandedCard(expandedCard === pkg.id ? null : pkg.id)}
                            >
                                {/* Popular Badge */}
                                {pkg.popular && (
                                    <div className="absolute -top-2 left-4 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full">
                                        POPULAR
                                    </div>
                                )}

                                {/* Package Header */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                    <div className="text-2xl font-bold text-gray-900 mt-2">{pkg.price}</div>
                                </div>

                                {/* Features (Always Visible) */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Image className="w-4 h-4 mr-2 text-[#D4AF37]" />
                                        <span>{pkg.photos} professional photos</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Shirt className="w-4 h-4 mr-2 text-[#D4AF37]" />
                                        <span>{pkg.outfits} outfit{pkg.outfits > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2 text-[#D4AF37]" />
                                        <span>Delivery in {pkg.deliveryTime}</span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedCard === pkg.id && (
                                    <div className="mt-4 space-y-3 animate-slideDown">
                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                                            <ul className="space-y-1">
                                                {pkg.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center text-sm text-gray-600">
                                                        <ChevronRight className="w-4 h-4 mr-2 text-[#D4AF37]" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Select Button (Only in expanded view) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePackageSelect(pkg);
                                            }}
                                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mt-4"
                                        >
                                            Select Package
                                        </button>
                                    </div>
                                )}

                                {/* View Details Hint (when collapsed) */}
                                {expandedCard !== pkg.id && (
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <div className="text-xs text-gray-500">
                                            Tap card for details
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                    {filteredPackages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelectedIndex(index);
                                carouselRef.current?.scrollTo({
                                    left: index * 280,
                                    behavior: 'smooth'
                                });
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${selectedIndex === index
                                ? 'bg-[#D4AF37] w-6'
                                : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}