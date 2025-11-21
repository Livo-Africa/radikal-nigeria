// src/components/shared/Navigation.tsx - FIXED VERSION
'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, Building2, Users, Camera, Menu, X } from 'lucide-react';

export default function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mounted, setMounted] = useState(false); // NEW: Track if component is mounted

  // Enhanced scroll detection
  useEffect(() => {
    setMounted(true); // Component is now mounted
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      setIsAtTop(scrollY < 10);
    };
    
    // Set initial state
    handleScroll();
    
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

  // FIXED: Glass morphism styles - Default to dark until we know scroll position
  const getNavStyles = () => {
    // Before component is mounted, default to dark style for hero background
    if (!mounted) {
      return {
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textColor: 'text-white',
        shadow: 'none'
      };
    }

    if (isAtTop) {
      // At very top - subtle glass on dark hero background
      return {
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textColor: 'text-white',
        shadow: 'none'
      };
    } else if (scrolled) {
      // Scrolled - stronger glass on white background
      return {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textColor: 'text-gray-900',
        shadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      };
    } else {
      // Minimal scroll - medium glass (shouldn't happen often)
      return {
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        textColor: 'text-gray-900',
        shadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      };
    }
  };

  const navStyles = getNavStyles();

  return (
    <>
      <nav 
        className="fixed top-0 w-full z-50 transition-all duration-500 ease-out"
        style={{
          background: navStyles.background,
          backdropFilter: navStyles.backdropFilter,
          borderBottom: navStyles.border,
          boxShadow: navStyles.shadow
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Enhanced Logo with Glass Effect */}
            <a href="/" className="flex items-center space-x-3 group">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${navStyles.textColor} group-hover:text-[#D4AF37]`}>
                  RADIKAL
                </span>
                <span className={`text-xs transition-colors duration-300 ${
                  !mounted || isAtTop ? 'text-white/70' : 'text-gray-600'
                } group-hover:text-[#D4AF37]`}>
                  Creative Technologies
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Individuals Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('individuals')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`flex items-center space-x-1 transition-all duration-200 font-medium text-sm ${navStyles.textColor} hover:text-[#D4AF37]`}>
                  <span>Individuals</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'individuals' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'individuals' && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-80 rounded-2xl py-3 z-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100/50">
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
                <button className={`flex items-center space-x-1 transition-all duration-200 font-medium text-sm ${navStyles.textColor} hover:text-[#D4AF37]`}>
                  <span>Business</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'business' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'business' && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-80 rounded-2xl py-3 z-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100/50">
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
                <button className={`flex items-center space-x-1 transition-all duration-200 font-medium text-sm ${navStyles.textColor} hover:text-[#D4AF37]`}>
                  <span>Creators</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === 'creators' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeDropdown === 'creators' && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-80 rounded-2xl py-3 z-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100/50">
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
              {['Services', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`transition-all duration-200 font-medium text-sm ${navStyles.textColor} hover:text-[#D4AF37]`}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Button with Glass Effect */}
            <div className="hidden lg:flex items-center">
              <a 
                href="/start" 
                className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 1) 0%, rgba(185, 28, 28, 1) 100%)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(212, 175, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(212, 175, 55, 0.4)';
                }}
              >
                Start Project
              </a>
            </div>

            {/* FIXED: Mobile Menu Button - Always visible with proper color */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 transition-colors ${
                !mounted || isAtTop ? 'text-white' : 'text-gray-900'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Enhanced Glass Morphism */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ease-out ${
          mobileMenuOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`} 
        style={{ top: '72px' }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)'
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Mobile Menu Content */}
        <div 
          className="relative h-full max-h-[calc(100vh-72px)] overflow-y-auto"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="flex flex-col px-6 py-8">
            {/* Mobile Navigation Items */}
            <div className="space-y-6">
              {Object.entries(dropdowns).map(([category, items]) => (
                <div key={category} className="border-b border-gray-200/50 pb-6">
                  <h3 className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wide mb-4">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-gray-900 hover:text-[#D4AF37] transition-colors py-3 px-4 rounded-xl hover:bg-white/50"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-gray-500 text-xs">{item.description}</div>
                        </div>
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
                  className="block text-gray-900 hover:text-[#D4AF37] transition-colors py-4 px-4 rounded-xl hover:bg-white/50 text-sm font-medium border-b border-gray-200/50"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <a
                href="/start"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-semibold py-4 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 text-sm"
                style={{
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)'
                }}
              >
                Start Your Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}