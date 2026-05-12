'use client';

import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import MobileStickyBar from '@/components/shared/MobileStickyBar';
import { motion } from 'framer-motion';
import { 
    Crown, Cpu, TrendingUp, ArrowRight, MapPin, Heart, Sparkles,
    Quote, Target, Lightbulb
} from 'lucide-react';

export default function AboutPage() {
    const pillars = [
        {
            title: 'CLASS',
            description: 'Premium visual language rooted in elegance and professional finesse. We believe in quality that speaks for itself.',
            icon: Crown,
            accent: 'bg-[#D4AF37]/5',
            iconColor: 'text-[#D4AF37]'
        },
        {
            title: 'TECHNOLOGY',
            description: 'Advanced digital tools redefining creative possibilities. We leverage cutting-edge technology to enhance human creativity.',
            icon: Cpu,
            accent: 'bg-blue-500/5',
            iconColor: 'text-blue-500'
        },
        {
            title: 'FUTURE',
            description: 'Forward-thinking creativity anticipating market trends. We\'re not just keeping up — we\'re paving the way.',
            icon: TrendingUp,
            accent: 'bg-purple-500/5',
            iconColor: 'text-purple-500'
        }
    ];

    const milestones = [
        { year: '2022', title: 'Founding', description: 'Radikal was established in Accra with a vision to democratize premium creative services.' },
        { year: '2023', title: 'Expansion', description: 'Launched our Lagos operations, becoming a truly West African creative powerhouse.' },
        { year: '2024', title: 'Tech Integration', description: 'Introduced Virtual Try-on technology and AI-enhanced studio workflows.' }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col font-sans selection:bg-[#D4AF37]/30">
            <Navigation />
            
            <main className="flex-1 pt-32 pb-20 relative overflow-hidden">
                {/* Brand Accent Backgrounds */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

                <div className="container mx-auto px-4 lg:px-8">
                    {/* Premium Header */}
                    <header className="max-w-5xl mx-auto mb-32">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-center md:text-left"
                        >
                            <span className="inline-block text-[#D4AF37] font-bold tracking-[0.2em] text-xs uppercase mb-6">
                                Defining the Future of Creativity
                            </span>
                            <h1 className="text-5xl md:text-8xl font-bold mb-10 font-playfair tracking-tight leading-[1.1] text-white">
                                Where <span className="italic text-[#D4AF37]">Artistry</span> Meets <span className="relative">Innovation<div className="absolute -bottom-2 left-0 w-full h-1 bg-[#D4AF37]/20 rounded-full" /></span>
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                                <p className="md:col-span-8 text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
                                    Radikal Creative Technologies is a premium agency at the intersection of high-end aesthetics and cutting-edge digital tools. We serve the bold, the ambitious, and the visionary.
                                </p>
                                <div className="md:col-span-4 flex flex-wrap gap-4 justify-center md:justify-end">
                                    <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                                        <div className="text-3xl font-bold text-[#D4AF37]">500+</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Global Clients</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    {/* Sophisticated Story Section */}
                    <section className="mb-40">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                                <div className="relative z-10 bg-white/5 backdrop-blur-md p-12 md:p-16 rounded-[40px] border border-white/10">
                                    <Quote className="w-12 h-12 text-[#D4AF37]/20 mb-8" />
                                    <h2 className="text-3xl md:text-4xl font-bold mb-8 font-playfair leading-tight text-white">
                                        Born from a belief that <span className="text-[#D4AF37]">Premium</span> shouldn't be limited by geography.
                                    </h2>
                                    <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
                                        <p>
                                            We realized that traditional studios were becoming a barrier to rapid, high-quality creativity. Our virtual-first approach was built to break those walls.
                                        </p>
                                        <p>
                                            Whether you're in the heart of Accra, the bustle of Lagos, or anywhere else in the world, we bring the studio directly to your digital doorstep.
                                        </p>
                                    </div>
                                    <div className="mt-12 flex items-center space-x-4">
                                        <div className="w-12 h-1 bg-[#D4AF37] rounded-full" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Our Founding Principle</span>
                                    </div>
                                </div>
                            </motion.div>
                            
                            <div className="space-y-12">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-[#D4AF37]/50 transition-all duration-500">
                                        <Target className="w-8 h-8 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#D4AF37] transition-colors text-white">Our Mission</h3>
                                        <p className="text-gray-400 leading-relaxed">To provide world-class creative assets with unprecedented speed and precision, empowering individuals and brands to excel.</p>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500">
                                        <Lightbulb className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors text-white">Our Vision</h3>
                                        <p className="text-gray-400 leading-relaxed">To be the global benchmark for technology-driven creativity, where AI and human artistry create magic together.</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Core Pillars Section */}
                    <section className="mb-40">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-bold font-playfair mb-6 text-white">Core <span className="text-[#D4AF37]">Pillars</span></h2>
                            <div className="w-24 h-1.5 bg-[#D4AF37] mx-auto rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {pillars.map((pillar, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className="relative group p-10 bg-white/5 rounded-[32px] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${pillar.accent} rounded-bl-[100px] -z-10 group-hover:scale-150 transition-transform duration-700`} />
                                    <pillar.icon className={`w-12 h-12 ${pillar.iconColor} mb-8`} />
                                    <h3 className="text-2xl font-bold mb-4 text-white">{pillar.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Our Journey Section */}
                    <section className="mb-40 py-20 bg-white/5 rounded-[60px] border border-white/10 shadow-2xl backdrop-blur-sm">
                        <div className="max-w-4xl mx-auto px-10">
                            <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-16 text-center text-white">Our <span className="text-[#D4AF37]">Journey</span></h2>
                            <div className="relative space-y-16">
                                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
                                {milestones.map((ms, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        <div className="flex-1 text-center md:text-right">
                                            <div className="text-4xl font-black text-white/5 mb-2">{ms.year}</div>
                                            <h4 className="text-xl font-bold mb-2 text-white">{ms.title}</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed">{ms.description}</p>
                                        </div>
                                        <div className="w-4 h-4 rounded-full bg-[#D4AF37] ring-8 ring-[#D4AF37]/10 relative z-10" />
                                        <div className="flex-1" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Geographic Presence */}
                    <section className="mb-40">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <div className="p-12 rounded-[40px] bg-white/5 border border-white/10 group hover:bg-[#D4AF37] transition-all duration-500 backdrop-blur-sm">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20">
                                    <MapPin className="w-6 h-6 text-[#D4AF37] group-hover:text-white" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 group-hover:text-white text-white">Ghana</h3>
                                <p className="text-gray-400 group-hover:text-white/90 leading-relaxed">Headquartered in Accra, we are the creative pulse of the nation, serving top-tier brands and creators.</p>
                            </div>
                            <div className="p-12 rounded-[40px] bg-white/5 border border-white/10 group hover:bg-[#B91C1C] transition-all duration-500 backdrop-blur-sm">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/20">
                                    <MapPin className="w-6 h-6 text-[#B91C1C] group-hover:text-white" />
                                </div>
                                <h3 className="text-3xl font-bold mb-4 group-hover:text-white text-white">Nigeria</h3>
                                <p className="text-gray-400 group-hover:text-white/90 leading-relaxed">Our Lagos hub brings premium speed and quality to the continent's most dynamic market.</p>
                            </div>
                        </div>
                    </section>

                    {/* High-End CTA */}
                    <motion.section 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative p-12 md:p-24 rounded-[60px] bg-white/5 border border-white/10 text-center overflow-hidden backdrop-blur-md"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#B91C1C]/10 opacity-50" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-7xl font-bold font-playfair mb-8 text-white">Ready to define <br /> your <span className="text-[#D4AF37]">Visual Legacy</span>?</h2>
                            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                                Let's collaborate to build a brand that stands the test of time and technology.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <a 
                                    href="/contact"
                                    className="px-10 py-5 bg-[#D4AF37] hover:bg-white text-black font-black rounded-2xl text-lg transition-all duration-500 transform hover:scale-110 shadow-2xl shadow-[#D4AF37]/20 flex items-center gap-3"
                                >
                                    <Heart className="w-5 h-5" />
                                    Start a Project
                                </a>
                                <a 
                                    href={`https://wa.me/${process.env.WHATSAPP_NUMBER}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl text-lg transition-all border border-white/10 backdrop-blur-md"
                                >
                                    WhatsApp Us
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
