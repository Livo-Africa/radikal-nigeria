// src/app/contact/page.tsx
'use client';
import { useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import {
    Phone, Mail, MapPin, Send, MessageCircle,
    Clock, CheckCircle2, ArrowRight, Sparkles,
    Zap, ChevronDown
} from 'lucide-react';

// Industry services data (from the services page)
const industryServicesMap: Record<string, string[]> = {
    'Fashion & Beauty': ['Virtual try-ons', 'Lookbook creation', 'Influencer content', 'Style guides', 'Custom'],
    'E-commerce & Retail': ['Product photography', 'Lifestyle shots', 'E-commerce optimization', 'Social media advertising', 'Custom'],
    'Tech & Startups': ['Brand identity', 'Pitch deck design', 'Product visualization', 'Corporate photography', 'Custom'],
    'Food & Hospitality': ['Restaurant photography', 'Menu design', 'Food styling', 'Promotional videos', 'Custom'],
    'Corporate Services': ['Executive portraits', 'Team photography', 'Corporate branding', 'Event coverage', 'Custom'],
};

const industryOptions = Object.keys(industryServicesMap);

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        industrySubService: '',
        budget: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Direct services (from services page + business page)
    const directServices = [
        'Virtual Photoshoot',
        'Graphic Design',
        'Motion & Animation',
        'Brand Identity',
        'Social Media Management',
        'Product Photography',
        'Video Production',
        'Web Development',
        'Systems & Automation',
        'Custom Applications',
        'Commercial Ads',
        'Advanced Solutions',
        'Custom Project'
    ];

    const budgetRanges = [
        'Under GH₵400 / ₦50,000',
        'GH₵400 – GH₵1,200 / ₦50,000 – ₦150,000',
        'GH₵1,200 – GH₵4,000 / ₦150,000 – ₦500,000',
        'GH₵4,000 – GH₵8,000 / ₦500,000 – ₦1,000,000',
        'Above GH₵8,000 / ₦1,000,000',
        'Custom'
    ];

    const isIndustryService = industryOptions.includes(formData.service);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Build WhatsApp message from form data
        const message = [
            `Hi Radikal! I'd like to inquire about your services.`,
            ``,
            `*Name:* ${formData.name}`,
            formData.email ? `*Email:* ${formData.email}` : '',
            formData.phone ? `*Phone:* ${formData.phone}` : '',
            formData.service ? `*Service:* ${formData.service}` : '',
            isIndustryService && formData.industrySubService ? `*Specific Need:* ${formData.industrySubService}` : '',
            formData.budget ? `*Budget:* ${formData.budget}` : '',
            formData.message ? `*Message:* ${formData.message}` : ''
        ].filter(Boolean).join('\n');

        const whatsappUrl = `https://wa.me/233207472307?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        setIsSubmitting(false);
        setSubmitted(true);

        // Reset after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', phone: '', service: '', industrySubService: '', budget: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const next = { ...prev, [name]: value };
            // Reset industry sub-service when switching away from an industry option
            if (name === 'service' && !industryOptions.includes(value)) {
                next.industrySubService = '';
            }
            return next;
        });
    };

    return (
        <>
            <Navigation />
            <main className="flex-1 pt-20">
                {/* Contact Cards + Form */}
                <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">

                            {/* ===== MOBILE LAYOUT ===== */}
                            <div className="block lg:hidden">
                                {/* Form First on Mobile */}
                                <div className="mb-10">
                                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
                                        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-playfair">
                                            Start Your <span className="text-[#D4AF37]">Project</span>
                                        </h1>
                                        <p className="text-gray-500 mb-6 text-sm">Fill out the form and we&apos;ll get back to you via WhatsApp within minutes.</p>

                                        {submitted ? (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                                <p className="text-gray-500 text-sm">We&apos;ll get back to you shortly on WhatsApp.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div>
                                                    <label htmlFor="name-mobile" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                                    <input
                                                        type="text"
                                                        id="name-mobile"
                                                        name="name"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50"
                                                        placeholder="Your name"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email-mobile" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        id="email-mobile"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50"
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="phone-mobile" className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                                                    <input
                                                        type="tel"
                                                        id="phone-mobile"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50"
                                                        placeholder="+233 XXX XXX XXXX"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="service-mobile" className="block text-sm font-semibold text-gray-700 mb-2">Service Needed</label>
                                                    <div className="relative">
                                                        <select
                                                            id="service-mobile"
                                                            name="service"
                                                            value={formData.service}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                                                        >
                                                            <option value="">Select a service</option>
                                                            <optgroup label="Direct Services">
                                                                {directServices.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </optgroup>
                                                            <optgroup label="Industry Solutions">
                                                                {industryOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                            </optgroup>
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    </div>
                                                </div>

                                                {/* Industry Sub-Service Dropdown (conditionally shown) */}
                                                {isIndustryService && (
                                                    <div className="animate-fadeIn">
                                                        <label htmlFor="industrySubService-mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Specific {formData.service} Need
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                id="industrySubService-mobile"
                                                                name="industrySubService"
                                                                value={formData.industrySubService}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                                                            >
                                                                <option value="">Select specific service</option>
                                                                {industryServicesMap[formData.service]?.map(sub => (
                                                                    <option key={sub} value={sub}>{sub}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <label htmlFor="budget-mobile" className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
                                                    <div className="relative">
                                                        <select
                                                            id="budget-mobile"
                                                            name="budget"
                                                            value={formData.budget}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                                                        >
                                                            <option value="">Select budget range</option>
                                                            {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                                                        </select>
                                                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="message-mobile" className="block text-sm font-semibold text-gray-700 mb-2">Project Details</label>
                                                    <textarea
                                                        id="message-mobile"
                                                        name="message"
                                                        rows={3}
                                                        value={formData.message}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 resize-none"
                                                        placeholder="Tell us about your project..."
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                                >
                                                    {isSubmitting ? (
                                                        <span>Sending...</span>
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5" />
                                                            <span>Send via WhatsApp</span>
                                                        </>
                                                    )}
                                                </button>

                                                <p className="text-xs text-gray-400 text-center">
                                                    Your inquiry will open in WhatsApp for instant communication.
                                                </p>
                                            </form>
                                        )}
                                    </div>
                                </div>

                                {/* Contact Methods - Below form on mobile */}
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20services"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex items-center space-x-4"
                                    >
                                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <MessageCircle className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">WhatsApp</h3>
                                            <p className="text-gray-500 text-sm">Fastest way to reach us</p>
                                            <div className="flex items-center text-green-600 font-semibold text-xs mt-1">
                                                <Clock className="w-3.5 h-3.5 mr-1" />
                                                <span>Typically responds in minutes</span>
                                            </div>
                                        </div>
                                    </a>

                                    {/* Email */}
                                    <a
                                        href="mailto:radikalcreatech@gmail.com"
                                        className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex items-center space-x-4"
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#B91C1C] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">Email</h3>
                                            <p className="text-gray-500 text-sm">radikalcreatech@gmail.com</p>
                                            <div className="flex items-center text-[#D4AF37] font-semibold text-xs mt-1">
                                                <Clock className="w-3.5 h-3.5 mr-1" />
                                                <span>Responds within 24 hours</span>
                                            </div>
                                        </div>
                                    </a>

                                    {/* Locations */}
                                    <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center space-x-4">
                                        <div className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <MapPin className="w-7 h-7 text-[#D4AF37]" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900">Locations</h3>
                                            <p className="text-gray-500 text-sm">Accra, Ghana 🇬🇭 &bull; Lagos, Nigeria 🇳🇬</p>
                                            <p className="text-[#D4AF37] font-semibold text-xs mt-1">Virtual services worldwide</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Why Radikal - mobile */}
                                <div className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl mb-6">
                                    <h3 className="text-lg font-bold mb-4 flex items-center">
                                        <Sparkles className="w-5 h-5 text-[#D4AF37] mr-2" />
                                        Why Choose Radikal
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Premium quality at competitive prices',
                                            '1-3 hour average delivery time',
                                            '24/7 WhatsApp support',
                                            'Free consultations',
                                            '500+ happy clients across Ghana & Nigeria',
                                            'No hidden fees — everything agreed upfront'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mr-2 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-300 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Social + Response Times on mobile */}
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Social Links */}
                                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                                        <div className="space-y-3">
                                            <a href="https://www.instagram.com/radikal_creativetechnologies/" target="_blank" rel="noopener noreferrer"
                                                className="flex items-center space-x-3 text-gray-600 hover:text-[#E4405F] transition-colors group">
                                                <div className="w-9 h-9 bg-gradient-to-br from-[#E4405F] to-[#FCAF45] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                                </div>
                                                <span className="font-medium text-sm">@radikal_creativetechnologies</span>
                                            </a>
                                            <a href="https://tiktok.com/@radikalcreatechnology" target="_blank" rel="noopener noreferrer"
                                                className="flex items-center space-x-3 text-gray-600 hover:text-black transition-colors group">
                                                <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.13a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.77-1.82v-.01l2.77.24z" /></svg>
                                                </div>
                                                <span className="font-medium text-sm">@radikalcreatechnology</span>
                                            </a>
                                            <a href="https://facebook.com/radikalcreativetechnologies" target="_blank" rel="noopener noreferrer"
                                                className="flex items-center space-x-3 text-gray-600 hover:text-[#1877F2] transition-colors group">
                                                <div className="w-9 h-9 bg-[#1877F2] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                </div>
                                                <span className="font-medium text-sm">Radikal Creative Technologies</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Response Times */}
                                    <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/5 rounded-3xl p-6 border border-[#D4AF37]/20">
                                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <Clock className="w-5 h-5 text-[#D4AF37] mr-2" />
                                            Response Times
                                        </h3>
                                        <div className="space-y-2.5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">WhatsApp</span>
                                                <span className="text-green-600 font-semibold text-sm flex items-center">
                                                    <Zap className="w-3.5 h-3.5 mr-1" />
                                                    Within minutes
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Email</span>
                                                <span className="text-[#D4AF37] font-semibold text-sm">Within 24 hours</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">Social Media</span>
                                                <span className="text-gray-600 font-semibold text-sm">Within 12 hours</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-3">Available 24/7 for urgent inquiries via WhatsApp</p>
                                    </div>
                                </div>
                            </div>

                            {/* ===== DESKTOP LAYOUT (lg+) ===== */}
                            <div className="hidden lg:block">
                                {/* Contact Methods Grid */}
                                <div className="grid grid-cols-3 gap-6 mb-16">
                                    {/* WhatsApp */}
                                    <a
                                        href="https://wa.me/233207472307?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20services"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 text-center"
                                    >
                                        <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <MessageCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                                        <p className="text-gray-500 text-sm mb-3">Fastest way to reach us</p>
                                        <div className="flex items-center justify-center text-green-600 font-semibold text-sm">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>Typically responds in minutes</span>
                                        </div>
                                    </a>

                                    {/* Email */}
                                    <a
                                        href="mailto:radikalcreatech@gmail.com"
                                        className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 text-center"
                                    >
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B91C1C] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                                        <p className="text-gray-500 text-sm mb-3">radikalcreatech@gmail.com</p>
                                        <div className="flex items-center justify-center text-[#D4AF37] font-semibold text-sm">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>Responds within 24 hours</span>
                                        </div>
                                    </a>

                                    {/* Location */}
                                    <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 text-center">
                                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <MapPin className="w-8 h-8 text-[#D4AF37]" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Locations</h3>
                                        <p className="text-gray-500 text-sm mb-1">Accra, Ghana 🇬🇭</p>
                                        <p className="text-gray-500 text-sm">Lagos, Nigeria 🇳🇬</p>
                                        <p className="text-[#D4AF37] font-semibold text-sm mt-3">Virtual services worldwide</p>
                                    </div>
                                </div>

                                {/* Form + Info Grid - Desktop */}
                                <div className="grid grid-cols-5 gap-12">
                                    {/* Contact Form */}
                                    <div className="col-span-3">
                                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
                                            <h1 className="text-2xl md:text-3xl font-bold mb-2 font-playfair">
                                                Start Your <span className="text-[#D4AF37]">Project</span>
                                            </h1>
                                            <p className="text-gray-500 mb-8">Fill out the form and we&apos;ll get back to you via WhatsApp within minutes.</p>

                                            {submitted ? (
                                                <div className="text-center py-16">
                                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                                    <p className="text-gray-500">We&apos;ll get back to you shortly on WhatsApp.</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                                                            <input
                                                                type="text"
                                                                id="name"
                                                                name="name"
                                                                required
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50"
                                                                placeholder="Your name"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                            <input
                                                                type="email"
                                                                id="email"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50"
                                                                placeholder="you@example.com"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                                                            <input
                                                                type="tel"
                                                                id="phone"
                                                                name="phone"
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50"
                                                                placeholder="+233 XXX XXX XXXX"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">Service Needed</label>
                                                            <div className="relative">
                                                                <select
                                                                    id="service"
                                                                    name="service"
                                                                    value={formData.service}
                                                                    onChange={handleChange}
                                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                                                                >
                                                                    <option value="">Select a service</option>
                                                                    <optgroup label="Direct Services">
                                                                        {directServices.map(s => <option key={s} value={s}>{s}</option>)}
                                                                    </optgroup>
                                                                    <optgroup label="Industry Solutions">
                                                                        {industryOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                                    </optgroup>
                                                                </select>
                                                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Industry Sub-Service Dropdown (conditionally shown) */}
                                                    {isIndustryService && (
                                                        <div className="animate-fadeIn">
                                                            <label htmlFor="industrySubService" className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Specific {formData.service} Need
                                                            </label>
                                                            <div className="relative">
                                                                <select
                                                                    id="industrySubService"
                                                                    name="industrySubService"
                                                                    value={formData.industrySubService}
                                                                    onChange={handleChange}
                                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                                                                >
                                                                    <option value="">Select specific service</option>
                                                                    {industryServicesMap[formData.service]?.map(sub => (
                                                                        <option key={sub} value={sub}>{sub}</option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div>
                                                        <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
                                                        <div className="relative">
                                                            <select
                                                                id="budget"
                                                                name="budget"
                                                                value={formData.budget}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 appearance-none"
                                                            >
                                                                <option value="">Select budget range</option>
                                                                {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                                                            </select>
                                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Project Details</label>
                                                        <textarea
                                                            id="message"
                                                            name="message"
                                                            rows={4}
                                                            value={formData.message}
                                                            onChange={handleChange}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-gray-900 bg-gray-50 resize-none"
                                                            placeholder="Tell us about your project, timeline, and any specific requirements..."
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                                    >
                                                        {isSubmitting ? (
                                                            <span>Sending...</span>
                                                        ) : (
                                                            <>
                                                                <Send className="w-5 h-5" />
                                                                <span>Send via WhatsApp</span>
                                                            </>
                                                        )}
                                                    </button>

                                                    <p className="text-xs text-gray-400 text-center">
                                                        Your inquiry will open in WhatsApp for instant communication.
                                                    </p>
                                                </form>
                                            )}
                                        </div>
                                    </div>

                                    {/* Side Info */}
                                    <div className="col-span-2 space-y-6">
                                        {/* Why Radikal */}
                                        <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
                                            <h3 className="text-xl font-bold mb-6 flex items-center">
                                                <Sparkles className="w-5 h-5 text-[#D4AF37] mr-2" />
                                                Why Choose Radikal
                                            </h3>
                                            <ul className="space-y-4">
                                                {[
                                                    'Premium quality at competitive prices',
                                                    '1-3 hour average delivery time',
                                                    '24/7 WhatsApp support',
                                                    'Free consultations',
                                                    '500+ happy clients across Ghana & Nigeria',
                                                    'No hidden fees — everything agreed upfront'
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" />
                                                        <span className="text-gray-300 text-sm">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Social Links */}
                                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                                            <div className="space-y-4">
                                                <a href="https://www.instagram.com/radikal_creativetechnologies/" target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center space-x-3 text-gray-600 hover:text-[#E4405F] transition-colors group">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-[#E4405F] to-[#FCAF45] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                                    </div>
                                                    <span className="font-medium">@radikal_creativetechnologies</span>
                                                </a>
                                                <a href="https://tiktok.com/@radikalcreatechnology" target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center space-x-3 text-gray-600 hover:text-black transition-colors group">
                                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.13a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.77-1.82v-.01l2.77.24z" /></svg>
                                                    </div>
                                                    <span className="font-medium">@radikalcreatechnology</span>
                                                </a>
                                                <a href="https://facebook.com/radikalcreativetechnologies" target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center space-x-3 text-gray-600 hover:text-[#1877F2] transition-colors group">
                                                    <div className="w-10 h-10 bg-[#1877F2] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                                    </div>
                                                    <span className="font-medium">Radikal Creative Technologies</span>
                                                </a>
                                            </div>
                                        </div>

                                        {/* Office Hours */}
                                        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/5 rounded-3xl p-8 border border-[#D4AF37]/20">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                                <Clock className="w-5 h-5 text-[#D4AF37] mr-2" />
                                                Response Times
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">WhatsApp</span>
                                                    <span className="text-green-600 font-semibold text-sm flex items-center">
                                                        <Zap className="w-3.5 h-3.5 mr-1" />
                                                        Within minutes
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Email</span>
                                                    <span className="text-[#D4AF37] font-semibold text-sm">Within 24 hours</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Social Media</span>
                                                    <span className="text-gray-600 font-semibold text-sm">Within 12 hours</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-4">Available 24/7 for urgent inquiries via WhatsApp</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    );
}
