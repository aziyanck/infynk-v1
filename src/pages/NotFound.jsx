import React from 'react';
import { Link } from 'react-router-dom';
import { WifiOff } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      {/* Large Animated Wifi Caution Icon */}
      <div className="mb-8 text-gray-800 relative inline-block">
        <style>
          {`
            @keyframes pulseCaution {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            .animate-caution {
               animation: pulseCaution 2s ease-in-out infinite;
               transform-box: fill-box;
               transform-origin: center;
            }
          `}
        </style>
        <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="a" d="M14.8 11.5a1.8 1.8 0 0 1 1.6.9l4.5 8.1a1.8 1.8 0 0 1 -1.6 2.7H10.3a1.8 1.8 0 0 1 -1.6-2.7l4.5-8.1a1.8 1.8 0 0 1 1.6-.9z" />
            <g id="b"><rect x="13.8" y="14" width="2" height="5" rx="1" /><circle cx="14.8" cy="21" r="1.1" /></g>
            <mask id="c"><rect width="100%" height="100%" fill="#fff" /><use href="#b" fill="#000" /></mask>
            <mask id="d"><rect width="100%" height="100%" fill="#fff" /><use href="#a" fill="#000" stroke="#000" strokeWidth="3" /></mask>
          </defs>
          <g mask="url(#d)" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 18.5a.5 0 0 1 0 1 .5.5 0 0 1 0-1" fill="currentColor" stroke="none" />
            <path d="M8.5 16A5 5 0 0 1 15.5 16" fill="none" />
            <path d="M6 13.5A8.5 8.5 0 0 1 18 13.5" fill="none" />
            <path d="M3.5 11A12 12 0 0 1 20.5 11" fill="none" />
          </g>
          <g mask="url(#c)" className="animate-caution">
            <use href="#a" fill="currentColor" />
          </g>
        </svg>
      </div>

      {/* 404 Heading */}
      <h1 className="text-8xl font-bold text-black mb-4 tracking-tighter">404</h1>

      {/* Subheading */}
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Oops, This Page Not Found!</h2>

      {/* Description Text */}
      <div className="text-gray-400 mb-8 space-y-1">
        <p>The link might be corrupted.</p>
        <p className="text-sm">or the page may have been removed</p>
      </div>

      {/* Action Button */}
      <Link
        to="/"
        className="px-8 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        GO BACK HOME
      </Link>

    </div>
  );
};

export default NotFound;