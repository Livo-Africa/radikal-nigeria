// src/components/individuals/FinalCTA.tsx - PREMIUM DARK MODE REDESIGN
'use client';
import { useState, useEffect, useRef } from 'react';

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
  return (
    <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 -translate-y-48 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-48 translate-y-48 blur-3xl"></div>

      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair">
          Ready for Your Professional Transformation?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
          Join thousands of satisfied clients who've transformed their visuals with Radikal
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="/individuals/style-journey"
            className="bg-black text-white hover:bg-gray-900 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl text-center"
          >
            Start Your Photoshoot Now
          </a>
          <a
            href="/packages"
            className="bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 text-center"
          >
            View All Packages
          </a>
        </div>

        {/* Trust Indicators - Glass Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl md:text-3xl font-bold mb-2 text-white bg-black/20 backdrop-blur-sm rounded-xl py-4 border border-white/10">
              <AnimatedCounter end={500} duration={2500} suffix="+" />
            </div>
            <div className="text-sm md:text-base font-semibold text-white/80">Happy Clients</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl md:text-3xl font-bold mb-2 text-white bg-black/20 backdrop-blur-sm rounded-xl py-4 border border-white/10">
              <AnimatedCounter end={4.9} duration={2500} suffix="/5" />
            </div>
            <div className="text-sm md:text-base font-semibold text-white/80">Satisfaction Rate</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl md:text-3xl font-bold mb-2 text-white bg-black/20 backdrop-blur-sm rounded-xl py-4 border border-white/10">
              <AnimatedCounter end={3} duration={2500} suffix="h" />
            </div>
            <div className="text-sm md:text-base font-semibold text-white/80">Avg Delivery</div>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-2xl md:text-3xl font-bold mb-2 text-white bg-black/20 backdrop-blur-sm rounded-xl py-4 border border-white/10">
              24/7
            </div>
            <div className="text-sm md:text-base font-semibold text-white/80">WhatsApp Support</div>
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-lg mb-4 text-white/90">Trusted by professionals and individuals across Ghana</p>
          <div className="flex justify-center items-center flex-wrap gap-6 opacity-80 text-sm">
            <span className="flex items-center">⭐ Premium Quality Guarantee</span>
            <span className="flex items-center">⚡ 1-3 Hour Delivery</span>
            <span className="flex items-center">💬 24/7 WhatsApp Support</span>
            <span className="flex items-center">🔄 Free Revisions</span>
          </div>
        </div>

        {/* WhatsApp Quick Action */}
        <div className="mt-12">
          <p className="text-sm text-white/60 mb-4">Prefer to chat first?</p>
          <a
            href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20virtual%20photoshoot%20services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
          >
            <span className="mr-2">💬</span>
            Chat with Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}