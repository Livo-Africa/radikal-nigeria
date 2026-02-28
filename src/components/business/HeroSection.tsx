'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Building2, TrendingUp, Users, Clock } from 'lucide-react';

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
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-black pt-20">
            {/* Animated Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#B91C1C]/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-1/4 w-48 h-48 bg-red-500/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }}></div>

            {/* Content */}
            <div className="relative z-10 flex items-center min-h-[calc(100vh-5rem)]">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">

                        {/* Badge */}
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-[#D4AF37]/30 text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-glow">
                            <Building2 className="w-4 h-4 mr-2 text-[#D4AF37]" />
                            <span>Premium Business Solutions</span>
                        </div>

                        {/* Desktop: Carousel Headlines */}
                        <div className="hidden md:block">
                            <div className="relative h-[180px] lg:h-[200px] mb-6">
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
                                            <span className="gradient-text">{slide.title.split(' ').slice(-1)}</span>
                                        </h1>
                                        <p className="text-xl lg:text-2xl xl:text-3xl text-[#D4AF37] font-light mt-4">
                                            {slide.subtitle}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Slide Indicators */}
                            <div className="flex justify-center space-x-2 mb-10">
                                {heroSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide
                                                ? 'bg-[#D4AF37] w-10'
                                                : 'bg-white/30 w-4 hover:bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Mobile: Minimal Static Hero */}
                        <div className="md:hidden mb-8">
                            <h1 className="text-4xl font-bold text-white font-playfair leading-tight mb-4">
                                Business <span className="gradient-text">Excellence</span>
                            </h1>
                            <p className="text-lg text-[#D4AF37] font-light">
                                Premium Visual & Tech Solutions for Growth-Focused Brands
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-base md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Transform your <span className="text-[#D4AF37] font-semibold">brand presence</span> with
                            professional design, photography, development, and strategic solutions
                            that <span className="text-[#D4AF37] font-semibold">drive real business results</span>.
                        </p>

                        {/* CTA */}
                        <a
                            href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20need%20business%20solutions%20for%20my%20brand.%20Can%20we%20discuss%20my%20needs?"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
                        >
                            <span className="mr-2">💬</span>
                            <span>Get a Free Consultation</span>
                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                        </a>

                        {/* Trust Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-white/10 max-w-3xl mx-auto">
                            {[
                                { icon: TrendingUp, number: "3-5x", label: "Higher Engagement" },
                                { icon: Clock, number: "48h", label: "Avg Turnaround" },
                                { icon: Users, number: "95%", label: "Client Satisfaction" },
                                { icon: Building2, number: "100+", label: "Brands Served" }
                            ].map((stat, index) => (
                                <div key={index} className="text-center group">
                                    <stat.icon className="w-4 h-4 text-[#D4AF37]/60 mx-auto mb-1.5 group-hover:text-[#D4AF37] transition-colors" />
                                    <div className="text-white font-bold text-lg md:text-xl group-hover:text-[#D4AF37] transition-colors">{stat.number}</div>
                                    <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
