import React from 'react';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
    return (
        <div className="bg-black text-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <Link to="/" className="text-2xl font-bold tracking-tighter uppercase text-white hover:opacity-80 transition-opacity mb-8 inline-block">
                        Pixiic
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">Cookie Policy</h1>
                    <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <p>
                        Pixiic does not use cookies or any browser-based tracking technologies on our website. We believe in keeping things simple and transparent.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">1. No Cookies Used</h2>
                        <p>Our website does not store, access, or process any information through cookies.</p>
                        <p className="mt-2">We do not use:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Session cookies</li>
                            <li>Preference cookies</li>
                            <li>Analytics/tracking cookies</li>
                            <li>Advertising cookies</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">2. How We Handle Authentication</h2>
                        <p>
                            Pixiic uses Supabase JWT-based authentication. This system works without cookies — authentication tokens are stored securely on the client according to Supabase standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">3. Third-Party Services</h2>
                        <p>
                            Although we don’t use cookies, Supabase may internally handle authentication tokens according to its own security measures. These tokens are not used for marketing or tracking; they are strictly for login protection.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">4. Changes to This Policy</h2>
                        <p>
                            If we ever introduce cookies in the future, this policy will be updated immediately.
                        </p>
                    </section>
                </div>

                <footer className="mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Pixiic. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
