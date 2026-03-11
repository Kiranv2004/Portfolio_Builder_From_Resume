import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLinkedin, FiBriefcase, FiCalendar, FiBook, FiAward, FiStar, FiExternalLink, FiArrowRight } from 'react-icons/fi';

const SplitLayout = ({ portfolio, styles, isDarkMode }) => {
    const { content } = portfolio;
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className={`min-h-screen flex flex-col lg:flex-row transition-colors duration-500 ${styles.bg} ${styles.text} ${styles.font || 'font-sans'}`}>

            {/* LEFT PANEL: Fixed Bio & Nav (Scrollable on mobile, Fixed on Desktop) */}
            <div className={`w-full lg:w-[40%] text-left lg:h-screen lg:fixed lg:top-0 lg:left-0 p-8 lg:p-20 flex flex-col justify-between overflow-y-auto ${isDarkMode ? 'lg:border-r lg:border-white/5' : 'lg:border-r lg:border-black/5'}`}>
                <div className="space-y-12">
                    <div>
                        {content.profileImage && (
                            <img src={content.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover mb-8 grayscale hover:grayscale-0 transition-all duration-500" />
                        )}
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                            {portfolio.username}
                        </h1>
                        <p className={`text-xl font-light leading-relaxed opacity-80 ${styles.subtext}`}>
                            {content.about}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {content.contact?.email && (
                            <a href={`mailto:${content.contact.email}`} className="block text-lg font-medium hover:underline decoration-1 underline-offset-4 decoration-dashed opacity-70 hover:opacity-100 transition-opacity">
                                {content.contact.email}
                            </a>
                        )}
                        <div className="flex gap-4">
                            {content.contact?.linkedin && (
                                <a href={content.contact.linkedin} className="opacity-50 hover:opacity-100 transition-opacity">
                                    <FiLinkedin className="w-6 h-6" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block text-xs font-mono opacity-30">
                    SCROLL TO EXPLORE <br /> ↓
                </div>
            </div>

            {/* RIGHT PANEL: Scrollable Content */}
            <div className="w-full lg:w-[60%] lg:ml-[40%] p-8 lg:p-24 space-y-32">

                {/* Projects */}
                {content.projects?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase mb-12 opacity-40">Selected Works</h2>
                        <div className="space-y-20">
                            {content.projects.map((project, i) => (
                                <div
                                    key={i}
                                    className="group cursor-pointer"
                                    onClick={() => setSelectedProject(project)}
                                >
                                    <div className="relative aspect-video overflow-hidden rounded-lg mb-6 bg-gray-100 dark:bg-gray-800">
                                        {project.imageUrl ? (
                                            <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 transform origin-center" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-10 font-bold text-6xl">
                                                {project.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2 group-hover:underline underline-offset-4 decoration-1">{project.name}</h3>
                                            <p className={`text-sm opacity-60 leading-relaxed max-w-md ${styles.subtext}`}>
                                                {project.description}
                                            </p>
                                        </div>
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                                            <FiArrowRight className="w-6 h-6" />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience */}
                {content.experience?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase mb-12 opacity-40">Experience</h2>
                        <div className="border-t border-dashed border-current/20">
                            {content.experience.map((exp, i) => (
                                <div key={i} className="py-8 border-b border-dashed border-current/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-sm opacity-50 font-mono py-1">{exp.endDate}</div>
                                    <div className="col-span-2">
                                        <h3 className="text-xl font-bold mb-1">{exp.company}</h3>
                                        <div className="text-sm font-medium opacity-70 mb-4">{exp.title}</div>
                                        <p className={`text-sm leading-relaxed opacity-60 ${styles.subtext}`}>
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {content.languages?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold tracking-[0.2em] uppercase mb-12 opacity-40">Languages</h2>
                        <div className="flex flex-wrap gap-4">
                            {content.languages.map((language, i) => (
                                <div key={i} className="flex items-center gap-3 px-6 py-3 border border-current/20 rounded-full">
                                    <span className="text-xl">🗣️</span>
                                    <span className="text-sm font-bold opacity-80">{language}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="pt-20 opacity-30 text-sm font-mono">
                    Built with ResumePortfolio.
                </footer>
            </div>

            {/* Project Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedProject(null)}></div>
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`pointer-events-auto relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 ${isDarkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white'}`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <h2 className="text-3xl font-bold">{selectedProject.name}</h2>
                                <button onClick={() => setSelectedProject(null)} className="p-2 opacity-50 hover:opacity-100">
                                    ✕
                                </button>
                            </div>
                            <div className="prose prose-lg dark:prose-invert">
                                <p className="opacity-80">{selectedProject.description}</p>
                            </div>
                            {selectedProject.url && (
                                <div className="mt-8 pt-8 border-t border-dashed border-current/20">
                                    <a href={selectedProject.url} target="_blank" rel="noreferrer" className="text-lg font-bold hover:underline">
                                        Visit Live Site →
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default SplitLayout;
