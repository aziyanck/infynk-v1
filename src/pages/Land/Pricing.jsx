import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Pricing = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const cardsRef = useRef(null);
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/getinfo');
    };

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(titleRef.current, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
            .from(cardsRef.current.children, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            }, "-=0.4");

    }, { scope: containerRef });

    const pvcPlans = [
        {
            duration: '1-Year Plan',
            originalPrice: '₹1399',
            price: '₹1199',
            features: ['1-year subscription', 'Fully customizable card design', 'Access to all features']
        },
        {
            duration: '2-Year Plan',
            originalPrice: '₹1599',
            price: '₹1399',
            features: ['2-year subscription', 'Fully customizable card design', 'Access to all features']
        },
        {
            duration: '3-Year Plan',
            originalPrice: '₹1899',
            price: '₹1599',
            features: ['3-year subscription', 'Fully customizable card design', 'Access to all features']
        }
    ];

    return (
        <section id="pricing" ref={containerRef} className="min-h-[90vh] flex flex-col justify-center py-20 md:py-32 px-6 md:px-12 bg-black text-white border-b border-white/10">
            <div ref={titleRef} className="mb-12 md:mb-16">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4">Pricing</h2>
                <h3 className="text-4xl md:text-7xl font-bold leading-none uppercase">
                    Choose Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-white">Access</span>
                </h3>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* PVC Card - Active */}
                <div className="border border-white/20 bg-white/5 p-8 flex flex-col relative group hover:border-blue-500 transition-colors duration-300">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        Best Value
                    </div>

                    <h4 className="text-2xl font-bold uppercase tracking-widest mb-6">PVC Card</h4>

                    <div className="space-y-8 flex-grow">
                        {pvcPlans.map((plan, index) => (
                            <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">{plan.duration}</span>
                                    <div className="text-right">
                                        <span className="text-gray-500 line-through text-xs block">{plan.originalPrice}</span>
                                        <span className="text-xl font-bold text-blue-400">{plan.price}</span>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                            <FontAwesomeIcon icon={faCheck} className="text-blue-500 mt-1 text-xs" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleNavigation} className="w-full mt-8 py-4 border border-white/20 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-blue-500">
                        Select Plan <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                {/* Wooden Card - Coming Soon */}
                <div className="border border-white/20 bg-white/5 p-8 flex flex-col justify-between relative group hover:border-blue-500 transition-colors duration-300">
                    <div>
                        <h4 className="text-2xl font-bold uppercase tracking-widest mb-4">Wooden Card</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Eco-friendly elegance. Crafted from premium sustainable wood for a natural touch.
                        </p>
                    </div>
                    <div className="mt-auto">
                        <span className="inline-block border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Metal Card - Coming Soon */}
                <div className="border border-white/20 bg-white/5 p-8 flex flex-col justify-between relative group hover:border-blue-500 transition-colors duration-300">
                    <div>
                        <h4 className="text-2xl font-bold uppercase tracking-widest mb-4">Metal Card</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            The ultimate statement. Precision-milled metal for weight, durability, and prestige.
                        </p>
                    </div>
                    <div className="mt-auto">
                        <span className="inline-block border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
