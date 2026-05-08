'use client';

import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import MobileStickyBar from '@/components/shared/MobileStickyBar';
import { motion } from 'framer-motion';
import { Building2, Coins, Users, Rocket, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function CreatorsPage() {
  const benefits = [
    {
      icon: Building2,
      title: "White-label Services",
      description: "Offer our premium photography and post-production services under your own brand identity.",
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500"
    },
    {
      icon: Coins,
      title: "Revenue Sharing",
      description: "Earn competitive commissions on every project you bring to the network through our transparent model.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500"
    },
    {
      icon: Users,
      title: "Creative Collaboration",
      description: "Partner with our elite team of editors and technologists on large-scale creative projects.",
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-500"
    },
    {
      icon: Rocket,
      title: "Portfolio Growth",
      description: "Access exclusive tools and resources designed to help you scale your creative business faster.",
      gradient: "from-rose-500/20 to-purple-500/20",
      iconColor: "text-rose-500"
    }
  ];

  const additionalFeatures = [
    {
      icon: ShieldCheck,
      title: "Priority Support",
      description: "Get direct access to our technical team for seamless project execution."
    },
    {
      icon: Zap,
      title: "Fast Turnaround",
      description: "Industry-leading delivery times for all white-label photography projects."
    },
    {
      icon: Globe,
      title: "Global Standards",
      description: "All deliverables meet international quality benchmarks for high-end creative work."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header Section (No Hero, just clean title) */}
          <div className="max-w-4xl mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair tracking-tight">
                Creator <span className="text-[#D4AF37]">Partnership</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                Join our exclusive network of creators and agencies. Scale your business with our enterprise-grade infrastructure and professional creative services.
              </p>
            </motion.div>
          </div>

          {/* Primary Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <benefit.icon className={`w-7 h-7 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#D4AF37] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Additional Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 border-y border-white/5 mb-20">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                className="flex flex-col items-start"
              >
                <feature.icon className="w-6 h-6 text-[#D4AF37] mb-4" />
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Portal Coming Soon Section */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#D4AF37]/10 via-black to-black border border-[#D4AF37]/30 rounded-3xl p-12 md:p-20 text-center"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#D4AF37] text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse mr-3"></span>
                In Development
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold mb-8 font-playfair">
                Creator Portal <span className="text-[#D4AF37]">Coming Soon</span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                We are building a comprehensive dashboard for our partners to manage white-label projects, track revenue shares, and access premium creative assets in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a 
                  href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20a%20creator%20interested%20in%20joining%20your%20partnership%20network.%20Can%20we%20discuss%20the%20opportunities?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#D4AF37] hover:bg-[#F4D03F] text-black font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
                >
                  <span>Join Partnership Network</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a 
                  href="/"
                  className="bg-transparent hover:bg-white/5 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
      <MobileStickyBar />
    </div>
  );
}