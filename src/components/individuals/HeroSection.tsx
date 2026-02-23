// src/components/individuals/HeroSection.tsx - PREMIUM DARK MODE REDESIGN
'use client';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1920&h=1080&fit=crop",
      title: "Virtual Photoshoot Studio",
      subtitle: "Professional Results in 1-3 Hours"
    },
    {
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop",
      title: "Studio Quality Photos",
      subtitle: "From your phone to professional portfolio"
    },
    {
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1920&h=1080&fit=crop",
      title: "No Studio Required",
      subtitle: "Get perfect shots from anywhere"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Deeper Gradient Overlay for Dark Theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/70 to-black/40"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-500/8 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center pb-8 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge - Glass Morphism */}
            <div className="inline-flex items-center bg-white/5 backdrop-blur-xl border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium mb-8 shadow-[0_0_20px_rgba(232,185,78,0.1)]">
              <span className="mr-2 text-amber-400">⚡</span>
              Professional Photos in 1-3 Hours
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-playfair">
                {heroSlides[currentSlide].title}
              </h1>

              {/* Gradient Subtitle */}
              <p className="text-xl md:text-2xl lg:text-3xl font-light bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                {/* Primary CTA - Gradient with Glow */}
                <a
                  href="/individuals/style-journey"
                  className="inline-flex justify-center items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] min-w-[200px]"
                >
                  Start Photoshoot
                </a>

                {/* Secondary CTA - Glass */}
                <a
                  href="/individuals/packages"
                  className="inline-flex justify-center items-center bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 min-w-[200px]"
                >
                  View Packages
                </a>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`rounded-full transition-all duration-500 ${index === currentSlide
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 w-8 h-2 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'bg-white/30 hover:bg-white/50 w-2 h-2'
                    }`}
                />
              ))}
            </div>

            {/* Stats - Glass Cards */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-white/10 max-w-md mx-auto">
              {[
                { number: "500+", label: "Happy Clients" },
                { number: "4.9", label: "Rating" },
                { number: "3h", label: "Avg Delivery" }
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