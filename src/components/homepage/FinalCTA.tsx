// src/components/homepage/FinalCTA.tsx - HIDDEN ON MOBILE, VISIBLE ON DESKTOP
'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Star, Zap, MessageCircle, CheckCircle2 } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  );
};

export default function FinalCTA() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Check if mobile and control visibility
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsVisible(!mobile); // Hide on mobile, show on desktop
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  // Desktop view - full component
  return (
    <section className="py-12 md:py-20 bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full -translate-x-16 -translate-y-16 md:-translate-x-32 md:-translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/5 rounded-full translate-x-16 translate-y-16 md:translate-x-32 md:translate-y-32"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Enhanced Header */}
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 font-playfair">
          Ready to Experience the <span className="text-black">Radikal Difference</span>?
        </h2>
        <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
          Join hundreds of satisfied clients transforming their visuals
        </p>

        {/* Enhanced CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12">
          <a
            href="/individuals"
            className="group bg-black hover:bg-gray-900 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent flex items-center justify-center space-x-2"
          >
            <span>Start Your Photoshoot</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/business"
            className="group bg-white hover:bg-gray-100 text-black font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg text-base md:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent flex items-center justify-center space-x-2"
          >
            <span>Get Business Solutions</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Enhanced Animated Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-xl md:text-3xl font-bold mb-2 text-white bg-black/20 rounded-lg py-3 md:py-4 flex items-center justify-center space-x-2">
              <Users className="w-5 h-5 md:w-6 md:h-6" />
              <span>
                <AnimatedCounter end={500} duration={2500} suffix="+" />
              </span>
            </div>
            <div className="text-xs md:text-sm font-semibold">Happy Clients</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-xl md:text-3xl font-bold mb-2 text-white bg-black/20 rounded-lg py-3 md:py-4 flex items-center justify-center space-x-2">
              <Star className="w-5 h-5 md:w-6 md:h-6" />
              <span>
                <AnimatedCounter end={4.9} duration={2500} suffix="/5" />
              </span>
            </div>
            <div className="text-xs md:text-sm font-semibold">Satisfaction Rate</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-xl md:text-3xl font-bold mb-2 text-white bg-black/20 rounded-lg py-3 md:py-4 flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 md:w-6 md:h-6" />
              <span>
                <AnimatedCounter end={3} duration={2500} suffix="h" />
              </span>
            </div>
            <div className="text-xs md:text-sm font-semibold">Avg Delivery</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-xl md:text-3xl font-bold mb-2 text-white bg-black/20 rounded-lg py-3 md:py-4 flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span>24/7</span>
            </div>
            <div className="text-xs md:text-sm font-semibold">WhatsApp Support</div>
          </div>
        </div>

        {/* Enhanced Trust Elements */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/20">
          <p className="text-base md:text-lg mb-4 font-semibold">Trusted by businesses and individuals worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 opacity-90">
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="w-4 h-4 text-white" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MessageCircle className="w-4 h-4 text-white" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}