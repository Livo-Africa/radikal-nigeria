// src/components/individuals/FAQSection.tsx - PREMIUM DARK MODE REDESIGN
'use client';
import { useState, useMemo } from 'react';
import { Search, ChevronDown, X, MessageCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const faqs = [
    {
      question: "How does the virtual photoshoot work?",
      answer: "Simply choose your package, upload your selfies or photos, select your preferred styles and outfits from our virtual wardrobe, and we'll transform them into studio-quality professional photos delivered directly to your WhatsApp in 1-3 hours.",
      category: "Getting Started"
    },
    {
      question: "What kind of photos should I upload?",
      answer: "Upload clear, well-lit selfies or photos taken against a plain background. Make sure your face is clearly visible and you're not wearing hats or sunglasses that obscure your features. The better the original photo, the better the final result!",
      category: "Getting Started"
    },
    {
      question: "How long does delivery take?",
      answer: "Most orders are delivered within 1-3 hours. We offer rush delivery options (1 hour or less) for an additional fee if you need your photos urgently.",
      category: "Delivery"
    },
    {
      question: "Can I use these photos for professional purposes?",
      answer: "Absolutely! Our photos are perfect for LinkedIn profiles, professional portfolios, business websites, and corporate branding. Many clients use our headshots for their professional online presence.",
      category: "Results"
    },
    {
      question: "What if I'm not happy with the results?",
      answer: "We offer one round of revisions for each package. If you're not completely satisfied, let us know what adjustments you'd like and we'll make them at no extra cost.",
      category: "Results"
    },
    {
      question: "Do you store my photos after delivery?",
      answer: "No, we delete all client photos from our systems once they've been delivered and approved. Your privacy and security are our top priorities.",
      category: "Privacy"
    },
    {
      question: "Can I get photos for my whole team or group?",
      answer: "Yes! We offer group packages for teams, families, and couples. Our group packages include multiple outfit changes and hairstyles to ensure everyone looks their best.",
      category: "Packages"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept mobile money, bank transfers, and credit/debit cards through secure payment processors. Full payment is required before we begin editing your photos.",
      category: "Payment"
    }
  ];

  const uniqueCategories = Array.from(new Set(faqs.map(faq => faq.category)));
  const categories = ['All', ...uniqueCategories];

  const filteredFaqs = useMemo(() => {
    let filtered = faqs;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
      );
    }

    if (activeCategory && activeCategory !== 'All') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    return filtered;
  }, [searchQuery, activeCategory, faqs]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#0A0A0F] to-[#0D0D15]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2 font-playfair text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-white/40 text-center mb-8 max-w-2xl mx-auto">
          Everything you need to know about our virtual photoshoots
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Search Bar - Dark Glass */}
          <div className="mb-6 relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a question..."
                className="w-full pl-12 pr-10 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/30 text-white placeholder:text-white/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="text-sm text-white/30 mt-2">
                Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Category Filter - Glass Segmented Controls */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 pb-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category === 'All' ? null : category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${(category === 'All' && !activeCategory) || activeCategory === category
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                    : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Info */}
          {(searchQuery || activeCategory) && (
            <div className="mb-6 flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
              <span className="text-sm text-white/40">
                Showing {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
                {activeCategory && activeCategory !== 'All' && ` in ${activeCategory}`}
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* FAQ List - Glass Cards */}
          {filteredFaqs.length > 0 ? (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border-b border-white/5 last:border-b-0 ${openIndex === index ? 'bg-white/[0.02]' : ''
                    }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-6 text-left flex justify-between items-start hover:bg-white/[0.02] transition-colors duration-300"
                  >
                    <div className="flex-1 pr-4">
                      <div className="flex items-center mb-1">
                        <span className="inline-block bg-amber-500/10 text-amber-400 text-xs font-medium px-2.5 py-1 rounded-lg mr-3 border border-amber-500/20">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {faq.question}
                      </h3>
                    </div>
                    <span className={`text-white/30 transform transition-all duration-300 ${openIndex === index ? 'rotate-180 text-amber-400' : ''
                      }`}>
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>

                  <div className={`px-6 pb-6 transition-all duration-300 ${openIndex === index ? 'block' : 'hidden'
                    }`}>
                    <p className="text-white/50 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
              <div className="text-white/20 mb-4">
                <Search className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No questions found
              </h3>
              <p className="text-white/40 mb-6">
                We couldn't find any questions matching "{searchQuery}"
                {activeCategory && activeCategory !== 'All' && ` in ${activeCategory}`}
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300"
              >
                Clear search & filters
              </button>
            </div>
          )}

          {/* Still have questions - WhatsApp CTA */}
          <div className="text-center mt-12">
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl p-8 border border-white/10 relative overflow-hidden">
              {/* Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-green-500/10 rounded-full blur-[60px] pointer-events-none"></div>

              <div className="flex items-center justify-center mb-4 relative z-10">
                <MessageCircle className="w-8 h-8 text-amber-400 mr-3" />
                <h4 className="text-2xl font-bold text-white">
                  Still have questions?
                </h4>
              </div>
              <p className="text-white/50 mb-6 relative z-10">
                Chat with us on WhatsApp for instant answers and support.
              </p>
              <a
                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20have%20a%20question%20about%20your%20virtual%20photoshoots"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.25)]"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}