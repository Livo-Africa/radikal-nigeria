// components/individuals/PackageCarousel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const packages: Package[] = [
        {
            id: "solo-standard",
            name: "Solo Standard",
            price: "₵50",
            photos: 4,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["4 professional photos", "1 outfit", "Basic editing", "WhatsApp delivery"],
            popular: true,
            category: "Solo"
        },
        {
            id: "profile-headshots",
            name: "Profile Headshots",
            price: "₵30",
            photos: 2,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["Professional quality", "LinkedIn ready", "2 edited photos", "Perfect for CV"],
            popular: false,
            category: "Professional"
        },
        {
            id: "graduation-shots",
            name: "Graduation Shots",
            price: "₵70",
            photos: 3,
            outfits: 1,
            deliveryTime: "1-3 hours",
            features: ["Graduation theme", "Gown enhancement", "3 photos", "Digital delivery"],
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
            features: ["8 photos", "2 outfits", "Premium editing", "All digital formats"],
            popular: false,
            category: "Solo"
        },
    ];

    // Handle touch events for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsSwiping(true);
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;

        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;

        // Prevent vertical scroll during horizontal swipe
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isSwiping) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex < packages.length - 1) {
                // Swipe left - next
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous
                setCurrentIndex(prev => prev - 1);
            }
        }

        setIsSwiping(false);
    };

    // Scroll carousel to current index
    useEffect(() => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.clientWidth * 0.85; // 85vw
            const scrollPosition = currentIndex * (cardWidth + 16); // card width + gap

            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);

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

    return (
        <section id="packages" className="py-8 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
                        Popular Packages
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        Swipe to see more packages
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Swipe Instructions */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="text-xs text-gray-500 flex items-center">
                            <span className="mr-1">←</span> Swipe
                        </div>
                        <div className="text-xs text-gray-500">
                            {currentIndex + 1} / {packages.length}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                            Swipe <span className="ml-1">→</span>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            touchAction: 'pan-y'
                        }}
                    >
                        <div className="flex gap-4 px-4">
                            {packages.map((pkg, index) => (
                                <div
                                    key={pkg.id}
                                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center"
                                >
                                    {/* Package Card */}
                                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                                        {/* Popular Badge */}
                                        {pkg.popular && (
                                            <div className="inline-block bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        {/* Package Header */}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                                            <div className="text-2xl font-bold text-gray-900">{pkg.price}</div>
                                            <p className="text-sm text-gray-500 mt-1">{pkg.category}</p>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-gray-700">
                                                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                                                    <span className="text-[#D4AF37] text-sm">📸</span>
                                                </div>
                                                <span className="text-sm">{pkg.photos} professional photos</span>
                                            </div>

                                            <div className="flex items-center text-gray-700">
                                                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                                                    <span className="text-[#D4AF37] text-sm">👕</span>
                                                </div>
                                                <span className="text-sm">{pkg.outfits} outfit{pkg.outfits > 1 ? 's' : ''}</span>
                                            </div>

                                            <div className="flex items-center text-gray-700">
                                                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                                                    <span className="text-[#D4AF37] text-sm">⚡</span>
                                                </div>
                                                <span className="text-sm">Delivery in {pkg.deliveryTime}</span>
                                            </div>
                                        </div>

                                        {/* Features List */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">INCLUDES:</h4>
                                            <ul className="space-y-1">
                                                {pkg.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center text-sm text-gray-600">
                                                        <span className="text-[#D4AF37] mr-2">✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Select Button - ALWAYS VISIBLE */}
                                        <button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors active:scale-[0.98]"
                                        >
                                            Select Package
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots - PROPER SIZE */}
                    <div className="flex justify-center items-center gap-1.5 mt-6">
                        {packages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`rounded-full transition-all ${index === currentIndex
                                    ? 'w-2 h-2 bg-[#D4AF37]'
                                    : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to package ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* View All Packages Link */}
                    <div className="text-center mt-8">
                        <a
                            href="/individuals/packages"
                            className="inline-block text-[#D4AF37] font-semibold hover:text-[#b8941f] transition-colors text-sm"
                        >
                            View all packages →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}