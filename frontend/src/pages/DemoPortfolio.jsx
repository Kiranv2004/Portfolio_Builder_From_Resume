import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiGithub, FiLinkedin, FiExternalLink, FiCalendar, FiBriefcase, FiBook, FiAward, FiStar, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DemoPortfolio = () => {
    // Impressive demo data
    const demoData = {
        username: "Alex Johnson",
        content: {
            about: "Full-Stack Developer & UI/UX Enthusiast with 5+ years of experience building scalable web applications. Passionate about creating beautiful, user-centric digital experiences that make a difference. Specialized in React, Node.js, and cloud architecture.",
            theme: "creative",
            profileImage: null,
            skills: [
                "React & Next.js",
                "Node.js & Express",
                "TypeScript",
                "AWS & Docker",
                "UI/UX Design",
                "MongoDB & PostgreSQL",
                "GraphQL",
                "Tailwind CSS"
            ],
            experience: [
                {
                    title: "Senior Full-Stack Developer",
                    company: "TechCorp Solutions",
                    startDate: "2021",
                    endDate: "Present",
                    description: "Leading development of cloud-native applications serving 100K+ users. Architected microservices infrastructure reducing deployment time by 60%. Mentoring junior developers and conducting code reviews."
                },
                {
                    title: "Frontend Developer",
                    company: "StartupHub Inc",
                    startDate: "2019",
                    endDate: "2021",
                    description: "Built responsive web applications using React and modern JavaScript. Improved page load performance by 40% through optimization techniques. Collaborated with designers to implement pixel-perfect UI components."
                }
            ],
            projects: [
                {
                    name: "E-Commerce Platform",
                    description: "Full-featured online marketplace with real-time inventory management, payment processing, and admin dashboard.\n\nKey Features:\n• Secure payment integration with Stripe\n• Real-time notifications using WebSockets\n• Advanced search with Elasticsearch\n• Responsive design for all devices",
                    url: "https://example.com",
                    imageUrl: null
                },
                {
                    name: "AI Task Manager",
                    description: "Smart productivity app with AI-powered task prioritization and scheduling recommendations.\n\nTechnologies:\n• React Native for mobile\n• TensorFlow.js for ML\n• Firebase for backend\n• Natural language processing",
                    url: "https://example.com",
                    imageUrl: null
                },
                {
                    name: "Social Analytics Dashboard",
                    description: "Real-time analytics platform for social media metrics with beautiful data visualizations.\n\nHighlights:\n• D3.js interactive charts\n• Real-time data streaming\n• Multi-platform integration\n• Export reports in PDF/Excel",
                    url: "https://example.com",
                    imageUrl: null
                }
            ],
            education: [
                {
                    school: "Stanford University",
                    degree: "Master of Science in Computer Science",
                    startDate: "2017",
                    endDate: "2019"
                },
                {
                    school: "UC Berkeley",
                    degree: "Bachelor of Science in Software Engineering",
                    startDate: "2013",
                    endDate: "2017"
                }
            ],
            certifications: [
                "AWS Certified Solutions Architect - Professional",
                "Google Cloud Professional Developer",
                "Meta React Advanced Certification",
                "MongoDB Certified Developer"
            ],
            awards: [
                "Best Innovation Award - TechCorp Hackathon 2023",
                "Top Contributor - Open Source Community 2022",
                "Excellence in Engineering - StartupHub 2020"
            ]
        }
    };

    const isDarkMode = false;
    const baseTheme = demoData.content.theme;
    const [selectedProject, setSelectedProject] = React.useState(null);

    // Theme styles
    const styles = {
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        accent: 'text-indigo-600',
        card: 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-100/40'
    };

    const content = demoData.content;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            {/* Demo Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 text-center relative">
                <p className="text-sm font-semibold">
                    🎨 This is a demo portfolio showcasing our features •
                    <Link to="/" className="ml-2 underline hover:text-indigo-200">Back to Home</Link>
                </p>
            </div>

            {/* Hero Header */}
            <header className="relative py-40 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-400 to-pink-400 opacity-40 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-indigo-400 opacity-40 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-yellow-300 to-orange-400 opacity-30 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8"
                    >
                        <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-8 ring-white shadow-2xl flex items-center justify-center text-white text-6xl font-black relative">
                            AJ
                            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg">
                                ✨
                            </div>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-bold mb-6 text-gray-900 drop-shadow-sm"
                    >
                        {demoData.username}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mt-8"
                    >
                        {content.about}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 mt-12"
                    >
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all flex items-center gap-2"
                        >
                            <FiMail className="w-5 h-5" />
                            Create Your Own Portfolio
                        </Link>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-20 px-6 space-y-32 relative">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-100/50 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl"></div>
                </div>

                {/* Skills */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl font-bold mb-16 text-center text-gray-900">Expertise</h2>
                    <div className="flex flex-wrap justify-center gap-5">
                        {content.skills.map((skill, index) => {
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

                {/* Experience */}
                <section>
                    <div className="flex items-center gap-4 mb-20">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <FiBriefcase className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-5xl font-bold text-gray-900">Experience</h2>
                        <div className="h-1 flex-1 rounded-full bg-gradient-to-r from-gray-200 to-transparent"></div>
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
                                className="group relative p-8 rounded-3xl transition-all duration-300 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-100/40 hover:shadow-2xl hover:shadow-indigo-200/50"
                            >
                                <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600"></div>

                                <div className="ml-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors">{exp.title}</h3>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-xl font-semibold text-indigo-600">{exp.company}</span>
                                                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100">
                                                    <FiCalendar className="inline w-3.5 h-3.5 mr-1.5" />
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-lg leading-relaxed text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section>
                    <h2 className="text-5xl font-bold mb-20 text-center text-gray-900">Featured Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {content.projects.map((project, index) => {
                            const gradients = [
                                'from-violet-600 via-purple-600 to-indigo-600',
                                'from-cyan-500 via-blue-500 to-indigo-600',
                                'from-pink-500 via-rose-500 to-red-500'
                            ];
                            const selectedGradient = gradients[index % gradients.length];

                            return (
                                <motion.div
                                    key={index}
                                    onClick={() => setSelectedProject(project)}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -12, scale: 1.02 }}
                                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                                    className="group flex flex-col h-full rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-100/40 hover:shadow-2xl hover:shadow-indigo-200/50"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <div className={`w-full h-full bg-gradient-to-br ${selectedGradient} relative overflow-hidden`}>
                                            <div className="absolute inset-0 opacity-20">
                                                <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl animate-float"></div>
                                                <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-float-delayed"></div>
                                                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-xl animate-pulse"></div>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-9xl font-black text-white opacity-30 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-700">
                                                    {project.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="absolute top-4 right-4 w-16 h-16 border-4 border-white/30 rounded-full group-hover:rotate-180 transition-transform duration-700"></div>
                                            <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-white/30 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                                        <div className="absolute bottom-5 left-5">
                                            <span className="bg-white/25 backdrop-blur-lg text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/40 shadow-lg group-hover:bg-white/35 transition-all">
                                                Click to View
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-indigo-500 transition-colors">{project.name}</h3>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Education & Credentials Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Education */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                                <FiBook className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900">Education</h3>
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
                                    className="group relative p-6 rounded-2xl transition-all bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-indigo-100/40 hover:shadow-xl overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-full"></div>

                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black shrink-0 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 border-2 border-emerald-200 shadow-md">
                                            {edu.school.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold mb-1 text-gray-900 group-hover:text-emerald-600 transition-colors">{edu.school}</h4>
                                            <p className="text-lg font-semibold mb-2 text-indigo-600">{edu.degree}</p>
                                            <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                                <FiCalendar className="w-3.5 h-3.5" />
                                                {edu.startDate} - {edu.endDate}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Certifications & Awards */}
                    <div className="space-y-12">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                                    <FiAward className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900">Certifications</h3>
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
                                        className="group flex items-center gap-4 p-5 rounded-xl transition-all bg-gradient-to-r from-blue-50/80 to-cyan-50/80 hover:from-blue-50 hover:to-cyan-50 border border-blue-100"
                                    >
                                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"></div>
                                        <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{cert}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg">
                                    <FiStar className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900">Awards</h3>
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
                                        className="group relative p-6 rounded-2xl flex items-center gap-5 transition-all overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300 shadow-md hover:shadow-xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                        <div className="text-4xl shrink-0 relative z-10">🏆</div>
                                        <span className="text-lg font-semibold relative z-10 text-gray-900 group-hover:text-yellow-700 transition-colors">{award}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center py-20"
                >
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Create Your Own?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                            Build a stunning portfolio like this in minutes. Upload your resume and let our AI do the rest.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            Get Started Free
                            <FiArrowLeft className="rotate-180" />
                        </Link>
                    </div>
                </motion.section>
            </main>

            {/* Project Modal */}
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
                        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl bg-white"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600">
                            <span className="absolute inset-0 flex items-center justify-center text-9xl font-black text-white opacity-20">{selectedProject.name.charAt(0)}</span>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8 sm:p-10 space-y-8">
                            <div>
                                <h3 className="text-4xl font-bold mb-2 text-gray-900">{selectedProject.name}</h3>
                                {selectedProject.url && (
                                    <a href={selectedProject.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-indigo-500 hover:text-indigo-600 font-medium">
                                        <FiExternalLink className="mr-2" /> Visit Live Project
                                    </a>
                                )}
                            </div>

                            <div className="prose max-w-none">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-600">
                                    {selectedProject.description}
                                </p>
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="px-6 py-3 rounded-xl font-bold transition-colors bg-gray-100 hover:bg-gray-200 text-gray-900"
                                >
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <footer className="py-12 mt-20 border-t border-gray-100 bg-white">
                <div className="text-center">
                    <p className="text-gray-600">&copy; {new Date().getFullYear()} Demo Portfolio. Built with Resume2Portfolio.</p>
                </div>
            </footer>
        </div>
    );
};

export default DemoPortfolio;
