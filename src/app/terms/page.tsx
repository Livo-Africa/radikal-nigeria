// src/app/terms/page.tsx
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';

export const metadata = {
    title: 'Terms of Service - Radikal Creative Technologies',
    description: 'Terms of Service for Radikal Creative Technologies. Read our service terms, revision policy, and refund policy.',
    openGraph: {
        title: 'Terms of Service - Radikal Creative Technologies',
        description: 'Service terms, revision policy, and client guidelines.',
        type: 'website',
    },
};

export default function TermsPage() {
    return (
        <>
            <Navigation />
            <main className="flex-1 pt-20">
                {/* Hero */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Terms of Service</h1>
                        <p className="text-gray-300 text-lg">Last updated: March 2026</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 md:py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">

                            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/5 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 mb-12">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    By using the services of <strong>Radikal Creative Technologies</strong>, you agree to the following terms and conditions.
                                    Please read them carefully before placing an order or engaging our services.
                                </p>
                            </div>

                            <div className="space-y-10">
                                {/* Section 1 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
                                        Your Selfie & Edits
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            For virtual photoshoot services, we replicate your selfie&apos;s face, expression, and body position as accurately as possible using our advanced creative technology.
                                        </p>
                                        <p>
                                            Each order includes <strong>2 free adjustments</strong> to ensure the face in your portrait closely matches your submitted photo. These adjustments cover minor corrections to facial features, expression alignment, and likeness refinement.
                                        </p>
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <p className="text-red-700 font-semibold text-sm">
                                                ⚠️ Important: Changing your selfie after we have submitted the two face reviews will incur an additional fee, as the editing process must restart from scratch.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">2</span>
                                        Revisions & Delivery
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            After final delivery, you have a <strong>30-minute window</strong> to request minor fixes or adjustments to your completed work. This window is designed to catch any last-minute issues while our team is still actively working on your project.
                                        </p>
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                            <p className="text-amber-700 font-semibold text-sm">
                                                ⏱️ The 30-minute revision window begins from the moment your final files are delivered. After this period, modification requests will be treated as a new order.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">3</span>
                                        Privacy & File Deletion
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            For your <strong>privacy and safety</strong>, all project files — including your selfies, edited images, and project data — are <strong>permanently deleted within 30 minutes</strong> of final delivery.
                                        </p>
                                        <p>
                                            This means:
                                        </p>
                                        <ul className="space-y-2 ml-4">
                                            <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>No copies of your photos are retained on our systems</li>
                                            <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>No changes can be made after deletion — late requests require a new order</li>
                                            <li className="flex items-start"><span className="text-[#D4AF37] mr-2 mt-1">•</span>Please download and save your files immediately upon delivery</li>
                                        </ul>
                                        <p className="text-sm text-gray-400 italic mt-2">
                                            This deletion policy exists to protect your identity and personal images from unauthorized access or misuse.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 4 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">4</span>
                                        Payment & Refund Policy
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            Payment is required before work begins on your project. We accept payments through Paystack, Flutterwave, and direct bank transfers.
                                        </p>
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                            <p className="text-red-700 font-semibold text-sm">
                                                🚫 No refunds are issued once we have begun designing or editing your project. This is because our creative work begins immediately upon order confirmation, and human effort and computational resources are allocated to your project right away.
                                            </p>
                                        </div>
                                        <p>
                                            If an order is cancelled <strong>before</strong> work begins, a full refund will be processed within 3-5 business days through the original payment method.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 5 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">5</span>
                                        Intellectual Property
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            Upon full payment, you receive <strong>full usage rights</strong> to all delivered creative assets for personal and commercial use. You may use, publish, print, and share the delivered work freely.
                                        </p>
                                        <p>
                                            Radikal Creative Technologies retains the right to be credited as the creator of the work. We will not use your work for marketing or portfolio purposes without your explicit written consent (see our <a href="/privacy" className="text-[#D4AF37] hover:underline font-semibold">Privacy Policy</a>).
                                        </p>
                                    </div>
                                </div>

                                {/* Section 6 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">6</span>
                                        Service Availability
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            We strive to maintain 24/7 availability through our WhatsApp support line. However, during periods of high demand, delivery times may vary. We will always communicate expected timelines upfront and update you if there are any delays.
                                        </p>
                                        <p>
                                            We reserve the right to refuse or cancel orders that violate our content guidelines, involve inappropriate or illegal material, or are deemed harmful or offensive.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 7 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">7</span>
                                        Limitation of Liability
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            Radikal Creative Technologies shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability for any claim related to our services is limited to the amount you paid for the specific service in question.
                                        </p>
                                        <p>
                                            We make every effort to deliver high-quality work, but creative output involves subjective judgment. If you are unsatisfied with your order, we encourage you to use the revision window or contact us immediately so we can make it right.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 8 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">8</span>
                                        Governing Law
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            These terms are governed by and construed in accordance with the laws of the Republic of Ghana. Any disputes arising from these terms or the use of our services shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to the appropriate courts in Accra, Ghana.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 9 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">9</span>
                                        Changes to These Terms
                                    </h2>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>
                                            We may update these terms from time to time to reflect changes in our services, technology, or legal requirements. Significant changes will be communicated to active clients via WhatsApp or email. Your continued use of our services after changes constitutes acceptance of the updated terms.
                                        </p>
                                    </div>
                                </div>

                                {/* Section 10 */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="w-8 h-8 bg-[#D4AF37] text-white rounded-lg flex items-center justify-center text-sm font-bold mr-3">10</span>
                                        Contact
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        For questions about these terms, please reach out:
                                    </p>
                                    <div className="bg-gray-50 rounded-xl p-6 space-y-2">
                                        <p className="text-gray-700"><strong>Email:</strong> radikalcreatech@gmail.com</p>
                                        <p className="text-gray-700"><strong>WhatsApp:</strong> +233 207 472 307</p>
                                        <p className="text-gray-700"><strong>Website:</strong> radikalcreatech.com</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-8 mt-8">
                                    <p className="text-gray-400 text-sm">
                                        By using Radikal Creative Technologies services, you acknowledge that you have read, understood, and agree to be bound by these terms.
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
