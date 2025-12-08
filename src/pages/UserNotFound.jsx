import React from 'react';
import { Link } from 'react-router-dom';

const UserNotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">

            {/* Typography Section */}
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-2 tracking-tight">Oops!</h1>
            <p className="text-red-500 font-medium text-lg md:text-xl mb-6 uppercase tracking-widest">User Not Found</p>

            <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">
                The user profile you requested could not be found. <br />
                Please check the URL or go back home.
            </p>

            {/* Broken Card SVG Illustration */}
            <div className="relative w-64 h-40 md:w-80 md:h-48 mb-12 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
                <style>
                    {`
            @keyframes breakLeft {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                50% { transform: translate(-10px, 5px) rotate(-5deg); }
            }
            @keyframes breakRight {
                0%, 100% { transform: translate(10px, 5px) rotate(5deg); }
                50% { transform: translate(20px, 0px) rotate(8deg); }
            }
            .animate-break-left {
                animation: breakLeft 4s ease-in-out infinite;
                transform-origin: center;
                transform-box: fill-box;
            }
            .animate-break-right {
                animation: breakRight 4s ease-in-out infinite;
                transform-origin: center;
                transform-box: fill-box;
            }
            `}
                </style>
                <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    {/* Card Backing Shadow/Glow */}
                    <ellipse cx="160" cy="190" rx="120" ry="10" fill="#000" fillOpacity="0.1" />

                    {/* Left Piece of Card */}
                    <g className="animate-break-left">
                        <path d="M20 40 C 20 28.954 28.954 20 40 20 L 140 20 L 160 60 L 130 100 L 150 140 L 120 180 L 40 180 C 28.954 180 20 171.046 20 160 L 20 40 Z"
                            fill="url(#cardGradient)"
                            stroke="white" strokeWidth="2" />
                        {/* Chip on left piece */}
                        <rect x="50" y="60" width="40" height="30" rx="4" fill="#fbbf24" fillOpacity="0.8" />
                        <path d="M50 75 H90 M70 60 V90" stroke="#f59e0b" strokeWidth="1" />
                    </g>

                    {/* Right Piece of Card (Shifted/Broken) */}
                    <g className="animate-break-right">
                        <path d="M150 15 L 280 15 C 291.046 15 300 23.954 300 35 L 300 155 C 300 166.046 291.046 175 280 175 L 130 175 L 160 135 L 140 95 L 170 55 L 150 15 Z"
                            fill="url(#cardGradient)"
                            stroke="white" strokeWidth="2" />
                        {/* Strip on right piece */}
                        <rect x="180" y="40" width="100" height="15" fill="white" fillOpacity="0.2" />
                        <rect x="180" y="65" width="60" height="8" rx="4" fill="white" fillOpacity="0.4" />
                    </g>

                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="cardGradient" x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#2563eb" />
                            <stop offset="1" stopColor="#60a5fa" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Action Button */}
            <Link
                to="/"
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/40"
            >
                Go Back Home
            </Link>

        </div>
    );
};

export default UserNotFound;
