import React, { useContext } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiUpload, FiLayout, FiLogOut, FiBarChart2, FiSettings, FiUser, FiArrowRight } from 'react-icons/fi';
import ResumeUpload from '../components/ResumeUpload';
import PortfolioEditor from '../components/PortfolioEditor';
import Analytics from '../components/Analytics';
import Settings from '../components/Settings';

const Dashboard = () => {
    const { logout, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: FiHome },
        { path: '/dashboard/upload', label: 'Upload Resume', icon: FiUpload },
        { path: '/dashboard/editor', label: 'Portfolio Editor', icon: FiLayout },
        { path: '/dashboard/analytics', label: 'Analytics', icon: FiBarChart2 },
        { path: '/dashboard/settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white flex overflow-hidden">
            {/* Optimized Background - Static Gradient avoiding heavy animated blurs */}
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-purple-100/50 opacity-70"></div>

            {/* Sidebar - Reduced blur radius for performance */}
            <aside className="w-80 h-screen fixed z-30 hidden lg:flex flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm">
                {/* Logo Area */}
                <div className="h-24 flex items-center px-8 border-b border-slate-200/50">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                            R
                        </div>
                        <span className="text-xl font-display font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                            Resume2Portfolio
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${isActive
                                        ? 'text-white shadow-md shadow-indigo-500/20'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 transition-colors'}`} />
                                <span className="font-semibold relative z-10 text-sm tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-slate-200/50">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {currentUser?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.username}</p>
                                <p className="text-xs text-slate-500 font-medium">Free Plan</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-all duration-300 border border-rose-100 hover:border-rose-500"
                        >
                            <FiLogOut className="w-3.5 h-3.5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - Added will-change-scroll for optimization */}
            <main className="flex-1 lg:ml-80 relative z-10 overflow-y-auto h-screen will-change-scroll">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <Routes>
                                <Route path="/" element={<DashboardOverview username={currentUser?.username} />} />
                                <Route path="/upload" element={<ResumeUpload />} />
                                <Route path="/editor" element={<PortfolioEditor />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/settings" element={<Settings />} />
                            </Routes>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

const DashboardOverview = ({ username }) => {
    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-slate-900">
                        Overview
                    </h1>
                    <p className="text-slate-500 mt-2">Welcome back to your creative control center.</p>
                </div>
                <span className="px-4 py-2 rounded-full bg-white text-slate-500 text-sm font-medium border border-slate-200 shadow-sm">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            {/* Hero Welcome Card - Reduced Box Shadow Complexity */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-500/20 group"
            >
                <div className="relative z-10 flex flex-col items-start gap-6 max-w-2xl">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-4"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            System Online
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
                            Hello, {username}!
                        </h2>
                        <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
                            Your professional journey deserves a stunning showcase.
                            Upload your resume now to auto-generate your personal website.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link to="/dashboard/upload" className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:bg-indigo-50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                            <FiUpload className="w-5 h-5" />
                            Upload New Resume
                        </Link>
                        <Link to="/dashboard/editor" className="px-8 py-4 bg-indigo-900/30 border border-white/20 text-white rounded-2xl font-bold hover:bg-indigo-900/50 transition-all duration-300 backdrop-blur-md">
                            Open Editor
                        </Link>
                    </div>
                </div>

                {/* Optimized Abstract Decorations - Static instead of animated blobbiness */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-105 transition-transform duration-700"></div>
                <div className="absolute bottom-0 right-20 -mb-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>

                {/* 3D-ish Element */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden xl:block">
                    <div className="w-64 h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl -rotate-6 shadow-2xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <FiBarChart2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold">1.2k</div>
                            <div className="text-xs text-indigo-200">Profile Views</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Grid - Removed heavy backdrop blurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Portfolio Editor',
                        desc: 'Customize theme, layout & content',
                        icon: FiLayout,
                        path: '/dashboard/editor',
                        color: 'text-blue-600',
                        bg: 'bg-blue-50 hover:bg-blue-100',
                        border: 'border-blue-100'
                    },
                    {
                        title: 'Analytics',
                        desc: 'View visitor stats & engagement',
                        icon: FiBarChart2,
                        path: '/dashboard/analytics',
                        color: 'text-purple-600',
                        bg: 'bg-purple-50 hover:bg-purple-100',
                        border: 'border-purple-100'
                    },
                    {
                        title: 'Account Settings',
                        desc: 'Manage profile & subscription',
                        icon: FiSettings,
                        path: '/dashboard/settings',
                        color: 'text-orange-600',
                        bg: 'bg-orange-50 hover:bg-orange-100',
                        border: 'border-orange-100'
                    },
                ].map((item, i) => (
                    <Link
                        key={i}
                        to={item.path}
                        className={`group p-8 rounded-[2rem] border ${item.border} bg-white shadow-lg shadow-slate-200/30 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
                    >
                        <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 transition-colors`}>
                            <item.icon className={`w-7 h-7 ${item.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-500 leading-relaxed mb-6">{item.desc}</p>

                        <div className="flex items-center text-sm font-bold text-slate-900 group-hover:gap-2 transition-all">
                            Open <FiArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
