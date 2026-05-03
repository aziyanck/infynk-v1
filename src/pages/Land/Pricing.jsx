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
                start: "top 70%",
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
            }, "-=0.4")
            .to('.original-price', {
                y: -24,
                scale: 0.6,
                color: '#6b7280',
                duration: 0.5,
                stagger: 0.15,
                ease: "back.out(1.5)"
            }, "-=0.2")
            .to('.strike-line', {
                width: '100%',
                duration: 0.3,
                stagger: 0.15,
                ease: "power2.out"
            }, "<0.2")
            .fromTo('.new-price', 
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: "back.out(1.5)" },
                "<-0.1"
            );

    }, { scope: containerRef });

    const pvcPlans = [
        {
            duration: '1-Year Plan',
            originalPrice: '₹1299',
            price: '₹999',
            features: ['1-year subscription', 'Fully customizable card design', 'Access to all features']
        },
        {
            duration: '2-Year Plan',
            originalPrice: '₹1499',
            price: '₹1199',
            features: ['2-year subscription', 'Fully customizable card design', 'Access to all features']
        },
        {
            duration: '3-Year Plan',
            originalPrice: '₹1699',
            price: '₹1399',
            features: ['3-year subscription', 'Fully customizable card design', 'Access to all features']
        }
    ];

    // Wooden plans coming soon

    return (
        <section id="pricing" ref={containerRef} className="min-h-[90vh] flex flex-col justify-center py-20 md:py-32 px-6 md:px-12 bg-black text-white border-b border-white/10">
            <div ref={titleRef} className="mb-12 md:mb-16">
                <h2 className="text-sm font-bold uppercase tracking-widest text-brand-hover mb-4">Pricing</h2>
                <h3 className="text-4xl md:text-7xl font-bold leading-none uppercase">
                    Choose Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-white">Access</span>
                </h3>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* PVC Card - Active */}
                <div className="border border-white/20 bg-white/5 p-8 flex flex-col relative group hover:border-brand-hover transition-colors duration-300">
                    <div className="absolute top-0 right-0 bg-brand text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        Best Value
                    </div>

                    <h4 className="text-2xl font-bold uppercase tracking-widest mb-6">PVC Card</h4>

                    <div className="space-y-8 flex-grow">
                        {pvcPlans.map((plan, index) => (
                            <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">{plan.duration}</span>
                                    <div className="text-right relative h-8 w-24">
                                        <span className="original-price text-xl font-bold text-white absolute bottom-0 right-0 origin-right whitespace-nowrap">
                                            {plan.originalPrice}
                                            <span className="strike-line absolute top-1/2 left-0 w-0 h-[2px] bg-gray-500 rounded-full" style={{ marginTop: '-1px' }}></span>
                                        </span>
                                        <span className="new-price text-xl font-bold text-brand-hover absolute bottom-0 right-0 opacity-0 whitespace-nowrap">{plan.price}</span>
                                    </div>
                                </div>
                                <ul className="space-y-2 mt-4">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                                            <FontAwesomeIcon icon={faCheck} className="text-brand-hover mt-1 text-xs" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleNavigation} className="w-full mt-8 py-4 border border-white/20 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-brand-hover">
                        Select Plan <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>

                {/* Wooden Card - Coming Soon */}
                <div className="border border-white/20 bg-white/5 p-8 flex flex-col justify-between relative group hover:border-brand-hover transition-colors duration-300">
                   <div className="absolute top-0 right-0 bg-brand text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        Eco Friendly
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold uppercase tracking-widest mb-4">Wooden Card</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Crafted from premium sustainable wood. A unique, eco-friendly way to share your details.
                        </p>
                    </div>
                    <div className="mt-auto">
                        <span className="inline-block border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Metal Card - Coming Soon */}
                <div className="border border-white/20 bg-white/5 p-8 flex flex-col justify-between relative group hover:border-brand-hover transition-colors duration-300">
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
