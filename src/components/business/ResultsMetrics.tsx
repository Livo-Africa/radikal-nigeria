'use client';
import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const AnimatedCounter = ({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start: number | null = null;
        const duration = 2200;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, isVisible]);

    return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

export default function ResultsMetrics() {
    const metrics = [
        {
            icon: TrendingUp,
            end: 40,
            suffix: "%",
            label: "Average Sales Increase",
            description: "For e-commerce clients after our product photography"
        },
        {
            icon: Users,
            end: 100,
            suffix: "+",
            label: "Brands Served",
            description: "Across Ghana and Nigeria"
        },
        {
            icon: Clock,
            end: 48,
            suffix: "h",
            label: "Average Turnaround",
            description: "From consultation to first deliverables"
        },
        {
            icon: Award,
            end: 95,
            suffix: "%",
            label: "Client Satisfaction",
            description: "Based on post-project reviews"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-gray-900">
                        Proven <span className="text-[#D4AF37]">Results</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Numbers that speak for the quality and impact of our work
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 text-center"
                        >
                            {/* Icon */}
                            <div className="mb-4 flex justify-center">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <metric.icon className="w-5 h-5 md:w-6 md:h-6 text-[#D4AF37]" />
                                </div>
                            </div>

                            {/* Animated Number */}
                            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                                <AnimatedCounter end={metric.end} suffix={metric.suffix} />
                            </div>

                            {/* Label */}
                            <div className="text-sm md:text-base font-semibold text-gray-800 mb-1">
                                {metric.label}
                            </div>

                            {/* Description */}
                            <p className="text-xs md:text-sm text-gray-500 leading-relaxed hidden md:block">
                                {metric.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
