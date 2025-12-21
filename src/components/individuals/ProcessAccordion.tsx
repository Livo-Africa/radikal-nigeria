// components/individuals/ProcessAccordion.tsx - FIXED VERSION
'use client';

import { useState } from 'react';
import { Upload, Users, Zap, ChevronDown, CheckCircle, Clock } from 'lucide-react';

export default function ProcessAccordion() {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [viewedSteps, setViewedSteps] = useState<number[]>([0]); // Track viewed steps

  const steps = [
    {
      id: 0, // Changed from 1 to 0
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
      color: "bg-green-500"
    },
    {
      id: 1, // Changed from 2 to 1
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
      color: "bg-blue-500"
    },
    {
      id: 2, // Changed from 3 to 2
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
      color: "bg-[#D4AF37]"
    }
  ];

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);

    // Mark step as viewed if not already
    if (!viewedSteps.includes(stepId)) {
      setViewedSteps([...viewedSteps, stepId]);
    }
  };

  // Calculate progress based on VIEWED steps (0-3)
  const progressPercentage = Math.round((viewedSteps.length / steps.length) * 100);

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
            How It Works
          </h2>
          <p className="text-gray-600">
            3 simple steps to professional photos
          </p>
        </div>

        {/* Progress Bar - FIXED */}
        <div className="mb-8 px-4">
          <div className="relative h-1 bg-gray-200 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-[#D4AF37] rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Step {viewedSteps.length} of {steps.length}</span>
            <span>{progressPercentage}% complete</span>
          </div>
        </div>

        {/* Steps Accordion */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              {/* Step Header */}
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  {/* Step Number with Status */}
                  <div className={`relative w-10 h-10 rounded-full ${step.color} flex items-center justify-center text-white mr-3`}>
                    {viewedSteps.includes(step.id) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.icon
                    )}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
                      {step.id + 1} {/* Display 1,2,3 instead of 0,1,2 */}
                    </div>
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </div>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedStep === step.id ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Step Content (Expandable) */}
              {expandedStep === step.id && (
                <div className="px-4 pb-4 animate-slideDown">
                  <p className="text-gray-600 mb-4">{step.description}</p>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      Includes:
                    </h4>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <div className={`w-2 h-2 rounded-full ${step.color} mt-1 mr-2 flex-shrink-0`} />
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

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xl font-bold text-[#D4AF37]">1-3h</div>
            <div className="text-xs text-gray-600 mt-1">Delivery Time</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xl font-bold text-[#D4AF37]">500+</div>
            <div className="text-xs text-gray-600 mt-1">Happy Clients</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xl font-bold text-[#D4AF37]">24/7</div>
            <div className="text-xs text-gray-600 mt-1">Support</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a
            href="/individuals/style-journey"
            className="inline-block bg-black text-white font-semibold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Start Your Photoshoot
          </a>
        </div>
      </div>
    </section>
  );
}