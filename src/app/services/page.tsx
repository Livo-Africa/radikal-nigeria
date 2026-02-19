// src/app/services/page.tsx
'use client';
import { useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import {
    Camera, Palette, Video, Smartphone, Zap, Users,
    CheckCircle2, ArrowRight, Sparkles,
    Building2, ChevronDown, ChevronUp, MessageCircle
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
            gradient: "from-purple-500 to-pink-500",
            audience: ['individuals', 'business'],
            items: ["Personal photoshoots", "Product imaging", "Team & corporate", "Virtual try-ons"]
        },
        {
            id: 2,
            title: "Graphic Design",
            icon: Palette,
            gradient: "from-blue-500 to-cyan-500",
            audience: ['individuals', 'business'],
            items: ["Logo development", "Complete brand kits", "Social media templates", "Packaging & labels", "Business stationery"]
        },
        {
            id: 3,
            title: "Motion & Animation",
            icon: Video,
            gradient: "from-green-500 to-emerald-500",
            audience: ['individuals', 'business'],
            items: ["Promotional videos", "Brand story videos", "Animations", "Product showcases", "Character animation"]
        },
        {
            id: 4,
            title: "Social Media Management",
            icon: Smartphone,
            gradient: "from-orange-500 to-red-500",
            audience: ['business'],
            items: ["Content strategy", "Post scheduling", "Multi-platform management", "Performance analytics", "Engagement optimization"]
        },
        {
            id: 5,
            title: "Advanced Technology",
            icon: Zap,
            gradient: "from-indigo-500 to-purple-500",
            audience: ['business'],
            items: ["Virtual try-on technology", "AI model displays", "3D product rendering", "Augmented reality integration"]
        },
        {
            id: 6,
            title: "Creative Partnerships",
            icon: Users,
            gradient: "from-pink-500 to-rose-500",
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
            gradient: "from-purple-500 to-pink-500",
            items: ["Logo & branding", "Basic website visuals", "Social media setup"],
            price: "From ₦150,000",
            savings: "Save 20%"
        },
        {
            title: "Content Creator Package",
            icon: Camera,
            gradient: "from-blue-500 to-cyan-500",
            items: ["Personal photoshoot", "Social media templates", "Intro video", "Content planning"],
            price: "From ₦100,000",
            savings: "Save 15%"
        },
        {
            title: "Enterprise Scale Package",
            icon: Building2,
            gradient: "from-green-500 to-emerald-500",
            items: ["Complete product imaging", "Virtual try-ons", "Social media management", "Advanced analytics"],
            price: "Custom Quote",
            savings: "Save 25%"
        }
    ];

    // Industry Specializations
    const industries = [
        { title: "Fashion & Beauty", icon: "👗", items: ["Virtual try-ons", "Lookbook creation", "Influencer content", "Style guides"] },
        { title: "E-commerce & Retail", icon: "🛒", items: ["Product photography", "Lifestyle shots", "E-commerce optimization", "Social media advertising"] },
        { title: "Tech & Startups", icon: "💻", items: ["Brand identity", "Pitch deck design", "Product visualization", "Corporate photography"] },
        { title: "Food & Hospitality", icon: "🍽️", items: ["Restaurant photography", "Menu design", "Food styling", "Promotional videos"] },
        { title: "Corporate Services", icon: "🏢", items: ["Executive portraits", "Team photography", "Corporate branding", "Event coverage"] }
    ];

    // Technology Features
    const techFeatures = [
        { title: "Virtual Production", items: ["Virtual photoshoots", "Digital try-ons", "Remote collaboration", "Cloud-based workflows"] },
        { title: "AI-Enhanced Creativity", items: ["Smart style matching", "Automated enhancements", "Quality optimization", "Consistent results"] },
        { title: "Advanced Digital Tools", items: ["Professional editing software", "3D rendering capabilities", "Motion graphics tools"] }
    ];

    // Filter categories
    const filteredCategories = serviceCategories.filter(cat => {
        if (activeFilter === 'all') return true;
        return cat.audience.includes(activeFilter);
    });

    const filterButtons: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'For Individuals', value: 'individuals' },
        { label: 'For Business', value: 'business' },
        { label: 'For Creators', value: 'creators' }
    ];

    const getWhatsAppUrl = (bundleTitle: string) => {
        return `https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20the%20${encodeURIComponent(bundleTitle)}`;
    };

    return (
        <>
            <Navigation />
            <main className="flex-1 pt-20">
                {/* ========== HERO SECTION ========== */}
                <section className="min-h-[70vh] md:min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="max-w-5xl mx-auto">
                            {/* Badge */}
                            <div className="inline-block bg-gradient-to-r from-[#D4AF37] to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 animate-glow">
                                🎨 Complete Creative Arsenal
                            </div>

                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-playfair text-white">
                                Our Complete <span className="gradient-text">Creative Arsenal</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                                Everything you need to <span className="text-[#D4AF37] font-semibold">express, engage, and excel</span> in the digital world
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a
                                    href="#categories"
                                    className="group bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
                                >
                                    <span>View All Services</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>

                                <a
                                    href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20need%20a%20custom%20quote%20for%20my%20project."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center space-x-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span>Get Custom Quote</span>
                                </a>

                                <a
                                    href="/transformations"
                                    className="bg-transparent hover:bg-white/10 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 border-2 border-white/30 hover:border-white"
                                >
                                    Browse Portfolio
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <ChevronDown className="w-8 h-8 text-white/50" />
                    </div>
                </section>

                {/* ========== SERVICE CATEGORIES GRID ========== */}
                <section id="categories" className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        {/* Section Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                Explore Our <span className="text-[#D4AF37]">Service Categories</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                                Premium creative solutions tailored for every need
                            </p>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {filterButtons.map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => setActiveFilter(filter.value)}
                                        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${activeFilter === filter.value
                                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mobile: Accordion */}
                        <div className="block md:hidden space-y-3 max-w-lg mx-auto">
                            {filteredCategories.map((category) => {
                                const isExpanded = expandedCategory === category.id;
                                const Icon = category.icon;

                                return (
                                    <div
                                        key={category.id}
                                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}
                                    >
                                        <button
                                            onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                                            className="w-full text-left p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <span className="text-lg font-semibold text-gray-900">{category.title}</span>
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="px-4 pb-4">
                                                <ul className="space-y-2 mb-4">
                                                    {category.items.map((item, idx) => (
                                                        <li key={idx} className="flex items-center text-gray-700 text-sm">
                                                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <a href="/contact" className="block w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-lg text-center text-sm transition-colors">
                                                    Explore
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop: Grid */}
                        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCategories.map((category) => {
                                const Icon = category.icon;

                                return (
                                    <div
                                        key={category.id}
                                        className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-4 text-gray-900">{category.title}</h3>

                                        <ul className="space-y-3 mb-6">
                                            {category.items.map((item, idx) => (
                                                <li key={idx} className="flex items-center text-gray-600 group-hover:text-gray-800 transition-colors">
                                                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <a href="/contact" className="inline-flex items-center space-x-2 text-[#D4AF37] hover:text-[#B91C1C] font-semibold transition-colors group-hover:translate-x-1">
                                            <span>Explore</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ========== SERVICE INTEGRATION EXAMPLES ========== */}
                <section className="py-12 md:py-20 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-white">
                                How Services <span className="text-[#D4AF37]">Work Together</span>
                            </h2>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                Discover the power of integrated creative solutions
                            </p>
                        </div>

                        <div className="space-y-6 max-w-4xl mx-auto">
                            {integrationExamples.map((example, index) => (
                                <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6">{example.title}</h3>

                                    <div className="space-y-4 mb-6">
                                        {example.items.map((item, idx) => (
                                            <div key={idx} className="flex items-start space-x-3">
                                                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="text-white font-semibold">{item.service}</span>
                                                    <span className="text-gray-400"> → {item.result}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gradient-to-r from-[#D4AF37]/20 to-purple-600/20 rounded-xl p-4 border border-[#D4AF37]/30">
                                        <p className="text-[#D4AF37] font-semibold">
                                            <Sparkles className="w-4 h-4 inline mr-2" />
                                            Result: {example.outcome}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== POPULAR SERVICE BUNDLES ========== */}
                <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                Most Popular <span className="text-[#D4AF37]">Service Bundles</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Save 15-25% compared to individual services
                            </p>
                        </div>

                        {/* Mobile: Accordion */}
                        <div className="block md:hidden space-y-3 max-w-lg mx-auto">
                            {serviceBundles.map((bundle, index) => {
                                const isExpanded = expandedBundle === index;
                                const Icon = bundle.icon;

                                return (
                                    <div
                                        key={index}
                                        className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}
                                    >
                                        <button
                                            onClick={() => setExpandedBundle(isExpanded ? null : index)}
                                            className="w-full text-left p-4 flex items-center justify-between"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 bg-gradient-to-br ${bundle.gradient} rounded-xl flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-lg font-semibold text-gray-900 block">{bundle.title}</span>
                                                    <span className="text-sm text-[#D4AF37]">{bundle.savings}</span>
                                                </div>
                                            </div>
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                        </button>

                                        {isExpanded && (
                                            <div className="px-4 pb-4">
                                                <ul className="space-y-2 mb-4">
                                                    {bundle.items.map((item, idx) => (
                                                        <li key={idx} className="flex items-center text-gray-700 text-sm">
                                                            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="text-xl font-bold text-gray-900 mb-4">{bundle.price}</div>
                                                <a
                                                    href={getWhatsAppUrl(bundle.title)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-semibold py-3 rounded-lg text-center text-sm transition-all hover:shadow-lg"
                                                >
                                                    Get Quote
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop: Grid */}
                        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {serviceBundles.map((bundle, index) => {
                                const Icon = bundle.icon;

                                return (
                                    <div
                                        key={index}
                                        className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 relative overflow-hidden"
                                    >
                                        {/* Savings Badge */}
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {bundle.savings}
                                        </div>

                                        <div className={`w-16 h-16 bg-gradient-to-br ${bundle.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold mb-4 text-gray-900">{bundle.title}</h3>

                                        <ul className="space-y-3 mb-6">
                                            {bundle.items.map((item, idx) => (
                                                <li key={idx} className="flex items-center text-gray-600">
                                                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="text-2xl font-bold text-gray-900 mb-6">{bundle.price}</div>

                                        <a
                                            href={getWhatsAppUrl(bundle.title)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-semibold py-4 rounded-xl text-center transition-all duration-300 hover:shadow-lg hover:scale-105"
                                        >
                                            Get Quote
                                        </a>
                                    </div>
                                );
                            })}
                        </div>

                        <p className="text-center text-gray-500 mt-8">
                            All bundles include dedicated project management
                        </p>
                    </div>
                </section>

                {/* ========== INDUSTRY SPECIALIZATIONS ========== */}
                <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair">
                                Tailored Solutions for <span className="text-[#D4AF37]">Your Industry</span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Specialized expertise for your specific sector
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                            {industries.map((industry, index) => (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{industry.icon}</div>
                                    <h3 className="text-lg font-bold mb-4 text-gray-900">{industry.title}</h3>

                                    <ul className="space-y-2">
                                        {industry.items.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-gray-600 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <a href="/contact" className="inline-flex items-center space-x-1 text-[#D4AF37] hover:text-[#B91C1C] font-semibold text-sm mt-4 transition-colors">
                                        <span>Explore</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ========== TECHNOLOGY & INNOVATION ========== */}
                <section className="py-12 md:py-20 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-white">
                                Powered by <span className="text-[#D4AF37]">Cutting-Edge Technology</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                            {techFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300"
                                >
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <ul className="space-y-3">
                                        {feature.items.map((item, idx) => (
                                            <li key={idx} className="flex items-center text-gray-300 text-sm">
                                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-3 flex-shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="text-center text-gray-400">
                            <p className="text-lg">
                                Our tech advantage: <span className="text-[#D4AF37]">Faster delivery</span> •
                                <span className="text-[#D4AF37]"> Consistent quality</span> •
                                <span className="text-[#D4AF37]"> Scalable solutions</span> •
                                <span className="text-[#D4AF37]"> Cost-effective production</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========== FINAL CTA SECTION ========== */}
                <section className="py-12 md:py-20 bg-gradient-to-br from-[#D4AF37]/10 via-white to-purple-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 font-playfair">
                                Ready to Find Your <span className="text-[#D4AF37]">Perfect Service Match?</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-10">
                                Not sure which services you need? We&apos;ll help you choose.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                                <a
                                    href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20need%20personalized%20service%20recommendations."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center space-x-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    <span>Get Personalized Recommendations</span>
                                </a>

                                <a
                                    href="/transformations"
                                    className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    View Our Portfolio
                                </a>
                            </div>

                            {/* Why Choose Radikal */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Why choose Radikal for all your creative needs:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        "Single point of contact for multiple services",
                                        "Consistent quality across all deliverables",
                                        "Integrated solutions that work together",
                                        "Technology-powered efficiency and speed",
                                        "Scalable from personal to enterprise needs",
                                        "24/7 WhatsApp support"
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-2 text-gray-700">
                                            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
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
