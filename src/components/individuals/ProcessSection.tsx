// src/components/individuals/ProcessSection.tsx - MODERN MOBILE UX
export default function ProcessSection() {
  const processSteps = [
    {
      step: 1,
      title: "Choose Package",
      description: "Select your perfect photoshoot package",
      icon: "📦",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      title: "Upload Photos", 
      description: "Share your selfies or existing photos",
      icon: "📱",
      color: "from-green-500 to-emerald-500"
    },
    {
      step: 3,
      title: "Customize Style",
      description: "Select outfits and preferences",
      icon: "🎨",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: 4,
      title: "We Enhance",
      description: "Professional editing and enhancement",
      icon: "✨",
      color: "from-orange-500 to-red-500"
    },
    {
      step: 5,
      title: "Instant Delivery",
      description: "Receive via WhatsApp in 1-3 hours",
      icon: "⚡",
      color: "from-[#D4AF37] to-[#F4D03F]"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 font-playfair">
          How It Works
        </h2>
        <p className="text-xl text-center mb-8 text-gray-600 max-w-2xl mx-auto">
          Simple 5-step process to professional photos
        </p>

        {/* Modern Mobile Design - Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {processSteps.map((step, index) => (
            <div key={step.step} className="flex items-start space-x-4">
              {/* Step Number with Connector Line */}
              <div className="flex flex-col items-center">
                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {step.step}
                </div>
                {index < processSteps.length - 1 && (
                  <div className="w-1 h-16 bg-gray-300 mt-2"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{step.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal Layout */}
        <div className="hidden lg:grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          {processSteps.map((step) => (
            <div 
              key={step.step}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4`}>
                {step.step}
              </div>
              <div className="text-2xl mb-3">{step.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Modern CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-3xl p-8 border border-[#D4AF37]/20">
            <h4 className="text-2xl font-bold mb-4 text-gray-900">
              Ready to Get Started?
            </h4>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied clients who've transformed their photos with Radikal
            </p>
            <a 
              href="/individuals/style-journey"
              className="inline-block bg-[#D4AF37] hover:bg-[#b8941f] text-black font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              Start Your Photoshoot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}