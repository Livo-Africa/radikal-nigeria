'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            title: "Elevate Your Brand",
            subtitle: "Premium Visual Solutions for Growth-Focused Businesses"
        },
        {
            title: "Scale With Confidence",
            subtitle: "End-to-End Creative & Technology Solutions"
        },
        {
            title: "Results That Matter",
            subtitle: "Data-Driven Design That Converts"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen md:min-h-screen overflow-hidden bg-[#0A0A0F] pt-20">
            {/* Ambient Glow Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-500/8 rounded-full blur-[100px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[140px]"></div>
            </div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }}></div>

            {/* Content */}
            <div className="relative z-10 flex items-center min-h-[calc(100vh-5rem)]">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">

                        {/* Badge — Glass Morphism */}
                        <div className="inline-flex items-center bg-white/5 backdrop-blur-xl border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-[0_0_20px_rgba(212,175,55,0.08)]">
                            <Building2 className="w-4 h-4 mr-2 text-[#D4AF37]" />
                            <span>Premium Business Solutions</span>
                        </div>

                        {/* Desktop: Carousel Headlines */}
                        <div className="hidden md:block">
                            <div className="relative h-[160px] lg:h-[180px] mb-6">
                                {heroSlides.map((slide, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-700 ${index === currentSlide
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4'
                                            }`}
                                    >
                                        <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-white font-playfair leading-tight">
                                            {slide.title.split(' ').slice(0, -1).join(' ')}{' '}
                                            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent">
                                                {slide.title.split(' ').slice(-1)}
                                            </span>
                                        </h1>
                                        <p className="text-xl lg:text-2xl xl:text-3xl font-light bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mt-4">
                                            {slide.subtitle}
                                        </p>
                                    </div>
                                ))}
                            </div>


                        </div>

                        {/* Mobile: Minimal Static Hero */}
                        <div className="md:hidden mb-8">
                            <h1 className="text-4xl font-bold text-white font-playfair leading-tight mb-3">
                                Elevate Your{' '}
                                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">Brand</span>
                            </h1>
                            <p className="text-lg font-light bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                                Premium Solutions for Growth-Focused Brands
                            </p>
                        </div>

                        {/* Description — Hidden on mobile for compactness */}
                        <p className="hidden md:block text-base md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Transform your <span className="text-[#D4AF37] font-semibold">brand presence</span> with
                            professional design, photography, development, and strategic solutions
                            that <span className="text-[#D4AF37] font-semibold">drive real business results</span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 md:mb-0">
                            {/* Primary — Amber Gradient */}
                            <a
                                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20need%20business%20solutions%20for%20my%20brand.%20Can%20we%20discuss%20my%20needs?"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex justify-center items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]"
                            >
                                <span>Book a Consultation</span>
                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </a>

                            {/* Secondary — Glass */}
                            <a
                                href="#services"
                                className="inline-flex justify-center items-center bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                            >
                                View Services
                            </a>
                        </div>

                        {/* Desktop-only: Trust Stats — Glass Cards */}
                        <div className="hidden md:grid grid-cols-3 gap-4 mt-14 pt-8 border-t border-white/10 max-w-md mx-auto">
                            {[
                                { number: "100+", label: "Brands Served" },
                                { number: "95%", label: "Satisfaction" },
                                { number: "48h", label: "Avg Turnaround" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="text-white font-bold text-lg">{stat.number}</div>
                                    <div className="text-white/50 text-xs">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
