import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faXmark, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Footer = () => {
    const [showContact, setShowContact] = useState(false);
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const containerRef = useRef(null);

    const socialLinks = [
        { name: 'Instagram', icon: faInstagram, url: '#' },
        { name: 'LinkedIn', icon: faLinkedin, url: '#' },
        { name: 'Twitter', icon: faTwitter, url: '#' },
        { name: 'Facebook', icon: faFacebook, url: '#' },
    ];

    const footerLinks = [
        {
            title: 'Product',
            links: [
                { name: 'Features', url: '#features' },
                { name: 'Services', url: '#services' },
                { name: 'Pricing', url: '#pricing' }
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About', url: '#about' },
                { name: 'Contact', url: '#' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', url: '#' },
                { name: 'Terms of Service', url: '#' },
                { name: 'Cookie Policy', url: '#' }
            ]
        },
    ];

    const handleLinkClick = (e, linkName) => {
        if (linkName === 'Contact') {
            e.preventDefault();
            setShowContact(true);
        }
    };

    const closeModal = () => {
        if (modalRef.current && backdropRef.current) {
            const tl = gsap.timeline({
                onComplete: () => setShowContact(false)
            });

            tl.to(modalRef.current, {
                y: '100%',
                opacity: 0,
                duration: 0.4,
                ease: "power3.in"
            })
                .to(backdropRef.current, {
                    opacity: 0,
                    duration: 0.3
                }, "-=0.2");
        }
    };

    useGSAP(() => {
        if (showContact && modalRef.current && backdropRef.current) {
            const tl = gsap.timeline();

            tl.fromTo(backdropRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            )
                .fromTo(modalRef.current,
                    { y: '100%', opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.5, ease: "power3.out" },
                    "-=0.1"
                );
        }
    }, [showContact]);

    return (
        <footer ref={containerRef} className="bg-black text-white border-t border-white/10 relative">
            {/* Contact Modal */}
            {showContact && (
                <div
                    ref={backdropRef}
                    className="fixed inset-0 z-[60] flex items-end justify-center pb-20 md:pb-32 px-4 bg-black/60 backdrop-blur-[2px]"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        className="bg-black border border-white/10 p-8 md:p-12 max-w-md w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <FontAwesomeIcon icon={faXmark} className="text-xl" />
                        </button>

                        <h3 className="text-2xl font-bold uppercase tracking-widest mb-8 text-blue-500">Contact Us</h3>

                        <div className="space-y-6">
                            <div className="group flex items-start gap-4 p-4 border border-white/10 hover:border-blue-500 transition-colors cursor-pointer">
                                <div className="mt-1 text-blue-500">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
                                    <p className="text-lg font-medium">hello@pixic.com</p>
                                </div>
                            </div>

                            <div className="group flex items-start gap-4 p-4 border border-white/10 hover:border-blue-500 transition-colors cursor-pointer">
                                <div className="mt-1 text-blue-500">
                                    <FontAwesomeIcon icon={faPhone} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                                    <p className="text-lg font-medium">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="px-6 md:px-12 py-20 border-b border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4">Get in touch</h2>
                        <h3 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none">
                            Let's Work <br /> Together.
                        </h3>
                    </div>
                    <button className="group flex items-center gap-4 text-xl font-medium hover:text-blue-500 transition-colors">
                        <span className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                            <FontAwesomeIcon icon={faArrowRight} className="group-hover:-rotate-45 transition-transform duration-300 text-2xl" />
                        </span>
                        Start to Tap
                    </button>
                </div>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/10">
                {/* Brand Column */}
                <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between h-full">
                    <div className="text-2xl font-bold tracking-tighter uppercase mb-8">Pixic</div>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        The next generation of digital networking. Sustainable, efficient, and designed for the modern professional.
                    </p>
                </div>

                {/* Link Columns */}
                {footerLinks.map((column, index) => (
                    <div key={index} className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 last:border-r-0">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">{column.title}</h4>
                        <ul className="space-y-4">
                            {column.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                    <a
                                        href={link.url}
                                        onClick={(e) => handleLinkClick(e, link.name)}
                                        className="text-lg font-medium hover:text-blue-500 transition-colors block"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom Bar */}
            <div className="px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Pixic. All rights reserved.
                </p>

                <div className="flex items-center gap-6">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.url}
                            className="text-gray-400 hover:text-white transition-colors text-xl"
                            aria-label={social.name}
                        >
                            <FontAwesomeIcon icon={social.icon} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
