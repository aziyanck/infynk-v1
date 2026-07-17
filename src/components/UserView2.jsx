import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreeDot } from "react-loading-indicators";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Spinner from "./Spinner";

import {
  faPhone,
  faEnvelope,
  faLink,
  faLocationDot,
  faDownload,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp,
  faLinkedin,
  faTwitter,
  faInstagram,
  faGithub,
  faFacebook,
  faYoutube,
  faTiktok,
  faTelegram,
  faSpotify,
  faPinterest,
  faThreads,
  faBehance,
} from "@fortawesome/free-brands-svg-icons";

import { themes } from "../services/themes";

const UserView2 = ({ user }) => {
  const containerRef = useRef();
  const hasAnimated = useRef(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useGSAP(
    () => {
      if (!user || hasAnimated.current) return;
      hasAnimated.current = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".anim-bg",
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      )
        .fromTo(
          ".anim-profile",
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
          "-=0.5"
        )
        .fromTo(
          ".anim-text",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          ".anim-btn",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1 },
          "-=0.2"
        )
        .fromTo(
          ".anim-link",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
          "-=0.2"
        );
    },
    { scope: containerRef, dependencies: [user] }
  );

  if (!user)
    return (
      <div className="font-sans min-h-screen flex items-center justify-center bg-gray-900">
        <ThreeDot variant="pulsate" color="#ffffff" size="large" />
      </div>
    );

  let themeKey = user.color || "sky";
  if (themeKey === "pixic_light") themeKey = "pixiic_light";
  if (themeKey === "pixic_dark") themeKey = "pixiic_dark";
  const currentTheme = themes[themeKey] || themes.sky;

  const bg = currentTheme.bgColor;
  const txtclr = currentTheme.textColor;
  const lightbg = currentTheme.lightColor;
  const primaryColor = currentTheme.primaryColor;

  const fullName = user.name || user.fullName || "Anonymous";
  const profilePhoto = user.pr_img || user.profilePhoto || "/placeholder.jpg";
  const designation = user.designation || "User";
  const bio = user.bio || "";

  const contact = {
    phone: user.phone || user.contact?.phone,
    email: user.email || user.contact?.email,
    whatsapp: user.whatsapp || user.contact?.whatsapp,
  };

  const activeContactCount = [contact.phone, contact.email, contact.whatsapp].filter(Boolean).length;

  const socials = user.socials || {
    whatsapp: user.whatsapp,
    instagram: user.instagram,
    linkedin: user.linkedin,
    facebook: user.facebook,
    twitter: user.twitter,
    website: user.website,
    location: user.location,
    youtube: user.youtube,
    spotify: user.spotify,
    telegram: user.telegram,
    pinterest: user.pinterest,
    threads: user.threads,
    behance: user.behance,
    github: user.github,
    tiktok: user.tiktok,
    reviews: user.reviews,
    c_link1: user.c_link1,
    c_link1_name: user.c_link1_name,
    c_link2: user.c_link2,
    c_link2_name: user.c_link2_name,
    c_link3: user.c_link3,
    c_link3_name: user.c_link3_name,
    c_link4: user.c_link4,
    c_link4_name: user.c_link4_name,
    c_link5: user.c_link5,
    c_link5_name: user.c_link5_name,
  };

  const formatUrl = (value, prefix) => {
    if (!value) return null;
    const strValue = String(value).trim();
    if (strValue.startsWith("http://") || strValue.startsWith("https://")) return strValue;
    let domain = "";
    try {
      const url = new URL(prefix);
      domain = url.hostname.replace("www.", "");
    } catch (e) {}

    if (
      strValue.startsWith("www.") || 
      (domain && strValue.toLowerCase().includes(domain.toLowerCase())) ||
      strValue.includes(".com/") || strValue.includes(".net/") || strValue.includes(".org/") ||
      strValue.includes(".me/") || strValue.includes(".io/") || strValue.includes(".co/") ||
      strValue.includes(".in/")
    ) {
      return `https://${strValue}`;
    }
    return `${prefix}${strValue}`;
  };

  const links = [
    { type: "linkedin", href: formatUrl(socials.linkedin, "https://linkedin.com/in/"), icon: faLinkedin, name: "LinkedIn" },
    { type: "twitter", href: formatUrl(socials.twitter, "https://twitter.com/"), icon: faTwitter, name: "Twitter" },
    { type: "instagram", href: formatUrl(socials.instagram, "https://instagram.com/"), icon: faInstagram, name: "Instagram" },
    { type: "facebook", href: formatUrl(socials.facebook, "https://facebook.com/"), icon: faFacebook, name: "Facebook" },
    { type: "youtube", href: formatUrl(socials.youtube, "https://youtube.com/"), icon: faYoutube, name: "YouTube" },
    { type: "github", href: formatUrl(socials.github, "https://github.com/"), icon: faGithub, name: "GitHub" },
    { type: "tiktok", href: formatUrl(socials.tiktok, "https://tiktok.com/@"), icon: faTiktok, name: "TikTok" },
    { type: "telegram", href: formatUrl(socials.telegram, "https://t.me/"), icon: faTelegram, name: "Telegram" },
    { type: "spotify", href: formatUrl(socials.spotify, "https://open.spotify.com/user/"), icon: faSpotify, name: "Spotify" },
    { type: "pinterest", href: formatUrl(socials.pinterest, "https://pinterest.com/"), icon: faPinterest, name: "Pinterest" },
    { type: "threads", href: formatUrl(socials.threads, "https://threads.net/@"), icon: faThreads, name: "Threads" },
    { type: "behance", href: formatUrl(socials.behance, "https://behance.net/"), icon: faBehance, name: "Behance" },
    { type: "website", href: formatUrl(socials.website, "https://"), icon: faLink, name: "Website" },
    { type: "reviews", href: formatUrl(socials.reviews, "https://"), icon: faStar, name: "Review Now" },
    { type: "c_link1", href: formatUrl(socials.c_link1, "https://"), icon: faLink, name: socials.c_link1_name || "Custom Link 1" },
    { type: "c_link2", href: formatUrl(socials.c_link2, "https://"), icon: faLink, name: socials.c_link2_name || "Custom Link 2" },
    { type: "c_link3", href: formatUrl(socials.c_link3, "https://"), icon: faLink, name: socials.c_link3_name || "Custom Link 3" },
    { type: "c_link4", href: formatUrl(socials.c_link4, "https://"), icon: faLink, name: socials.c_link4_name || "Custom Link 4" },
    { type: "c_link5", href: formatUrl(socials.c_link5, "https://"), icon: faLink, name: socials.c_link5_name || "Custom Link 5" },
    {
      type: "location",
      href: (() => {
        if (!socials.location) return null;
        const loc = String(socials.location).trim();
        if (loc.startsWith("http://") || loc.startsWith("https://")) return loc;
        if (loc.startsWith("www.") || loc.includes("maps.app.goo.gl") || loc.includes("google.com/maps") || loc.includes("goo.gl/maps")) {
          return `https://${loc}`;
        }
        return `https://maps.google.com/?q=${encodeURIComponent(loc)}`;
      })(),
      icon: faLocationDot,
      name: "Location",
    },
  ].filter((link) => link.href);

  const handleSaveContact = (e) => {
    e.preventDefault();
    const contactData = { name: fullName, phone: contact.phone || "", email: contact.email || "" };
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);

    const downloadVCF = (data) => {
      const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTEL:${data.phone}\nEMAIL:${data.email}\nEND:VCARD`;
      const blob = new Blob([vcard], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.setAttribute("download", "contact.vcf");
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const downloadCSV = (data) => {
      const csvContent = "data:text/csv;charset=utf-8," + "Name,Phone,Email\n" + `"${data.name}","${data.phone}","${data.email}"`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri); link.setAttribute("download", "contact.csv");
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    if (isAndroid) downloadCSV(contactData);
    else downloadVCF(contactData);
  };

  return (
    <div
      ref={containerRef}
      className="font-sans min-h-screen w-full relative overflow-hidden bg-cover bg-center flex flex-col items-center py-10"
      style={{ backgroundColor: bg }}
    >
      {/* Decorative Blur Orbs */}
      <div className="anim-bg absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
      <div className="anim-bg absolute -top-20 -left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-[80px] opacity-70" style={{ backgroundColor: primaryColor }} />
      <div className="anim-bg absolute top-40 -right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-[80px] opacity-70" style={{ backgroundColor: lightbg }} />

      <div className="w-full max-w-md px-6 relative z-10 flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="relative anim-profile">
            <div className="w-36 h-36 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/40 transform rotate-3 transition-transform hover:rotate-0 duration-300">
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                  <FontAwesomeIcon icon={faUser} className="w-16 h-16" />
                </div>
              ) : (
                <img
                  src={profilePhoto}
                  alt={fullName}
                  className="w-full h-full object-cover"
                  onLoad={() => setImgLoading(false)}
                  onError={() => { setImgLoading(false); setImgError(true); }}
                />
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <h1 className="anim-text text-4xl font-extrabold tracking-tight drop-shadow-md" style={{ color: txtclr }}>
              {fullName}
            </h1>
            <div className="anim-text mt-2 inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/20 shadow-sm border border-white/30" style={{ color: txtclr }}>
              <span className="font-medium text-sm">
                {designation.includes(";") ? designation.replace(";", " • ") : designation}
              </span>
            </div>
            {bio && (
              <p className="anim-text mt-4 text-base leading-relaxed opacity-90 max-w-sm mx-auto" style={{ color: txtclr }}>
                {bio}
              </p>
            )}
          </div>
        </div>

        {/* Contact Buttons */}
        {activeContactCount > 0 && (
          <div className={`grid ${activeContactCount === 1 ? "grid-cols-1" : activeContactCount === 2 ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="anim-btn flex flex-col items-center justify-center gap-2 py-3 rounded-2xl shadow-sm backdrop-blur-md bg-white/20 border border-white/30 transition-all hover:bg-white/40 hover:-translate-y-1"
                style={{ color: txtclr }}
              >
                <FontAwesomeIcon icon={faPhone} className="text-xl" />
                <span className="text-xs font-semibold">Call</span>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="anim-btn flex flex-col items-center justify-center gap-2 py-3 rounded-2xl shadow-sm backdrop-blur-md bg-white/20 border border-white/30 transition-all hover:bg-white/40 hover:-translate-y-1"
                style={{ color: txtclr }}
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                <span className="text-xs font-semibold">Email</span>
              </a>
            )}
            {contact.whatsapp && (
              <a
                href={formatUrl(contact.whatsapp, "https://wa.me/")}
                target="_blank"
                rel="noopener noreferrer"
                className="anim-btn flex flex-col items-center justify-center gap-2 py-3 rounded-2xl shadow-sm backdrop-blur-md bg-white/20 border border-white/30 transition-all hover:bg-white/40 hover:-translate-y-1"
                style={{ color: txtclr }}
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
                <span className="text-xs font-semibold">WhatsApp</span>
              </a>
            )}
          </div>
        )}

        {/* Links List */}
        {links.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            {links.map((link) => (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="anim-link flex items-center gap-4 p-4 rounded-2xl backdrop-blur-xl bg-white/20 border border-white/30 shadow-sm transition-all duration-300 hover:bg-white/40 hover:shadow-md hover:-translate-y-1 group"
                style={{ color: txtclr }}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/30 text-current shadow-inner group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={link.icon} className="text-lg" />
                </div>
                <span className="font-semibold text-lg flex-1">{link.name}</span>
                <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  →
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Save Contact Button at Bottom */}
        {!(links.length === 1 && links[0].type === "reviews") && (
          <div className="flex gap-4 justify-center mt-2">
            <button
              onClick={handleSaveContact}
              className="anim-btn flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl shadow-lg backdrop-blur-lg bg-white/20 border border-white/40 transition-all hover:scale-105 active:scale-95"
              style={{ color: txtclr }}
            >
              <FontAwesomeIcon icon={faDownload} className="text-xl" />
              <span className="font-bold">Save Contact</span>
            </button>
          </div>
        )}
      </div>

      <footer className="text-center mt-12 pb-4 opacity-70">
        <a href="https://pixiic.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold tracking-wide" style={{ color: txtclr }}>
          Powered by Pixiic
        </a>
      </footer>
    </div>
  );
};

export default UserView2;
