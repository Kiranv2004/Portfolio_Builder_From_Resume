import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiCheck, FiLayout, FiShare2, FiCpu, FiGithub, FiLinkedin, FiFileText, FiGlobe } from 'react-icons/fi';

const LandingPage = () => {
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-500 selection:text-white">

            {/* Mesh Gradient Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400 blur-[120px] mix-blend-multiply animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-400 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">R</div>
                        <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                            Resume2Portfolio
                        </span>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/login" className="hidden md:block text-slate-600 hover:text-slate-900 font-medium transition-colors">
                            Sign In
                        </Link>
                        <Link to="/register" className="btn-primary py-2.5 px-6 text-sm shadow-md">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* Hero Content */}
                        <motion.div
                            className="lg:w-1/2 text-center lg:text-left"
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                AI-Powered Resume Parsing
                            </motion.div>

                            <motion.h1 variants={fadeInUp} className="hero-title text-slate-900">
                                Transform your <br />
                                <span className="font-serif italic text-slate-400">Resume</span> into a <br />
                                <span className="gradient-text">Stunning Portfolio.</span>
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Stop sending static PDFs. Upload your resume and instantly get a personal website that highlights your skills, experience, and projects.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link to="/register" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group">
                                    Create My Portfolio <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/demo" className="btn-secondary w-full sm:w-auto">
                                    View Demo
                                </Link>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-400">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                            User
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm font-medium">
                                    <span className="text-slate-900 font-bold">2,000+</span> professionals joined
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Hero Visual */}
                        <motion.div
                            className="lg:w-1/2 relative perspective-1000"
                            initial={{ opacity: 0, x: 50, rotateY: -10 }}
                            animate={{ opacity: 1, x: 0, rotateY: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ opacity, scale }}
                        >
                            <div className="relative w-full max-w-lg mx-auto">
                                {/* Abstract Shapes */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

                                {/* Main Glass Card Mockup */}
                                <div className="glass-panel p-3 animate-float transition-all duration-500 hover:scale-[1.02]">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 ring-1 ring-slate-900/5">
                                        {/* Mockup Header */}
                                        <div className="h-10 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 flex items-center px-5 gap-2.5">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-inner"></div>
                                                <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-inner"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-inner"></div>
                                            </div>
                                            <div className="flex-1 text-center flex justify-center">
                                                <div className="w-48 h-5 bg-white rounded-md shadow-sm border border-slate-100 flex items-center justify-center">
                                                    <div className="w-24 h-1.5 bg-slate-200 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mockup Body */}
                                        <div className="p-8 space-y-8 bg-gradient-to-b from-white to-slate-50/50">
                                            <div className="flex gap-8 items-center">
                                                <div className="w-24 h-24 rounded-full bg-slate-200 shrink-0 shadow-inner ring-4 ring-white relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-slate-100 opacity-50"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-slate-300/30"></div>
                                                </div>
                                                <div className="space-y-4 flex-1">
                                                    <div className="h-8 w-3/4 bg-slate-800 rounded-lg opacity-80 shadow-sm"></div>
                                                    <div className="h-5 w-1/2 bg-indigo-500 rounded-lg opacity-30 shadow-sm"></div>
                                                    <div className="flex gap-3 pt-2">
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 shadow-sm border border-slate-200"></div>
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 shadow-sm border border-slate-200"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full opacity-50"></div>
                                                <div className="flex justify-between items-center relative z-10">
                                                    <div className="h-6 w-1/3 bg-slate-700/80 rounded-md"></div>
                                                    <div className="h-5 w-16 bg-slate-200 rounded-md"></div>
                                                </div>
                                                <div className="h-3 w-full bg-slate-200 rounded opacity-60"></div>
                                                <div className="h-3 w-5/6 bg-slate-200 rounded opacity-60"></div>
                                                <div className="h-3 w-4/6 bg-slate-200 rounded opacity-60"></div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="h-32 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm"></div>
                                                <div className="h-32 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Conversion Elements */}
                                <div className="absolute top-1/2 -right-12 -translate-y-1/2 bg-white rounded-2xl p-4 shadow-xl shadow-indigo-500/10 border border-slate-100 animate-float-delayed z-20 hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <FiCheck />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-medium">Status</div>
                                            <div className="text-sm font-bold text-slate-800">Portfolio Live</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-xl shadow-purple-500/10 border border-slate-100 animate-float z-20 hidden md:block">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <FiFileText />
                                        </div>
                                        <FiArrowRight className="text-slate-300" />
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <FiGlobe />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it Works / Features */}
            <section id="how-it-works" className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">Features</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mt-2 mb-4 text-slate-900">
                            From Resume to Website in <span className="gradient-text">Minutes</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg hover:text-slate-800 transition-colors">
                            We use advanced AI to extract your details and build a professional site automatically.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <FiCpu className="w-6 h-6" />,
                                title: "AI-Powered Parsing",
                                desc: "Upload your PDF resume. Our smart algorithms extract work history, skills, and projects with high accuracy."
                            },
                            {
                                icon: <FiLayout className="w-6 h-6" />,
                                title: "Premium Themes",
                                desc: "Switch between professional, creative, and dark themes instantly. No CSS knowledge required."
                            },
                            {
                                icon: <FiShare2 className="w-6 h-6" />,
                                title: "Instant Hosting",
                                desc: "Get a unique URL like resume2portfolio.com/p/yourname immediately. Ready to share on LinkedIn."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="glass-card p-8 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 clip-path-slant z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90 z-0"></div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
                        Ready to stand out?
                    </h2>
                    <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of developers and professionals who have already upgraded their online presence.
                    </p>
                    <Link to="/register" className="inline-block bg-white text-indigo-900 font-bold py-4 px-10 rounded-full shadow-2xl hover:bg-indigo-50 hover:scale-105 transition-all duration-300">
                        Get Started for Free
                    </Link>
                    <p className="mt-6 text-sm text-indigo-200 opacity-70">
                        No credit card required · Free to try
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">R</div>
                        <span className="text-lg font-bold font-display text-slate-900">Resume2Portfolio</span>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><FiGithub className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><FiLinkedin className="w-5 h-5" /></a>
                    </div>

                    <div className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} Resume2Portfolio.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
