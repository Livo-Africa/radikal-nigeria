// src/components/individuals/UnifiedPackageSection.tsx - PREMIUM DARK MODE REDESIGN
'use client';

import { useState } from 'react';
import PackageCarousel from './PackageCarousel';
import PackageShowcase from './PackageShowcase';

export default function UnifiedPackageSection() {
    const [country, setCountry] = useState<'GH' | 'NG'>('GH');

    return (
        <section className="bg-[#0A0A0F] relative overflow-hidden">
            {/* Subtle Ambient Glow Behind Tabs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-amber-500/8 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Country Selector */}
            <div className="container mx-auto px-4 py-6 md:py-10 relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Modern Segmented Control - Apple/Uber Style */}
                    <div className="bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl inline-flex relative border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                        {/* Animated Sliding Background */}
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${country === 'GH'
                                    ? 'left-1.5 bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                                    : 'left-[calc(50%+1.5px)] bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                                }`}
                        />

                        {/* Ghana Button */}
                        <button
                            onClick={() => setCountry('GH')}
                            className={`relative z-10 flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${country === 'GH'
                                    ? 'text-black'
                                    : 'text-white/50 hover:text-white/70'
                                }`}
                        >
                            <span className="text-lg">🇬🇭</span>
                            Ghana
                        </button>

                        {/* Nigeria Button */}
                        <button
                            onClick={() => setCountry('NG')}
                            className={`relative z-10 flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${country === 'NG'
                                    ? 'text-black'
                                    : 'text-white/50 hover:text-white/70'
                                }`}
                        >
                            <span className="text-lg">🇳🇬</span>
                            Nigeria
                        </button>
                    </div>

                    <p className="text-xs text-white/30 font-medium">
                        Viewing packages for {country === 'GH' ? 'Ghana' : 'Nigeria'}
                    </p>
                </div>
            </div>

            {/* Content Swapping */}
            <div className="relative min-h-[400px]">
                {/* Mobile View */}
                <div className="block md:hidden">
                    <PackageCarousel country={country} />
                </div>

                {/* Desktop View */}
                <div className="hidden md:block">
                    <PackageShowcase country={country} />
                </div>
            </div>
        </section>
    );
}
