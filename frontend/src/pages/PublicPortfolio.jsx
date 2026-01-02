import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioService from '../services/portfolio.service';
import { FiMail, FiGithub, FiLinkedin, FiExternalLink, FiCalendar, FiMoon, FiSun, FiBriefcase, FiBook, FiAward, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PublicPortfolio = () => {
    const { username } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false); // Default to light, but toggleable
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await PortfolioService.getPublicPortfolio(username);
                setPortfolio(response.data);
            } catch (err) {
                setError("Portfolio not found or is private.");
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, [username]);

    // System preference check
    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
        }
    }, []);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
    );
    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 font-medium text-xl">
            {error}
        </div>
    );
    if (!portfolio || !portfolio.content) return (
        <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 text-xl">
            Portfolio content is empty.
        </div>
    );

    const { content } = portfolio;
    const baseTheme = content.theme || 'modern';

    // Theme Logic: Dynamic classes based on Base Theme AND Dark Mode
    const getThemeStyles = () => {
        // Common Transitions
        const transition = "transition-colors duration-500";

        const darkBase = {
            bg: "bg-gray-900",
            text: "text-gray-100",
            subtext: "text-gray-400",
            card: "bg-gray-800/60 backdrop-blur-md border border-white/10 shadow-xl",
            accent: "text-indigo-400",
            button: "bg-indigo-600 text-white hover:bg-indigo-500",
            headerGradient: "from-gray-900 via-gray-800 to-gray-900"
        };

        const lightBase = {
            bg: "bg-slate-50",
            text: "text-slate-900",
            subtext: "text-slate-500",
            card: "bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-100/20",
            accent: "text-indigo-600",
            button: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5",
            headerGradient: "from-indigo-50 via-white to-blue-50"
        };

        const currentBase = isDarkMode ? darkBase : lightBase;

        // Theme Specific Overrides
        switch (baseTheme) {
            case 'minimal':
                return {
                    ...currentBase,
                    bg: isDarkMode ? "bg-black" : "bg-white",
                    card: isDarkMode ? "border-b border-gray-800 bg-transparent" : "border-b border-gray-100 bg-transparent py-8",
                    font: "font-sans",
                    button: isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                };
            case 'nature':
                return {
                    ...currentBase,
                    bg: isDarkMode ? "bg-stone-900" : "bg-stone-50",
                    text: isDarkMode ? "text-stone-100" : "text-stone-800",
                    accent: "text-emerald-600",
                    button: "bg-emerald-600 text-white hover:bg-emerald-700",
                    card: isDarkMode ? "bg-stone-800/80 border-stone-700" : "bg-white/80 border-stone-200 shadow-sm",
                    headerGradient: isDarkMode ? "from-stone-900 to-emerald-900/20" : "from-stone-50 to-emerald-50"
                };
            case 'creative':
                return {
                    ...currentBase,
                    font: "font-display",
                    headerGradient: isDarkMode ? "from-gray-900 via-purple-900/30 to-gray-900" : "from-purple-50 via-pink-50 to-white",
                    accent: "text-purple-600",
                    button: "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                };
            case 'professional':
                return {
                    ...currentBase,
                    font: "font-serif",
                    card: isDarkMode ? "bg-slate-800 border-l-4 border-slate-600" : "bg-white border-l-4 border-slate-800 shadow-md",
                    button: isDarkMode ? "bg-slate-700 text-white" : "bg-slate-900 text-white"
                };
            case 'dark': // If user selected "dark" theme specifically, force dark mode defaults? Or just unique style?
                return { // Treat as "Cyberpunk" or "High Contrast"
                    ...darkBase,
                    bg: "bg-black",
                    text: "text-gray-100",
                    accent: "text-cyan-400",
                    button: "bg-cyan-600 text-white hover:bg-cyan-500",
                    card: "bg-gray-900 border border-gray-800"
                };
            default: // modern
                return currentBase;
        }
    };

    const styles = getThemeStyles();



    return (
        <div className={`min-h-screen transition-colors duration-500 ${styles.bg} ${styles.text} ${styles.font || 'font-sans'}`}>

            {/* Dark Mode Toggle */}
            <button
                onClick={toggleTheme}
                className={`fixed top-6 right-6 z-50 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'}`}
                title="Toggle Dark Mode"
            >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Hero Section */}
            <header className={`relative py-40 overflow-hidden bg-gradient-to-br ${styles.headerGradient}`}>
                {/* Background Decor */}
                {!isDarkMode && baseTheme === 'creative' && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-400 to-pink-400 opacity-40 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-indigo-400 opacity-40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-yellow-300 to-orange-400 opacity-30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
                    </div>
                )}
                {isDarkMode && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {content.profileImage ? (
                            <div className="relative inline-block mb-10">
                                <img
                                    src={content.profileImage}
                                    alt={portfolio.username}
                                    className={`w-48 h-48 rounded-full object-cover shadow-2xl ring-8 ${isDarkMode ? 'ring-gray-800/50' : 'ring-white/80'} border-4 ${isDarkMode ? 'border-gray-700' : 'border-white'}`}
                                />
                                <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full ${isDarkMode ? 'bg-indigo-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center shadow-xl`}>
                                    <span className="text-2xl">✨</span>
                                </div>
                            </div>
                        ) : (
                            baseTheme !== 'minimal' && (
                                <div className="relative inline-block mb-10">
                                    <div className={`w-44 h-44 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl ring-8 ${isDarkMode ? 'ring-gray-800/50' : 'ring-white/80'} ${baseTheme === 'creative' ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white' : (isDarkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white')}`}>
                                        {portfolio.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full ${isDarkMode ? 'bg-indigo-500' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} flex items-center justify-center shadow-xl`}>
                                        <span className="text-2xl">✨</span>
                                    </div>
                                </div>
                            )
                        )}

                        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8">
                            <span className={`${styles.text} drop-shadow-sm`}>{portfolio.username}</span>
                        </h1>

                        <p className={`mt-8 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed ${styles.subtext}`}>
                            {content.about}
                        </p>

                        <div className="mt-12 flex flex-wrap justify-center gap-5">
                            {content.contact?.email && (
                                <a href={`mailto:${content.contact.email}`} className={`py-5 px-12 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 text-lg ${styles.button}`}>
                                    <FiMail className="w-5 h-5" /> Hire Me
                                </a>
                            )}
                            {content.contact?.linkedin && (
                                <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer" className={`py-5 px-12 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 text-lg ${isDarkMode ? 'bg-gray-800 text-white border-2 border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50'}`}>
                                    <FiLinkedin className="w-5 h-5" /> LinkedIn
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-20 px-6 space-y-32 relative">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
                    <div className={`absolute top-20 right-10 w-72 h-72 ${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-100/50'} rounded-full blur-3xl`}></div>
                    <div className={`absolute bottom-40 left-10 w-96 h-96 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100/50'} rounded-full blur-3xl`}></div>
                </div>

                {/* Skills */}
                {content.skills && content.skills.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <h2 className={`text-5xl font-bold mb-16 text-center ${styles.text}`}>Expertise</h2>
                        <div className="flex flex-wrap justify-center gap-5">
                            {content.skills.map((skill, index) => {
                                // Assign vibrant gradient colors to each skill
                                const gradients = [
                                    'from-blue-500 to-cyan-500',
                                    'from-purple-500 to-pink-500',
                                    'from-orange-500 to-red-500',
                                    'from-green-500 to-emerald-500',
                                    'from-indigo-500 to-purple-500',
                                    'from-yellow-500 to-orange-500',
                                    'from-pink-500 to-rose-500',
                                    'from-teal-500 to-cyan-500'
                                ];
                                const gradient = gradients[index % gradients.length];

                                return (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.1, y: -6, rotate: 2 }}
                                        className={`px-8 py-4 rounded-2xl text-lg font-bold transition-all cursor-default bg-gradient-to-r ${gradient} text-white shadow-xl hover:shadow-2xl relative overflow-hidden group`}
                                    >
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <span className="relative z-10">{skill}</span>
                                    </motion.span>
                                );
                            })}
                        </div>
                    </motion.section>
                )}

                {/* Experience */}
                {content.experience && content.experience.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-20">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} shadow-lg`}>
                                <FiBriefcase className="w-7 h-7 text-white" />
                            </div>
                            <h2 className={`text-5xl font-bold ${styles.text}`}>Experience</h2>
                            <div className={`h-1 flex-1 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-gray-700 to-transparent' : 'bg-gradient-to-r from-gray-200 to-transparent'}`}></div>
                        </div>
                        <div className="space-y-8">
                            {content.experience.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -4 }}
                                    className={`group relative p-8 rounded-3xl transition-all duration-300 ${styles.card} hover:shadow-2xl ${isDarkMode ? 'hover:shadow-indigo-500/10' : 'hover:shadow-indigo-200/50'}`}
                                >
                                    {/* Gradient accent bar */}
                                    <div className={`absolute left-0 top-8 bottom-8 w-1.5 rounded-full ${isDarkMode ? 'bg-gradient-to-b from-indigo-500 to-purple-500' : 'bg-gradient-to-b from-blue-500 to-indigo-600'}`}></div>

                                    <div className="ml-6">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <h3 className={`text-2xl font-bold mb-2 ${styles.text} group-hover:text-indigo-600 transition-colors`}>{exp.title}</h3>
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <span className={`text-xl font-semibold ${styles.accent}`}>{exp.company}</span>
                                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100'}`}>
                                                        <FiCalendar className="inline w-3.5 h-3.5 mr-1.5" />
                                                        {exp.startDate} - {exp.endDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-lg leading-relaxed ${styles.subtext}`}>{exp.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {content.projects && content.projects.length > 0 && (
                    <section>
                        <h2 className={`text-5xl font-bold mb-20 text-center ${styles.text}`}>Featured Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {content.projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    onClick={() => setSelectedProject(project)}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -12, scale: 1.02 }}
                                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                                    className={`group flex flex-col h-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${styles.card} ${isDarkMode ? 'hover:shadow-2xl hover:shadow-indigo-500/20' : 'hover:shadow-2xl hover:shadow-indigo-200/50'}`}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <>
                                                {/* Vibrant gradient backgrounds for projects without images */}
                                                {(() => {
                                                    const gradients = [
                                                        'from-violet-600 via-purple-600 to-indigo-600',
                                                        'from-cyan-500 via-blue-500 to-indigo-600',
                                                        'from-pink-500 via-rose-500 to-red-500',
                                                        'from-emerald-500 via-teal-500 to-cyan-500',
                                                        'from-orange-500 via-amber-500 to-yellow-500',
                                                        'from-fuchsia-600 via-pink-600 to-rose-600'
                                                    ];
                                                    const selectedGradient = gradients[index % gradients.length];

                                                    return (
                                                        <div className={`w-full h-full bg-gradient-to-br ${selectedGradient} relative overflow-hidden`}>
                                                            {/* Animated background pattern */}
                                                            <div className="absolute inset-0 opacity-20">
                                                                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl animate-float"></div>
                                                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-float-delayed"></div>
                                                                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-xl animate-pulse"></div>
                                                            </div>
                                                            {/* Large decorative letter */}
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-9xl font-black text-white opacity-30 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-700">
                                                                    {project.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            {/* Decorative shapes */}
                                                            <div className="absolute top-4 right-4 w-16 h-16 border-4 border-white/30 rounded-full group-hover:rotate-180 transition-transform duration-700"></div>
                                                            <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-white/30 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                                                        </div>
                                                    );
                                                })()}
                                            </>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                                        <div className="absolute bottom-5 left-5">
                                            <span className="bg-white/25 backdrop-blur-lg text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/40 shadow-lg group-hover:bg-white/35 transition-all">
                                                Click to View
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className={`text-2xl font-bold mb-3 ${styles.text} group-hover:text-indigo-500 transition-colors`}>{project.name}</h3>

                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Grid for Education & Others */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Education */}
                    {content.education && content.education.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-emerald-600 to-teal-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'} shadow-lg`}>
                                    <FiBook className="w-6 h-6 text-white" />
                                </div>
                                <h3 className={`text-4xl font-bold ${styles.text}`}>Education</h3>
                            </div>
                            <div className="space-y-5">
                                {content.education.map((edu, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 4 }}
                                        className={`group relative p-6 rounded-2xl transition-all ${styles.card} hover:shadow-xl overflow-hidden`}
                                    >
                                        {/* Gradient corner accent */}
                                        <div className={`absolute top-0 right-0 w-24 h-24 ${isDarkMode ? 'bg-gradient-to-bl from-emerald-500/20 to-transparent' : 'bg-gradient-to-bl from-emerald-100 to-transparent'} rounded-bl-full`}></div>

                                        <div className="flex items-start gap-5 relative z-10">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0 ${isDarkMode ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white' : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 border-2 border-emerald-200'} shadow-md`}>
                                                {edu.school.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-xl font-bold mb-1 ${styles.text} group-hover:text-emerald-600 transition-colors`}>{edu.school}</h4>
                                                <p className={`text-lg font-semibold mb-2 ${styles.accent}`}>{edu.degree}</p>
                                                <p className={`text-sm font-medium ${styles.subtext} flex items-center gap-2`}>
                                                    <FiCalendar className="w-3.5 h-3.5" />
                                                    {edu.startDate} - {edu.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Certifications & Awards */}
                    <div className="space-y-12">
                        {content.certifications && content.certifications.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-cyan-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'} shadow-lg`}>
                                        <FiAward className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className={`text-4xl font-bold ${styles.text}`}>Certifications</h3>
                                </div>
                                <div className="space-y-3">
                                    {content.certifications.map((cert, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ x: 4, scale: 1.01 }}
                                            className={`group flex items-center gap-4 p-5 rounded-xl transition-all ${isDarkMode ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50' : 'bg-gradient-to-r from-blue-50/80 to-cyan-50/80 hover:from-blue-50 hover:to-cyan-50 border border-blue-100'}`}
                                        >
                                            <div className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-cyan-500'} shadow-lg`}></div>
                                            <span className={`text-lg font-medium ${styles.text} group-hover:text-blue-600 transition-colors`}>{cert}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {content.awards && content.awards.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="flex items-center gap-4 mb-10">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-yellow-600 to-orange-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500'} shadow-lg`}>
                                        <FiStar className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className={`text-4xl font-bold ${styles.text}`}>Awards</h3>
                                </div>
                                <div className="space-y-4">
                                    {content.awards.map((award, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            className={`group relative p-6 rounded-2xl flex items-center gap-5 transition-all overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700/50 hover:border-yellow-600' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300 shadow-md hover:shadow-xl'}`}
                                        >
                                            {/* Shine effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                            <div className={`text-4xl shrink-0 relative z-10 ${isDarkMode ? 'drop-shadow-lg' : ''}`}>🏆</div>
                                            <span className={`text-lg font-semibold relative z-10 ${styles.text} group-hover:text-yellow-700 transition-colors`}>{award}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </div>

            </main>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            layoutId={`project-${selectedProject.name}`}
                            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${isDarkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                                {selectedProject.imageUrl ? (
                                    <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
                                        <span className="text-8xl font-black text-white opacity-20">{selectedProject.name.charAt(0)}</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 sm:p-10 space-y-8">
                                <div>
                                    <h3 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedProject.name}</h3>
                                    {selectedProject.url && (
                                        <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-500 hover:text-indigo-600 font-medium">
                                            <FiExternalLink className="mr-2" /> Visit Live Project
                                        </a>
                                    )}
                                </div>

                                <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                                    <p className={`text-lg leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {selectedProject.description}
                                    </p>
                                </div>

                                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className={`px-6 py-3 rounded-xl font-bold transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <footer className={`py-12 mt-20 border-t ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
                <div className="text-center">
                    <p className={styles.subtext}>&copy; {new Date().getFullYear()} {portfolio.username}. Built with ResumePortfolio.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicPortfolio;
