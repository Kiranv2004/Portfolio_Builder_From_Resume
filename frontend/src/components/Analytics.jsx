import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FiTrendingUp, FiUsers, FiClock, FiGlobe } from 'react-icons/fi';
import AnalyticsService from '../services/analytics.service';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const response = await AnalyticsService.getAnalyticsSummary();
            setAnalyticsData(response.data);
            setError(null);
        } catch (err) {
            console.error("Error loading analytics:", err);
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={loadAnalytics}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!analyticsData) {
        return null;
    }

    // Transform daily views data for chart
    const viewsData = Object.entries(analyticsData.dailyViews || {}).map(([name, views]) => ({
        name,
        views
    }));

    // Transform traffic sources data for chart
    const trafficSourceData = Object.entries(analyticsData.trafficSources || {}).map(([name, value]) => ({
        name,
        value
    }));

    // Calculate metrics
    const totalViews = analyticsData.totalViews || 0;
    const uniqueVisitors = analyticsData.uniqueVisitors || 0;
    const viewsChange = analyticsData.viewsChange || "+0%";

    // Calculate average time (placeholder - would need backend tracking)
    const avgTime = "2m 15s";

    // Calculate bounce rate (placeholder - would need backend tracking)
    const bounceRate = uniqueVisitors > 0 ? ((totalViews - uniqueVisitors) / totalViews * 100).toFixed(1) + "%" : "0%";

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900">Analytics</h2>
                    <p className="text-slate-500 text-sm mt-1">Track your portfolio's performance</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last Month</option>
                    </select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Views', value: totalViews.toLocaleString(), change: viewsChange, icon: FiTrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Unique Visitors', value: uniqueVisitors.toLocaleString(), change: '+5%', icon: FiUsers, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Avg. Time', value: avgTime, change: '-2%', icon: FiClock, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Bounce Rate', value: bounceRate, change: '+1%', icon: FiGlobe, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-white/60 shadow-lg shadow-slate-200/50"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Views Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Views Overview (Last 7 Days)</h3>
                    {viewsData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={viewsData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                            <p>No view data available yet</p>
                        </div>
                    )}
                </motion.div>

                {/* Traffic Sources */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Traffic Sources</h3>
                    {trafficSourceData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trafficSourceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" axisLine={false} tickLine={false} hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px' }} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-slate-400">
                            <p>No traffic data available yet</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
