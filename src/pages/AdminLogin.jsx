// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/supabaseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg('');
  setSuccessMsg('');

  const { data, error } = await loginUser(formData);
  setLoading(false);

  if (error) {
    setErrorMsg(error.message);
  } else {
    setSuccessMsg("Logged in successfully!");
    setTimeout(() => {
      navigate("/admin/dashboard"); // Change this to your actual route
    }, 1000); // optional delay for UX
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 mr-2" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
              <FontAwesomeIcon icon={faLock} className="text-gray-400 mr-2" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Alerts */}
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
