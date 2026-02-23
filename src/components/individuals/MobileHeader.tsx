// components/individuals/MobileHeader.tsx - PREMIUM DARK MODE REDESIGN
'use client';

export default function MobileHeader() {
    return (
        <section className="min-h-[30vh] bg-gradient-to-br from-amber-500/10 via-[#0A0A0F] to-[#0A0A0F] pt-8 pb-12 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-10">
                {/* Main Value Proposition */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white font-playfair leading-tight mb-3">
                        Virtual Photoshoot Studio
                    </h1>
                    <p className="text-base md:text-lg bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-medium">
                        Professional Results in 1-3 Hours
                    </p>
                </div>

                {/* Trust Signals - Row 1 */}
                <div className="flex flex-wrap justify-center items-center gap-4 mb-3">
                    <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl">
                        <span className="text-amber-400 mr-2">★</span>
                        <span className="text-white text-sm md:text-base">
                            <span className="font-bold">4.9/5</span> <span className="text-white/60">from 700+ clients</span>
                        </span>
                    </div>
                </div>

                {/* Trust Signals - Row 2 */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                    <div className="flex items-center text-white/80">
                        <span className="text-amber-400 mr-2">⚡</span>
                        <span className="text-sm md:text-base">1-3h delivery</span>
                    </div>

                    <div className="hidden md:block text-white/20">•</div>

                    <div className="flex items-center text-white/80">
                        <span className="text-amber-400 mr-2">💬</span>
                        <span className="text-sm md:text-base">24/7 WhatsApp</span>
                    </div>

                    <div className="hidden md:block text-white/20">•</div>

                    <div className="flex items-center text-white/80">
                        <span className="text-amber-400 mr-2">🔄</span>
                        <span className="text-sm md:text-base">Free revisions</span>
                    </div>
                </div>

                {/* Quick CTA */}
                <div className="mt-6">
                    <a
                        href="#packages"
                        className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold py-2.5 px-6 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] text-sm"
                    >
                        View Packages
                    </a>
                </div>
            </div>
        </section>
    );
}