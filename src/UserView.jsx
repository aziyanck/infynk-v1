import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone, faEnvelope, faLink, faLocationDot, faBriefcase, faDownload
} from '@fortawesome/free-solid-svg-icons';
import {
  faWhatsapp, faLinkedin, faTwitter, faInstagram, faGithub, faFacebook, faYoutube, faTiktok, faTelegram, faSpotify, faPinterest, faThreads, faBehance
} from '@fortawesome/free-brands-svg-icons';

// Component
const UserView = ({ user }) => {
  if (!user) return (
    <div className="font-sans bg-slate-50 min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );

  // Fallback helpers
  const fullName = user.name || user.fullName || 'Anonymous';
  const profilePhoto = user.profile_photo || user.profilePhoto || '/placeholder.jpg';
  const designation = user.designation || 'User';
  const bio = user.bio || '';
  const vCardUrl = user.vcard_url || user.vCardUrl || '#';

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
    c_link1: user.c_link1,
    c_link2: user.c_link2,
  };


  const extras = user.extras || {
    website: user.website,
    portfolio: user.portfolio,
    address: user.address
  };

  const links = [
    { type: 'linkedin', href: socials.linkedin ? `https://linkedin.com/in/${socials.linkedin}` : null, icon: faLinkedin, name: 'LinkedIn' },
    { type: 'twitter', href: socials.twitter ? `https://twitter.com/${socials.twitter}` : null, icon: faTwitter, name: 'Twitter' },
    { type: 'instagram', href: socials.instagram ? `https://instagram.com/${socials.instagram}` : null, icon: faInstagram, name: 'Instagram' },
    { type: 'facebook', href: socials.facebook ? `https://facebook.com/${socials.facebook}` : null, icon: faFacebook, name: 'Facebook' },
    { type: 'youtube', href: socials.youtube ? `https://youtube.com/${socials.youtube}` : null, icon: faYoutube, name: 'YouTube' },
    { type: 'github', href: socials.github ? `https://github.com/${socials.github}` : null, icon: faGithub, name: 'GitHub' },
    { type: 'tiktok', href: socials.tiktok ? `https://tiktok.com/@${socials.tiktok}` : null, icon: faTiktok, name: 'TikTok' },
    { type: 'telegram', href: socials.telegram ? `https://t.me/${socials.telegram}` : null, icon: faTelegram, name: 'Telegram' },
    { type: 'spotify', href: socials.spotify ? `https://open.spotify.com/user/${socials.spotify}` : null, icon: faSpotify, name: 'Spotify' },
    { type: 'pinterest', href: socials.pinterest ? `https://pinterest.com/${socials.pinterest}` : null, icon: faPinterest, name: 'Pinterest' },
    { type: 'threads', href: socials.threads ? `https://threads.net/@${socials.threads}` : null, icon: faThreads, name: 'Threads' },
    { type: 'behance', href: socials.behance ? `https://behance.net/${socials.behance}` : null, icon: faBehance, name: 'Behance' },
    { type: 'website', href: socials.website || null, icon: faLink, name: 'Website' },
    { type: 'c_link1', href: socials.c_link1 || null, icon: faLink, name: 'Custom Link 1' },
    { type: 'c_link2', href: socials.c_link2 || null, icon: faLink, name: 'Custom Link 2' },
    { type: 'location', href: socials.location ? `https://maps.google.com/?q=${encodeURIComponent(socials.location)}` : null, icon: faLocationDot, name: 'Location' },
  ].filter(link => link.href);


  return (
    <div className="font-sans bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 md:p-8 flex flex-col space-y-6">

        {/* Header */}
        <header className="text-center space-y-4">
          <img
            src={profilePhoto}
            alt={fullName}
            className="w-28 h-28 rounded-full mx-auto ring-4 ring-slate-100 object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{fullName}</h1>
            <p className="text-md text-slate-500">{designation}</p>
          </div>
        </header>

        {bio && (
          <p className="text-center text-slate-600">{bio}</p>
        )}

        {/* Contact buttons */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {contact.phone && <ContactButton href={`tel:${contact.phone}`} icon={faPhone} text="Call" />}
          {contact.email && <ContactButton href={`mailto:${contact.email}`} icon={faEnvelope} text="Email" />}
          {contact.whatsapp && <ContactButton href={`https://wa.me/${contact.whatsapp}`} icon={faWhatsapp} text="WhatsApp" />}
        </div>

        {/* Socials/Extra links */}
        {links.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-2">
            {links.map(link => (
              <a
                key={link.type}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="flex flex-col items-center justify-center gap-2 p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 hover:text-slate-800 transition-all duration-300"
              >
                <FontAwesomeIcon icon={link.icon} className="h-7 w-7" />
                <span className="text-xs font-semibold">{link.name}</span>
              </a>
            ))}
          </div>
        )}

        {/* Save Contact */}
        <div className="pt-2 !mt-auto">
          <a
            href={vCardUrl}
            download
            className="w-full bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faDownload} className="w-5 h-5" />
            Save Contact
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-8">
        <a href="https://infynk.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 text-sm font-medium hover:text-slate-800 transition-colors">
          Powered by <strong>Infynk</strong>
        </a>
      </footer>
    </div>
  );
};

const ContactButton = ({ href, icon, text }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1.5 bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition-colors duration-300">
    <FontAwesomeIcon icon={icon} className="h-6 w-6 text-slate-700" />
    <span className="text-xs font-semibold text-slate-600">{text}</span>
  </a>
);

export default UserView;
