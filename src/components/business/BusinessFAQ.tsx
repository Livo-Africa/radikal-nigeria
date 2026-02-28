'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BusinessFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "What services do you offer for businesses?",
            answer: "We provide a comprehensive suite: Graphic Design (brand kits, logos, social media templates), Photography & Video (product shots, corporate headshots, commercial video), Motion & Animation (promo videos, brand stories), Web Development, Custom Application Development, Systems & Workflow Automation, and Commercial Advertising campaigns."
        },
        {
            question: "How long does a typical business project take?",
            answer: "Timelines vary by scope. Simple projects like product photography or social media templates can be delivered in 24-48 hours. Larger projects like brand identity packages, website development, or commercial ad campaigns typically take 1-4 weeks depending on complexity."
        },
        {
            question: "Do you handle bulk or ongoing work?",
            answer: "Absolutely! We offer retainer packages for businesses needing consistent creative and technical output. This includes monthly content creation, ongoing design support, and dedicated account management. Retainer clients also enjoy priority turnaround and discounted rates."
        },
        {
            question: "How does pricing work for business projects?",
            answer: "Every business has unique needs, so we provide custom quotes after an initial consultation. We'll discuss your goals, scope, and budget to create a tailored proposal. There are no hidden fees — everything is agreed upfront."
        },
        {
            question: "Can you work with our existing brand guidelines?",
            answer: "Yes! We work seamlessly with your existing brand assets, style guides, and color palettes. If you don't have brand guidelines yet, we can create a comprehensive brand kit as part of our Graphic Design services."
        },
        {
            question: "Do you serve businesses outside Ghana?",
            answer: "Yes, we serve businesses across West Africa and beyond. We currently have active operations in Ghana and Nigeria, with the ability to handle remote projects for clients anywhere in the world."
        },
        {
            question: "What industries do you specialize in?",
            answer: "We work with businesses across all industries — e-commerce, real estate, hospitality, fashion, tech startups, FMCG, healthcare, and more. Our diverse experience allows us to adapt our creative approach to any sector."
        },
        {
            question: "What's included in the consultation?",
            answer: "Our free consultation covers a review of your current brand presence, discussion of your goals and challenges, project scoping, timeline estimation, and a no-obligation custom quote. It typically takes 30 minutes via WhatsApp or video call."
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-14">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 font-playfair text-gray-900">
                        Frequently Asked <span className="text-[#D4AF37]">Questions</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about working with us
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`border-b border-gray-100 last:border-b-0 ${openIndex === index ? 'bg-gray-50/50' : ''
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full px-5 md:px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 pr-4">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-[#D4AF37] flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-5 md:px-6 pb-5">
                                        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="text-center mt-10">
                        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20">
                            <h4 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">
                                Still have questions?
                            </h4>
                            <p className="text-gray-600 mb-5 text-sm md:text-base">
                                Chat with us on WhatsApp for instant answers and personalized guidance.
                            </p>
                            <a
                                href="https://wa.me/233207472307?text=Hi%20Radikal!%20I%20have%20a%20question%20about%20your%20business%20services"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="mr-2">💬</span>
                                Chat on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
