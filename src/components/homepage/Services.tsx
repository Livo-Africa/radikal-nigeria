// src/components/homepage/Services.tsx
'use client';
import { useState } from 'react';
import { Palette, Video, Camera, Zap, CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export default function Services() {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const services = [
    {
      id: 1,
      title: "Graphic Design",
      items: ["Brand Kits", "Social Templates", "Logo Development"],
      icon: Palette,
      gradient: "from-purple-500 to-pink-500",
      description: "Visual identity that makes your brand unforgettable"
    },
    {
      id: 2,
      title: "Motion & Animation",
      items: ["Promo Videos", "Animations", "Brand Stories"],
      icon: Video,
      gradient: "from-blue-500 to-cyan-500",
      description: "Engaging motion content that captures attention"
    },
    {
      id: 3,
      title: "Photography & Video",
      items: ["Product Imaging", "Personal Branding", "Team Shots"],
      icon: Camera,
      gradient: "from-green-500 to-emerald-500",
      description: "Professional visuals that tell your story"
    },
    {
      id: 4,
      title: "Advanced Solutions",
      items: ["Virtual Try-Ons", "AI Model Displays", "Creative Direction"],
      icon: Zap,
      gradient: "from-orange-500 to-red-500",
      description: "Cutting-edge technology for innovative visuals"
    }
  ];

  const toggleService = (id: number) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <section className="py-8 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">

        {/* ========== SECTION HEADER ========== */}
        <div className="text-center mb-8 md:mb-16">
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            Our Creative <span className="text-[#D4AF37]">Services</span>
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Premium creative solutions powered by cutting-edge technology
          </p>
        </div>

        {/* ========== MOBILE: ACCORDION ========== */}
        <div className="block md:hidden">
          <div className="space-y-3 max-w-lg mx-auto">
            {services.map((service) => {
              const isExpanded = expandedService === service.id;
              const Icon = service.icon;

              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm'
                    }`}
                >
                  {/* Accordion Header - Icon + Title Only */}
                  <button
                    onClick={() => toggleService(service.id)}
                    className="w-full text-left p-4 flex items-center justify-between focus:outline-none"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>

                      {/* Title Only - No Extra Text */}
                      <span className="text-base md:text-lg font-semibold text-gray-900">
                        {service.title}
                      </span>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="text-gray-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4">
                        {service.description}
                      </p>

                      {/* Items List */}
                      <ul className="space-y-2 mb-4">
                        {service.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-gray-700 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Mobile CTA Button */}
                      <a
                        href="/services"
                        className="block w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg text-center text-sm transition-colors"
                      >
                        Learn More
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== DESKTOP: ORIGINAL GRID ========== */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Enhanced Icon Container */}
              <div className="mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                  <service.icon className="w-8 h-8" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-black transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Enhanced Items List */}
              <ul className="space-y-3 mb-8">
                {service.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors transform group-hover:translate-x-1 duration-300"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button - Hidden until hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <a
                  href="/services"
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ========== BOTTOM CTA ========== */}
        <div className="text-center mt-8 md:mt-12">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20">
            {/* Heading Only - No Extra Text */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Need a custom solution?
            </h3>

            {/* Button Only - No Extra Text */}
            <a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mx-auto"
            >
              <span>Get Custom Pricing</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}