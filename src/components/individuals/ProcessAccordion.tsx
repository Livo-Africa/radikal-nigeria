// components/individuals/ProcessAccordion.tsx - PREMIUM DARK MODE REDESIGN
'use client';

import { useState } from 'react';
import { Upload, Users, Zap, ChevronDown, CheckCircle, Clock } from 'lucide-react';

export default function ProcessAccordion() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [viewedSteps, setViewedSteps] = useState<number[]>([0]);

  const steps = [
    {
      id: 0,
      title: "Upload Selfie",
      description: "Take a clear photo or choose from gallery",
      details: [
        "Face clearly visible",
        "Plain background recommended",
        "No hats/sunglasses",
        "Good lighting preferred"
      ],
      icon: <Upload className="w-5 h-5" />,
      time: "2 minutes",
      color: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      id: 1,
      title: "We Enhance",
      description: "Professional editing by our team",
      details: [
        "Studio-quality retouching",
        "Background enhancement",
        "Professional lighting effects",
        "Color correction"
      ],
      icon: <Users className="w-5 h-5" />,
      time: "1-3 hours",
      color: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Get Your Photos",
      description: "Photos delivered digitally",
      details: [
        "High-resolution files",
        "Multiple format options",
        "Unlimited downloads",
        "Instant access"
      ],
      icon: <Zap className="w-5 h-5" />,
      time: "Instant",
      color: "bg-gradient-to-br from-amber-400 to-orange-500"
    }
  ];

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
    if (!viewedSteps.includes(stepId)) {
      setViewedSteps([...viewedSteps, stepId]);
    }
  };

  const progressPercentage = Math.round((viewedSteps.length / steps.length) * 100);

  return (
    <section className="py-8 bg-[#0A0A0F]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 font-playfair">
            How It Works
          </h2>
          <p className="text-white/50">
            3 simple steps to professional photos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 px-4">
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/30">
            <span>Step {viewedSteps.length} of {steps.length}</span>
            <span>{progressPercentage}% complete</span>
          </div>
        </div>

        {/* Steps Accordion - Glass Cards */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white/[0.04] backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/15 transition-colors"
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center">
                  <div className={`relative w-10 h-10 rounded-xl ${step.color} flex items-center justify-center text-white mr-3 shadow-lg`}>
                    {viewedSteps.includes(step.id) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold shadow-md">
                      {step.id + 1}
                    </div>
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <div className="flex items-center text-sm text-white/30 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </div>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-white/30 transition-transform duration-300 ${expandedStep === step.id ? 'rotate-180 text-amber-400' : ''}`}
                />
              </button>

              {/* Step Content (Expandable) */}
              {expandedStep === step.id && (
                <div className="px-4 pb-4 animate-slideDown">
                  <p className="text-white/60 mb-4">{step.description}</p>

                  <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                    <h4 className="font-semibold text-white/80 mb-2 text-sm">
                      Includes:
                    </h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start text-sm text-white/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats - Glass Cards */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">1-3h</div>
            <div className="text-xs text-white/40 mt-1">Delivery Time</div>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">500+</div>
            <div className="text-xs text-white/40 mt-1">Happy Clients</div>
          </div>
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-xl p-4 border border-white/10">
            <div className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">24/7</div>
            <div className="text-xs text-white/40 mt-1">Support</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="/individuals/style-journey"
            className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold py-3 px-8 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)]"
          >
            Start Your Photoshoot
          </a>
        </div>
      </div>
    </section>
  );
}