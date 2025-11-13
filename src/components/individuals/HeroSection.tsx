
'use client';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [currentTransform, setCurrentTransform] = useState(0);
  
  const transformations = [
    {
      before: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=600&fit=crop"
    },
    {
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop", 
      after: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=500&h=600&fit=crop"
    },
    {
      before: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=600&fit=crop",
      after: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTransform((prev) => (prev + 1) % transformations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [transformations.length]);

  return (
    <section className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Split-screen background - KEEPING YOUR DESIGN */}
      <div className="absolute inset-0 flex">
        {/* Before side */}
        <div className="flex-1 relative">
          <img 
            src={transformations[currentTransform].before}
            alt="Before transformation"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        
        {/* After side */}
        <div className="flex-1 relative">
          <img 
            src={transformations[currentTransform].after}
            alt="After transformation" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-playfair">
          Virtual Photoshoot Studio
        </h1>
        <p className="text-xl md:text-2xl text-[#D4AF37] mb-8 max-w-2xl mx-auto">
          Professional Results in 1-3 Hours
        </p>
        
        {/*  CTA */}
        <a 
          href="/individuals/style-journey"
          className="inline-block bg-[#D4AF37] hover:bg-[#b8941f] text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
        >
          Start Photoshoot
        </a>
      </div>
    </section>
  );
}