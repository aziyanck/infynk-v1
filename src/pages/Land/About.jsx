import React, { useRef } from "react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
    const containerRef = useRef();
    const textRef = useRef();
    const statsRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(textRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        })
            .from(statsRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.5");

    }, { scope: containerRef });

    return (
        <section id="about" ref={containerRef} className="min-h-screen w-full bg-black text-white flex items-center justify-center px-6 md:px-12 py-20">

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="flex flex-col justify-center" ref={textRef}>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-8">About Us</h2>
                    <h3 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
                        Bridging the <br /> physical and <br /> digital worlds.
                    </h3>
                    <p className="text-xl text-gray-400 font-light leading-relaxed max-w-lg">
                        We believe that networking should be seamless, sustainable, and memorable. Pixic is more than just a digital business card; it's a statement.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-8" ref={statsRef}>
                    <div className="border border-white/10 p-4 md:p-8 flex flex-col justify-end h-40 md:h-64 hover:border-blue-500 transition-colors duration-300">
                        <span className="text-3xl md:text-6xl font-bold text-blue-600 mb-2">10k+</span>
                        <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-gray-400">Active Users</span>
                    </div>
                    <div className="border border-white/10 p-4 md:p-8 flex flex-col justify-end h-40 md:h-64 hover:border-blue-500 transition-colors duration-300 md:mt-12">
                        <span className="text-3xl md:text-6xl font-bold text-white mb-2">50+</span>
                        <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-gray-400">Countries</span>
                    </div>
                    <div className="border border-white/10 p-4 md:p-8 flex flex-col justify-end h-40 md:h-64 hover:border-blue-500 transition-colors duration-300 md:-mt-12">
                        <span className="text-3xl md:text-6xl font-bold text-white mb-2">24/7</span>
                        <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-gray-400">Support</span>
                    </div>
                    <div className="border border-white/10 p-4 md:p-8 flex flex-col justify-end h-40 md:h-64 hover:border-blue-500 transition-colors duration-300">
                        <span className="text-3xl md:text-6xl font-bold text-blue-600 mb-2">100%</span>
                        <span className="text-xs md:text-sm font-medium uppercase tracking-widest text-gray-400">Secure</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
