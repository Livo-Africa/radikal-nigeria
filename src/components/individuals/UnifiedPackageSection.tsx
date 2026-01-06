// src/components/individuals/UnifiedPackageSection.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import PackageCarousel from './PackageCarousel';
import PackageShowcase from './PackageShowcase';

export default function UnifiedPackageSection() {
    const [country, setCountry] = useState<'GH' | 'NG'>('GH');

    return (
        <section className="bg-white">
            {/* Country Selector - Sticky or just at top */}
            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Toggle Container */}
                    <div className="bg-gray-100 p-1.5 rounded-full inline-flex relative shadow-inner">
                        {/* Sliding Background */}
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-spring ${country === 'GH' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'
                                }`}
                        />

                        {/* Ghana Button */}
                        <button
                            onClick={() => setCountry('GH')}
                            className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${country === 'GH' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="text-lg">🇬🇭</span>
                            Ghana
                        </button>

                        {/* Nigeria Button */}
                        <button
                            onClick={() => setCountry('NG')}
                            className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-colors duration-300 ${country === 'NG' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="text-lg">🇳🇬</span>
                            Nigeria
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 font-medium">
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
