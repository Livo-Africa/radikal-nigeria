// src/components/individuals/HeroSection.tsx - FIXED FOR LARGE SCREENS
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
      {/* Background Slides - Fixed for Large Screens */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image - Fixed to cover properly */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content - Centered on All Screens */}
      <div className="relative h-full flex items-center justify-center pb-8 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center"> {/* Added mx-auto and text-center */}
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">⚡</span>
              Professional Photos in 1-3 Hours
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight font-playfair">
                {heroSlides[currentSlide].title}
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-[#D4AF37] font-light">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Buttons - Centered */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center"> {/* Added justify-center */}
                <a 
                  href="/individuals/style-journey"
                  className="inline-flex justify-center items-center bg-[#D4AF37] hover:bg-[#b8941f] text-black font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl min-w-[200px]"
                >
                  Start Photoshoot
                </a>
                
                <a 
                  href="/individuals/packages"
                  className="inline-flex justify-center items-center bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-2xl text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm min-w-[200px]"
                >
                  View Packages
                </a>
              </div>
            </div>

            {/* Progress Indicators - Centered */}
            <div className="flex justify-center space-x-2 mt-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#D4AF37] w-8' 
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>

            {/* Quick Stats - Centered */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20 max-w-md mx-auto"> {/* Added mx-auto */}
              {[
                { number: "500+", label: "Happy Clients" },
                { number: "4.9", label: "Rating" },
                { number: "3h", label: "Avg Delivery" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-white font-bold text-lg">{stat.number}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}