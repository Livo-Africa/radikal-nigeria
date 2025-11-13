// src/components/individuals/ProcessSection.tsx - FIXED (Horizontal scroll on mobile)
export default function ProcessSection() {
  const processSteps = [
    {
      step: 1,
      title: "Choose Package",
      description: "Select from our curated packages",
      icon: "📦",
      details: "Pick the perfect package for your needs"
    },
    {
      step: 2,
      title: "Upload Photos",
      description: "Share your selfies or photos",
      icon: "📱",
      details: "Simple upload from your phone or device"
    },
    {
      step: 3,
      title: "Customize",
      description: "Select outfits & styles",
      icon: "🎨",
      details: "Choose from our virtual wardrobe"
    },
    {
      step: 4,
      title: "We Work Our Magic",
      description: "Advanced enhancement technology",
      icon: "✨",
      details: "Professional editing and enhancement"
    },
    {
      step: 5,
      title: "Delivery",
      description: "Receive via WhatsApp in 1-3 hours",
      icon: "⚡",
      details: "Instant delivery to your phone"
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

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory space-x-4">
            {processSteps.map((step) => (
              <div 
                key={step.step}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 snap-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center text-black font-bold text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <div className="text-3xl mb-4 transform group-hover:scale-125 transition-transform duration-500">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 mb-3 font-semibold text-sm">{step.description}</p>
                <p className="text-xs text-gray-500">{step.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid grid-cols-5 gap-4 max-w-6xl mx-auto">
          {processSteps.map((step) => (
            <div 
              key={step.step}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center text-black font-bold text-lg mx-auto mb-4">
                {step.step}
              </div>
              <div className="text-3xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 mb-3 font-semibold text-sm">{step.description}</p>
              <p className="text-xs text-gray-500">{step.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}