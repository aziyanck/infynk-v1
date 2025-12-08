import React, { useState } from 'react';
import { updateUserPassword } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await updateUserPassword(password);
            if (error) throw error;
            setMessage('Password updated successfully! Redirecting...');
            setTimeout(() => navigate('/user'), 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Set New Password</h2>
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                            <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full focus:outline-none"
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
