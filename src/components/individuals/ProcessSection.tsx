'use client';
import { ChevronRight, Package, Upload, Palette, Wand2, Zap, Clock, CheckCircle2, Users } from 'lucide-react';

export default function ProcessSection() {
  const processSteps = [
    {
      step: 1,
      title: "Choose Your Package",
      description: "Select from our curated professional packages in seconds",
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      time: "2 mins",
      status: "active"
    },
    {
      step: 2,
      title: "Upload Your Photos", 
      description: "Share selfies or existing photos from your gallery securely",
      icon: <Upload className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      time: "5 mins",
      status: "pending"
    },
    {
      step: 3,
      title: "Customize Style & Outfits",
      description: "Select outfits, backgrounds, and styling preferences",
      icon: <Palette className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500", 
      time: "3 mins",
      status: "pending"
    },
    {
      step: 4,
      title: "Professional Enhancement",
      description: "Expert editing by our professional photography team",
      icon: <Users className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      time: "1-3 hours",
      status: "pending"
    },
    {
      step: 5,
      title: "Instant WhatsApp Delivery", 
      description: "Receive studio-quality photos directly via WhatsApp",
      icon: <Zap className="w-6 h-6" />,
      color: "from-[#D4AF37] to-[#F4D03F]",
      time: "Instant",
      status: "pending"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header - Google-style */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get professional photos in 5 simple steps. Fast, easy, and delivered straight to your WhatsApp.
          </p>
        </div>

        {/* Modern Process Timeline - Desktop */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-5 gap-8 relative">
              {processSteps.map((step, index) => (
                <div key={step.step} className="text-center group">
                  {/* Step Circle with Connection Line */}
                  <div className="relative mb-8">
                    {/* Progress Line */}
                    {index < processSteps.length - 1 && (
                      <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
                    )}
                    
                    {/* Step Circle */}
                    <div className={`relative mx-auto w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                      {step.icon}
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Time Indicator */}
                    <div className="flex items-center justify-center text-xs text-gray-500 font-medium">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Process - Vertical Timeline */}
        <div className="lg:hidden">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
              
              <div className="space-y-8">
                {processSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start group">
                    {/* Step Circle */}
                    <div className={`relative flex-shrink-0 w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 z-10`}>
                      {step.icon}
                    </div>

                    {/* Content */}
                    <div className="ml-6 flex-1 pt-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                          {step.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 font-medium ml-2">
                          <Clock className="w-3 h-3 mr-1" />
                          {step.time}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Number */}
                    <div className="flex-shrink-0 ml-4 w-6 h-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Google-style */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-[#D4AF37] mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-gray-600 text-sm">1-3 hour delivery guaranteed</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle2 className="w-8 h-8 text-[#D4AF37] mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-gray-600 text-sm">Studio-grade professional editing</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-[#D4AF37] mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Expert Team</h4>
              <p className="text-gray-600 text-sm">Professional photography specialists</p>
            </div>
          </div>
        </div>

        {/* CTA - Uber-style */}
        <div className="text-center mt-12">
          <a 
            href="/individuals/style-journey"
            className="inline-flex items-center bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 group"
          >
            <span>Start Your Photoshoot Now</span>
            <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
          
          {/* Secondary CTA */}
          <div className="mt-6">
            <a 
              href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20have%20questions%20about%20the%20process"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              <span>Need help? Chat with us on WhatsApp</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}