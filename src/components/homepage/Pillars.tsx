// src/components/homepage/Pillars.tsx - MOBILE SIMPLIFIED, DESKTOP CARDS
'use client';
import { useState, useEffect } from 'react';
import { Crown, Cpu, TrendingUp, ArrowRight, Info } from 'lucide-react';

export default function Pillars() {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);

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
      shortDescription: 'Elegance & Professionalism'
    },
    {
      id: 2,
      title: 'TECHNOLOGY',
      description: 'Advanced digital tools redefining creative possibilities',
      quote: 'We leverage cutting-edge technology to enhance, not replace, human creativity',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      shortDescription: 'Advanced Digital Tools'
    },
    {
      id: 3,
      title: 'FUTURE',
      description: 'Forward-thinking creativity anticipating market trends and evolving needs',
      quote: 'We\'re not just keeping up - we\'re paving the way',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      shortDescription: 'Forward-Thinking Creativity'
    }
  ];

  const togglePillar = (id: number) => {
    setExpandedPillar(expandedPillar === id ? null : id);
  };

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
        {/* MOBILE VIEW: Simplified Icon Grid */}
        {/* =============================================== */}
        <div className="block md:hidden">
          <div className="max-w-md mx-auto">
            {/* Three Pillars Grid - Simple Icons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                const isExpanded = expandedPillar === pillar.id;

                return (
                  <div key={pillar.id} className="text-center">
                    {/* Icon Button */}
                    <button
                      onClick={() => togglePillar(pillar.id)}
                      className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-2 transition-all duration-300 transform ${isExpanded ? 'scale-110 ring-4 ring-white/20' : 'hover:scale-105'
                        }`}
                      aria-label={`Learn about ${pillar.title}`}
                    >
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </button>

                    {/* Title */}
                    <div className="text-center">
                      <h3 className="text-sm font-bold mb-1 text-[#D4AF37]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {pillar.shortDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Expandable Details - Shows one at a time */}
            {expandedPillar && (
              <div className="mt-6">
                {pillars.map((pillar) => {
                  if (pillar.id !== expandedPillar) return null;

                  return (
                    <div
                      key={pillar.id}
                      className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 animate-fadeIn"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-bold text-[#D4AF37]">
                          {pillar.title}
                        </h3>
                        <button
                          onClick={() => setExpandedPillar(null)}
                          className="text-gray-400 hover:text-white"
                          aria-label="Close details"
                        >
                          ×
                        </button>
                      </div>

                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {pillar.description}
                      </p>

                      <blockquote className="text-sm italic text-[#D4AF37]/80 border-l-2 border-[#D4AF37] pl-4 py-2 mb-6 leading-relaxed">
                        "{pillar.quote}"
                      </blockquote>

                      {/* Expand Indicator */}
                      <div className="text-center pt-4 border-t border-gray-800">
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                          <Info className="w-3 h-3" />
                          <span>Tap other icons to learn more</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Default State - If nothing expanded */}
            {!expandedPillar && (
              <div className="text-center mt-6">
                <p className="text-gray-400 text-sm mb-4">
                  Tap on any icon to learn more about our pillars
                </p>

                {/* Quick Description Cards */}
                <div className="space-y-3">
                  {pillars.map((pillar) => (
                    <div
                      key={pillar.id}
                      className="bg-gray-900/50 rounded-xl p-3 border border-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${pillar.color} rounded-lg flex items-center justify-center`}>
                          <pillar.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="font-semibold text-sm text-white">
                            {pillar.title}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {pillar.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        {/* Bottom CTA - Desktop only (hiding on mobile per your request) */}
        <div className="hidden md:text-center mt-12">
          <a
            href="/about"
            className="inline-flex items-center space-x-3 bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
          >
            <span>Learn More About Our Philosophy</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile: Simple Learn More Link */}
        <div className="block md:hidden text-center mt-8">
          <a
            href="/about"
            className="inline-flex items-center space-x-2 text-[#D4AF37] hover:text-white font-medium text-sm transition-colors"
          >
            <span>Learn more about our philosophy</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}