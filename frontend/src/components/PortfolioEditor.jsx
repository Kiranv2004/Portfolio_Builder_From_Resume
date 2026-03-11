import React, { useState, useEffect } from 'react';
import PortfolioService from '../services/portfolio.service';
import { FiSave, FiEye, FiPlus, FiTrash2, FiEdit2, FiLayout, FiBook, FiCpu, FiAward, FiUser, FiGlobe, FiStar, FiCheck, FiExternalLink, FiBriefcase } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { themes, getThemeStyles } from '../utils/themeConfig';

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

    const styles = getThemeStyles(portfolio.content.theme, false); // Use light mode for editor preview of current selection?? Or maybe just for the list.

    const inputStyle = "w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-400";
    const labelStyle = "block text-sm font-bold text-slate-700 mb-2 ml-1";

    return (
        <div className="space-y-8 pb-20 p-6 max-w-7xl mx-auto">
            {/* Action Bar */}
            <div className="sticky top-4 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-white/60">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900">Portfolio Editor <span className="text-indigo-600 text-lg">v2.0</span></h2>
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
                                <p className="text-slate-600">Choose a theme that matches your style. Click to preview.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {themes.map((theme) => {
                                        // Generate preview styles for this specific theme (forcing light mode for consistency in preview, or maybe dark if it's a dark theme?)
                                        // Actually, let's preview in "Light" by default unless it's a purely dark theme like 'cyber' which forces dark mode in its config?
                                        // In my config, 'cyber' has bg-black by default even in "base", so it handles itself.
                                        // But 'dark' theme depends on isDarkMode flag in `getThemeStyles`.
                                        // Let's pass `false` for isDarkMode generally, but for 'dark' theme we might want to pass true to see it?
                                        // But `getThemeStyles` for 'dark' theme (case 'dark') forces dark values even if isDarkMode is false? 
                                        // Wait, looking at my config: case 'dark' inherits 'darkBase' and sets bg-black. It ignores isDarkMode arg effectively for the base colors?
                                        // Actually: `const currentBase = isDarkMode ? darkBase : lightBase;`
                                        // `return { ...darkBase, ... }` for case 'dark'. So it uses darkBase. functional.

                                        const previewStyles = getThemeStyles(theme.id, theme.id === 'dark' || theme.id === 'cyber');

                                        return (
                                            <motion.div
                                                key={theme.id}
                                                onClick={() => handleThemeChange(theme.id)}
                                                whileHover={{ scale: 1.02, y: -4 }}
                                                className={`cursor-pointer group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 ${portfolio.content.theme === theme.id
                                                    ? 'border-indigo-600 shadow-2xl shadow-indigo-200/50'
                                                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl'
                                                    }`}
                                            >
                                                {/* Theme Preview - Dynamic Layout based on Theme Type */}
                                                <div className={`h-48 relative overflow-hidden transition-colors ${previewStyles.bg} ${previewStyles.font}`}>

                                                    {/* STANDARD LAYOUT PREVIEW */}
                                                    {(!theme.layout || theme.layout === 'standard') && (
                                                        <div className="p-4 h-full flex flex-col">
                                                            {previewStyles.headerGradient && (
                                                                <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-br ${previewStyles.headerGradient} opacity-50`}></div>
                                                            )}
                                                            <div className="relative flex items-center gap-3 mb-3 z-10">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${previewStyles.iconBox || 'bg-white'}`}>
                                                                    {theme.icon && <theme.icon className="w-4 h-4" />}
                                                                </div>
                                                                <div className="space-y-1.5 flex-1">
                                                                    <div className={`h-2 w-20 rounded-full ${previewStyles.accent.replace('text-', 'bg-')}`}></div>
                                                                    <div className="h-1 w-12 rounded-full bg-slate-400/30"></div>
                                                                </div>
                                                            </div>
                                                            <div className="relative flex gap-1 mb-2 z-10">
                                                                {[1, 2].map(i => <div key={i} className={`h-1 w-6 rounded-full ${previewStyles.tag ? previewStyles.tag.replace('text-', 'bg-').replace('border-', 'border-transparent ') : 'bg-slate-200'}`}></div>)}
                                                            </div>
                                                            <div className="relative grid grid-cols-2 gap-2 z-10 mt-auto">
                                                                {[1, 2].map(i => (
                                                                    <div key={i} className={`h-12 rounded-lg ${previewStyles.card} border opacity-80`}></div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* BENTO LAYOUT PREVIEW */}
                                                    {theme.layout === 'bento' && (
                                                        <div className="p-3 h-full grid grid-cols-3 grid-rows-3 gap-2">
                                                            {/* Hero Tile */}
                                                            <div className={`col-span-2 row-span-2 rounded-xl ${previewStyles.card} border p-2 flex flex-col justify-end relative overflow-hidden`}>
                                                                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${previewStyles.headerGradient} opacity-50 blur-xl`}></div>
                                                                <div className={`w-6 h-6 rounded-lg mb-1 ${previewStyles.iconBox}`}>
                                                                    {theme.icon && <theme.icon className="w-3 h-3" />}
                                                                </div>
                                                                <div className={`h-1.5 w-12 rounded-full ${previewStyles.accent.replace('text-', 'bg-')} mb-1`}></div>
                                                            </div>
                                                            {/* Side Tile */}
                                                            <div className={`col-span-1 row-span-1 rounded-xl ${previewStyles.bg === 'bg-black' ? 'bg-slate-800' : 'bg-slate-100'} opacity-50`}></div>
                                                            {/* Tall Tile */}
                                                            <div className={`col-span-1 row-span-2 rounded-xl ${previewStyles.card} border`}></div>
                                                            {/* Bottom Wide */}
                                                            <div className={`col-span-2 row-span-1 rounded-xl ${previewStyles.tag ? previewStyles.tag.replace('text-', 'bg-').split(' ')[0] : 'bg-slate-200'} opacity-30`}></div>
                                                        </div>
                                                    )}

                                                    {/* SPLIT LAYOUT PREVIEW */}
                                                    {theme.layout === 'split' && (
                                                        <div className="h-full flex">
                                                            {/* Sidebar */}
                                                            <div className={`w-[35%] h-full p-3 flex flex-col justify-between border-r ${previewStyles.bg === 'bg-white' ? 'border-slate-100' : 'border-white/10'}`}>
                                                                <div>
                                                                    <div className={`w-6 h-6 rounded-full mb-3 ${previewStyles.iconBox}`}>
                                                                        {theme.icon && <theme.icon className="w-3 h-3" />}
                                                                    </div>
                                                                    <div className={`h-1.5 w-10 rounded-full ${previewStyles.accent.replace('text-', 'bg-')} mb-2`}></div>
                                                                    <div className="h-1 w-8 rounded-full bg-current opacity-20"></div>
                                                                </div>
                                                                <div className="space-y-1 opacity-30">
                                                                    <div className="h-0.5 w-6 bg-current"></div>
                                                                    <div className="h-0.5 w-4 bg-current"></div>
                                                                </div>
                                                            </div>
                                                            {/* Content */}
                                                            <div className="flex-1 p-3 space-y-3 overflow-hidden">
                                                                {[1, 2, 3].map(i => (
                                                                    <div key={i} className="flex gap-2 items-center">
                                                                        <div className="w-8 h-5 rounded bg-current opacity-10 shrink-0"></div>
                                                                        <div className="space-y-1 flex-1">
                                                                            <div className="h-1 w-12 bg-current opacity-30 rounded-full"></div>
                                                                            <div className="h-0.5 w-full bg-current opacity-10 rounded-full"></div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Selected Indicator */}
                                                    {portfolio.content.theme === theme.id && (
                                                        <div className="absolute top-2 right-2 z-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                                                            <FiCheck className="text-white w-3 h-3" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Theme Info */}
                                                <div className="p-5 bg-white border-t border-slate-100">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-slate-900 text-lg">{theme.name}</h4>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${theme.layout === 'bento' ? 'bg-purple-100 text-purple-700' :
                                                                theme.layout === 'split' ? 'bg-emerald-100 text-emerald-700' :
                                                                    'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                {theme.layout || 'Standard'}
                                                            </span>
                                                        </div>
                                                        <theme.icon className="text-slate-300 w-5 h-5" />
                                                    </div>
                                                    <p className="text-sm text-slate-500 leading-relaxed">{theme.description}</p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {
                            activeTab === 'about' && (
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
                            )
                        }

                        {
                            activeTab === 'experience' && <EditorSection
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
                            />
                        }

                        {
                            activeTab === 'projects' && <EditorSection
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
                            />
                        }

                        {
                            activeTab === 'education' && <EditorSection
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
                            />
                        }

                        {
                            activeTab === 'skills' && (
                                <SimpleListEditor
                                    title="Skills"
                                    items={portfolio.content.skills}
                                    hasChips={true}
                                    setItems={(newSkills) => setPortfolio(prev => ({ ...prev, content: { ...prev.content, skills: newSkills } }))}
                                    placeholder="Add a new skill and press Enter"
                                />
                            )
                        }

                        {
                            activeTab === 'certifications' && (
                                <SimpleListEditor
                                    title="Certifications"
                                    items={certifications}
                                    setItems={setCertifications}
                                    placeholder="e.g. AWS Certified Developer"
                                />
                            )
                        }

                        {
                            activeTab === 'languages' && (
                                <SimpleListEditor
                                    title="Languages"
                                    items={languages}
                                    setItems={setLanguages}
                                    placeholder="e.g. English, French"
                                />
                            )
                        }

                        {
                            activeTab === 'awards' && (
                                <SimpleListEditor
                                    title="Awards"
                                    items={awards}
                                    setItems={setAwards}
                                    placeholder="e.g. Dean's List 2023"
                                />
                            )
                        }

                    </motion.div >
                </div >
                {/* Image Crop Modal */}
                < AnimatePresence >
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
                </AnimatePresence >
            </div >
        </div >
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
