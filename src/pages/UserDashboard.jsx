import React, { useState } from 'react';
import {Save, Bell, User } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Brand icons
import {
    faLinkedin, faGithub, faTwitter, faFacebook, faWhatsapp,
    faInstagram, faYoutube, faTiktok, faTelegram, faSpotify,
    faPinterest, faThreads, faBehance
} from '@fortawesome/free-brands-svg-icons';

// Solid icons
import {
    faPhone, faEnvelope, faBuilding, faUser as faUserSolid,
    faLink, faLocationDot,
    faGlobe
} from '@fortawesome/free-solid-svg-icons';

import EditableField from '../components/EditableField';

const UserDashboard = () => {
    const [personalInfo, setPersonalInfo] = useState({
        name: 'John Doe',
        role: 'Software Engineer',
        bio: 'Passionate about building scalable web applications.',
        phone: '+1 (123) 456-7890',
        email: 'john.doe@example.com',
        companyName: 'Infynk Solutions',
        whatsapp: '1234567890',
        profileImage: 'https://placehold.co/150x150/A78BFA/ffffff?text=JD',
    });

    const [socials, setSocials] = useState({
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        youtube: '',
        github: '',
        tiktok: '',
        telegram: '',
        spotify: '',
        pinterest: '',
        threads: '',
        behance: '',
        website: '',
        c_link1: '',
        c_link2: '',
        location: '',
    });

    const [visibility, setVisibility] = useState({
        phone: true,
        email: true,
        bio: true,
        companyName: true,
        whatsapp: true,
        linkedin: true,
        twitter: true,
        instagram: true,
        facebook: true,
        youtube: true,
        github: true,
        tiktok: true,
        telegram: true,
        spotify: true,
        pinterest: true,
        threads: true,
        behance: true,
        website: true,
        c_link1: true,
        c_link2: true,
        location: true,
    });

    const socialFields = [

        { type: 'website', icon: faGlobe, name: 'Website' },
        { type: 'linkedin', icon: faLinkedin, name: 'LinkedIn' },
        { type: 'twitter', icon: faTwitter, name: 'Twitter' },
        { type: 'instagram', icon: faInstagram, name: 'Instagram' },
        { type: 'facebook', icon: faFacebook, name: 'Facebook' },
        { type: 'youtube', icon: faYoutube, name: 'YouTube' },
        { type: 'github', icon: faGithub, name: 'GitHub' },
        { type: 'tiktok', icon: faTiktok, name: 'TikTok' },
        { type: 'telegram', icon: faTelegram, name: 'Telegram' },
        { type: 'spotify', icon: faSpotify, name: 'Spotify' },
        { type: 'pinterest', icon: faPinterest, name: 'Pinterest' },
        { type: 'threads', icon: faThreads, name: 'Threads' },
        { type: 'behance', icon: faBehance, name: 'Behance' },

        { type: 'location', icon: faLocationDot, name: 'Location' },
        { type: 'c_link1', icon: faLink, name: 'Custom Link 1' },
        { type: 'c_link2', icon: faLink, name: 'Custom Link 2' },
    ];

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocials((prev) => ({ ...prev, [name]: value }));
    };

    const handleVisibilityToggle = (field) => {
        setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPersonalInfo({ ...personalInfo, profileImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        console.log('Saving personal info:', personalInfo);
        console.log('Saving socials:', socials);
        console.log('Saving visibility settings:', visibility);
        alert('Changes saved!');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 sm:p-6">
            {/* Header */}
            <header className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-4 mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-violet-700">Infynk.</h1>
                <div className="flex items-center space-x-4">
                    <Bell className="text-gray-600 cursor-pointer" size={24} />
                    <User className="text-gray-600 cursor-pointer" size={24} />
                </div>
            </header>

            {/* Main Content */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-4 mb-20">

                {/* Profile Image */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-violet-300 shadow-lg">
                        <img src={personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        <label htmlFor="profile-image-upload" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            Upload
                        </label>
                        <input
                            id="profile-image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <h2 className="text-3xl font-semibold text-gray-800">{personalInfo.name}</h2>
                    <p className="text-md text-gray-600">{personalInfo.role}</p>
                </div>

                {/* Personal Info Section */}
                <div className="mb-8 p-4 bg-violet-50 rounded-xl shadow-inner">
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="border p-2 rounded" placeholder="Name" />
                        <input name="role" value={personalInfo.role} onChange={handlePersonalInfoChange} className="border p-2 rounded" placeholder="Role" />
                        <textarea name="bio" value={personalInfo.bio} onChange={handlePersonalInfoChange} rows="3" className="border p-2 rounded col-span-full" placeholder="Bio" />
                    </div>
                </div>

                {/* Pinned Fields */}
                <div className="mb-8 p-4 bg-violet-50 rounded-xl shadow-inner space-y-4">
                    <EditableField
                        label="Phone"
                        name="phone"
                        type="text"
                        placeholder="Phone Number"
                        value={personalInfo.phone}
                        icon={faPhone}
                        visibility={visibility.phone}
                        onChange={handlePersonalInfoChange}
                        onToggle={handleVisibilityToggle}
                    />
                    <EditableField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={personalInfo.email}
                        icon={faEnvelope}
                        visibility={visibility.email}
                        onChange={handlePersonalInfoChange}
                        onToggle={handleVisibilityToggle}
                    />
                    <EditableField
                        label="Whatsapp"
                        name="whatsapp"
                        type="text"
                        placeholder="Whatsapp"
                        value={personalInfo.whatsapp}
                        icon={faWhatsapp}
                        visibility={visibility.whatsapp}
                        onChange={handlePersonalInfoChange}
                        onToggle={handleVisibilityToggle}
                    />
                </div>

                {/* Social Fields */}
                <div className="mb-8 p-4 bg-violet-50 rounded-xl shadow-inner space-y-4">
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">Manage Links</h3>
                    {socialFields.map(field => (
                        <EditableField
                            key={field.type}
                            label={field.name}
                            name={field.type}
                            type="text"
                            placeholder={field.name}
                            value={socials[field.type] || ''}
                            icon={field.icon}
                            visibility={visibility[field.type]}
                            onChange={handleSocialChange}
                            onToggle={handleVisibilityToggle}
                        />
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg flex justify-center z-10">
                <button
                    onClick={handleSave}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
                >
                    <Save size={20} className="mr-2" /> Save Changes
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;