import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsOfService() {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link to="/" className="text-2xl font-bold tracking-tighter uppercase text-white hover:opacity-80 transition-opacity mb-8 inline-block">
                        Pixic
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">Terms of Service</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <p>
                        By using Pixiic services, you agree to the following terms.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">1. User Agreement</h2>
                        <p>By creating an account or placing an order, you acknowledge:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>You choose to share your data with us for service-related purposes.</li>
                            <li>Admins may access your data (except passwords) for support and card preparation.</li>
                            <li>You understand that your digital profile will contain the information you choose to make visible.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">2. Orders, Payments & Designs</h2>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">2.1 Payment Requirement</h3>
                        <p>To order a Pixiic NFC business card, full payment must be made during checkout.</p>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">2.2 WhatsApp Follow-Up</h3>
                        <p>After payment:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Our team will contact you via WhatsApp to discuss your card design.</li>
                            <li>You must confirm the final design.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">2.3 Design Confirmation</h3>
                        <p>Once the design is confirmed:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>No further changes are allowed.</li>
                            <li>We will proceed with printing.</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">2.4 Card Printing & Delivery</h3>
                        <p>After confirmation:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>The card is printed.</li>
                            <li>Your digital profile link is set up.</li>
                            <li>The card is couriered to the address you provided during ordering.</li>
                            <li>We will send your initial password via WhatsApp and also include it with the card courier package.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">3. Subscription & Pricing</h2>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>After the first order, users can renew their profile access for ₹300 per year.</li>
                            <li>Prices may change over time without prior notice.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">4. No Refund Policy</h2>
                        <p>Pixiic follows a strict no refund policy because:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>The card is custom-printed after your design confirmation.</li>
                            <li>Each card is personalized and cannot be reused or resold.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">5. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Provide accurate information during ordering.</li>
                            <li>Keep your login details safe.</li>
                            <li>Not misuse or attempt to harm the service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">6. Data Access</h2>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Admins can access your profile data only to support your order and account.</li>
                            <li>Admins cannot access your password — it is encrypted by Supabase.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">7. Contact & Support</h2>
                        <p>For any help or concerns:</p>
                        <ul className="list-none mt-2 space-y-1">
                            <li>WhatsApp / Call: <a href="tel:+919188802136" className="text-blue-500 hover:text-blue-400">+91 91888 02136</a></li>
                            <li>Email: <a href="mailto:support@pixiic.com" className="text-blue-500 hover:text-blue-400">support@pixiic.com</a></li>
                        </ul>
                    </section>
                </div>

                <footer className="mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Pixic. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
