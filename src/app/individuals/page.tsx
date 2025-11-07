import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';

export default function IndividualsPage() {
  const features = [
    {
      icon: "📸",
      title: "Virtual Photoshoot",
      description: "Professional studio-quality photos from your selfie"
    },
    {
      icon: "⚡", 
      title: "3-Hour Delivery",
      description: "Get your edited photos via WhatsApp in hours"
    },
    {
      icon: "💻",
      title: "Advance Tech Enhancement",
      description: "Advanced technology perfects every detail"
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Real human support whenever you need it"
    }
  ];

  return (
    <>
      <Navigation />
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#B91C1C]/20 rounded-full blur-3xl animate-float delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#eef10e]/10 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-block bg-[#B91C1C] text-white px-6 py-3 rounded-full text-sm font-bold mb-8 animate-glow">
                 Currently Serving Clients via WhatsApp
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 font-playfair text-white">
                Virtual <span className="gradient-text">Photoshoot</span>
              </h1>
              
              <p className="text-2xl md:text-4xl mb-8 text-[#D4AF37] font-light">
                Professional Photos • No Studio Required
              </p>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Get <span className="text-[#D4AF37] font-semibold">studio-quality photos</span> and <span className="text-[#D4AF37] font-semibold">Personal branded content</span> on your phone. 
                Our technology enhances your photos while our team ensures perfection.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#D4AF37] transition-all duration-500 transform hover:-translate-y-2">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#B91C1C]/20 rounded-3xl p-8 md:p-12 border border-[#D4AF37]/30 backdrop-blur-sm">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready for Your Photoshoot?
                </h3>
                <p className="text-gray-300 mb-8 text-lg">
                  Message us on WhatsApp to start your virtual photoshoot experience
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20want%20to%20start%20a%20virtual%20photoshoot%20for%20professional%20photos."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-3"
                  >
                    <span>💬</span>
                    <span>Start on WhatsApp</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  
                  <a 
                    href="/"
                    className="bg-transparent hover:bg-white/10 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/30 hover:border-white"
                  >
                    ← Back to Home
                  </a>
                </div>

                <p className="text-sm text-gray-400 mt-6">
                  Average response time: <span className="text-[#D4AF37]">2 minutes</span>
                </p>
              </div>

              {/* Coming Soon Teaser */}
              <div className="mt-16 bg-black/50 rounded-2xl p-6 border border-[#D4AF37]/20">
                <div className="flex items-center justify-center space-x-3 text-[#D4AF37] mb-3">
                  <span className="text-xl">🔮</span>
                  <span className="font-bold">Coming Soon</span>
                </div>
                <p className="text-gray-300">
                  Automated styling journey, outfit uploads, and instant payments - all directly on our platform!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

