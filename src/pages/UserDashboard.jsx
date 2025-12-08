import React, { useState, useEffect } from 'react';
import { Save, Bell, User, LogOut, LayoutDashboard } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchUserProfile, updateUserProfile, uploadProfileImage } from '../services/userService';
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import NotActive from '../components/Notactive';
import { ThreeDot } from 'react-loading-indicators';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../crop/cropUtils';
import { themes } from '../services/themes';   // ➊ import the map
import ThemeColorPicker from '../components/ThemeColorPicker';
import Spinner from '../components/Spinner';

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
    faGlobe, faStar
} from '@fortawesome/free-solid-svg-icons';

import EditableField from '../components/EditableField';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [sessionUser, setSessionUser] = useState(null);
    useEffect(() => {
        if (sessionUser) return;
        const checkUserRole = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session) return navigate("/user");
            setSessionUser(session.user);
            const role = session.user.app_metadata?.role;
            if (role === "user") return navigate("/user/dashboard"); // admins kicked out
        };
        checkUserRole();
    }, [navigate, sessionUser]);

    // near the top of the component
    const [themeKey, setThemeKey] = useState('sky');

    const [notActive, setNotActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    // Cropper
    const [cropModal, setCropModal] = useState(() =>
        localStorage.getItem('cropModal') === 'true'
    );

    const [cropImgSrc, setCropImgSrc] = useState(() =>
        localStorage.getItem('cropImgSrc') || ''
    );

    const [croppedAreaPixels, setCroppedAreaPixels] = useState(() => {
        const data = localStorage.getItem('croppedAreaPixels');
        return data ? JSON.parse(data) : null;
    });

    const [crop, setCrop] = useState(() => {
        const data = localStorage.getItem('crop');
        return data ? JSON.parse(data) : { x: 0, y: 0 };
    });

    const [zoom, setZoom] = useState(() =>
        parseFloat(localStorage.getItem('zoom')) || 1
    );

    const [rotation, setRotation] = useState(() =>
        parseInt(localStorage.getItem('rotation')) || 0
    );


    useEffect(() => {
        localStorage.setItem('cropModal', cropModal);
    }, [cropModal]);

    useEffect(() => {
        if (cropImgSrc) localStorage.setItem('cropImgSrc', cropImgSrc);
        else localStorage.removeItem('cropImgSrc');
    }, [cropImgSrc]);

    useEffect(() => {
        if (croppedAreaPixels)
            localStorage.setItem('croppedAreaPixels', JSON.stringify(croppedAreaPixels));
    }, [croppedAreaPixels]);

    useEffect(() => {
        localStorage.setItem('crop', JSON.stringify(crop));
    }, [crop]);

    useEffect(() => {
        localStorage.setItem('zoom', zoom.toString());
    }, [zoom]);

    useEffect(() => {
        localStorage.setItem('rotation', rotation.toString());
    }, [rotation]);




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
        reviews: '',
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
        reviews: true,
        c_link1: true,
        c_link2: true,
        location: true,
    });

    const [localImage, setLocalImage] = useState(null);
    const [showUserPop, setShowUserPop] = useState(false);
    const [showThemePop, setShowThemePop] = useState(false);



    useEffect(() => {
        const close = (e) => e.target.closest('.relative') || setShowUserPop(false);
        if (showUserPop) document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [showUserPop]);

    useEffect(() => {
        const close = (e) => e.target.closest('.relative') || setShowThemePop(false);
        if (showThemePop) document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [showThemePop]);



    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await fetchUserProfile();
                console.log("Response from fetchUserProfile:", response);
                const profileData = response;
                console.log("Fetched profile:", profileData);

                if (profileData.color) {
                    setThemeKey(profileData.color);
                }


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
                    reviews: profileData.reviews || '',
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
                    behance: profileData.show_behance,
                    reviews: profileData.show_reviews
                });

                setLocalImage(profileData.pr_img);

            } catch (err) {
                console.error("Failed to fetch profile:", err.message);
                await supabase.auth.signOut()
                setNotActive(true);
            } finally {
                setLoading(false);   // <- hide loader no matter what
            }
        };

        getProfile();
    }, []);
    if (notActive) return <NotActive />;
    if (loading)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <ThreeDot variant="pulsate" color="#3194cc" size="large" text="" textColor="" />
            </div>
        );

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
        { type: 'reviews', icon: faStar, name: 'Reviews' },
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

        const reader = new FileReader();
        reader.onload = () => {
            setCropImgSrc(reader.result);
            setCropModal(true);        // open modal
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
        };
        reader.readAsDataURL(file);
    };



    const handleSave = async () => {
        setSaving(true);
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
                show_reviews: visibility.reviews,
                show_location: visibility.location,
                show_c_link1: visibility.c_link1,
                show_c_link2: visibility.c_link2,
                id: profile.id,
                color: themeKey
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
        } finally {
            setSaving(false);
        }
    };


    const txtclr = themes[themeKey].textColor;
    const bg = themes[themeKey].bgColor;
    const lightbg = themes[themeKey].lightColor;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-2 sm:p-6">
            {/* Header */}
            <header className="w-full max-w-4xl  rounded-2xl shadow-md p-4 mb-6 flex justify-between items-center" style={{ backgroundColor: bg }}>
                <h1 className="text-2xl font-bold" style={{ color: themes[themeKey].textColor }} >Infynk.</h1>
                <div className="flex items-center space-x-4">
                    <div className='relative'>
                        <LayoutDashboard className='text-gray-600 cursor-pointer' size={24} onClick={() => setShowThemePop((p) => !p)} />
                        {showThemePop && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg p-4 z-50">
                                <ThemeColorPicker themeKey={themeKey} setThemeKey={setThemeKey} />
                            </div>
                        )}

                    </div>
                    <Bell className="text-gray-600 cursor-pointer" size={24} />
                    <div className="relative">
                        <User
                            className="text-gray-600 cursor-pointer"
                            size={24}
                            onClick={() => setShowUserPop((p) => !p)}
                        />
                        {showUserPop && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg p-4 z-50">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={localImage || profile.pr_img || 'https://placehold.co/150x150/A78BFA/ffffff?text=JD'}
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {sessionUser?.user_metadata?.full_name ||
                                                sessionUser?.user_metadata?.name ||
                                                'User'}
                                        </p>
                                        <p className="text-xs text-gray-500">{sessionUser?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        navigate('/user');
                                    }}
                                    className="mt-3 flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 hover:cursor-pointer"
                                >
                                    <LogOut size={14} />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="w-full max-w-4xl rounded-2xl shadow-md p-4 mb-20" style={{ backgroundColor: bg }}>

                {/* Profile Image */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4  shadow-lg" style={{ borderColor: lightbg }}>

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
                    <h2 className="text-3xl font-semibold " style={{ color: txtclr }} >{profile.name}</h2>
                    <p className="text-md text-gray-500" >{profile.designation}</p>
                </div>

                {/* Personal Info Section */}
                <div className="mb-8 p-4  rounded-xl shadow-inner" style={{ backgroundColor: lightbg }}>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: txtclr }} >Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={profile.name} onChange={handleProfileChange} className="border p-2 rounded bg-white/90" placeholder="Name" />
                        <input name="designation" value={profile.designation} onChange={handleProfileChange} className="border p-2 rounded bg-white/90" placeholder="designation" />
                        <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows="3" className="border p-2 rounded col-span-full bg-white/90" placeholder="Bio" />
                    </div>
                </div>

                {/* Pinned Fields */}
                <div className="mb-8 p-4  rounded-xl shadow-inner space-y-4" style={{ backgroundColor: lightbg }}>
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
                        themekey={themeKey}
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
                        themekey={themeKey}
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
                        themekey={themeKey}
                    />
                </div>

                {/* Social Fields */}
                <div className="mb-8 p-4  rounded-xl shadow-inner space-y-4" style={{ backgroundColor: lightbg }}>
                    <h3 className="text-xl font-semibold  mb-4" style={{ color: themes[themeKey].textColor }} >Manage Links</h3>
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
                            themekey={themeKey}
                        />
                    ))}
                </div>
            </div>
            {/* Crop Modal */}
            {cropModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white rounded-xl p-4 w-full max-w-lg mx-4">
                        <h3 className="text-lg font-semibold mb-2">Crop your avatar</h3>
                        <div className="relative h-64 md:h-80 w-full">
                            <Cropper
                                image={cropImgSrc}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onRotationChange={setRotation}
                                onCropComplete={(_, croppedPixels) =>
                                    setCroppedAreaPixels(croppedPixels)
                                }
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <label className="text-xs">Zoom</label>
                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(e.target.value)}
                            />
                            {/* <label className="text-xs ml-2">Rotate</label>
                                <input
                                    type="range"
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={rotation}
                                    onChange={(e) => setRotation(e.target.value)}
                                /> */}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded-lg text-sm bg-gray-200"
                                onClick={() => {
                                    setCropModal(false);
                                    setCropImgSrc('');
                                    localStorage.removeItem('cropModal');
                                    localStorage.removeItem('cropImgSrc');
                                }}

                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg text-sm bg-violet-600 text-white min-w-[120px] flex justify-center items-center"
                                disabled={uploadingPhoto}
                                onClick={async () => {
                                    setUploadingPhoto(true);
                                    try {
                                        const croppedUrl = await getCroppedImg(
                                            cropImgSrc,
                                            croppedAreaPixels,
                                            rotation
                                        );
                                        // convert dataURL → File
                                        const blob = await (await fetch(croppedUrl)).blob();
                                        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });

                                        if (!profile.id) {
                                            alert('User ID missing');
                                            return;
                                        }
                                        const imageUrl = await uploadProfileImage(file, profile.id, profile.pr_img);
                                        setProfile((p) => ({ ...p, pr_img: imageUrl }));
                                        setLocalImage(croppedUrl);
                                        setCropModal(false);
                                        setCropImgSrc('');
                                        setCroppedAreaPixels(null);
                                        setZoom(1);
                                        setCrop({ x: 0, y: 0 });
                                        setRotation(0);

                                        localStorage.removeItem('cropModal');
                                        localStorage.removeItem('cropImgSrc');
                                        localStorage.removeItem('croppedAreaPixels');
                                        localStorage.removeItem('zoom');
                                        localStorage.removeItem('crop');
                                        localStorage.removeItem('rotation');



                                        alert('Avatar updated!');
                                    } catch (err) {
                                        console.error(err);
                                        alert('Upload failed');
                                    } finally {
                                        setUploadingPhoto(false);
                                    }
                                }}
                            >
                                {uploadingPhoto ? <Spinner size="sm" /> : "Crop & Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg flex justify-center z-10">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: themes[themeKey].primaryColor }}
                >
                    {saving ? <Spinner /> : <><Save size={20} className="mr-2" /> Save Changes</>}
                </button>
            </div>
        </div>
    );
};

export default UserDashboard;
