// src/components/homepage/Pillars.tsx - MOBILE SIMPLIFIED HORIZONTAL, DESKTOP CARDS
'use client';
import { useState, useEffect } from 'react';
import { Crown, Cpu, TrendingUp, ArrowRight } from 'lucide-react';

export default function Pillars() {
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pillars = [
    {
      id: 1,
      title: 'CLASS',
      description: 'Premium visual language rooted in elegance and professional finesse',
      quote: 'We believe in quality that speaks for itself',
      icon: Crown,
      color: 'from-[#D4AF37] to-[#F4D03F]',
      mobileSubtext: 'Elegance & Professionalism'
    },
    {
      id: 2,
      title: 'TECHNOLOGY',
      description: 'Advanced digital tools redefining creative possibilities',
      quote: 'We leverage cutting-edge technology to enhance, not replace, human creativity',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      mobileSubtext: 'Advanced Digital Tools'
    },
    {
      id: 3,
      title: 'FUTURE',
      description: 'Forward-thinking creativity anticipating market trends and evolving needs',
      quote: 'We\'re not just keeping up - we\'re paving the way',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      mobileSubtext: 'Forward-Thinking Creativity'
    }
  ];

  return (
    <section className="py-8 md:py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Header - Same for both */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            Our Three <span className="text-[#D4AF37]">Pillars</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            The foundation of everything we do at Radikal
          </p>
        </div>

        {/* =============================================== */}
        {/* MOBILE VIEW: Simplified Horizontal Row */}
        {/* =============================================== */}
        <div className="block md:hidden">
          <div className="max-w-md mx-auto">
            {/* Three Pillars in a Horizontal Row */}
            <div className="flex flex-row justify-between items-start gap-4">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <div key={pillar.id} className="flex-1 text-center">
                    {/* Icon */}
                    <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-3`}>
                      <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold mb-1 text-[#D4AF37] leading-tight">
                      {pillar.title}
                    </h3>

                    {/* Subtext */}
                    <p className="text-xs text-gray-400 leading-tight">
                      {pillar.mobileSubtext}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Optional: Simple separator line */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-center text-sm text-gray-400">
                The core principles guiding every project
              </p>
            </div>
          </div>
        </div>

        {/* =============================================== */}
        {/* DESKTOP VIEW: Original Card Layout */}
        {/* =============================================== */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Enhanced Icon */}
              <div className={`w-20 h-20 md:w-20 md:h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <pillar.icon className="w-10 h-10 md:w-10 md:h-10" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-[#D4AF37] group-hover:text-white transition-colors">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 mb-6 text-base leading-relaxed">
                {pillar.description}
              </p>

              {/* Quote */}
              <blockquote className="text-base italic text-[#D4AF37]/80 mb-8 leading-relaxed">
                "{pillar.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Desktop only */}
        <div className="hidden md:text-center mt-12">
          <a
            href="/about"
            className="inline-flex items-center space-x-3 bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <span>Learn More About Our Philosophy</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}