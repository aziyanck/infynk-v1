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

// Component
const UserView = ({ user }) => {
  const containerRef = useRef();
  const hasAnimated = useRef(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Animations when user data loads
  useGSAP(
    () => {
      if (!user || hasAnimated.current) return;

      hasAnimated.current = true;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".anim-card",
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 }
      )
        .fromTo(
          ".anim-profile",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.4"
        )
        .fromTo(
          ".anim-text",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.2"
        )
        .fromTo(
          ".anim-contact-btn",
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          "-=0.2"
        )
        .fromTo(
          ".anim-link",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 },
          "-=0.2"
        )
        .fromTo(
          ".anim-save",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.1"
        );
    },
    { scope: containerRef, dependencies: [user] }
  );

  if (!user)
    return (
      <div className="font-sans bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <ThreeDot
            variant="pulsate"
            color="#3194cc"
            size="large"
            text=""
            textColor=""
          />
        </div>
      </div>
    );

  let themeKey = user.color || "sky";

  // Handle legacy theme names if any exist in DB
  if (themeKey === "pixic_light") themeKey = "pixiic_light";
  if (themeKey === "pixic_dark") themeKey = "pixiic_dark";

  const currentTheme = themes[themeKey] || themes.sky; // Fallback to sky if still undefined

  const bg = currentTheme.bgColor;
  const txtclr = currentTheme.textColor;
  const lightbg = currentTheme.lightColor;
  const primaryColor = currentTheme.primaryColor;

  // Fallback helpers
  const fullName = user.name || user.fullName || "Anonymous";
  const profilePhoto = user.pr_img || user.profilePhoto || "/placeholder.jpg";
  const designation = user.designation || "User";
  const bio = user.bio || "";

  const contact = {
    phone: user.phone || user.contact?.phone,
    email: user.email || user.contact?.email,
    whatsapp: user.whatsapp || user.contact?.whatsapp,
  };

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
    c_link2: user.c_link2,
  };

  const links = [
    {
      type: "linkedin",
      href: socials.linkedin
        ? `https://linkedin.com/in/${socials.linkedin}`
        : null,
      icon: faLinkedin,
      name: "LinkedIn",
    },
    {
      type: "twitter",
      href: socials.twitter ? `https://twitter.com/${socials.twitter}` : null,
      icon: faTwitter,
      name: "Twitter",
    },
    {
      type: "instagram",
      href: socials.instagram
        ? `https://instagram.com/${socials.instagram}`
        : null,
      icon: faInstagram,
      name: "Instagram",
    },
    {
      type: "facebook",
      href: socials.facebook
        ? `https://facebook.com/${socials.facebook}`
        : null,
      icon: faFacebook,
      name: "Facebook",
    },
    {
      type: "youtube",
      href: socials.youtube ? `https://youtube.com/${socials.youtube}` : null,
      icon: faYoutube,
      name: "YouTube",
    },
    {
      type: "github",
      href: socials.github ? `https://github.com/${socials.github}` : null,
      icon: faGithub,
      name: "GitHub",
    },
    {
      type: "tiktok",
      href: socials.tiktok ? `https://tiktok.com/@${socials.tiktok}` : null,
      icon: faTiktok,
      name: "TikTok",
    },
    {
      type: "telegram",
      href: socials.telegram ? `https://t.me/${socials.telegram}` : null,
      icon: faTelegram,
      name: "Telegram",
    },
    {
      type: "spotify",
      href: socials.spotify
        ? `https://open.spotify.com/user/${socials.spotify}`
        : null,
      icon: faSpotify,
      name: "Spotify",
    },
    {
      type: "pinterest",
      href: socials.pinterest
        ? `https://pinterest.com/${socials.pinterest}`
        : null,
      icon: faPinterest,
      name: "Pinterest",
    },
    {
      type: "threads",
      href: socials.threads ? `https://threads.net/@${socials.threads}` : null,
      icon: faThreads,
      name: "Threads",
    },
    {
      type: "behance",
      href: socials.behance ? `https://behance.net/${socials.behance}` : null,
      icon: faBehance,
      name: "Behance",
    },
    {
      type: "website",
      href: socials.website ? `https://${socials.website}` : null,
      icon: faLink,
      name: "Website",
    },
    {
      type: "reviews",
      href: socials.reviews || null,
      icon: faStar,
      name: "Review Now",
    },
    {
      type: "c_link1",
      href: socials.c_link1 || null,
      icon: faLink,
      name: "Custom Link 1",
    },
    {
      type: "c_link2",
      href: socials.c_link2 || null,
      icon: faLink,
      name: "Custom Link 2",
    },
    {
      type: "location",
      href: socials.location
        ? `https://maps.google.com/?q=${encodeURIComponent(socials.location)}`
        : null,
      icon: faLocationDot,
      name: "Location",
    },
  ].filter((link) => link.href);

  const handleSaveContact = (e) => {
    e.preventDefault();

    // 1. Define Contact Data
    const contactData = {
      name: fullName,
      phone: contact.phone || "",
      email: contact.email || "",
    };

    // 2. Detect User Agent (OS)
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // Helper functions
    const downloadVCF = (data) => {
      // Use existing vCardUrl if available or generate fresh
      // Using the user's snippet approach for VCF content generation if preferred,
      // but we have `vCardData` from useMemo which is likely more robust.
      // However, to strictly follow the "above code" snippet logic for the VCF structure:

      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TEL:${data.phone}
EMAIL:${data.email}
END:VCARD`;
      // Note: The existing vCardData might contain more info (socials, etc).
      // If we strictly follow the user snippet, we lose that.
      // I will use a hybrid approach: Use `vCardData` if we want full info,
      // or the snippet content if "above code" is strict.
      // Given "create ... by the above code", I will include the snippet logic but perhaps use vCardData for the actual content to not regress features?
      // Actually, let's use the provided snippet logic for the *structure* of the download actions.

      const blob = new Blob([vcard], { type: "text/vcard" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "contact.vcf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const downloadCSV = (data) => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Name,Phone,Email\n" +
        `"${data.name}","${data.phone}","${data.email}"`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "contact.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // 3. Logic Branching
    if (isAndroid) {
      // user's observation: specific logic to generate CSV for Android
      downloadCSV(contactData);
    } else {
      // iOS Standard: Generate VCF (vCard)
      downloadVCF(contactData);
    }
  };

  return (
    <div
      ref={containerRef}
      className="font-sans min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200"
    >
      <div
        className="anim-card w-full max-w-md rounded-[2.5rem] shadow-2xl p-6 md:p-8 flex flex-col space-y-6 relative overflow-hidden"
        style={{ backgroundColor: bg }}
      >
        {/* Background glow for premium feel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full pointer-events-none -mr-32 -marginTop-32"></div>

        {/* Header */}
        <header className="text-center space-y-4 relative z-10">
          <div className="relative inline-block">
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full z-20">
                <Spinner size="md" color="text-gray-500" />
              </div>
            )}
            {imgError ? (
              <div
                className="anim-profile w-32 h-32 rounded-full mx-auto shadow-lg flex items-center justify-center bg-gray-200 text-gray-400"
                style={{
                  border: "4px solid",
                  borderColor: primaryColor,
                }}
              >
                <FontAwesomeIcon icon={faUser} className="w-16 h-16" />
              </div>
            ) : (
              <img
                src={profilePhoto}
                alt={fullName}
                className={`anim-profile w-32 h-32 rounded-full mx-auto object-cover shadow-lg ${
                  imgLoading ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  border: "4px solid",
                  borderColor: primaryColor,
                }}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setImgError(true);
                }}
              />
            )}
          </div>

          <div>
            <h1
              className="anim-text text-3xl font-bold tracking-tight"
              style={{ color: txtclr }}
            >
              {fullName}
            </h1>
            <div
              className="anim-text flex items-center justify-center gap-2 mt-1 opacity-90 text-md font-medium"
              style={{ color: txtclr }}
            >
              {designation.includes(";") ? (
                <>
                  <span>{designation.split(";")[0]}</span>
                  <span className="w-px h-4 bg-current opacity-50"></span>
                  <span>{designation.split(";")[1]}</span>
                </>
              ) : (
                designation
              )}
            </div>
            {bio && (
              <p
                className="anim-text text-center leading-relaxed opacity-85 mt-1.5"
                style={{ color: txtclr }}
              >
                {bio}
              </p>
            )}
          </div>
        </header>

        {/* Contact buttons */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {contact.phone && (
            <ContactButton
              className="anim-contact-btn"
              href={`tel:${contact.phone}`}
              icon={faPhone}
              text="Call"
              lightbg={lightbg}
              txtclr={txtclr}
            />
          )}
          {contact.email && (
            <ContactButton
              className="anim-contact-btn"
              href={`mailto:${contact.email}`}
              icon={faEnvelope}
              text="Email"
              lightbg={lightbg}
              txtclr={txtclr}
            />
          )}
          {contact.whatsapp && (
            <ContactButton
              className="anim-contact-btn"
              href={`https://wa.me/${contact.whatsapp}`}
              icon={faWhatsapp}
              text="WhatsApp"
              lightbg={lightbg}
              txtclr={txtclr}
            />
          )}
        </div>

        {/* Socials/Extra links */}
        {links.length > 0 && (
          <div
            className={`grid ${
              links.length === 1 ? "grid-cols-1" : "grid-cols-3"
            } gap-4 pt-2`}
          >
            {links.map((link) => (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="anim-link flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-md"
                style={{ backgroundColor: lightbg, color: txtclr }}
              >
                <FontAwesomeIcon
                  icon={link.icon}
                  className="h-6 w-6 opacity-90"
                />
                <span className="text-xs font-semibold opacity-80">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Save Contact */}
        {!(links.length === 1 && links[0].type === "reviews") && (
          <div className="pt-2 !mt-auto">
            <button
              onClick={handleSaveContact}
              className="anim-save w-full text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              style={{ backgroundColor: primaryColor }}
            >
              <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
              Save Contact
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-8 pb-4 opacity-0 animate-[fadeIn_1s_ease-out_1.5s_forwards]">
        <a
          href="https://pixiic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors flex items-center gap-1 justify-center"
        >
          Powered by <span className="font-bold text-slate-700">Pixiic</span>
        </a>
      </footer>
    </div>
  );
};

const ContactButton = ({ href, icon, text, lightbg, txtclr, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${className} flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-md`}
    style={{ backgroundColor: lightbg, color: txtclr }}
  >
    <FontAwesomeIcon icon={icon} className="h-6 w-6 opacity-90" />
    <span className="text-xs font-semibold opacity-80">{text}</span>
  </a>
);

export default UserView;
