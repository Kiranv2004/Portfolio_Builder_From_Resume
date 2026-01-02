import React, { useState, useEffect } from 'react';
import PortfolioService from '../services/portfolio.service';
import { FiSave, FiEye, FiPlus, FiTrash2, FiEdit2, FiLayout, FiBook, FiCpu, FiAward, FiUser, FiGlobe, FiStar, FiCheck, FiExternalLink, FiBriefcase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const PortfolioEditor = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState('theme');

    // Local state for complex nested objects to ensure immediate UI updates
    const [certifications, setCertifications] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [awards, setAwards] = useState([]);

    // Image Crop State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);

    useEffect(() => {
        loadPortfolio();
    }, []);

    const loadPortfolio = async () => {
        try {
            const response = await PortfolioService.getMyPortfolio();
            // Ensure data consistency
            const content = response.data.content || {};
            if (!content.theme) content.theme = 'modern';
            if (!content.skills) content.skills = [];
            if (!content.experience) content.experience = [];
            if (!content.education) content.education = [];
            if (!content.projects) content.projects = [];

            // Initialize new fields
            setCertifications(content.certifications || []);
            setLanguages(content.languages || []);
            setAwards(content.awards || []);

            response.data.content = content;
            setPortfolio(response.data);
        } catch (error) {
            console.error("Error loading portfolio", error);
        } finally {
            setLoading(false);
        }
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(
                tempImage,
                croppedAreaPixels,
                rotation
            );
            setPortfolio(prev => ({
                ...prev,
                content: { ...prev.content, profileImage: croppedImage }
            }));
            setIsCropModalOpen(false);
            setTempImage(null);
            setMessage("Photo updated! Remember to Save.");
            setTimeout(() => setMessage(""), 3000);
        } catch (e) {
            console.error(e);
            setMessage("Error saving cropped image.");
        }
    };

    const handleCropCancel = () => {
        setIsCropModalOpen(false);
        setTempImage(null);
    };

    const handleSave = async () => {
        try {
            const updatedPortfolio = {
                ...portfolio,
                content: {
                    ...portfolio.content,
                    certifications,
                    languages,
                    awards
                }
            };

            await PortfolioService.updatePortfolio(updatedPortfolio);
            setPortfolio(updatedPortfolio); // Sync local state
            setMessage("Changes saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Failed to save changes.");
        }
    };

    const handlePublicToggle = async () => {
        const updatedPortfolio = { ...portfolio, isPublic: !portfolio.isPublic };
        setPortfolio(updatedPortfolio);

        try {
            await PortfolioService.updatePortfolio(updatedPortfolio);
            setMessage(updatedPortfolio.isPublic ? "Portfolio is now Public!" : "Portfolio is now Private.");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Failed to update privacy settings.");
        }
    };

    const handleThemeChange = (theme) => {
        setPortfolio(prev => ({ ...prev, content: { ...prev.content, theme } }));
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20 min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
    );

    if (!portfolio) return (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-xl font-bold text-slate-700">No portfolio found</h3>
            <p className="text-slate-500 mt-2">Please upload a resume first to generate your portfolio.</p>
        </div>
    );

    const tabs = [
        { id: 'theme', label: 'Visual Theme', icon: FiLayout },
        { id: 'about', label: 'Personal Details', icon: FiUser },
        { id: 'experience', label: 'Experience', icon: FiBriefcase },
        { id: 'projects', label: 'Projects', icon: FiCpu },
        { id: 'education', label: 'Education', icon: FiBook },
        { id: 'skills', label: 'Skills', icon: FiAward },
        { id: 'certifications', label: 'Certifications', icon: FiAward },
        { id: 'languages', label: 'Languages', icon: FiGlobe },
        { id: 'awards', label: 'Awards', icon: FiStar },
    ];

    const themes = [
        { id: 'modern', name: 'Modern', description: 'Clean, professional, and balanced.', color: 'bg-blue-500' },
        { id: 'minimal', name: 'Minimal', description: 'Simple, typography-focused, and elegant.', color: 'bg-gray-800' },
        { id: 'creative', name: 'Creative', description: 'Bold colors and unique layout.', color: 'bg-purple-600' },
        { id: 'professional', name: 'Professional', description: 'Serif fonts, slate colors, trustworthy.', color: 'bg-slate-700' },
        { id: 'nature', name: 'Nature', description: 'Earth tones, calming and organic.', color: 'bg-emerald-600' },
        { id: 'dark', name: 'Dark Mode', description: 'High contrast, sleek dark aesthetic.', color: 'bg-gray-900' },
    ];

    const inputStyle = "w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400";
    const labelStyle = "block text-sm font-bold text-slate-700 mb-2 ml-1";

    return (
        <div className="space-y-8 pb-20 p-6 max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="sticky top-4 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-white/60">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900">Portfolio Editor</h2>
                    <p className="text-slate-500 text-sm mt-1">Refine and customize your personal site</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 p-1.5 rounded-xl">
                        <button
                            onClick={handlePublicToggle}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${portfolio.isPublic
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full mr-2 ${portfolio.isPublic ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            {portfolio.isPublic ? 'Public' : 'Private'}
                        </button>
                    </div>

                    <a
                        href={`${window.location.origin}/p/${portfolio.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/80 hover:bg-white text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-bold border border-indigo-100 transition-all flex items-center shadow-sm"
                    >
                        <FiExternalLink className="mr-2" /> View Live
                    </a>

                    <button
                        onClick={handleSave}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center hover:-translate-y-0.5"
                    >
                        <FiSave className="mr-2" /> Save Changes
                    </button>
                </div>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl text-center font-bold border border-green-200 shadow-sm"
                >
                    {message}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 sticky top-36">
                    <nav className="space-y-2 bg-white/60 backdrop-blur-lg p-3 rounded-3xl border border-white/50 shadow-lg shadow-indigo-100/20">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                                    : 'text-slate-500 hover:bg-white hover:text-indigo-600'
                                    }`}
                            >
                                <tab.icon className={`mr-3 w-5 h-5 ${activeTab === tab.id ? 'text-indigo-200' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-white/60"
                    >
                        {activeTab === 'theme' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold font-display text-slate-900">Visual Theme</h3>
                                <p className="text-slate-600">Choose a theme that matches your style. Click to preview how your portfolio will look.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {themes.map((theme) => (
                                        <motion.div
                                            key={theme.id}
                                            onClick={() => handleThemeChange(theme.id)}
                                            whileHover={{ scale: 1.02, y: -4 }}
                                            className={`cursor-pointer group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 ${portfolio.content.theme === theme.id
                                                ? 'border-indigo-600 shadow-2xl shadow-indigo-200/50'
                                                : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl'
                                                }`}
                                        >
                                            {/* Theme Preview - Miniature Portfolio Layout */}
                                            <div className={`h-48 p-4 relative overflow-hidden ${theme.id === 'modern' ? 'bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50' :
                                                    theme.id === 'minimal' ? 'bg-white border-b-2 border-gray-100' :
                                                        theme.id === 'creative' ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50' :
                                                            theme.id === 'professional' ? 'bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100' :
                                                                theme.id === 'nature' ? 'bg-gradient-to-br from-emerald-50 to-teal-50' :
                                                                    'bg-gray-900'
                                                }`}>
                                                {/* Miniature Header - Different styles per theme */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className={`${theme.id === 'modern' ? 'w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg' :
                                                            theme.id === 'minimal' ? 'w-8 h-8 rounded-full border-2 border-gray-800 bg-white' :
                                                                theme.id === 'professional' ? 'w-9 h-9 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 shadow-md' :
                                                                    theme.id === 'dark' ? 'w-9 h-9 rounded-full bg-gray-700 ring-2 ring-gray-600' :
                                                                        theme.id === 'creative' ? 'w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg' :
                                                                            'w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400'
                                                        }`}></div>
                                                    <div className="space-y-1 flex-1">
                                                        <div className={`${theme.id === 'modern' ? 'h-2.5 w-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600' :
                                                                theme.id === 'minimal' ? 'h-2 w-20 bg-black' :
                                                                    theme.id === 'professional' ? 'h-2.5 w-22 rounded bg-slate-800' :
                                                                        theme.id === 'dark' ? 'h-2 w-20 rounded bg-gray-300' :
                                                                            'h-2 w-20 rounded bg-gray-700'
                                                            }`}></div>
                                                        <div className={`${theme.id === 'modern' ? 'h-1.5 w-16 rounded-full bg-indigo-300' :
                                                                theme.id === 'minimal' ? 'h-1 w-14 bg-gray-400' :
                                                                    theme.id === 'professional' ? 'h-1.5 w-16 rounded bg-slate-500' :
                                                                        theme.id === 'dark' ? 'h-1.5 w-16 rounded bg-gray-600' :
                                                                            'h-1.5 w-16 rounded bg-gray-400'
                                                            }`}></div>
                                                    </div>
                                                </div>

                                                {/* Miniature Skills - Different styles */}
                                                <div className="flex gap-1.5 mb-3 flex-wrap">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className={`h-4 px-2 rounded text-[6px] flex items-center font-bold ${theme.id === 'modern' ? 'rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' :
                                                                theme.id === 'minimal' ? 'rounded-none bg-white text-gray-800 border-b-2 border-gray-800 px-1' :
                                                                    theme.id === 'creative' ? `${i % 2 === 0 ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-orange-400 to-red-400'} text-white rounded-xl shadow-sm` :
                                                                        theme.id === 'professional' ? 'rounded bg-slate-700 text-slate-100 shadow-sm' :
                                                                            theme.id === 'nature' ? 'rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white' :
                                                                                'bg-gray-700 text-gray-300 rounded-md'
                                                            }`}>
                                                            ●
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Miniature Project Card - Different layouts */}
                                                <div className={`overflow-hidden ${theme.id === 'modern' ? 'rounded-2xl shadow-lg' :
                                                        theme.id === 'minimal' ? 'rounded-none border-l-4 border-black' :
                                                            theme.id === 'professional' ? 'rounded-lg shadow-md' :
                                                                'rounded-xl'
                                                    } ${theme.id === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                                                    <div className={`${theme.id === 'modern' ? 'h-14 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500' :
                                                            theme.id === 'minimal' ? 'h-12 bg-gray-100' :
                                                                theme.id === 'creative' ? 'h-14 bg-gradient-to-br from-purple-400 to-pink-400' :
                                                                    theme.id === 'professional' ? 'h-13 bg-gradient-to-br from-slate-500 to-slate-600' :
                                                                        theme.id === 'nature' ? 'h-13 bg-gradient-to-br from-emerald-400 to-teal-400' :
                                                                            'h-12 bg-gradient-to-br from-gray-700 to-gray-600'
                                                        }`}></div>
                                                    <div className={`p-2 space-y-1 ${theme.id === 'minimal' ? 'border-t border-gray-200' : ''}`}>
                                                        <div className={`${theme.id === 'modern' ? 'h-2 w-14 rounded-full bg-indigo-600' :
                                                                theme.id === 'minimal' ? 'h-1.5 w-12 bg-black' :
                                                                    theme.id === 'professional' ? 'h-2 w-14 rounded bg-slate-700' :
                                                                        theme.id === 'dark' ? 'h-1.5 w-12 rounded bg-gray-600' :
                                                                            'h-1.5 w-12 rounded bg-gray-700'
                                                            }`}></div>
                                                        <div className={`${theme.id === 'modern' ? 'h-1 w-16 rounded-full bg-gray-300' :
                                                                theme.id === 'minimal' ? 'h-1 w-16 bg-gray-300' :
                                                                    theme.id === 'professional' ? 'h-1 w-16 rounded bg-slate-400' :
                                                                        theme.id === 'dark' ? 'h-1 w-16 rounded bg-gray-700' :
                                                                            'h-1 w-16 rounded bg-gray-300'
                                                            }`}></div>
                                                    </div>
                                                </div>

                                                {/* Theme-specific decorative elements */}
                                                {theme.id === 'modern' && (
                                                    <div className="absolute bottom-2 right-2 flex gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                    </div>
                                                )}
                                                {theme.id === 'minimal' && (
                                                    <div className="absolute bottom-2 right-2 w-8 h-0.5 bg-black"></div>
                                                )}
                                                {theme.id === 'professional' && (
                                                    <div className="absolute top-2 left-2 text-[8px] text-slate-400 font-serif">Aa</div>
                                                )}

                                                {/* Selected Indicator */}
                                                {portfolio.content.theme === theme.id && (
                                                    <div className="absolute top-2 right-2 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <FiCheck className="text-white w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Theme Info */}
                                            <div className="p-5 bg-white">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="font-bold text-slate-900 text-lg">{theme.name}</h4>
                                                    <div className={`w-3 h-3 rounded-full ${theme.color}`}></div>
                                                </div>
                                                <p className="text-sm text-slate-500 leading-relaxed">{theme.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-8">
                                <h3 className="text-xl font-bold font-display text-slate-900">Personal Details</h3>
                                <div>
                                    <label className={labelStyle}>Professional Headline</label>
                                    <textarea
                                        rows={6}
                                        className={inputStyle}
                                        value={portfolio.content.about || ''}
                                        onChange={(e) => setPortfolio(prev => ({ ...prev, content: { ...prev.content, about: e.target.value } }))}
                                        placeholder="I am a passionate developer..."
                                    />
                                    <p className="text-xs text-slate-400 mt-2 ml-1">Markdown supported</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                    <label className={labelStyle}>Profile Photo</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden shrink-0 border-2 border-white shadow-sm relative group">
                                            {portfolio.content.profileImage
                                                ? <img src={portfolio.content.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-slate-400"><FiUser /></div>
                                            }
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                className={inputStyle}
                                                value={portfolio.content.profileImage || ''}
                                                onChange={(e) => setPortfolio(prev => ({ ...prev, content: { ...prev.content, profileImage: e.target.value } }))}
                                                placeholder="https://... or Upload Image"
                                            />

                                            <div className="flex gap-2">
                                                <label className="flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all shadow-sm">
                                                    <FiPlus className="mr-2" /> Upload Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                                                                    setMessage("Image is too large (Max 2MB)");
                                                                    setTimeout(() => setMessage(""), 3000);
                                                                    return;
                                                                }
                                                                const reader = new FileReader();
                                                                reader.addEventListener("load", () => {
                                                                    setTempImage(reader.result);
                                                                    setIsCropModalOpen(true);
                                                                });
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <p className="text-xs text-slate-400 py-2">Max 2MB. Stored locally.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'experience' && <EditorSection
                            title="Work Experience"
                            items={portfolio.content.experience}
                            onAdd={() => {
                                const newExp = { title: '', company: '', startDate: '', endDate: '', description: '' };
                                setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: [...(prev.content.experience || []), newExp] } }));
                            }}
                            onRemove={(index) => {
                                const updated = portfolio.content.experience.filter((_, i) => i !== index);
                                setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: updated } }));
                            }}
                            renderItem={(item, index) => (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">Role</label>
                                            <input
                                                className={inputStyle}
                                                placeholder="Software Engineer"
                                                value={item.title}
                                                onChange={(e) => {
                                                    const updated = [...portfolio.content.experience];
                                                    updated[index].title = e.target.value;
                                                    setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: updated } }));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 mb-1 block">Company</label>
                                            <input
                                                className={inputStyle}
                                                placeholder="Google"
                                                value={item.company}
                                                onChange={(e) => {
                                                    const updated = [...portfolio.content.experience];
                                                    updated[index].company = e.target.value;
                                                    setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: updated } }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className={inputStyle} placeholder="Start Date" value={item.startDate} onChange={(e) => {
                                            const updated = [...portfolio.content.experience];
                                            updated[index].startDate = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: updated } }));
                                        }} />
                                        <input className={inputStyle} placeholder="End Date" value={item.endDate} onChange={(e) => {
                                            const updated = [...portfolio.content.experience];
                                            updated[index].endDate = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: updated } }));
                                        }} />
                                    </div>
                                    <textarea
                                        rows={3}
                                        className={inputStyle}
                                        placeholder="Describe your responsibilities..."
                                        value={item.description}
                                        onChange={(e) => {
                                            const updated = [...portfolio.content.experience];
                                            updated[index].description = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, experience: updated } }));
                                        }}
                                    />
                                </div>
                            )}
                        />}

                        {activeTab === 'projects' && <EditorSection
                            title="Projects"
                            items={portfolio.content.projects}
                            onAdd={() => {
                                const newP = { name: '', description: '', url: '', imageUrl: '' };
                                setPortfolio(prev => ({ ...prev, content: { ...prev.content, projects: [...(prev.content.projects || []), newP] } }));
                            }}
                            onRemove={(index) => {
                                const updated = portfolio.content.projects.filter((_, i) => i !== index);
                                setPortfolio(prev => ({ ...prev, content: { ...prev.content, projects: updated } }));
                            }}
                            renderItem={(item, index) => (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className={inputStyle} placeholder="Project Name" value={item.name} onChange={(e) => {
                                            const updated = [...portfolio.content.projects];
                                            updated[index].name = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, projects: updated } }));
                                        }} />
                                        <input className={inputStyle} placeholder="Project URL" value={item.url} onChange={(e) => {
                                            const updated = [...portfolio.content.projects];
                                            updated[index].url = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, projects: updated } }));
                                        }} />
                                    </div>
                                    <input className={inputStyle} placeholder="Cover Image URL" value={item.imageUrl} onChange={(e) => {
                                        const updated = [...portfolio.content.projects];
                                        updated[index].imageUrl = e.target.value;
                                        setPortfolio(prev => ({ ...prev, content: { ...prev.content, projects: updated } }));
                                    }} />
                                    <textarea className={inputStyle} rows={3} placeholder="Project Description" value={item.description} onChange={(e) => {
                                        const updated = [...portfolio.content.projects];
                                        updated[index].description = e.target.value;
                                        setPortfolio(prev => ({ ...prev, content: { ...prev.content, projects: updated } }));
                                    }} />
                                </div>
                            )}
                        />}

                        {activeTab === 'education' && <EditorSection
                            title="Education"
                            items={portfolio.content.education}
                            onAdd={() => {
                                const newEdu = { school: '', degree: '', startDate: '', endDate: '' };
                                setPortfolio(prev => ({ ...prev, content: { ...prev.content, education: [...(prev.content.education || []), newEdu] } }));
                            }}
                            onRemove={(index) => {
                                const updated = portfolio.content.education.filter((_, i) => i !== index);
                                setPortfolio(prev => ({ ...prev, content: { ...prev.content, education: updated } }));
                            }}
                            renderItem={(item, index) => (
                                <div className="space-y-4">
                                    <input className={inputStyle} placeholder="School / University" value={item.school} onChange={(e) => {
                                        const updated = [...portfolio.content.education];
                                        updated[index].school = e.target.value;
                                        setPortfolio(prev => ({ ...prev, content: { ...prev.content, education: updated } }));
                                    }} />
                                    <input className={inputStyle} placeholder="Degree" value={item.degree} onChange={(e) => {
                                        const updated = [...portfolio.content.education];
                                        updated[index].degree = e.target.value;
                                        setPortfolio(prev => ({ ...prev, content: { ...prev.content, education: updated } }));
                                    }} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input className={inputStyle} placeholder="Start Year" value={item.startDate} onChange={(e) => {
                                            const updated = [...portfolio.content.education];
                                            updated[index].startDate = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, education: updated } }));
                                        }} />
                                        <input className={inputStyle} placeholder="End Year" value={item.endDate} onChange={(e) => {
                                            const updated = [...portfolio.content.education];
                                            updated[index].endDate = e.target.value;
                                            setPortfolio(prev => ({ ...prev, content: { ...prev.content, education: updated } }));
                                        }} />
                                    </div>
                                </div>
                            )}
                        />}

                        {activeTab === 'skills' && (
                            <SimpleListEditor
                                title="Skills"
                                items={portfolio.content.skills}
                                hasChips={true}
                                setItems={(newSkills) => setPortfolio(prev => ({ ...prev, content: { ...prev.content, skills: newSkills } }))}
                                placeholder="Add a new skill and press Enter"
                            />
                        )}

                        {activeTab === 'certifications' && (
                            <SimpleListEditor
                                title="Certifications"
                                items={certifications}
                                setItems={setCertifications}
                                placeholder="e.g. AWS Certified Developer"
                            />
                        )}

                        {activeTab === 'languages' && (
                            <SimpleListEditor
                                title="Languages"
                                items={languages}
                                setItems={setLanguages}
                                placeholder="e.g. English, French"
                            />
                        )}

                        {activeTab === 'awards' && (
                            <SimpleListEditor
                                title="Awards"
                                items={awards}
                                setItems={setAwards}
                                placeholder="e.g. Dean's List 2023"
                            />
                        )}

                    </motion.div>
                </div>
                {/* Image Crop Modal */}
                <AnimatePresence>
                    {isCropModalOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl overflow-hidden"
                            >
                                <h3 className="text-xl font-bold mb-4 text-slate-800">Adjust Photo</h3>
                                <div className="relative w-full h-80 bg-slate-100 rounded-xl overflow-hidden mb-6">
                                    <Cropper
                                        image={tempImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                        style={{
                                            containerStyle: { background: '#f1f5f9' },
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-sm font-bold text-slate-500">Zoom</span>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(e.target.value)}
                                        className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={handleCropCancel}
                                        className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCropSave}
                                        className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                                    >
                                        Set Profile Photo
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const EditorSection = ({ title, items, onAdd, onRemove, renderItem }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold font-display text-slate-900">{title}</h3>
            <button onClick={onAdd} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-colors">
                <FiPlus className="w-5 h-5" />
            </button>
        </div>
        <div className="space-y-6">
            <AnimatePresence>
                {items?.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-50/50 p-6 rounded-3xl border border-slate-200/60 hover:border-indigo-300/50 transition-colors relative group"
                    >
                        <button
                            onClick={() => onRemove(index)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-sm"
                        >
                            <FiTrash2 />
                        </button>
                        {renderItem(item, index)}
                    </motion.div>
                ))}
            </AnimatePresence>
            {items?.length === 0 && <p className="text-center text-slate-400 py-8 italic">No items yet. Click + to add one.</p>}
        </div>
    </div>
);

const SimpleListEditor = ({ title, items, setItems, placeholder, hasChips = false }) => {
    // Ensure normalization
    const list = Array.isArray(items) ? items : [];

    const handleAdd = () => {
        setItems([...list, ""]);
    };

    const handleChange = (index, val) => {
        const updated = [...list];
        updated[index] = val;
        setItems(updated);
    };

    const handleRemove = (index) => {
        setItems(list.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold font-display text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 mt-1">Add items individually</p>
                </div>
                {!hasChips && (
                    <button
                        onClick={handleAdd}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-colors"
                    >
                        <FiPlus className="w-5 h-5" />
                    </button>
                )}
            </div>

            {hasChips && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {list.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 shadow-sm animate-fadeIn">
                            <span className="font-medium">{item}</span>
                            <button
                                onClick={() => handleRemove(index)}
                                className="text-indigo-400 hover:text-indigo-600 transition-colors"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <input
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                        placeholder={placeholder}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                                setItems([...list, e.target.value.trim()]);
                                e.target.value = '';
                            }
                        }}
                    />
                </div>
            )}

            {!hasChips && (
                <div className="space-y-3">
                    <AnimatePresence>
                        {list.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3 group"
                            >
                                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                                    {index + 1}
                                </span>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                        placeholder={placeholder}
                                    />
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {list.length === 0 && (
                        <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                            <p>No items added yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PortfolioEditor;
