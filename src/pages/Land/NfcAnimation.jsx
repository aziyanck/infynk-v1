import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const NfcAnimation = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const phoneContentRef = useRef(null);
    const rippleRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

        // Initial state
        gsap.set(cardRef.current, { x: 50, y: 50, rotation: 10, opacity: 0 });
        gsap.set(phoneContentRef.current, { opacity: 0, scale: 0.8 });
        gsap.set(rippleRef.current, { scale: 0, opacity: 0 });

        // Animation sequence
        tl.to(cardRef.current, {
            opacity: 1,
            x: -20,
            y: -20,
            rotation: -5,
            duration: 1,
            ease: "power2.out"
        })
            .to(cardRef.current, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power1.inOut"
            })
            // Tap effect
            .to(rippleRef.current, {
                scale: 1.5,
                opacity: 0.5,
                duration: 0.4,
                ease: "power1.out"
            }, "<")
            .to(rippleRef.current, {
                opacity: 0,
                duration: 0.2
            }, ">-0.2")
            // Show content on phone
            .to(phoneContentRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            }, "-=0.3")
            // Hold
            .to({}, { duration: 1.5 })
            // Reset for loop
            .to(phoneContentRef.current, {
                opacity: 0,
                scale: 0.8,
                duration: 0.5
            })
            .to(cardRef.current, {
                x: 50,
                y: 50,
                rotation: 10,
                opacity: 0,
                duration: 0.8,
                ease: "power2.in"
            }, "<");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 400 600" className="w-full h-full max-h-[500px] drop-shadow-2xl">
                {/* Phone Body */}
                <rect x="100" y="50" width="200" height="400" rx="30" fill="#1a1a1a" stroke="#333" strokeWidth="4" />

                {/* Phone Screen */}
                <rect x="110" y="60" width="180" height="380" rx="25" fill="#000" />

                {/* Phone Notch/Dynamic Island */}
                <rect x="170" y="65" width="60" height="15" rx="7.5" fill="#222" />

                {/* Content on Phone (Initially Hidden) */}
                <g ref={phoneContentRef}>
                    {/* Logo/Brand */}
                    <text x="200" y="220" textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">
                        Pixiic
                    </text>
                    <text x="200" y="250" textAnchor="middle" fill="#3b82f6" fontSize="14" fontFamily="sans-serif">
                        Digital Identity
                    </text>

                    {/* Profile Mockup Elements */}
                    <circle cx="200" cy="150" r="30" fill="#333" stroke="#3b82f6" strokeWidth="2" />
                    <rect x="140" y="280" width="120" height="10" rx="5" fill="#222" />
                    <rect x="140" y="300" width="120" height="10" rx="5" fill="#222" />

                    {/* Action Buttons */}
                    <rect x="130" y="340" width="140" height="30" rx="15" fill="#3b82f6" />
                    <text x="200" y="360" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">
                        Connect
                    </text>
                </g>

                {/* Ripple Effect */}
                <circle ref={rippleRef} cx="200" cy="250" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" />

                {/* NFC Card */}
                <g ref={cardRef}>
                    {/* Card Body */}
                    <rect x="160" y="200" width="180" height="110" rx="10" fill="url(#cardGradient)" transform="rotate(-15 250 255)" filter="url(#dropShadow)" />

                    {/* Card Chip/Icon */}
                    <rect x="180" y="230" width="25" height="20" rx="4" fill="#fbbf24" transform="rotate(-15 250 255)" />

                    {/* Card Text */}
                    <text x="260" y="280" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif" transform="rotate(-15 250 255)">
                        Pixiic
                    </text>

                    {/* NFC Icon Waves */}
                    <path d="M 310 230 Q 320 230 320 240" stroke="white" strokeWidth="2" fill="none" transform="rotate(-15 250 255)" opacity="0.7" />
                    <path d="M 305 225 Q 325 225 325 245" stroke="white" strokeWidth="2" fill="none" transform="rotate(-15 250 255)" opacity="0.5" />
                </g>

                {/* Definitions */}
                <defs>
                    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
                        <feOffset dx="2" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.3" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>
        </div>
    );
};

export default NfcAnimation;
