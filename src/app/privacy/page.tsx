// src/app/privacy/page.tsx
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';

export const metadata = {
    title: 'Privacy Policy - Radikal Creative Technologies',
    description: 'Privacy Policy for Radikal Creative Technologies. Learn how we protect your data and privacy.',
    openGraph: {
        title: 'Privacy Policy - Radikal Creative Technologies',
        description: 'Our commitment to protecting your privacy and data.',
        type: 'website',
    },
};

export default function PrivacyPage() {
    return (
        <>
            <Navigation />
            <main className="flex-1 pt-20">
                {/* Hero */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Privacy Policy</h1>
                        <p className="text-gray-300 text-lg">Last updated: March 2026</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 md:py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto prose prose-lg prose-gray">

                            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/5 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 mb-12">
                                <p className="text-gray-700 text-lg leading-relaxed m-0">
                                    At <strong>Radikal Creative Technologies</strong>, protecting your privacy is not just compliance — it&apos;s a core value.
                                    We are committed to being transparent about how we handle your information and ensuring your data remains secure at all times.
                                </p>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
                                        Data We Collect
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        We only collect information that you voluntarily provide to us when using our services. This may include:
                                    </p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Your name and contact details (phone number, email) when you place an order or fill out our contact form</li>
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Photos or images you submit for editing or virtual photoshoot services</li>
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Payment information processed through our secure payment partners (Paystack, Flutterwave)</li>
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Project preferences and specifications you share with us</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                                        No Data Stored on Our Servers
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        We do <strong>not</strong> maintain long-term storage of your personal data on our servers. All client files, including photos, designs, and project assets, are
                                        <strong> automatically deleted within 24 hours</strong> of project completion and delivery. We do not retain copies of your work beyond this period unless you
                                        explicitly request otherwise in writing.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                                        No AI Training with Your Images
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Your images and creative assets are <strong>never used for training AI models, machine learning algorithms, or any automated system</strong>.
                                        The photos and designs you submit are used solely for the purpose of completing your requested service — nothing more.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                                        Client Work & Portfolio Use
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        We <strong>never</strong> use client work for marketing, portfolio showcases, social media posts, or any public-facing purpose without
                                        <strong> your explicit written permission</strong>. If you do grant permission for us to showcase your work, you may revoke that permission at any time by
                                        contacting us.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                                        No User Tracking
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        We do <strong>not</strong> use invasive tracking technologies to monitor your browsing behavior. We do not sell, rent, or share your
                                        personal information with third-party advertisers or data brokers. We use minimal analytics only to improve the performance and usability of our website.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
                                        Payment Security
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        All payments are processed through trusted, PCI-compliant payment processors (such as Paystack and Flutterwave). We <strong>never</strong> store your
                                        credit card or bank account information on our systems. Payment data is handled entirely by our secure payment partners.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
                                        Data Deletion
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        All client data, including images, contact details, and project files, is <strong>permanently deleted within 24 hours</strong> of project completion.
                                        If you wish to have your data deleted before this period, you may contact us at any time via WhatsApp or email and we will process your request immediately.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
                                        Third-Party Services
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Our website may contain links to external sites or use third-party tools (such as Cloudinary for image delivery, Vercel for hosting, and Paystack/Flutterwave for payments).
                                        These services have their own privacy policies and practices, which we encourage you to review. We are not responsible for the privacy practices of these external services.
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
                                        Your Rights
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Request access to any personal data we hold about you</li>
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Request correction or deletion of your personal data</li>
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Withdraw consent for portfolio or marketing use at any time</li>
                                        <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Request information about how your data is being used</li>
                                    </ul>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
                                        Contact Us
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        If you have any questions or concerns about this privacy policy, or if you wish to exercise any of your rights, please contact us:
                                    </p>
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-2">
                                        <p className="text-gray-700"><strong>Email:</strong> radikalcreatech@gmail.com</p>
                                        <p className="text-gray-700"><strong>WhatsApp:</strong> +233 207 472 307</p>
                                        <p className="text-gray-700"><strong>Website:</strong> radikalcreatech.com</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-8 mt-8">
                                    <p className="text-gray-400 text-sm">
                                        This privacy policy may be updated from time to time. We will notify existing clients of significant changes via WhatsApp or email.
                                        Continued use of our services constitutes acceptance of the updated policy.
                                    </p>
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
