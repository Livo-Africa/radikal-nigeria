// src/components/shared/Footer.tsx - MOBILE OPTIMIZED
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-[#D4AF37]/30">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Mobile Layout - Minimal */}
        <div className="md:hidden">
          {/* Brand - Centered on mobile */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">
              RADIKAL<span className="text-[#D4AF37]">TECH</span>
            </h3>
            <p className="text-[#D4AF37] text-xs mb-3">Class • Technology • Future</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Transforming visions into visual reality.
            </p>
          </div>

          {/* Contact - Primary action on mobile */}
          <div className="mb-6">
            <div className="space-y-3">
              <a
                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20services"
                className="flex items-center justify-center text-gray-400 hover:text-white transition-colors group bg-white/5 rounded-lg p-3"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">WhatsApp</div>
                  <div className="text-xs text-gray-500">Instant response</div>
                </div>
              </a>
              <a
                href="mailto:radikalcreatech@gmail.com"
                className="flex items-center justify-center text-gray-400 hover:text-white transition-colors group bg-white/5 rounded-lg p-3"
              >
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3">
                  <Mail className="w-4 h-4 text-black" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">Email</div>
                  <div className="text-xs text-gray-500">Get in touch</div>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links - Minimal grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-[#D4AF37]">Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="/individuals" className="text-gray-400 hover:text-white transition-colors">Individuals</a></li>
                <li><a href="/business" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
                <li><a href="/creators" className="text-gray-400 hover:text-white transition-colors">Creators</a></li>
                <li><a href="/wardrobe" className="text-gray-400 hover:text-white transition-colors">Wardrobe</a></li>
                <li><a href="/transformations" className="text-gray-400 hover:text-white transition-colors">Transformations</a></li>
                <li><a href="/testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-[#D4AF37]">Services</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="/individuals" className="text-gray-400 hover:text-white transition-colors">Photography</a></li>
                <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Graphic Design</a></li>
                <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Video & Motion</a></li>
              </ul>
              <h4 className="text-sm font-semibold mt-4 mb-3 text-[#D4AF37]">Follow Us</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://www.instagram.com/radikal_creativetechnologies/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://tiktok.com/@radikalcreatechnology" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">TikTok</a></li>
                <li><a href="https://facebook.com/radikalcreativetechnologies" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              RADIKAL<span className="text-[#D4AF37]">TECH</span>
            </h3>
            <p className="text-[#D4AF37] text-sm mb-4">Class • Technology • Future</p>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Transforming visions into visual reality with premium creative technology.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a href="https://www.instagram.com/radikal_creativetechnologies/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://tiktok.com/@radikalcreatechnology" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.13a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.77-1.82v-.01l2.77.24z" /></svg>
              </a>
              <a href="https://facebook.com/radikalcreativetechnologies" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Home
              </a></li>
              <li><a href="/individuals" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Individuals
              </a></li>
              <li><a href="/business" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Business
              </a></li>
              <li><a href="/creators" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Creators
              </a></li>
              <li><a href="/wardrobe" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Wardrobe
              </a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Services
              </a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center group">
                <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                About
              </a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Services</h4>
            <ul className="space-y-3">
              <li><a href="/individuals" className="text-gray-400 hover:text-white transition-colors">Photography</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Graphic Design</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Video & Motion</a></li>
              <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">Social Media</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#D4AF37]">Get In Touch</h4>
            <div className="space-y-4">
              <a
                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20services"
                className="flex items-center text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">WhatsApp Chat</div>
                  <div className="text-sm text-gray-500">Instant response</div>
                </div>
              </a>
              <a
                href="mailto:radikalcreatech@gmail.com"
                className="flex items-center text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="font-semibold">Email Us</div>
                  <div className="text-sm text-gray-500">radikalcreatech@gmail.com</div>
                </div>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center text-[#D4AF37] hover:text-white transition-colors text-sm font-semibold mt-2"
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                Contact Page
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Responsive */}
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-xs md:text-sm mb-3 md:mb-0 text-center md:text-left">
            © {currentYear} Radikal Creative Technologies. All rights reserved.
          </div>
          <div className="flex space-x-4 md:space-x-6 text-xs md:text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}