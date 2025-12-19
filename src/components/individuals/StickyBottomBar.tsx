// components/individuals/StickyBottomBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

// Simple icon components
const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

export default function StickyBottomBar() {
    const [isVisible, setIsVisible] = useState(false);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine scroll direction
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;

            // Show sticky bar after user scrolls past 300px
            if (currentScrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Throttle scroll events
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });

        return () => window.removeEventListener('scroll', throttledScroll);
    }, []);

    const handleBookNow = () => {
        // Scroll to packages or start booking flow
        const packagesSection = document.getElementById('packages');
        if (packagesSection) {
            packagesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = '/individuals/style-journey';
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">

                    {/* Action Buttons */}
                    <div className="flex-1 flex gap-3 sm:justify-end">
                        <button
                            onClick={() => window.location.href = '/individuals/packages'}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors active:scale-95"
                        >
                            <div className="flex items-center">
                                <PackageIcon />
                            </div>
                            <span className="hidden sm:inline">Packages</span>
                            <span className="sm:hidden">View All</span>
                        </button>

                        <button
                            onClick={handleBookNow}
                            className="flex-1 sm:flex-none bg-[#D4AF37] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#c19c2d] transition-colors shadow-lg shadow-[#D4AF37]/25 active:scale-95"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}