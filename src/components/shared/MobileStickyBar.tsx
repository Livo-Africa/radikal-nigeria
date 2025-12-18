// src/components/shared/MobileStickyBar.tsx
'use client';
import { Camera, Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileStickyBar() {
    const [isVisible, setIsVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        // Only show on mobile
        const checkIfMobile = () => {
            return window.innerWidth < 768;
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show if we're past 200px from top (below hero) AND on mobile
            if (checkIfMobile()) {
                if (currentScrollY > 200) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            } else {
                setIsVisible(false); // Always hide on desktop
            }

            // Hide when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Hide when scrolling down
            }

            setLastScrollY(currentScrollY);
        };

        // Initial check
        setIsVisible(checkIfMobile() && window.scrollY > 200);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            setIsVisible(checkIfMobile() && window.scrollY > 200);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', () => {
                setIsVisible(checkIfMobile() && window.scrollY > 200);
            });
        };
    }, [lastScrollY]);

    return (
        <>
            {/* Mobile Sticky Bar - Hidden on desktop */}
            <div className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}>
                <div className="bg-white border-t border-gray-200 shadow-lg">
                    <div className="container mx-auto px-4 py-3">
                        <div className="grid grid-cols-2 gap-3">
                            {/* Individual CTA */}
                            <a
                                href="/individuals"
                                className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-shadow active:scale-95"
                            >
                                <Camera className="w-4 h-4" />
                                <span className="text-sm">Start Photoshoot</span>
                            </a>

                            {/* Business CTA */}
                            <a
                                href="/business"
                                className="bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transition-shadow active:scale-95"
                            >
                                <Building2 className="w-4 h-4" />
                                <span className="text-sm">Business Solutions</span>
                            </a>
                        </div>

                        {/* Optional: Add a small indicator that it's sticky */}
                        <div className="text-center mt-1">
                            <div className="w-8 h-1 bg-gray-300 rounded-full mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add padding to bottom of page on mobile to prevent content hiding behind bar */}
            <style jsx global>{`
        @media (max-width: 767px) {
          body {
            padding-bottom: 80px;
          }
        }
      `}</style>
        </>
    );
}