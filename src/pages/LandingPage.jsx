import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CardModel from "./Land/CardModel";
import Services from "./Land/Services";
import Features from "./Land/Features";
import Pricing from "./Land/Pricing";
import About from "./Land/About";
import Footer from "./Land/Footer";
import '../App.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
    const containerRef = useRef();
    const heroTextRef = useRef();
    const cardRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(heroTextRef.current.children, {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out"
        })
            .from(cardRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 1.5,
                ease: "power3.out"
            }, "-=1");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="bg-black text-white min-h-screen font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">

            {/* Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none flex justify-between px-6 md:px-12 opacity-20">
                <div className="w-px h-full bg-white/20"></div>
                <div className="w-px h-full bg-white/20 hidden md:block"></div>
                <div className="w-px h-full bg-white/20 hidden md:block"></div>
                <div className="w-px h-full bg-white/20"></div>
            </div>

            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference">
                <a href="#" className="text-2xl font-bold tracking-tighter uppercase text-white hover:opacity-80 transition-opacity">
                    Pixic
                </a>

                <nav className="hidden md:flex items-center gap-12 text-sm font-medium uppercase tracking-widest">
                    {['Services', 'Features', 'About'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-500 transition-colors">
                            {item}
                        </a>
                    ))}
                </nav>

                <button className="text-sm font-bold uppercase tracking-widest border border-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-300">
                    Get Started
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 pt-20 z-10 border-b border-white/10">
                <div className="flex flex-col-reverse md:flex-row items-end justify-between w-full h-full pb-20">

                    {/* Left: Typography */}
                    <div className="w-full md:w-2/3" ref={heroTextRef}>
                        <div className="overflow-hidden">
                            <h1 className="text-[15vw] md:text-[12vw] leading-[0.9] font-bold tracking-tighter uppercase">
                                Digital
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-[15vw] md:text-[12vw] leading-[0.9] font-bold tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-white">
                                Identity
                            </h1>
                        </div>

                        <div className="mt-8 md:mt-12 max-w-md">
                            <p className="text-base md:text-xl text-gray-400 font-light leading-relaxed">
                                The next generation of networking. Share your world with a single tap. Minimalist, efficient, and designed for professionals.
                            </p>

                            <div className="mt-8 flex items-center gap-4">
                                <button className="group flex items-center gap-4 text-lg font-medium hover:text-blue-500 transition-colors">
                                    <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                        <FontAwesomeIcon icon={faArrowRight} className="group-hover:-rotate-45 transition-transform duration-300" />
                                    </span>
                                    Order Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: 3D Card */}
                    <div className="w-full md:w-1/3 h-[30vh] md:h-[60vh] relative mt-10 md:mt-0" ref={cardRef}>
                        <div className="absolute inset-0">
                            <CardModel />
                        </div>
                    </div>
                </div>
            </section>

            <Services />
            <Features />
            <Pricing />
            <About />
            <Footer />

        </div>
    );
}
