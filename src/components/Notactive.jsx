import React from 'react';
import { AppWindow, RefreshCw } from 'lucide-react';

const NotActive = () => {
    const handleLogin = () => {
        // Clear Supabase tokens and other data
        localStorage.clear();
        // Redirect to login
        window.location.href = '/user';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl text-center border border-white/50">

                {/* Illustration similar to reference image */}
                <div className="relative inline-block mb-8">
                    <div className="text-blue-100">
                        {/* Main Browser Window Icon */}
                        <AppWindow size={100} strokeWidth={1.5} />
                    </div>
                    {/* Floating Refresh Icon */}
                    <div className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-blue-50">
                        <RefreshCw size={24} className="text-blue-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">Your session has expired</h1>
                <p className="text-gray-500 mb-8 text-sm sm:text-base leading-relaxed">
                    Please log in again to continue. Don't worry, we kept all of your filters and breakdowns in place.
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center mx-auto"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default NotActive;