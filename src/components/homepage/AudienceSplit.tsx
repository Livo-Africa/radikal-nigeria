// src/components/homepage/AudienceSplit.tsx - MOBILE TABS (SIMPLIFIED)
'use client';
import { useState, useEffect } from 'react';
import { Camera, Building2, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AudienceSplit() {
  const [activeTab, setActiveTab] = useState<'individuals' | 'business' | 'creators'>('individuals');
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

  const audiences = {
    individuals: {
      id: 'individuals',
      title: "FOR INDIVIDUALS",
      description: "Virtual Photoshoot Studio",
      features: ["Studio Shots", "Couple Photos", "Occasions & Celebrations", "Personal Branding"],
      buttonText: "Start Photoshoot",
      link: "/individuals",
      bgGradient: "from-[#D4AF37]/5 to-[#D4AF37]/10",
      borderColor: "border-[#D4AF37]/30",
      icon: Camera,
      iconColor: "text-[#D4AF37]",
      buttonColor: "bg-[#D4AF37] hover:bg-[#b8941f]",

    },
    business: {
      id: 'business',
      title: "FOR BUSINESS",
      description: "Creative Technology Solutions",
      features: ["Product Imaging", "Brand Identity", "Social Media Management", "Marketing Visuals"],
      buttonText: "View Solutions",
      link: "/business",
      bgGradient: "from-[#B91C1C]/5 to-[#B91C1C]/10",
      borderColor: "border-[#B91C1C]/30",
      icon: Building2,
      iconColor: "text-[#B91C1C]",
      buttonColor: "bg-[#B91C1C] hover:bg-[#991b1b]",

    },
    creators: {
      id: 'creators',
      title: "FOR CREATORS",
      description: "Creative Partnership Network",
      features: ["White-label Services", "Portfolio Enhancement", "Creative Collaboration", "Revenue Growth"],
      buttonText: "Join Network",
      link: "/creators",
      bgGradient: "from-gray-100 to-gray-50",
      borderColor: "border-gray-300",
      icon: Users,
      iconColor: "text-gray-900",
      buttonColor: "bg-gray-900 hover:bg-black",

    }
  };

  const activeAudience = audiences[activeTab];

  return (
    <section className="py-8 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            Solutions for <span className="text-[#D4AF37]">Everyone</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Tailored solutions for individuals, businesses, and creators
          </p>
        </div>

        {/* =============================================== */}
        {/* MOBILE VIEW: Simple Tabbed Interface */}
        {/* =============================================== */}
        <div className="block md:hidden">
          <div className="max-w-md mx-auto">
            {/* Tab Navigation */}
            <div className="flex justify-between mb-6 bg-gray-100 rounded-2xl p-1 shadow-inner">
              <button
                onClick={() => setActiveTab('individuals')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-300 ${activeTab === 'individuals'
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <span className="text-2xl mb-1">📸</span>
                <span className="text-xs font-semibold">Individuals</span>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-300 ${activeTab === 'business'
                  ? 'bg-[#B91C1C] text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <span className="text-2xl mb-1">💼</span>
                <span className="text-xs font-semibold">Business</span>
              </button>

              <button
                onClick={() => setActiveTab('creators')}
                className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-300 ${activeTab === 'creators'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <span className="text-2xl mb-1">✨</span>
                <span className="text-xs font-semibold">Creators</span>
              </button>
            </div>

            {/* Active Tab Content - Always Expanded */}
            <div className={`bg-gradient-to-br ${activeAudience.bgGradient} rounded-2xl p-6 shadow-lg border ${activeAudience.borderColor} overflow-hidden transition-all duration-500`}>
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center ${activeAudience.iconColor} shadow-md`}>
                  <activeAudience.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {activeAudience.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#D4AF37]">
                    {activeAudience.description}
                  </p>
                </div>
              </div>

              {/* Features List - Always Visible */}
              <ul className="space-y-3 mb-6">
                {activeAudience.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={activeAudience.link}
                className={`w-full ${activeAudience.buttonColor} text-white text-center font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2`}
              >
                <span className="text-sm">{activeAudience.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Tab Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {Object.keys(audiences).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as 'individuals' | 'business' | 'creators')}
                  className={`w-2 h-2 rounded-full transition-all ${activeTab === key
                    ? key === 'individuals' ? 'bg-[#D4AF37] w-6'
                      : key === 'business' ? 'bg-[#B91C1C] w-6'
                        : 'bg-gray-900 w-6'
                    : 'bg-gray-300'
                    }`}
                  aria-label={`Switch to ${key} tab`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* =============================================== */}
        {/* DESKTOP VIEW: Original Grid Layout */}
        {/* =============================================== */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {Object.values(audiences).map((audience, index) => {
            const Icon = audience.icon;

            return (
              <div
                key={audience.id}
                className={`group relative bg-gradient-to-br ${audience.bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border ${audience.borderColor} overflow-hidden`}
              >
                {/* Enhanced Icon */}
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center ${audience.iconColor} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>

                <div className="relative z-10">
                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-black transition-colors">
                    {audience.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg font-semibold text-[#D4AF37] mb-6">
                    {audience.description}
                  </p>

                  {/* Enhanced Features */}
                  <ul className="mb-8 space-y-3">
                    {audience.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-gray-700 group-hover:text-gray-900 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Enhanced CTA Button */}
                  <a
                    href={audience.link}
                    className={`w-full ${audience.buttonColor} text-white text-center font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg border border-transparent flex items-center justify-center space-x-2`}
                  >
                    <span className="text-base">{audience.buttonText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Subtle hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Indicator - Desktop Only */}
        <div className="hidden md:block text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-gray-500 text-base">
            <span>Trusted by businesses and individuals worldwide</span>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-[#D4AF37] text-sm">⭐</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}