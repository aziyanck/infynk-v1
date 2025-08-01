import React from 'react';
import { supabase } from './../supabaseClient'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const NotActive = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. clear Supabase tokens (and anything else you stored)
        localStorage.clear();
        // 2. redirect to login
        window.location.href = '/user';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold text-violet-700 mb-2">Session Expired</h1>
                <p className="text-gray-600 mb-4">Please log in again to continue.</p>
                <button
                    onClick={handleLogout}
                    className="inline-block bg-violet-600 text-white px-6 py-2 rounded hover:bg-violet-700"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default NotActive;