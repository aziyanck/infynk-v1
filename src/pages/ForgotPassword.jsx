import React, { useState } from 'react';
import { sendPasswordResetEmail } from '../services/supabaseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { error } = await sendPasswordResetEmail(email);
            if (error) throw error;
            setMessage('Check your email for the password reset link.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
                <form className="space-y-5" onSubmit={handleReset}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                            <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full focus:outline-none"
                                placeholder="Enter your registered email"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition duration-200 ${loading ? 'opacity-50' : ''}`}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/user" className="text-sm text-violet-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
