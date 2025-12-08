import React from 'react';
import { Link } from 'react-router-dom';
import { WifiOff } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      
      {/* Large Wifi Cut Icon */}
      <div className="mb-8 text-gray-300">
        <WifiOff size={120} strokeWidth={1.5} />
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