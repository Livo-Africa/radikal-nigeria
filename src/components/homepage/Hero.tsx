// src/components/homepage/Hero.tsx - MOBILE FIRST
'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Play, Camera, Building, Zap,Star,Users  } from 'lucide-react';

export default function Hero() {
  const [currentSubheading, setCurrentSubheading] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  
  // Mobile-optimized content
  const subheadings = [
    "Studio photos without the studio",
    "Premium Visuals at Revolutionary Speed", 
    "Your Creative Partner in the Digital Age"
  ];

  const backgroundImages = [
    "https://i.postimg.cc/W4NDFNBY/RADIKAL-03.jpg",
    "https://i.postimg.cc/wBqtyqCb/RADIKAL-04.jpg", 
    "https://i.postimg.cc/9MzrbxFg/RADIKAL-21.jpg",
  ];

  useEffect(() => {
    const subheadingInterval = setInterval(() => {
      setCurrentSubheading((prev) => (prev + 1) % subheadings.length);
    }, 3000);

    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => {
      clearInterval(subheadingInterval);
      clearInterval(imageInterval);
    };
  }, []);

  return (
    <section className="pt-16 min-h-[90vh] md:min-h-[100vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
      
      {/* Gradient Overlay - Enhanced for mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black/85 md:from-black/80 md:via-black/60 md:to-black/80"></div>

      {/* Main Content - Mobile Optimized */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-2xl md:max-w-4xl mx-auto">
          
          {/* Headline - Mobile First */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-4 md:mb-6 tracking-tight leading-tight">
            Advanced Creative
            <br />
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent font-semibold">
              Solutions
            </span>
          </h1>
          
          {/* Subheading - Mobile Optimized */}
          <div className="h-16 md:h-20 mb-6 md:mb-8 flex items-center justify-center">
            <div className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light transition-all duration-500 px-4">
              {subheadings[currentSubheading]}
            </div>
          </div>

          {/* CTA Buttons - Stacked on Mobile */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4">
            {/* Primary CTA - Full width on mobile */}
            <a 
              href="/individuals"
              className="w-full sm:w-auto group bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl flex items-center justify-center space-x-2"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
              <span>Start Photoshoot</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            {/* Secondary CTA - Less prominent on mobile */}
            <a 
              href="/business"
              className="w-full sm:w-auto group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 border border-white/30 hover:border-white/50 flex items-center justify-center space-x-2"
            >
              <Building className="w-4 h-4 md:w-5 md:h-5" />
              <span>Explore Business Solutions</span>
            </a>
          </div>

          {/* Social Proof - Hidden on mobile, visible on desktop */}
          <div className="hidden md:grid grid-cols-3 gap-8 max-w-md mx-auto text-white/80 mb-0">
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 text-green-400 mb-2" />
              <div className="text-2xl font-bold">1-3h</div>
              <div className="text-sm">Delivery</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm">Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Completely hidden */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:flex animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/70" />
      </div> */}

      {/* Image Navigation - Minimal on mobile */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1 md:space-x-2 z-10">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentImage 
                ? 'bg-[#D4AF37] scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            } w-1.5 h-1.5 md:w-2 md:h-2`}
            aria-label={`Go to background ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}