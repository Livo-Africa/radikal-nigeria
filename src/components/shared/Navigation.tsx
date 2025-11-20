// src/components/shared/Navigation.tsx - PROFESSIONAL REDESIGN
'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Building2, Users, Camera, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll effect for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dropdowns = {
    individuals: [
      { 
        name: "Studio Shots", 
        href: "/individuals/studio",
        description: "Professional studio-style photography",
        icon: Camera
      },
      { 
        name: "Headshots", 
        href: "/individuals/headshots",
        description: "Corporate and professional headshots",
        icon: Users
      },
      { 
        name: "Occasion & Celebration", 
        href: "/individuals/occasion",
        description: "Special events and celebrations",
        icon: Sparkles
      },
      { 
        name: "Milestone Shots", 
        href: "/individuals/milestone",
        description: "Important life moments captured",
        icon: Camera
      }
    ],
    business: [
      { 
        name: "Product Shots", 
        href: "/business/product",
        description: "Professional product photography",
        icon: Camera
      },
      { 
        name: "Brand Identity", 
        href: "/business/brand",
        description: "Complete brand visual identity",
        icon: Building2
      },
      { 
        name: "Social Media Content", 
        href: "/business/social",
        description: "Engaging social media visuals",
        icon: Sparkles
      },
      { 
        name: "Marketing Visuals", 
        href: "/business/marketing",
        description: "Campaign and marketing assets",
        icon: Building2
      }
    ],
    creators: [
      { 
        name: "Partnership Programs", 
        href: "/creators/partnership",
        description: "Collaborative creator programs",
        icon: Users
      },
      { 
        name: "White-label Services", 
        href: "/creators/white-label",
        description: "Private label photography services",
        icon: Building2
      },
      { 
        name: "Portfolio Enhancement", 
        href: "/creators/portfolio",
        description: "Professional portfolio development",
        icon: Camera
      }
    ]
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Enhanced Logo with Professional Typography */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B91C1C] rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight transition-colors ${
                  scrolled ? 'text-gray-900' : 'text-white'
                } group-hover:text-[#D4AF37]`}>
                  RADIKAL
                </span>
                <span className={`text-xs transition-colors ${
                  scrolled ? 'text-gray-600' : 'text-white/80'
                } group-hover:text-[#D4AF37]`}>
                  Creative Technologies
                </span>
              </div>
            </a>

            {/* Desktop Navigation - Professional Layout */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Individuals Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('individuals')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                } font-medium text-sm`}>
                  <span>Individuals</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'individuals' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'individuals' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">For Individuals</h3>
                      <p className="text-gray-500 text-xs">Professional photography for personal use</p>
                    </div>
                    {dropdowns.individuals.map((item) => (
                      <a 
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-[#D4AF37] text-sm">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('business')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                } font-medium text-sm`}>
                  <span>Business</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'business' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'business' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">For Business</h3>
                      <p className="text-gray-500 text-xs">Enterprise-grade visual solutions</p>
                    </div>
                    {dropdowns.business.map((item) => (
                      <a 
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-[#D4AF37] text-sm">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Creators Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('creators')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 transition-all duration-200 ${
                  scrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                } font-medium text-sm`}>
                  <span>Creators</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'creators' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'creators' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 text-sm">For Creators</h3>
                      <p className="text-gray-500 text-xs">Partnership and white-label services</p>
                    </div>
                    {dropdowns.creators.map((item) => (
                      <a 
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50/80 transition-colors group"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-[#D4AF37] text-sm">
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Simple Links */}
              <a 
                href="/services" 
                className={`transition-all duration-200 font-medium text-sm ${
                  scrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Services
              </a>
              <a 
                href="/about" 
                className={`transition-all duration-200 font-medium text-sm ${
                  scrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                About
              </a>
              <a 
                href="/contact" 
                className={`transition-all duration-200 font-medium text-sm ${
                  scrolled 
                    ? 'text-gray-700 hover:text-gray-900' 
                    : 'text-white/90 hover:text-white'
                }`}
              >
                Contact
              </a>
            </div>

            {/* CTA Button - Professional Style */}
            <div className="hidden lg:flex items-center">
              <a 
                href="/start" 
                className="bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm"
              >
                Start Project
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
        mobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible pointer-events-none'
      }`} style={{ top: '76px' }}>
        <div className="flex flex-col h-full px-6 py-8 overflow-y-auto">
          {/* Mobile Navigation Items */}
          <div className="space-y-4">
            {Object.entries(dropdowns).map(([category, items]) => (
              <div key={category} className="border-b border-gray-700 pb-4">
                <h3 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wide mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 text-white hover:text-[#D4AF37] transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Simple Links */}
            {['Services', 'About', 'Contact'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white hover:text-[#D4AF37] transition-colors py-3 px-3 rounded-lg hover:bg-white/5 text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <a
              href="/start"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors text-sm"
            >
              Start Your Project
            </a>
          </div>
        </div>
      </div>
    </>
  );
}