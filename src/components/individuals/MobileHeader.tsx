// components/individuals/MobileHeader.tsx
'use client';

export default function MobileHeader() {
    return (
        <section className="relative bg-gradient-to-br from-[#D4AF37]/90 via-black/95 to-black pt-6 pb-8 min-h-[30vh] max-h-[240px] flex flex-col justify-center">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-white/70 text-sm mb-4">
                    <a
                        href="/"
                        className="flex items-center hover:text-[#D4AF37] transition-colors"
                    >
                        ← Home
                    </a>
                    <span className="mx-2">•</span>
                    <span className="text-[#D4AF37]">Individuals</span>
                </div>

                {/* Main Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-playfair leading-tight">
                    Virtual Photoshoot Studio
                </h1>

                <p className="text-[#D4AF37] text-base mb-6">
                    Professional Results in 1-3 Hours
                </p>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <span className="text-[#D4AF37] mr-2">★</span>
                        <span className="text-white text-sm">
                            <span className="font-bold">4.9/5</span> from 700+ clients
                        </span>
                    </div>

                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                        <span className="text-[#D4AF37] mr-2">⚡</span>
                        <span className="text-white text-sm">
                            1-3h delivery
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}