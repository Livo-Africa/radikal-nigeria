'use client';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentSubheading, setCurrentSubheading] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);
  
  const subheadings = [
    "Where Style Meets Digital Innovation",
    "Premium Visuals at Revolutionary Speed", 
    "Your Creative Partner in the Digital Age"
  ];

  // High-quality background images (replace with your actual images)
  const backgroundImages = [
    "https://i.postimg.cc/W4NDFNBY/RADIKAL-03.jpg",
    "https://i.postimg.cc/wBqtyqCb/RADIKAL-04.jpg", 
    "https://i.postimg.cc/9MzrbxFg/RADIKAL-21.jpg",
    "https://i.postimg.cc/B6ytVxXN/RADIKAL-20.jpg"
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
    <section className="pt-20 min-h-[100dvh] flex items-center justify-center relative overflow-hidden">
      {/* Background Images with Crossfade */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-10000 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
      
      {/* DARKER Overlay - Increased from 60% to 70% darkness */}
<<<<<<< HEAD
      <div className="absolute inset-0 bg-black/85"></div>
=======
      <div className="absolute inset-0 bg-black/90"></div>
>>>>>>> e1e346ece051adc775115da9107dfe196386e56d
      
      {/* Optional: Additional Gradient Overlay for Better Text Readability */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
        }}
      ></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#B91C1C]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#D4AF37] font-playfair drop-shadow-2xl">
          Virtual Photography Studio
        </h1>
        
        {/* Rotating Subheadings - CHANGED TO RED (#B91C1C) */}
        <div className="h-20 mb-8 flex items-center justify-center">
          <div className="text-xl md:text-2xl lg:text-3xl text-white font-light transition-all duration-500 transform hover:scale-105">
            {subheadings[currentSubheading]}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a 
            href="/individuals" 
            className="group bg-[#D4AF37] hover:bg-[#b8941f] text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/30 border-2 border-[#D4AF37] text-center"
          >
            <span className="flex items-center justify-center">
              Start Your Photoshoot 
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          
          <a 
            href="/business"
            className="group bg-transparent hover:bg-[#B91C1C] text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 border-2 border-[#B91C1C] hover:shadow-2xl hover:shadow-[#B91C1C]/30 text-center"
          >
            <span className="flex items-center justify-center">
              Explore Business Solutions
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
        </div>
<<<<<<< HEAD

       
=======
>>>>>>> e1e346ece051adc775115da9107dfe196386e56d
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImage 
                ? 'bg-[#D4AF37] scale-125 shadow-lg shadow-[#D4AF37]/50' 
                : 'bg-white/50 hover:bg-white/80 hover:scale-110'
            }`}
            aria-label={`Go to background image ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
