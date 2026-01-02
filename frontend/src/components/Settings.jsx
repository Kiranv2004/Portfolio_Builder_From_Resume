import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiLock, FiCreditCard, FiSave } from 'react-icons/fi';
import UserService from '../services/user.service';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Profile data
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        bio: '',
        username: ''
    });

    const tabs = [
        { id: 'account', label: 'Account', icon: FiUser },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'billing', label: 'Billing', icon: FiCreditCard },
    ];

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);

            // Try to get from backend first
            try {
                const response = await UserService.getUserProfile();
                setProfileData(response.data);
                setError('');
            } catch (backendError) {
                // Fallback to localStorage if backend is not available
                console.log("Backend not available, using localStorage data");
                const user = JSON.parse(localStorage.getItem('user'));
                if (user) {
                    setProfileData({
                        username: user.username || '',
                        email: user.email || '',
                        fullName: '',
                        bio: ''
                    });
                    setError('Note: Profile settings will be fully functional once the backend restarts.');
                } else {
                    throw new Error("No user data found");
                }
            }
        } catch (err) {
            console.error("Error loading profile:", err);
            const errorMsg = "Failed to load profile data. Please make sure you're logged in.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setMessage('');
            setError('');

            await UserService.updateUserProfile({
                fullName: profileData.fullName,
                email: profileData.email,
                bio: profileData.bio
            });

            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error("Error saving profile:", err);
            setError(err.response?.data || "Failed to update profile");
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-display font-bold text-slate-900">Settings</h2>
                <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-2xl p-4 text-green-700 font-medium"
                >
                    {message}
                </motion.div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-medium"
                >
                    {error}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Sidebar */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-md shadow-indigo-100'
                                    : 'text-slate-500 hover:bg-white/50 hover:text-indigo-600'
                                    }`}
                            >
                                <tab.icon className={`mr-3 w-5 h-5 ${activeTab === tab.id ? 'text-indigo-500' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Settings Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-3 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white/60"
                >
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Profile Information</h3>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                                            <input
                                                type="text"
                                                className="w-full input-field bg-slate-100 cursor-not-allowed"
                                                value={profileData.username}
                                                disabled
                                            />
                                            <p className="text-xs text-slate-400 mt-1">Username cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                className="w-full input-field"
                                                value={profileData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="w-full input-field"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                className="w-full input-field"
                                                rows="4"
                                                value={profileData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="btn-primary px-6 py-2.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiSave />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">Email Notifications</h3>
                            <div className="space-y-4">
                                {['Weekly Analytics Report', 'New Template Alerts', 'Account Activity', 'Design Tips & Tricks'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <span className="font-semibold text-slate-700">{item}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="text-slate-500 text-center py-12">
                            <FiLock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Security settings are managed by your auth provider.</p>
                        </div>
                    )}

                    {activeTab === 'billing' && (
                        <div className="text-slate-500 text-center py-12">
                            <FiCreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>You are currently on the <strong className="text-indigo-600">Free Forever</strong> plan.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Settings;
