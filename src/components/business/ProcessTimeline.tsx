'use client';
import { MessageSquare, Lightbulb, Clapperboard, Send, Clock } from 'lucide-react';

export default function ProcessTimeline() {
    const steps = [
        {
            step: 1,
            title: "Consultation",
            description: "We discuss your brand goals, challenges, and vision to craft the perfect strategy",
            icon: <MessageSquare className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            time: "30 mins"
        },
        {
            step: 2,
            title: "Strategy & Planning",
            description: "Our team designs a tailored creative and technical roadmap for your project",
            icon: <Lightbulb className="w-6 h-6" />,
            color: "from-[#D4AF37] to-[#F4D03F]",
            time: "1-2 days"
        },
        {
            step: 3,
            title: "Production",
            description: "We bring your vision to life with premium design, development, and content creation",
            icon: <Clapperboard className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500",
            time: "3-14 days"
        },
        {
            step: 4,
            title: "Delivery & Support",
            description: "Final assets delivered with ongoing support and optimization recommendations",
            icon: <Send className="w-6 h-6" />,
            color: "from-green-500 to-emerald-500",
            time: "On schedule"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-900 to-black relative overflow-hidden">
            {/* Subtle background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#B91C1C]/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-playfair">
                        How We <span className="text-[#D4AF37]">Work</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                        A streamlined process designed for efficiency and exceptional results
                    </p>
                </div>

                {/* Desktop: Horizontal Timeline */}
                <div className="hidden lg:block">
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-white/10 via-[#D4AF37]/30 to-white/10"></div>

                        <div className="grid grid-cols-4 gap-8 relative">
                            {steps.map((step) => (
                                <div key={step.step} className="text-center group">
                                    {/* Step Circle */}
                                    <div className="relative mb-8 flex justify-center">
                                        <div className={`relative w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#D4AF37]/10`}>
                                            {step.icon}
                                            {/* Step Number */}
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                                                {step.step}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-2">
                                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-3 leading-relaxed">
                                            {step.description}
                                        </p>
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

                {/* Mobile: Vertical Timeline */}
                <div className="lg:hidden">
                    <div className="max-w-lg mx-auto">
                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/30 via-white/10 to-transparent -translate-x-1/2"></div>

                            <div className="space-y-8">
                                {steps.map((step) => (
                                    <div key={step.step} className="flex items-start group">
                                        {/* Step Circle */}
                                        <div className={`relative flex-shrink-0 w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 z-10`}>
                                            {step.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="ml-5 flex-1 pb-2">
                                            <div className="flex items-start justify-between mb-1.5">
                                                <h3 className="text-lg font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                                                    {step.title}
                                                </h3>
                                                <div className="flex items-center text-xs text-gray-500 font-medium ml-2 mt-1">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {step.time}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
