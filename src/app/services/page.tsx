'use client';

import { useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import MobileStickyBar from '@/components/shared/MobileStickyBar';
import { motion } from 'framer-motion';
import {
    Camera, Palette, Video, Smartphone, Zap, Users,
    CheckCircle2, ArrowRight, Sparkles,
    Building2, ChevronDown, ChevronUp, MessageCircle, ShieldCheck, Globe
} from 'lucide-react';

type FilterType = 'all' | 'individuals' | 'business' | 'creators';

export default function ServicesPage() {
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
    const [expandedBundle, setExpandedBundle] = useState<number | null>(null);

    // Service Categories Data
    const serviceCategories = [
        {
            id: 1,
            title: "Photography & Videography",
            icon: Camera,
            gradient: "from-purple-500/20 to-pink-500/20",
            iconColor: "text-purple-500",
            audience: ['individuals', 'business'],
            items: ["Personal photoshoots", "Product imaging", "Team & corporate", "Virtual try-ons"]
        },
        {
            id: 2,
            title: "Graphic Design",
            icon: Palette,
            gradient: "from-blue-500/20 to-cyan-500/20",
            iconColor: "text-blue-500",
            audience: ['individuals', 'business'],
            items: ["Logo development", "Complete brand kits", "Social media templates", "Packaging & labels", "Business stationery"]
        },
        {
            id: 3,
            title: "Motion & Animation",
            icon: Video,
            gradient: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-500",
            audience: ['individuals', 'business'],
            items: ["Promotional videos", "Brand story videos", "Animations", "Product showcases", "Character animation"]
        },
        {
            id: 4,
            title: "Social Media Management",
            icon: Smartphone,
            gradient: "from-orange-500/20 to-red-500/20",
            iconColor: "text-orange-500",
            audience: ['business'],
            items: ["Content strategy", "Post scheduling", "Multi-platform management", "Performance analytics", "Engagement optimization"]
        },
        {
            id: 5,
            title: "Advanced Technology",
            icon: Zap,
            gradient: "from-indigo-500/20 to-purple-500/20",
            iconColor: "text-indigo-500",
            audience: ['business'],
            items: ["Virtual try-on technology", "AI model displays", "3D product rendering", "Augmented reality integration"]
        },
        {
            id: 6,
            title: "Creative Partnerships",
            icon: Users,
            gradient: "from-pink-500/20 to-rose-500/20",
            iconColor: "text-pink-500",
            audience: ['creators'],
            items: ["White-label services", "Photo enhancement", "Concept development", "Portfolio upgrade", "Referral programs"]
        }
    ];

    // Service Integration Examples
    const integrationExamples = [
        {
            title: "Complete Brand Launch Package",
            items: [
                { service: "Brand Identity Design", result: "Creates visual foundation" },
                { service: "Product Imaging", result: "Professional product visuals" },
                { service: "Social Media Setup", result: "Launch and engagement" },
                { service: "Motion Graphics", result: "Dynamic content for ads" }
            ],
            outcome: "Cohesive brand presence across all touchpoints"
        },
        {
            title: "Personal Branding Transformation",
            items: [
                { service: "Professional Headshots", result: "Build credibility" },
                { service: "Social Media Content", result: "Consistent personal brand" },
                { service: "Motion Intro", result: "Engaging video presence" },
                { service: "Brand Kit", result: "Professional templates" }
            ],
            outcome: "Strong personal brand that stands out"
        },
        {
            title: "E-commerce Optimization Package",
            items: [
                { service: "Product Photography", result: "High-converting images" },
                { service: "Virtual Try-Ons", result: "Reduced returns, higher conversion" },
                { service: "Social Media Management", result: "Drive traffic and sales" },
                { service: "Motion Product Videos", result: "Show products in action" }
            ],
            outcome: "Complete e-commerce visual strategy"
        }
    ];

    // Popular Service Bundles
    const serviceBundles = [
        {
            title: "Startup Launch Package",
            icon: Sparkles,
            gradient: "from-purple-500/20 to-pink-500/20",
            items: ["Logo & branding", "Basic website visuals", "Social media setup"],
            price: "From ₦150,000",
            savings: "Save 20%"
        },
        {
            title: "Content Creator Package",
            icon: Camera,
            gradient: "from-blue-500/20 to-cyan-500/20",
            items: ["Personal photoshoot", "Social media templates", "Intro video", "Content planning"],
            price: "From ₦100,000",
            savings: "Save 15%"
        },
        {
            title: "Enterprise Scale Package",
            icon: Building2,
            gradient: "from-green-500/20 to-emerald-500/20",
            items: ["Complete product imaging", "Virtual try-ons", "Social media management", "Advanced analytics"],
            price: "Custom Quote",
            savings: "Save 25%"
        }
    ];

    // Industry Specializations
    const industries = [
        { title: "Fashion & Beauty", icon: ShieldCheck, items: ["Virtual try-ons", "Lookbook creation", "Influencer content", "Style guides"] },
        { title: "E-commerce & Retail", icon: Globe, items: ["Product photography", "Lifestyle shots", "E-commerce optimization", "Social media advertising"] },
        { title: "Tech & Startups", icon: Zap, items: ["Brand identity", "Pitch deck design", "Product visualization", "Corporate photography"] },
        { title: "Food & Hospitality", icon: Camera, items: ["Restaurant photography", "Menu design", "Food styling", "Promotional videos"] },
        { title: "Corporate Services", icon: Building2, items: ["Executive portraits", "Team photography", "Corporate branding", "Event coverage"] }
    ];

    const filteredCategories = serviceCategories.filter(cat => {
        if (activeFilter === 'all') return true;
        return cat.audience.includes(activeFilter);
    });

    const filterButtons: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Individuals', value: 'individuals' },
        { label: 'Business', value: 'business' },
        { label: 'Creators', value: 'creators' }
    ];

    const getWhatsAppUrl = (bundleTitle: string) => {
        return `https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20the%20${encodeURIComponent(bundleTitle)}`;
    };

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
            <Navigation />
            <main className="flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header Section (Replaced Hero) */}
                    <div className="max-w-4xl mb-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#D4AF37] text-sm font-medium mb-6">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Complete Creative Arsenal
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair tracking-tight">
                                Our <span className="text-[#D4AF37]">Services</span>
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                                Everything you need to express, engage, and excel in the digital world. We provide premium creative solutions tailored for individuals, businesses, and creators.
                            </p>
                        </motion.div>
                    </div>

                    {/* Filter Section */}
                    <div className="flex flex-wrap gap-3 mb-12">
                        {filterButtons.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                                    activeFilter === filter.value
                                        ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Service Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-500"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#D4AF37] transition-colors">
                                    {category.title}
                                </h3>
                                <ul className="space-y-3 mb-6">
                                    {category.items.map((item, idx) => (
                                        <li key={idx} className="flex items-center text-gray-400 text-sm">
                                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-3 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a href="/contact" className="inline-flex items-center space-x-2 text-[#D4AF37] hover:text-white font-semibold transition-colors group">
                                    <span>Learn More</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* How Services Work Together */}
                    <div className="py-20 border-t border-white/5 mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                How Services <span className="text-[#D4AF37]">Work Together</span>
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">
                                Discover the power of integrated creative solutions designed for maximum impact.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {integrationExamples.map((example, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 rounded-2xl p-8 border border-white/10"
                                >
                                    <h3 className="text-xl font-bold mb-6 text-white">{example.title}</h3>
                                    <div className="space-y-4 mb-8">
                                        {example.items.map((item, idx) => (
                                            <div key={idx} className="flex items-start space-x-3 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                                <p><span className="text-white font-medium">{item.service}</span> <span className="text-gray-500">→ {item.result}</span></p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-[#D4AF37]/10 rounded-xl p-4 border border-[#D4AF37]/20">
                                        <p className="text-[#D4AF37] text-sm font-semibold">
                                            Outcome: {example.outcome}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Service Bundles */}
                    <div className="mb-24">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                Service <span className="text-[#D4AF37]">Bundles</span>
                            </h2>
                            <p className="text-gray-400">Save up to 25% with our curated service packages.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {serviceBundles.map((bundle, index) => (
                                <div key={index} className="relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                                        {bundle.savings}
                                    </div>
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${bundle.gradient} flex items-center justify-center mb-6`}>
                                        <bundle.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{bundle.title}</h3>
                                    <ul className="space-y-3 mb-8">
                                        {bundle.items.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-gray-400 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-3 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="text-2xl font-bold mb-8 text-white">{bundle.price}</div>
                                    <a 
                                        href={getWhatsAppUrl(bundle.title)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white font-bold py-4 rounded-xl text-center transition-all"
                                    >
                                        Get Package
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Industry Section */}
                    <div className="py-20 border-t border-white/5">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                Industry <span className="text-[#D4AF37]">Solutions</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {industries.map((industry, index) => (
                                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                                    <industry.icon className="w-8 h-8 text-[#D4AF37] mb-4" />
                                    <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">{industry.title}</h3>
                                    <ul className="space-y-2">
                                        {industry.items.map((item, idx) => (
                                            <li key={idx} className="text-xs text-gray-500 flex items-center">
                                                <div className="w-1 h-1 bg-[#D4AF37] rounded-full mr-2" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <WhatsAppFloat />
            <MobileStickyBar />
        </div>
    );
}
