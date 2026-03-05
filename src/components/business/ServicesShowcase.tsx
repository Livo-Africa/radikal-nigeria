'use client';
import {
    Palette, Video, Camera, Globe, Cog, Code2,
    Megaphone, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function ServicesShowcase() {
    const services = [
        {
            title: "Graphic Design",
            description: "Visual identity that makes your brand unforgettable",
            items: ["Brand Kits", "Logo Development", "Social Templates", "Print Design"],
            icon: Palette,
            gradient: "from-purple-500 to-pink-500"
        },
        {
            title: "Motion & Animation",
            description: "Engaging motion content that captures and converts",
            items: ["Promo Videos", "Brand Animations", "Social Reels", "Brand Stories"],
            icon: Video,
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            title: "Photography & Video",
            description: "Professional visuals that tell your brand story",
            items: ["Product Photography", "Corporate Headshots", "Commercial Video", "Event Coverage"],
            icon: Camera,
            gradient: "from-green-500 to-emerald-500"
        },
        {
            title: "Web Development",
            description: "Modern, high-performance websites that drive growth",
            items: ["Business Websites", "E-commerce", "Web Applications", "SEO Optimization"],
            icon: Globe,
            gradient: "from-indigo-500 to-blue-500"
        },
        {
            title: "Systems & Automation",
            description: "Streamline your workflows with intelligent automation",
            items: ["Workflow Automation", "CRM Integration", "Process Optimization", "Custom Bots"],
            icon: Cog,
            gradient: "from-amber-500 to-orange-500"
        },
        {
            title: "Custom Applications",
            description: "Bespoke software solutions tailored to your business",
            items: ["Mobile Apps", "Business Tools", "API Development", "Cloud Solutions"],
            icon: Code2,
            gradient: "from-rose-500 to-red-500"
        },
        {
            title: "Commercial Ads",
            description: "Full-scale advertising campaigns that drive real ROI",
            items: ["TV Commercials", "Digital Ads", "Social Campaigns", "Billboard Design"],
            icon: Megaphone,
            gradient: "from-teal-500 to-cyan-500"
        },
        {
            title: "Advanced Solutions",
            description: "Cutting-edge technology for next-level innovation",
            items: ["Virtual Try-Ons", "AI Model Displays", "Creative Direction", "Tech Consulting"],
            icon: Zap,
            gradient: "from-[#D4AF37] to-[#B91C1C]"
        }
    ];

    return (
        <section id="services" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-gray-900">
                        Our <span className="text-[#D4AF37]">Solutions</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Comprehensive creative and technology solutions designed to scale your business
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                        >
                            {/* Gradient accent line at top */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                            {/* Icon */}
                            <div className="mb-5">
                                <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                    <service.icon className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-black transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                                {service.description}
                            </p>

                            {/* Items List */}
                            <ul className="space-y-2 mb-5">
                                {service.items.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center text-gray-600 text-sm group-hover:translate-x-1 transition-transform duration-300"
                                        style={{ transitionDelay: `${idx * 50}ms` }}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] mr-2 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA - visible on hover (desktop) / always visible (mobile) */}
                            <a
                                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%27m%20interested%20in%20your%20business%20solutions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 text-sm md:opacity-0 md:group-hover:opacity-100"
                            >
                                <span>Inquire</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 max-w-2xl mx-auto">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                            Need a custom solution?
                        </h3>
                        <p className="text-gray-600 mb-5 text-sm md:text-base">
                            Our team creates tailored packages for your specific business needs and budget.
                        </p>
                        <a
                            href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20need%20a%20custom%20business%20solution.%20Can%20we%20discuss?"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group"
                        >
                            <span>Get Custom Pricing</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
