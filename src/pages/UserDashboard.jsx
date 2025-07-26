import React, { useState, useEffect } from 'react';
import { Save, Bell, User } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchUserProfile, updateUserProfile, uploadProfileImage } from '../services/userService';
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
    const navigate = useNavigate();
    useEffect(() => {
        const checkUserRole = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session) return navigate("/user");

            const role = session.user.app_metadata?.role;
            if (role === "user") return navigate("/user/dashboard"); // admins kicked out
        };
        checkUserRole();
    }, [navigate]);

    const [profile, setProfile] = useState({
        name: '',
        bio: '',
        phone: '',
        email: '',
        whatsapp: '',
        pr_img: '',
        designation: '',

        // social links
        website: '',
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
        location: '',
        c_link1: '',
        c_link2: '',
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

    const [localImage, setLocalImage] = useState(null);



    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetchUserProfile();
                console.log("Response from fetchUserProfile:", response);
                const profileData = response;
                console.log("Fetched profile:", profileData);


                setProfile({
                    id: profileData.id,
                    name: profileData.name || '',
                    bio: profileData.bio || '',
                    phone: profileData.phone || '',
                    email: profileData.email || '',
                    whatsapp: profileData.whatsapp || '',
                    pr_img: profileData.pr_img || '',
                    designation: profileData.designation || '',


                    website: profileData.website || '',
                    linkedin: profileData.linkedin || '',
                    twitter: profileData.twitter || '',
                    instagram: profileData.instagram || '',
                    facebook: profileData.facebook || '',
                    youtube: profileData.youtube || '',
                    github: profileData.github || '',
                    tiktok: profileData.tiktok || '',
                    telegram: profileData.telegram || '',
                    spotify: profileData.spotify || '',
                    pinterest: profileData.pinterest || '',
                    threads: profileData.threads || '',
                    behance: profileData.behance || '',
                    location: profileData.location || '',
                    c_link1: profileData.c_link1 || '',
                    c_link2: profileData.c_link2 || '',
                });
                setVisibility({
                    phone: profileData.show_phone,
                    email: profileData.show_email,
                    whatsapp: profileData.show_whatsapp,
                    instagram: profileData.show_instagram,
                    linkedin: profileData.show_linkedin,
                    facebook: profileData.show_facebook,
                    twitter: profileData.show_twitter,
                    website: profileData.show_website,
                    location: profileData.show_location,
                    youtube: profileData.show_youtube,
                    spotify: profileData.show_spotify,
                    telegram: profileData.show_telegram,
                    pinterest: profileData.show_pinterest,
                    threads: profileData.show_threads,
                    behance: profileData.show_behance
                });

                setLocalImage(profileData.pr_img);

            } catch (err) {
                console.error("Failed to fetch profile:", err.message);
            }
        };

        getProfile();
    }, []);

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

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleVisibilityToggle = (field) => {
        setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            if (!profile.id) {
                alert("Cannot upload image: User ID is missing.");
                return;
            }
            const localURL = URL.createObjectURL(file);

            const imageUrl = await uploadProfileImage(file, profile.id, profile.pr_img);
            console.log("id in handleImageUpload:", profile.id);
            console.log("Image URL:", imageUrl);
            setProfile((prev) => ({ ...prev, pr_img: imageUrl }));
            alert("Profile image uploaded successfully!");
            setLocalImage(localURL);
        } catch (err) {
            console.error("Image upload failed:", err.message);
            alert("Image upload failed.");
        }
    };



    const handleSave = async () => {
        try {
            // Combine profile and visibility into one object
            console.log("Profile before update:", profile);

            const updatedData = {
                ...profile,
                show_phone: visibility.phone,
                show_email: visibility.email,
                show_whatsapp: visibility.whatsapp,
                show_linkedin: visibility.linkedin,
                show_twitter: visibility.twitter,
                show_instagram: visibility.instagram,
                show_facebook: visibility.facebook,
                show_youtube: visibility.youtube,
                show_github: visibility.github,
                show_tiktok: visibility.tiktok,
                show_telegram: visibility.telegram,
                show_spotify: visibility.spotify,
                show_pinterest: visibility.pinterest,
                show_threads: visibility.threads,
                show_behance: visibility.behance,
                show_website: visibility.website,
                show_location: visibility.location,
                show_c_link1: visibility.c_link1,
                show_c_link2: visibility.c_link2,
                id: profile.id
            };
            // Ensure ID is present
            if (!updatedData.id) {
                alert("User ID missing. Cannot update profile.");
                return;
            }



            // Call API
            await updateUserProfile(updatedData);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed:", err.message);
            alert("Failed to save profile. Please try again.");
        }
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

                        <img
                            src={localImage || profile.pr_img || 'https://placehold.co/150x150/A78BFA/ffffff?text=JD'}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

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
                    <h2 className="text-3xl font-semibold text-gray-800">{profile.name}</h2>
                    <p className="text-md text-gray-600">{profile.designation}</p>
                </div>

                {/* Personal Info Section */}
                <div className="mb-8 p-4 bg-violet-50 rounded-xl shadow-inner">
                    <h3 className="text-xl font-semibold text-violet-700 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={profile.name} onChange={handleProfileChange} className="border p-2 rounded" placeholder="Name" />
                        <input name="designation" value={profile.designation} onChange={handleProfileChange} className="border p-2 rounded" placeholder="designation" />
                        <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows="3" className="border p-2 rounded col-span-full" placeholder="Bio" />
                    </div>
                </div>

                {/* Pinned Fields */}
                <div className="mb-8 p-4 bg-violet-50 rounded-xl shadow-inner space-y-4">
                    <EditableField
                        label="Phone"
                        name="phone"
                        type="text"
                        placeholder="Phone Number"
                        value={profile.phone}
                        icon={faPhone}
                        visibility={visibility.phone}
                        onChange={handleProfileChange}
                        onToggle={handleVisibilityToggle}
                    />
                    <EditableField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={profile.email}
                        icon={faEnvelope}
                        visibility={visibility.email}
                        onChange={handleProfileChange}
                        onToggle={handleVisibilityToggle}
                    />
                    <EditableField
                        label="Whatsapp"
                        name="whatsapp"
                        type="text"
                        placeholder="Whatsapp"
                        value={profile.whatsapp}
                        icon={faWhatsapp}
                        visibility={visibility.whatsapp}
                        onChange={handleProfileChange}
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
                            value={profile[field.type] || ''}
                            icon={field.icon}
                            visibility={visibility[field.type]}
                            onChange={handleProfileChange}
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
