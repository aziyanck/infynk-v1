import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link to="/" className="text-2xl font-bold tracking-tighter uppercase text-white hover:opacity-80 transition-opacity mb-8 inline-block">
                        Pixiic
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <p>
                        Your privacy is important to us. This policy explains how Pixiic collects, stores, and uses your data when you use our digital business card services.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">1. Data We Collect</h2>
                        <p>When you create an account or use Pixiic, you may provide:</p>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">Personal & Contact Information</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Name</li>
                            <li>Email address</li>
                            <li>Phone number</li>
                            <li>Social media links</li>
                            <li>Profile image</li>
                            <li>Business information</li>
                            <li>Address (for card delivery)</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">Authentication Information</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Email & password (passwords are securely hashed by Supabase — we never see or store them)</li>
                        </ul>

                        <h3 className="text-xl font-bold text-white mt-4 mb-2">Technical Information</h3>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Device information</li>
                            <li>IP address (handled by Supabase)</li>
                            <li>Basic analytics (only for service improvement)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">2. How We Store Your Data</h2>
                        <p>
                            All user data is stored safely in our Supabase database, which follows industry-standard security practices, encryption, and access controls.
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Passwords are never accessible to us.</li>
                            <li>Only authorized admin staff can access user data for support and account management.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">3. How Your Data Appears on Your Digital Profile</h2>
                        <p>Each user can choose what information is shown publicly on their digital card profile.</p>
                        <p className="mt-2">You control:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Which fields are visible / hidden</li>
                            <li>What information you upload</li>
                            <li>When you want to update or remove data</li>
                        </ul>
                        <p className="mt-2">Your digital profile will only display data that you explicitly enable.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">4. What We Use Your Data For</h2>
                        <p>We use your data to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Create and manage your Pixiic account</li>
                            <li>Provide your digital business card profile</li>
                            <li>Print and deliver physical NFC cards</li>
                            <li>Communicate updates or service information</li>
                            <li>Offer customer support via WhatsApp, phone, or email</li>
                        </ul>
                        <p className="mt-4">We do not sell or share your data with advertisers.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">5. Your Rights</h2>
                        <p>You can:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>View your data</li>
                            <li>Edit or update your data</li>
                            <li>Delete your profile information</li>
                            <li>Contact us for changes or removal</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">6. Contact for Privacy Matters</h2>
                        <p>You can reach us at:</p>
                        <ul className="list-none mt-2 space-y-1">
                            <li>WhatsApp / Call: <a href="tel:+919188802136" className="text-blue-500 hover:text-blue-400">+91 91888 02136</a></li>
                            <li>Email: <a href="mailto:support@pixiic.com" className="text-blue-500 hover:text-blue-400">support@pixiic.com</a></li>
                        </ul>
                    </section>
                </div>

                <footer className="mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Pixiic. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
