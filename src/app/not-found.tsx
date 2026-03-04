import Link from 'next/link';
import { ArrowRight, Home } from 'lucide-react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

export default function NotFound() {
    return (
        <>
            <Navigation />
            <main className="flex-1 flex flex-col min-h-[85vh] bg-black text-white relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Gradient Orbs */}
                    <div className="absolute top-20 left-10 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-[#D4AF37]/20 to-[#F4D03F]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-[#F4D03F]/10 to-[#D4AF37]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2000ms' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-[#FFD700]/10 to-[#D4AF37]/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>

                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent"></div>
                        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F4D03F] to-transparent"></div>
                    </div>
                </div>

                <div className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center relative z-10 text-center py-20">
                    {/* 404 Text */}
                    <div className="mb-4 animate-slideDown">
                        <h1 className="text-8xl md:text-9xl font-light text-white mb-2 tracking-tighter leading-none">
                            4<span className="bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent font-semibold inline-block">0</span>4
                        </h1>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-light mb-6 text-white tracking-tight animate-fadeIn" style={{ animationDelay: '200ms' }}>
                        Page not found
                    </h2>

                    <p className="text-gray-400 max-w-lg mb-10 text-lg md:text-xl font-light animate-fadeIn" style={{ animationDelay: '400ms' }}>
                        The page you are looking for has been moved, deleted, or does not exist.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '600ms' }}>
                        <Link
                            href="/"
                            className="group bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-[#b8941f] hover:to-[#d4b83d] text-black font-semibold py-3 px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center space-x-2 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            <Home className="w-5 h-5 relative z-10" />
                            <span className="relative z-10">Return Home</span>
                        </Link>

                        <Link
                            href="/business"
                            className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 border border-white/30 hover:border-white/50 flex items-center justify-center space-x-2"
                        >
                            <span>View Services</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Inline styles for animations */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes slideDown {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slideDown { animation: slideDown 0.8s ease-out both; }
          .animate-fadeIn { animation: fadeIn 0.8s ease-out both; }
        `}} />
            </main>
            <Footer />
        </>
    );
}
