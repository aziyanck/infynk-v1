// Services.jsx
import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const containerRef = useRef();
  const titleRef = useRef();
  const listRef = useRef();

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
      .from(listRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      }, "-=0.5");

  }, { scope: containerRef });

  const services = [
    {
      id: "01",
      title: "Instant Sharing",
      description: "Share your contact info, social profiles, and portfolio with just a single tap.",
    },
    {
      id: "02",
      title: "Custom Design",
      description: "Express your brand identity with fully customizable card designs.",
    },
    {
      id: "03",
      title: "Real-time Updates",
      description: "Update your profile instantly from our dashboard without reprinting.",
    },
    {
      id: "04",
      title: "Custom Colour",
      description: "Customize the colour of your digital profile anytime you want, a unique feature no other NFC business card company offers.",
    },

  ];

  return (
    <section id="services" ref={containerRef} className="min-h-[90vh] w-full bg-black text-white flex flex-col justify-center px-6 md:px-12 py-20 border-b border-white/10">

      <div className="mb-16" ref={titleRef}>
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4">
          Our Services
        </h2>
        <h3 className="text-4xl md:text-6xl font-bold max-w-2xl leading-tight">
          Everything you need to <br /> connect better.
        </h3>
      </div>

      <div className="w-full" ref={listRef}>
        {services.map((service, index) => (
          <div
            key={index}
            className="group border-t border-white/10 py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors duration-500 cursor-pointer"
          >
            <div className="flex items-start gap-4 md:gap-8 md:w-1/2">
              <span className="text-xs md:text-sm font-mono text-gray-500 pt-1">{service.id}</span>
              <h4 className="text-2xl md:text-4xl font-bold group-hover:text-blue-500 transition-colors duration-300">
                {service.title}
              </h4>
            </div>

            <div className="mt-4 md:mt-0 md:w-1/3 flex items-center justify-between">
              <p className="text-gray-400 font-light text-lg max-w-xs">
                {service.description}
              </p>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                <FontAwesomeIcon icon={faArrowRight} className="-rotate-45 text-blue-500" />
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-white/10"></div>
      </div>
    </section>
  );
};

export default Services;
