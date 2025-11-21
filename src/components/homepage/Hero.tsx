// src/components/homepage/Hero.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Camera, Building, Zap, Star, Users } from 'lucide-react';

interface Symbol {
  id: number;
  svg: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
  duration: number;
}

export default function Hero() {
  const [currentSubheading, setCurrentSubheading] = useState(0);
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const symbolCount = useRef(0);
  const maxSymbols = 8; // Maximum symbols on screen at once
  
  const subheadings = [
    "Studio photos without the studio",
    "Premium Visuals at Revolutionary Speed", 
    "Your Creative Partner in the Digital Age"
  ];

  // SVG symbols data
  const symbolTemplates = [
    {
      name: "Gye Nyame",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744 1052" fill="currentColor">
        <path d="M372 0C166 0 0 166 0 372s166 372 372 372 372-166 372-372S578 0 372 0z"/>
      </svg>`
    },
    {
      name: "Adinkrahene",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744 1052" fill="currentColor">
        <circle cx="372" cy="526" r="300" stroke="currentColor" fill="none" stroke-width="20"/>
        <circle cx="372" cy="526" r="150" stroke="currentColor" fill="none" stroke-width="20"/>
      </svg>`
    },
    {
      name: "Sankofa",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 744 1052" fill="currentColor">
        <path d="M372 100c-150 0-272 122-272 272s122 272 272 272 272-122 272-272S522 100 372 100z"/>
      </svg>`
    },
    {
      name: "Nsibidi Autonym",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244 186" fill="currentColor">
        <path d="M20 150 L120 30 L220 150 Z" stroke="currentColor" fill="none" stroke-width="8"/>
      </svg>`
    },
    {
      name: "Cowrie",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
        <path d="M20,50 Q50,10 80,50 Q50,90 20,50 Z" stroke="currentColor" fill="none" stroke-width="3"/>
        <path d="M35,45 Q50,35 65,45" stroke="currentColor" fill="none" stroke-width="2"/>
      </svg>`
    },
    {
      name: "Nsibidi Three Letters",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 617 487" fill="currentColor">
        <path d="M100 200 L200 100 L300 200 Z" stroke="currentColor" fill="none" stroke-width="8"/>
      </svg>`
    },
    {
      name: "Yin Yang",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 0a256 256 0 100 512 256 256 0 000-512zm0 128a128 128 0 010 256 128 128 0 010-256z"/>
        <circle cx="256" cy="160" r="32" fill="white"/>
        <circle cx="256" cy="352" r="32" fill="black"/>
      </svg>`
    },
    {
      name: "Infinity",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" fill="currentColor">
        <path d="M10 25c0-8 6-15 15-15s15 7 25 15-10 15-25 15-15-7-15-15zM50 25c10-8 15-15 25-15s15 7 15 15-6 15-15 15-15-7-25-15z" fill="none" stroke="currentColor" stroke-width="3"/>
      </svg>`
    }
  ];

  const colors = [
    '#D4AF37', // Gold
    '#F4D03F', // Yellow
    '#FFFFFF', // White
    '#E8C872', // Light Gold
    '#F7DC6F'  // Pale Yellow
  ];

  const createSymbol = (): Symbol => {
    const template = symbolTemplates[Math.floor(Math.random() * symbolTemplates.length)];
    return {
      id: symbolCount.current++,
      svg: template.svg,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * 360,
      delay: Math.random() * 2000,
      duration: 8000 + Math.random() * 7000
    };
  };

  useEffect(() => {
    const subheadingInterval = setInterval(() => {
      setCurrentSubheading((prev) => (prev + 1) % subheadings.length);
    }, 3000);

    // Initial symbols
    const initialSymbols = Array.from({ length: 4 }, createSymbol);
    setSymbols(initialSymbols);

    // Add new symbols periodically
    const symbolInterval = setInterval(() => {
      setSymbols(current => {
        if (current.length >= maxSymbols) {
          return current.slice(1);
        }
        return [...current, createSymbol()];
      });
    }, 2000);

    return () => {
      clearInterval(subheadingInterval);
      clearInterval(symbolInterval);
    };
  }, []);

  return (
    <section className="pt-16 min-h-[90vh] md:min-h-[100vh] flex items-center justify-center relative overflow-hidden bg-black">
      {/* Animated Background with Cultural Symbols */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Cultural Symbols */}
        {symbols.map((symbol) => {
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={symbol.id}
              className="absolute pointer-events-none"
              style={{
                left: `${symbol.x}%`,
                top: `${symbol.y}%`,
                transform: `scale(${symbol.scale}) rotate(${symbol.rotation}deg)`,
                animation: `symbolFloat ${symbol.duration}ms ease-in-out ${symbol.delay}ms infinite`,
                color: color,
                opacity: 0.1 + Math.random() * 0.15
              }}
              dangerouslySetInnerHTML={{ __html: symbol.svg }}
            />
          );
        })}

        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#D4AF37]/20 to-[#F4D03F]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#F4D03F]/10 to-[#D4AF37]/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2000ms'}}></div>
        
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-shimmer"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent animate-shimmer" style={{animationDelay: '1000ms'}}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-2xl md:max-w-4xl mx-auto">
          
          {/* Headline with Enhanced Styling */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-4 tracking-tight leading-tight">
              Advanced
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent font-semibold animate-gradient-x">
                  Creative
                </span>
              </span>
              <br />
              Solutions
            </h1>
          </div>
          
          {/* Animated Subheading */}
          <div className="h-16 md:h-20 mb-6 md:mb-8 flex items-center justify-center">
            <div className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light transition-all duration-500 px-4">
              {subheadings[currentSubheading]}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 px-4">
            <a 
              href="/individuals"
              className="w-full sm:w-auto group bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-[#b8941f] hover:to-[#d4b83d] text-black font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Camera className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
              <span className="relative z-10">Start Photoshoot</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </a>
            
            <a 
              href="/business"
              className="w-full sm:w-auto group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 border border-white/30 hover:border-white/50 flex items-center justify-center space-x-2"
            >
              <Building className="w-4 h-4 md:w-5 md:h-5" />
              <span>Explore Business Solutions</span>
            </a>
          </div>

          {/* Social Proof */}
          <div className="hidden md:grid grid-cols-3 gap-8 max-w-md mx-auto text-white/80">
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-green-400 mb-2" />
              <div className="text-2xl font-bold">1-3h</div>
              <div className="text-sm">Delivery</div>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
              <Star className="w-6 h-6 text-yellow-400 mb-2" />
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-sm">Rating</div>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm">Clients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes symbolFloat {
          0% {
            transform: translateY(100vh) scale(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            transform: translateY(80vh) scale(0.5) rotate(90deg);
            opacity: 0.3;
          }
          30% {
            transform: translateY(60vh) scale(0.8) rotate(180deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(40vh) scale(1) rotate(270deg);
            opacity: 0.3;
          }
          70% {
            transform: translateY(20vh) scale(0.8) rotate(360deg);
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100px) scale(0) rotate(450deg);
            opacity: 0;
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}