import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLinkedin, FiBriefcase, FiCalendar, FiBook, FiAward, FiStar, FiExternalLink, FiGithub, FiTwitter } from 'react-icons/fi';

const BentoLayout = ({ portfolio, styles, isDarkMode }) => {
    const { content } = portfolio;
    const [selectedProject, setSelectedProject] = useState(null);

    // Helper to generate a random but consistent size for bento items if needed, 
    // but we'll try to keep it structured.

    return (
        <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${styles.bg} ${styles.text} ${styles.font || 'font-sans'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                    {/* Hero Tile - 2x2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className={`col-span-1 md:col-span-2 row-span-2 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                    >
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${styles.headerGradient} opacity-20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none`}></div>

                        <div className="relative z-10">
                            {content.profileImage ? (
                                <img src={content.profileImage} alt="Profile" className="w-24 h-24 rounded-2xl object-cover shadow-lg mb-6" />
                            ) : (
                                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                    {portfolio.username.charAt(0)}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 leading-tight">
                                {portfolio.username}
                            </h1>
                            <p className={`text-lg md:text-xl font-medium opacity-80 ${styles.subtext}`}>
                                {content.about ? content.about.split('.')[0] + '.' : 'Creative Developer'}
                            </p>
                        </div>
                        <div className="flex gap-3 relative z-10 mt-6">
                            {content.contact?.email && (
                                <a href={`mailto:${content.contact.email}`} className={`px-6 py-3 rounded-xl font-bold text-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 ${styles.button}`}>
                                    <FiMail /> Get in touch
                                </a>
                            )}
                            <div className="flex gap-2">
                                {content.contact?.linkedin && (
                                    <a href={content.contact.linkedin} target="_blank" rel="noreferrer" className={`p-3 rounded-xl ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'} transition-colors`}>
                                        <FiLinkedin className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Bio / About - 2x1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                        className={`col-span-1 md:col-span-2 row-span-1 rounded-[2.5rem] p-8 flex flex-col justify-center ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                    >
                        <h3 className="text-sm font-bold uppercase tracking-wider opacity-60 mb-3">About Me</h3>
                        <p className={`text-lg leading-relaxed ${styles.text} line-clamp-4`}>
                            {content.about}
                        </p>
                    </motion.div>

                    {/* Experience List - 1x2 (tall) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className={`col-span-1 md:col-span-1 row-span-2 rounded-[2.5rem] p-6 overflow-y-auto ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <FiBriefcase className={`${styles.accent}`} />
                            <h3 className="font-bold text-lg">Experience</h3>
                        </div>
                        <div className="space-y-6">
                            {content.experience?.slice(0, 3).map((exp, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-bold text-sm">{exp.company}</span>
                                        <span className="text-xs opacity-50">{exp.endDate}</span>
                                    </div>
                                    <div className={`text-xs font-semibold mb-2 ${styles.accent}`}>{exp.title}</div>
                                    <p className="text-xs opacity-70 line-clamp-2">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Skills Cloud - 1x1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                        className={`col-span-1 rounded-[2.5rem] p-6 flex flex-col ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                    >
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <FiAward className={`${styles.accent}`} /> Stack
                        </h3>
                        <div className="flex flex-wrap gap-2 content-start">
                            {content.skills?.slice(0, 6).map((skill, i) => (
                                <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-lg ${styles.tag}`}>
                                    {skill}
                                </span>
                            ))}
                            {content.skills?.length > 6 && (
                                <span className="text-xs font-bold px-2 py-1.5 opacity-50">+{content.skills.length - 6}</span>
                            )}
                        </div>
                    </motion.div>

                    {/* Languages - 1x1 */}
                    {content.languages && content.languages.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}
                            className={`col-span-1 md:col-span-1 rounded-[2.5rem] p-6 flex flex-col ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                        >
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="text-xl">🗣️</span> Languages
                            </h3>
                            <div className="flex flex-col gap-3 content-start">
                                {content.languages.map((language, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${styles.accent.replace('text-', 'bg-')} opacity-60`}></div>
                                        <span className="text-sm font-bold opacity-80">{language}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Projects Grid - Spans Remaining */}
                    {content.projects?.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + (i * 0.1) }}
                            onClick={() => setSelectedProject(project)}
                            className={`col-span-1 rounded-[2.5rem] overflow-hidden group cursor-pointer relative min-h-[240px] ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                        >
                            {/* Image Background */}
                            {project.imageUrl ? (
                                <img src={project.imageUrl} alt={project.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${isDarkMode ? 'from-slate-800 to-slate-900' : 'from-slate-100 to-slate-200'} group-hover:from-indigo-500 group-hover:to-purple-600 transition-colors duration-500`}></div>
                            )}

                            {/* Overlay Content */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                                <h3 className="font-bold text-xl mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{project.name}</h3>
                                <p className="text-sm opacity-0 group-hover:opacity-90 translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 line-clamp-2">
                                    {project.description}
                                </p>
                                <span className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiExternalLink />
                                </span>
                            </div>
                        </motion.div>
                    ))}

                    {/* Education - 2x1 */}
                    {content.education?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className={`col-span-1 md:col-span-2 rounded-[2.5rem] p-8 flex flex-col justify-center ${styles.card} border-0 ring-1 ring-inset ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <FiBook className={`${styles.accent}`} />
                                <h3 className="font-bold text-lg">Education</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {content.education.map((edu, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
                                            {edu.school.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{edu.school}</div>
                                            <div className="text-xs opacity-70">{edu.degree}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>

                <footer className="py-12 text-center opacity-50 text-sm">
                    <p>&copy; {new Date().getFullYear()} {portfolio.username}.</p>
                </footer>
            </div>

            {/* Project Details Modal (Reused) */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        ></motion.div>
                        <motion.div
                            className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2rem] shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="relative h-64 w-full">
                                {selectedProject.imageUrl ? (
                                    <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                                        <h1 className="text-6xl font-black opacity-10">{selectedProject.name[0]}</h1>
                                    </div>
                                )}
                                <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-md">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-8">
                                <h2 className="text-3xl font-bold mb-4">{selectedProject.name}</h2>
                                <p className="opacity-80 leading-relaxed mb-6">{selectedProject.description}</p>
                                {selectedProject.url && (
                                    <a href={selectedProject.url} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${styles.button}`}>
                                        View Project <FiExternalLink />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BentoLayout;
