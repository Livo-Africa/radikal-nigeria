'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start: number | null = null;
        const duration = 2000;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [end, isVisible]);

    return <span ref={ref}>{count}{suffix}</span>;
};

export default function BusinessCTA() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-32 translate-y-32"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.03] rounded-full"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-5 font-playfair">
                    Ready to Elevate Your Brand?
                </h2>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90">
                    Join hundreds of businesses that have transformed their visual presence with Radikal
                </p>

                {/* WhatsApp CTA */}
                <a
                    href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20need%20business%20solutions%20for%20my%20brand.%20Can%20we%20discuss%20my%20needs?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center bg-black hover:bg-gray-900 text-white font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                    <span className="mr-2">💬</span>
                    <span>Start Your Consultation</span>
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-14">
                    {[
                        { end: 100, suffix: "+", label: "Brands Served" },
                        { end: 95, suffix: "%", label: "Satisfaction Rate" },
                        { end: 48, suffix: "h", label: "Avg Turnaround" },
                        { end: 500, suffix: "+", label: "Projects Delivered" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center group">
                            <div className="text-2xl md:text-3xl font-bold mb-1 bg-black/20 rounded-xl py-3 group-hover:bg-black/30 transition-colors">
                                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                            </div>
                            <div className="text-sm font-medium text-white/80 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Trust Elements */}
                <div className="mt-12 pt-8 border-t border-white/20">
                    <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                        <span>⭐ Premium Quality Guarantee</span>
                        <span>⚡ Fast Turnaround</span>
                        <span>💬 24/7 WhatsApp Support</span>
                        <span>🔄 Revisions Included</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
