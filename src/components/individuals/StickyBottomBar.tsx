// components/individuals/StickyBottomBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Package, X } from 'lucide-react';

export default function StickyBottomBar() {
    const [isVisible, setIsVisible] = useState(false);
    const [showWhatsAppBanner, setShowWhatsAppBanner] = useState(true);
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
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });

        return () => window.removeEventListener('scroll', throttledScroll);
    }, []);

    const handleWhatsAppClick = () => {
        window.open(
            'https://wa.me/233207472307?text=Hi%20Radikal!%20I%20have%20questions%20about%20your%20virtual%20photoshoots',
            '_blank'
        );
    };

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
        <>
            {/* WhatsApp Banner (Only shows when scrolling up) */}
            {showWhatsAppBanner && scrollDirection === 'up' && (
                <div className="fixed bottom-24 left-0 right-0 z-40 px-4 animate-slideUp">
                    <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl p-4 shadow-lg relative">
                        <button
                            onClick={() => setShowWhatsAppBanner(false)}
                            className="absolute top-2 right-2 text-white/80 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">Need help?</p>
                                <p className="text-xs opacity-90">Chat with us on WhatsApp</p>
                            </div>
                            <button
                                onClick={handleWhatsAppClick}
                                className="bg-white text-[#25D366] text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Chat Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Quick Info */}
                        <div className="hidden sm:block">
                            <div className="flex items-center text-sm">
                                <span className="text-[#D4AF37] mr-2">⚡</span>
                                <span className="text-gray-700">1-3h delivery</span>
                            </div>
                            <div className="text-xs text-gray-500">100% satisfaction guarantee</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex-1 flex gap-3 sm:justify-end">
                            <button
                                onClick={() => window.location.href = '/individuals/packages'}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Package className="w-4 h-4" />
                                <span className="hidden sm:inline">Packages</span>
                                <span className="sm:hidden">View All</span>
                            </button>

                            <button
                                onClick={handleBookNow}
                                className="flex-1 sm:flex-none bg-[#D4AF37] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#c19c2d] transition-colors shadow-lg shadow-[#D4AF37]/25 active:scale-95 transition-transform"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}