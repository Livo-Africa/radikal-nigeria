// components/individuals/MobileHeader.tsx
'use client';

export default function MobileHeader() {
    return (
        <section className="min-h-[30vh] bg-gradient-to-br from-[#D4AF37]/20 via-black/95 to-black pt-8 pb-12">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                {/* Main Value Proposition */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white font-playfair leading-tight mb-3">
                        Virtual Photoshoot Studio
                    </h1>
                    <p className="text-[#D4AF37] text-base md:text-lg">
                        Professional Results in 1-3 Hours
                    </p>
                </div>

                {/* Trust Signals - Row 1 */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-3">
                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <span className="text-[#D4AF37] mr-2">★</span>
                        <span className="text-white text-sm md:text-base">
                            <span className="font-bold">4.9/5</span> from 700+ clients
                        </span>
                    </div>
                </div>

                {/* Trust Signals - Row 2 */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                    <div className="flex items-center text-white/90">
                        <span className="text-[#D4AF37] mr-2">⚡</span>
                        <span className="text-sm md:text-base">1-3h delivery</span>
                    </div>

                    <div className="hidden md:block text-white/50">•</div>

                    <div className="flex items-center text-white/90">
                        <span className="text-[#D4AF37] mr-2">💬</span>
                        <span className="text-sm md:text-base">24/7 WhatsApp</span>
                    </div>

                    <div className="hidden md:block text-white/50">•</div>

                    <div className="flex items-center text-white/90">
                        <span className="text-[#D4AF37] mr-2">🔄</span>
                        <span className="text-sm md:text-base">Free revisions</span>
                    </div>
                </div>

                {/* Quick CTA (Optional) */}
                <div className="mt-6">
                    <a
                        href="#packages"
                        className="inline-block bg-[#D4AF37] text-black font-semibold py-2 px-6 rounded-lg hover:bg-[#b8941f] transition-colors text-sm"
                    >
                        View Packages
                    </a>
                </div>
            </div>
        </section>
    );
}