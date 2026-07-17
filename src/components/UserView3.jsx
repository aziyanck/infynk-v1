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

// Small helper: mix a theme color with another color using modern CSS color-mix.
// Falls back gracefully in browsers that don't support it (mixed color simply
// won't apply, base color still renders via the surrounding style).
const mix = (color, percent, into = "white") =>
  `color-mix(in srgb, ${color} ${percent}%, ${into})`;

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

    // If it already starts with http:// or https://, just return it
    if (strValue.startsWith("http://") || strValue.startsWith("https://")) return strValue;

    // Try to extract the domain from the prefix to see if the user already included it
    let domain = "";
    try {
      const url = new URL(prefix);
      domain = url.hostname.replace("www.", "");
    } catch (e) {
      // Ignore if prefix is not a valid URL by itself (e.g., just "https://")
    }

    // If the input looks like a full URL (starts with www.) or contains the target domain,
    // we assume it's a link they pasted without http/https
    if (
      strValue.startsWith("www.") ||
      (domain && strValue.toLowerCase().includes(domain.toLowerCase())) ||
      strValue.includes(".com/") ||
      strValue.includes(".net/") ||
      strValue.includes(".org/") ||
      strValue.includes(".me/") ||
      strValue.includes(".io/") ||
      strValue.includes(".co/") ||
      strValue.includes(".in/")
    ) {
      return `https://${strValue}`;
    }

    return `${prefix}${strValue}`;
  };

  const links = [
    {
      type: "linkedin",
      href: formatUrl(socials.linkedin, "https://linkedin.com/in/"),
      icon: faLinkedin,
      name: "LinkedIn",
    },
    {
      type: "twitter",
      href: formatUrl(socials.twitter, "https://twitter.com/"),
      icon: faTwitter,
      name: "Twitter",
    },
    {
      type: "instagram",
      href: formatUrl(socials.instagram, "https://instagram.com/"),
      icon: faInstagram,
      name: "Instagram",
    },
    {
      type: "facebook",
      href: formatUrl(socials.facebook, "https://facebook.com/"),
      icon: faFacebook,
      name: "Facebook",
    },
    {
      type: "youtube",
      href: formatUrl(socials.youtube, "https://youtube.com/"),
      icon: faYoutube,
      name: "YouTube",
    },
    {
      type: "github",
      href: formatUrl(socials.github, "https://github.com/"),
      icon: faGithub,
      name: "GitHub",
    },
    {
      type: "tiktok",
      href: formatUrl(socials.tiktok, "https://tiktok.com/@"),
      icon: faTiktok,
      name: "TikTok",
    },
    {
      type: "telegram",
      href: formatUrl(socials.telegram, "https://t.me/"),
      icon: faTelegram,
      name: "Telegram",
    },
    {
      type: "spotify",
      href: formatUrl(socials.spotify, "https://open.spotify.com/user/"),
      icon: faSpotify,
      name: "Spotify",
    },
    {
      type: "pinterest",
      href: formatUrl(socials.pinterest, "https://pinterest.com/"),
      icon: faPinterest,
      name: "Pinterest",
    },
    {
      type: "threads",
      href: formatUrl(socials.threads, "https://threads.net/@"),
      icon: faThreads,
      name: "Threads",
    },
    {
      type: "behance",
      href: formatUrl(socials.behance, "https://behance.net/"),
      icon: faBehance,
      name: "Behance",
    },
    {
      type: "website",
      href: formatUrl(socials.website, "https://"),
      icon: faLink,
      name: "Website",
    },
    {
      type: "reviews",
      href: formatUrl(socials.reviews, "https://"),
      icon: faStar,
      name: "Review Now",
    },
    {
      type: "c_link1",
      href: formatUrl(socials.c_link1, "https://"),
      icon: faLink,
      name: socials.c_link1_name || "Custom Link 1",
    },
    {
      type: "c_link2",
      href: formatUrl(socials.c_link2, "https://"),
      icon: faLink,
      name: socials.c_link2_name || "Custom Link 2",
    },
    {
      type: "c_link3",
      href: formatUrl(socials.c_link3, "https://"),
      icon: faLink,
      name: socials.c_link3_name || "Custom Link 3",
    },
    {
      type: "c_link4",
      href: formatUrl(socials.c_link4, "https://"),
      icon: faLink,
      name: socials.c_link4_name || "Custom Link 4",
    },
    {
      type: "c_link5",
      href: formatUrl(socials.c_link5, "https://"),
      icon: faLink,
      name: socials.c_link5_name || "Custom Link 5",
    },
    {
      type: "location",
      href: (() => {
        if (!socials.location) return null;
        const loc = String(socials.location).trim();
        if (loc.startsWith("http://") || loc.startsWith("https://")) return loc;
        if (
          loc.startsWith("www.") ||
          loc.includes("maps.app.goo.gl") ||
          loc.includes("google.com/maps") ||
          loc.includes("goo.gl/maps")
        ) {
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

  // Decorative "card number" derived from the user's id, purely cosmetic —
  // gives the card an authentic ID/membership-card feel without adding new data.
  const cardSerial = String(user._id || user.id || fullName)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .padEnd(8, "0")
    .slice(0, 8)
    .replace(/(.{4})/g, "$1 ")
    .trim();

  return (
    <div
      ref={containerRef}
      className="font-sans min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `
          radial-gradient(circle at 15% 10%, ${mix(primaryColor, 18)} 0%, transparent 45%),
          radial-gradient(circle at 85% 90%, ${mix(primaryColor, 12)} 0%, transparent 50%),
          #f4f5f7
        `,
      }}
    >
      <div
        className="anim-card w-full max-w-sm rounded-[28px] p-5 flex flex-col space-y-5 relative overflow-hidden"
        style={{
          backgroundColor: bg,
          boxShadow: `0 25px 60px -20px ${mix(primaryColor, 35, "black")}, 0 2px 8px -2px rgba(0,0,0,0.08)`,
          border: `1px solid ${mix(txtclr, 8)}`,
        }}
      >
        {/* Hologram strip + chip — signature "digital ID card" motif */}
        <div className="flex items-center justify-between relative z-10">
          {/* <div
            className="w-9 h-7 rounded-[6px] grid grid-cols-3 grid-rows-2 gap-[2px] p-[3px]"
            style={{
              background: `linear-gradient(135deg, ${mix(primaryColor, 90)}, ${mix(primaryColor, 55)})`,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[1px] bg-black/15" />
            ))}
          </div> */}
          {/* <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase opacity-50"
            style={{ color: txtclr }}
          >
            Digital&nbsp;Card
          </span> */}
        </div>

        {/* Header */}
        <header className="text-center space-y-4 relative z-10">
          <div className="relative inline-block">
            {imgLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-[26px] z-20">
                <Spinner size="md" color="text-gray-500" />
              </div>
            )}
            {imgError ? (
              <div
                className="anim-profile w-28 h-28 rounded-[26px] mx-auto shadow-lg flex items-center justify-center bg-gray-200 text-gray-400"
                style={{
                  boxShadow: `0 0 0 3px ${bg}, 0 0 0 5px ${primaryColor}`,
                }}
              >
                <FontAwesomeIcon icon={faUser} className="w-14 h-14" />
              </div>
            ) : (
              <img
                src={profilePhoto}
                alt={fullName}
                className={`anim-profile w-28 h-28 rounded-[26px] mx-auto object-cover shadow-lg ${
                  imgLoading ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  boxShadow: `0 0 0 3px ${bg}, 0 0 0 5px ${primaryColor}`,
                }}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setImgError(true);
                }}
              />
            )}
            {/* Verified/status dot */}
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px]"
              style={{ backgroundColor: primaryColor, borderColor: bg }}
            />
          </div>

          <div>
            <h1
              className="anim-text text-[26px] font-extrabold tracking-tight leading-tight"
              style={{ color: txtclr }}
            >
              {fullName}
            </h1>
            <div className="anim-text flex items-center justify-center gap-2 mt-2 flex-wrap">
              {designation.includes(";") ? (
                <>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
                    style={{ backgroundColor: lightbg, color: txtclr }}
                  >
                    {designation.split(";")[0]}
                  </span>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
                    style={{ backgroundColor: lightbg, color: txtclr }}
                  >
                    {designation.split(";")[1]}
                  </span>
                </>
              ) : (
                <span
                  className="text-[11px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
                  style={{ backgroundColor: lightbg, color: txtclr }}
                >
                  {designation}
                </span>
              )}
            </div>
            {bio && (
              <p
                className="anim-text text-center leading-relaxed opacity-80 mt-3 text-[14px] px-1"
                style={{ color: txtclr }}
              >
                {bio}
              </p>
            )}
          </div>
        </header>

        {/* Contact buttons */}
        <div className={`grid ${activeContactCount === 1 ? "grid-cols-1" : activeContactCount === 2 ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
          {contact.phone && (
            <ContactButton
              className="anim-contact-btn"
              href={`tel:${contact.phone}`}
              icon={faPhone}
              text="Call"
              primaryColor={primaryColor}
              txtclr={txtclr}
            />
          )}
          {contact.email && (
            <ContactButton
              className="anim-contact-btn"
              href={`mailto:${contact.email}`}
              icon={faEnvelope}
              text="Email"
              primaryColor={primaryColor}
              txtclr={txtclr}
            />
          )}
          {contact.whatsapp && (
            <ContactButton
              className="anim-contact-btn"
              href={formatUrl(contact.whatsapp, "https://wa.me/")}
              icon={faWhatsapp}
              text="WhatsApp"
              primaryColor={primaryColor}
              txtclr={txtclr}
            />
          )}
        </div>

        {/* Socials/Extra links — modern stacked list */}
        {links.length > 0 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: lightbg }}
          >
            {links.map((link, i) => (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="anim-link flex items-center gap-3 px-4 py-3.5 transition-all duration-200 hover:brightness-95 active:scale-[0.99]"
                style={{
                  color: txtclr,
                  borderTop: i === 0 ? "none" : `1px solid ${mix(txtclr, 10)}`,
                }}
              >
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
                  style={{ backgroundColor: mix(bg, 70) }}
                >
                  <FontAwesomeIcon icon={link.icon} className="h-4 w-4 opacity-90" />
                </span>
                <span className="text-sm font-semibold opacity-90 flex-1 text-left truncate">
                  {link.name}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-40 shrink-0"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </a>
            ))}
          </div>
        )}

        {/* Save Contact */}
        {!(links.length === 1 && links[0].type === "reviews") && (
          <div className="pt-1 !mt-auto">
            <button
              onClick={handleSaveContact}
              className="anim-save w-full text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 10px 25px -8px ${mix(primaryColor, 60, "black")}`,
              }}
            >
              <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
              Save Contact
            </button>
          </div>
        )}

        {/* Card serial — decorative footer of the "ID card" */}
        <div className="flex items-center justify-center pt-1">
          {/* <span
            className="font-mono text-[10px] tracking-[0.15em] opacity-35"
            style={{ color: txtclr }}
          >
            {cardSerial}
          </span> */}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-6 pb-4 opacity-0 animate-[fadeIn_1s_ease-out_1.5s_forwards]">
        <a
          href="https://pixiic.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 text-xs font-medium hover:text-slate-800 transition-colors flex items-center gap-1 justify-center"
        >
          Powered by <span className="font-bold text-slate-700">Pixiic</span>
        </a>
      </footer>
    </div>
  );
};

const ContactButton = ({ href, icon, text, primaryColor, txtclr, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${className} flex flex-col items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95`}
    style={{ backgroundColor: primaryColor }}
  >
    <FontAwesomeIcon icon={icon} className="h-5 w-5 text-white" />
    <span className="text-[11px] font-bold text-white/95 tracking-wide">{text}</span>
  </a>
);

export default UserView;