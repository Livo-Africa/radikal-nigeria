// src/components/homepage/Process.tsx - MOBILE ACCORDION (ICON + TITLE ONLY)
'use client';
import { useState, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  MessageCircle,
  Target,
  Palette,
  Cog,
  Rocket,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Process() {
  const [activeTab, setActiveTab] = useState<'individuals' | 'business'>('individuals');
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
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

  const individualsProcess = [
    {
      id: 1,
      step: 1,
      title: 'Upload Your Selfie',
      description: 'Simple photo upload from your phone',
      icon: Upload,
      details: 'Take a selfie or choose from your gallery. We recommend good lighting and a clear background for best results.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      step: 2,
      title: 'Magic Happens',
      description: 'Advanced technology enhances your look',
      icon: Sparkles,
      details: 'Our technology transforms your photo professionally with background replacement, lighting adjustments, and professional retouching.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      step: 3,
      title: 'Delivery via WhatsApp',
      description: 'Fast, direct to your phone',
      icon: MessageCircle,
      details: 'Receive studio-quality photos instantly on WhatsApp. Get edited photos delivered within 1-3 hours.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const businessProcess = [
    {
      id: 4,
      step: 1,
      title: 'Consult',
      description: 'Understand your goals',
      icon: Target,
      details: 'Deep dive into your brand needs and objectives with our creative team.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 5,
      step: 2,
      title: 'Create',
      description: 'Develop concepts',
      icon: Palette,
      details: 'Our team creates stunning concepts tailored to your brand identity.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 6,
      step: 3,
      title: 'Enhance',
      description: 'Technology meets creativity',
      icon: Cog,
      details: 'Advanced digital enhancement and professional editing to perfect every detail.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 7,
      step: 4,
      title: 'Deliver',
      description: 'Ready to use',
      icon: Rocket,
      details: 'Premium results delivered fast with multiple format options for all platforms.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const currentProcess = activeTab === 'individuals' ? individualsProcess : businessProcess;

  const toggleStep = (stepId: number) => {
    setExpandedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <section className="py-8 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header - Same for both */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            How <span className="text-[#D4AF37]">Radikal</span> Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and professional - that's the Radikal way
          </p>
        </div>

        {/* Tab Toggle - Same for both */}
        <div className="flex justify-center mb-8 md:mb-16">
          <div className="bg-gray-100 rounded-2xl p-1 md:p-2 shadow-inner w-full max-w-md">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  setActiveTab('individuals');
                  setExpandedSteps([]);
                }}
                className={`flex items-center justify-center space-x-2 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 transform ${activeTab === 'individuals'
                  ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:scale-102'
                  }`}
              >
                <Users className="w-4 h-4 md:w-5 md:h-5" />
                <span>For Individuals</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('business');
                  setExpandedSteps([]);
                }}
                className={`flex items-center justify-center space-x-2 py-3 md:py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 transform ${activeTab === 'business'
                  ? 'bg-[#D4AF37] text-black shadow-lg scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:scale-102'
                  }`}
              >
                <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                <span>For Business</span>
              </button>
            </div>
          </div>
        </div>

        {/* =============================================== */}
        {/* MOBILE VIEW: Accordion Steps (Icon + Title Only) */}
        {/* =============================================== */}
        <div className="block md:hidden">
          <div className="max-w-2xl mx-auto">
            {/* Steps Accordion */}
            <div className="space-y-3">
              {currentProcess.map((step) => {
                const Icon = step.icon;
                const isExpanded = expandedSteps.includes(step.id);

                return (
                  <div
                    key={step.id}
                    className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-xl' : ''
                      }`}
                  >
                    {/* Step Header - ICON + TITLE ONLY (No step number, no description) */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="w-full text-left p-5 flex items-center justify-between focus:outline-none"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Large Icon - More space since we removed step number */}
                        <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white`}>
                          <Icon className="w-7 h-7" />
                        </div>

                        {/* Title Only - No description */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 text-left">
                            {step.title}
                          </h3>
                          {/* Description removed for mobile - desktop only */}
                        </div>
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
                    <div
                      className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                      <div className="p-5 pt-0">
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            How it works:
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {step.details}
                          </p>

                          {/* Step-specific tip */}
                          <div className="mt-4 p-3 bg-[#D4AF37]/10 rounded-lg">
                            <p className="text-xs text-gray-700 font-medium">
                              💡 {activeTab === 'individuals'
                                ? 'Usually takes 1-3 hours'
                                : 'Professional quality guaranteed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =============================================== */}
        {/* DESKTOP VIEW: Original Grid Layout (100% Unchanged) */}
        {/* =============================================== */}
        <div className="hidden md:block max-w-6xl mx-auto">
          {/* Process Steps Grid */}
          <div className={`grid gap-8 ${currentProcess.length === 3
            ? 'grid-cols-1 md:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
            {currentProcess.map((step, index) => (
              <div
                key={step.step}
                className="group text-center relative"
              >
                {/* Connecting Line (except for last step) */}
                {index < currentProcess.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-full h-0.5 bg-gray-300 group-hover:bg-[#D4AF37] transition-colors duration-500 z-0"></div>
                )}

                {/* Step Card - DESKTOP: Step Number + Icon + Title + Description */}
                <div className="relative z-10 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-2 border border-gray-100">
                  {/* Step Number - Desktop only */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                    {step.step}
                  </div>

                  {/* Enhanced Icon - Desktop only */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <step.icon className="w-10 h-10" />
                  </div>

                  {/* Title - Desktop only */}
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-black transition-colors">
                    {step.title}
                  </h3>

                  {/* Description - Desktop only (hidden on mobile) */}
                  <p className="text-gray-600 mb-3 font-semibold text-base">
                    {step.description}
                  </p>

                  {/* Details - Desktop only (expands on mobile) */}
                  <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors leading-relaxed">
                    {step.details}
                  </p>
                </div>

                {/* Mobile Arrow */}
                {index < currentProcess.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* =============================================== */}
        {/* "No Studio..." Tagline - DESKTOP ONLY */}
        {/* =============================================== */}
        <div className="hidden md:block text-center mt-8 md:mt-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-2xl p-8 border border-[#D4AF37]/20">
            <h4 className="text-2xl font-bold mb-4 text-gray-900 flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
              <span>
                {activeTab === 'individuals'
                  ? 'No Studio • No Travel • No Awkward Poses'
                  : 'Quality Assurance • Strategic Oversight • Future-Ready Technology'
                }
              </span>
            </h4>
            <p className="text-gray-600 text-base leading-relaxed">
              {activeTab === 'individuals'
                ? 'Professional results without the traditional studio hassle. Get perfect photos from the comfort of your home.'
                : 'Professional creative solutions with transparent communication and cutting-edge technology tailored to your business needs.'
              }
            </p>
          </div>
        </div>

        {/* CTA Section - Same for both */}
        <div className="text-center mt-8 md:mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={activeTab === 'individuals' ? '/individuals' : '/business'}
              className="group bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 justify-center"
            >
              <span>
                Start Your {activeTab === 'individuals' ? 'Photoshoot' : 'Project'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Trust Indicators - Desktop only (original grid) */}
        <div className="hidden md:grid grid-cols-4 gap-8 max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-[#D4AF37] mb-1">1-3h</div>
            <div className="text-sm text-gray-600">Avg. Delivery</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-[#D4AF37] mb-1">4.9/5</div>
            <div className="text-sm text-gray-600">Satisfaction</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-[#D4AF37] mb-1">700+</div>
            <div className="text-sm text-gray-600">Happy Clients</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl font-bold text-[#D4AF37] mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>

        {/* Mobile Trust Indicators - Simplified (2 metrics) */}
        <div className="block md:hidden mt-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D4AF37] mb-1">1-3h</div>
                <div className="text-xs text-gray-600">Avg. Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#D4AF37] mb-1">4.9/5</div>
                <div className="text-xs text-gray-600">Satisfaction</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Trusted by 700+ clients with 24/7 support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}