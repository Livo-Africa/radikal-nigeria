// src/app/about/page.tsx
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import { Crown, Cpu, TrendingUp, Camera, Palette, Video, Zap, Users, CheckCircle2, ArrowRight, MapPin, Heart } from 'lucide-react';

export const metadata = {
    title: 'About Us - Radikal Creative Technologies',
    description: 'Radikal Creative Technologies is a premium creative agency serving Ghana and Nigeria. Specializing in virtual photography, motion graphics, graphic design, and brand identity.',
    openGraph: {
        title: 'About Us - Radikal Creative Technologies',
        description: 'Transforming visions into visual reality across West Africa.',
        type: 'website',
    },
};

export default function AboutPage() {
    const pillars = [
        {
            title: 'CLASS',
            description: 'Premium visual language rooted in elegance and professional finesse. We believe in quality that speaks for itself.',
            icon: Crown,
            color: 'from-[#D4AF37] to-[#F4D03F]',
        },
        {
            title: 'TECHNOLOGY',
            description: 'Advanced digital tools redefining creative possibilities. We leverage cutting-edge technology to enhance, not replace, human creativity.',
            icon: Cpu,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            title: 'FUTURE',
            description: 'Forward-thinking creativity anticipating market trends and evolving needs. We\'re not just keeping up — we\'re paving the way.',
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-500',
        }
    ];

    const services = [
        { name: 'Virtual Photography', icon: Camera, description: 'Studio-quality photos without the studio' },
        { name: 'Graphic Design', icon: Palette, description: 'Complete brand identity and visual assets' },
        { name: 'Motion & Animation', icon: Video, description: 'Dynamic video and animated content' },
        { name: 'Advanced Technology', icon: Zap, description: 'Virtual try-ons, AI-enhanced imagery, 3D rendering' },
        { name: 'Social Media', icon: Users, description: 'Strategy, content creation, and management' },
    ];

    const stats = [
        { number: '500+', label: 'Happy Clients' },
        { number: '4.9/5', label: 'Client Rating' },
        { number: '1-3h', label: 'Average Delivery' },
        { number: '24/7', label: 'WhatsApp Support' },
    ];

    return (
        <>
            <Navigation />
            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="py-20 md:py-32 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                            🌟 Our Story
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair">
                            Transforming Visions Into <span className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">Visual Reality</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Radikal Creative Technologies is a premium creative agency at the intersection of art and technology, serving individuals and businesses across Ghana, Nigeria, and beyond.
                        </p>
                    </div>
                </section>

                {/* Who We Are */}
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-playfair text-center">
                                Who We <span className="text-[#D4AF37]">Are</span>
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    <strong className="text-gray-900">Radikal Creative Technologies</strong> was born from a simple yet powerful belief: that premium creative services should be accessible to everyone — not just those in major cities with access to expensive studios and agencies.
                                </p>
                                <p>
                                    Operating from <strong className="text-gray-900">Accra, Ghana</strong> and <strong className="text-gray-900">Lagos, Nigeria</strong>, we combine cutting-edge technology with artistic excellence to deliver professional-grade creative solutions. Our virtual studio approach means you get studio-quality photos, designs, and videos — no matter where you are.
                                </p>
                                <p>
                                    From a single portrait to a complete brand overhaul, we handle every project with the same commitment to premium quality, rapid delivery, and transparent pricing. Our team blends human creativity with advanced digital tools to produce results that consistently exceed expectations.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Three Pillars */}
                <section className="py-16 md:py-24 bg-black text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                Our Three <span className="text-[#D4AF37]">Pillars</span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                                The core principles guiding every project we undertake
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {pillars.map((pillar, index) => {
                                const Icon = pillar.icon;
                                return (
                                    <div
                                        key={index}
                                        className="text-center bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-[#D4AF37]/50 transition-all duration-500 transform hover:-translate-y-2"
                                    >
                                        <div className={`w-20 h-20 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
                                            <Icon className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4 text-[#D4AF37]">{pillar.title}</h3>
                                        <p className="text-gray-300 text-base leading-relaxed">{pillar.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                                    <div className="text-white/80 text-sm md:text-base font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What We Do */}
                <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                What We <span className="text-[#D4AF37]">Do</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                A complete creative arsenal for individuals and businesses
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {services.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Icon className="w-7 h-7 text-[#D4AF37]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                                        <p className="text-gray-500 text-sm">{service.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-12">
                            <a
                                href="/services"
                                className="inline-flex items-center space-x-2 bg-gray-900 hover:bg-black text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <span>View All Services</span>
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Where We Serve */}
                <section className="py-16 md:py-24 bg-gray-900 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-playfair">
                                Where We <span className="text-[#D4AF37]">Serve</span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-12">
                                Proudly serving clients across West Africa and beyond through our virtual-first approach
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                    <div className="text-4xl mb-4">🇬🇭</div>
                                    <h3 className="text-2xl font-bold mb-2">Ghana</h3>
                                    <div className="flex items-center justify-center text-gray-400 mb-4">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>Accra</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">Our founding base, serving individuals and businesses across Ghana with premium creative solutions.</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                                    <div className="text-4xl mb-4">🇳🇬</div>
                                    <h3 className="text-2xl font-bold mb-2">Nigeria</h3>
                                    <div className="flex items-center justify-center text-gray-400 mb-4">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>Lagos</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">Expanding our reach to Africa&apos;s largest economy, bringing the same premium quality to the Nigerian market.</p>
                                </div>
                            </div>
                            <p className="text-gray-400 mt-8 text-sm">
                                Our virtual studio model means we can serve clients <span className="text-[#D4AF37] font-semibold">anywhere in the world</span> — no physical studio visit required.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 md:py-24 bg-gradient-to-br from-[#D4AF37]/10 via-white to-[#B91C1C]/5">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 font-playfair">
                            Ready to Work <span className="text-[#D4AF37]">Together</span>?
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Whether you&apos;re an individual looking for the perfect portrait or a business ready for a complete visual transformation — let&apos;s talk.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contact"
                                className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-2"
                            >
                                <Heart className="w-5 h-5" />
                                <span>Get In Touch</span>
                            </a>
                            <a
                                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20services"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                                <span>💬</span>
                                <span>Chat on WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    );
}
