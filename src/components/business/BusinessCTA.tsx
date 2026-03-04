'use client';
import { ArrowRight, Star, Zap, MessageCircle, RefreshCw } from 'lucide-react';

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
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <span>Start Your Consultation</span>
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Trust Elements */}
                <div className="mt-12 pt-8 border-t border-white/20">
                    <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
                        <span className="inline-flex items-center gap-1.5">
                            <Star className="w-4 h-4" />
                            Premium Quality Guarantee
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Zap className="w-4 h-4" />
                            Fast Turnaround
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <MessageCircle className="w-4 h-4" />
                            24/7 WhatsApp Support
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <RefreshCw className="w-4 h-4" />
                            Revisions Included
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
