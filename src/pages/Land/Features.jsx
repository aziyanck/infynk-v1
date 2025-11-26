import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNfcSymbol } from '@fortawesome/free-brands-svg-icons';
import { faBolt, faShieldHalved, faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    const containerRef = useRef();
    const titleRef = useRef();
    const gridRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(titleRef.current.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        })
            .from(gridRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=0.5");

    }, { scope: containerRef });

    const features = [
        {
            id: "01",
            title: "NFC Tech",
            description: "Embedded with high-quality NFC chips."
        },
        {
            id: "02",
            title: "Lightning Fast",
            description: "Share your details in milliseconds."
        },
        {
            id: "03",
            title: "Secure",
            description: "Your data is encrypted and safe."
        },
        {
            id: "04",
            title: "Universal",
            description: "Works with iOS & Android."
        }
    ];

    return (
        <section id="features" ref={containerRef} className="min-h-screen w-full bg-black text-white flex flex-col justify-center px-6 md:px-12 py-20 border-b border-white/10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
                <div className="flex flex-col justify-between" ref={titleRef}>
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4">Features</h2>
                        <h3 className="text-4xl md:text-7xl font-bold leading-none uppercase">
                            Built for <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-white">Speed</span>
                        </h3>
                    </div>
                    <p className="text-xl text-gray-400 font-light max-w-md mt-8 md:mt-0">
                        We've stripped away the unnecessary to focus on what matters: getting your information across instantly.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10" ref={gridRef}>
                    {features.map((feature, index) => (
                        <div key={index} className="bg-black p-8 flex flex-col justify-between aspect-square hover:bg-white/5 transition-colors duration-300 group">
                            <span className="text-sm font-mono text-gray-600 group-hover:text-blue-500 transition-colors">{feature.id}</span>
                            <div>
                                <h4 className="text-2xl font-bold mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
