import { FiLayout, FiMoon, FiSun, FiMonitor, FiCpu, FiFeather, FiBox, FiGrid, FiCoffee, FiTrendingUp, FiBriefcase } from 'react-icons/fi';

// Theme Metadata
export const themes = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean, professional, and balanced. The default choice.',
        color: 'bg-indigo-600',
        icon: FiLayout,
        layout: 'standard'
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple, typography-focused, and elegant.',
        color: 'bg-gray-800',
        icon: FiFeather,
        layout: 'split'
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Bold gradients and unique layout for creatives.',
        color: 'bg-purple-600',
        icon: FiTrendingUp,
        layout: 'bento'
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Serif fonts, slate colors, trustworthy.',
        color: 'bg-slate-700',
        icon: FiBriefcase,
        layout: 'standard'
    },
    {
        id: 'nature',
        name: 'Nature',
        description: 'Earth tones, calming and organic.',
        color: 'bg-emerald-600',
        icon: FiSun,
        layout: 'split'
    },
    {
        id: 'saas',
        name: 'SaaS',
        description: 'Polished, tech-focused, startup aesthetic.',
        color: 'bg-blue-600',
        icon: FiMonitor, // Replaced FiGlobe which is not imported, using FiMonitor
        layout: 'standard'
    },
    {
        id: 'cyber',
        name: 'Cyber',
        description: 'Dark, neon accents, futuristic.',
        color: 'bg-pink-600',
        icon: FiCpu,
        layout: 'bento'
    },
    {
        id: 'neobrutal',
        name: 'Neo-Brutalist',
        description: 'High contrast, bold borders, unpolished vibe.',
        color: 'bg-yellow-400',
        icon: FiBox,
        layout: 'bento'
    },
    {
        id: 'swiss',
        name: 'Swiss',
        description: 'Grid-based, strong typography, minimalist.',
        color: 'bg-red-600',
        icon: FiGrid,
        layout: 'bento'
    },
    {
        id: 'lofi',
        name: 'LoFi',
        description: 'Cozy, soft pastel tones, relaxed.',
        color: 'bg-orange-300',
        icon: FiCoffee,
        layout: 'standard'
    }
];

// Helper to generate styles based on theme and dark mode
export const getThemeStyles = (themeId, isDarkMode) => {
    // 1. Common Base Styles (Defaults)
    const base = {
        font: "font-sans",
        bg: isDarkMode ? "bg-slate-900" : "bg-slate-50",
        text: isDarkMode ? "text-slate-100" : "text-slate-900",
        subtext: isDarkMode ? "text-slate-400" : "text-slate-500",
        card: isDarkMode ? "bg-slate-800/50 backdrop-blur-md border border-slate-700/50" : "bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50",
        button: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/50",
        accent: "text-indigo-600",
        headerGradient: isDarkMode ? "from-slate-900 via-indigo-950 to-slate-900" : "from-indigo-50 via-white to-blue-50",
        tag: isDarkMode ? "bg-indigo-900/50 text-indigo-300 border-indigo-700" : "bg-indigo-50 text-indigo-700 border-indigo-100",
        progress: "bg-indigo-600",
        iconBox: isDarkMode ? "bg-slate-800 text-indigo-400" : "bg-white text-indigo-600 shadow-sm",
    };

    // 2. Theme Specific Overrides
    switch (themeId) {
        case 'minimal':
            return {
                ...base,
                font: "font-sans tracking-tight",
                bg: isDarkMode ? "bg-neutral-950" : "bg-white",
                text: isDarkMode ? "text-neutral-200" : "text-neutral-900",
                subtext: isDarkMode ? "text-neutral-500" : "text-neutral-500",
                card: isDarkMode ? "border-b border-neutral-800 bg-transparent" : "border-b border-neutral-100 bg-transparent py-6",
                button: isDarkMode ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-300" : "bg-neutral-900 text-white hover:bg-neutral-700",
                headerGradient: isDarkMode ? "from-neutral-950 to-neutral-900" : "from-white to-neutral-50",
                accent: isDarkMode ? "text-white" : "text-black",
                tag: isDarkMode ? "bg-neutral-900 text-neutral-300 border-neutral-800" : "bg-neutral-100 text-neutral-700 border-neutral-200",
                iconBox: isDarkMode ? "bg-neutral-900 text-white border border-neutral-800" : "bg-neutral-50 text-black border border-neutral-200"
            };

        case 'nature':
            return {
                ...base,
                font: "font-sans",
                bg: isDarkMode ? "bg-stone-900" : "bg-stone-50",
                text: isDarkMode ? "text-stone-100" : "text-stone-800",
                subtext: isDarkMode ? "text-stone-400" : "text-stone-500",
                accent: "text-emerald-600",
                button: "bg-emerald-700 text-white hover:bg-emerald-800 ring-2 ring-emerald-100/20",
                card: isDarkMode ? "bg-stone-800/60 border-stone-700/50" : "bg-white/60 border-stone-200/50 shadow-sm",
                headerGradient: isDarkMode ? "from-stone-900 to-emerald-950/20" : "from-stone-50 to-emerald-50/30",
                tag: isDarkMode ? "bg-emerald-900/30 text-emerald-300 border-emerald-800" : "bg-emerald-50 text-emerald-700 border-emerald-100",
                iconBox: isDarkMode ? "bg-stone-800 text-emerald-400" : "bg-emerald-50 text-emerald-700"
            };

        case 'creative':
            return {
                ...base,
                font: "font-display",
                bg: isDarkMode ? "bg-purple-950" : "bg-white",
                headerGradient: isDarkMode ? "from-gray-900 via-purple-900 to-gray-900" : "from-purple-50 via-pink-50 to-white",
                accent: "text-pink-500",
                button: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 transition-transform",
                card: isDarkMode ? "bg-gray-900/40 backdrop-blur-xl border border-white/10" : "bg-white/40 backdrop-blur-3xl border border-white/50 shadow-xl shadow-purple-200/30",
                tag: isDarkMode ? "bg-purple-900/50 text-pink-300 border-pink-700" : "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-100",
                iconBox: "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
            };

        case 'professional':
            return {
                ...base,
                font: "font-serif",
                bg: isDarkMode ? "bg-slate-900" : "bg-slate-50",
                card: isDarkMode ? "bg-slate-800 border-l-4 border-l-slate-500 border-y border-r border-slate-700" : "bg-white border-l-4 border-l-slate-600 shadow-md border-y border-r border-slate-200",
                button: isDarkMode ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-800 text-white hover:bg-slate-900",
                accent: isDarkMode ? "text-slate-300" : "text-slate-700",
                headerGradient: isDarkMode ? "from-slate-900 to-slate-800" : "from-slate-100 to-slate-200",
                tag: "bg-slate-200 text-slate-700 rounded-sm font-sans"
            };

        case 'saas':
            return {
                ...base,
                font: "font-sans tracking-snug",
                bg: isDarkMode ? "bg-slate-900" : "bg-white",
                headerGradient: isDarkMode ? "from-blue-950 via-slate-900 to-slate-900" : "from-blue-50 via-white to-white",
                accent: "text-blue-600",
                button: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 rounded-lg",
                card: isDarkMode ? "bg-slate-800 border border-slate-700 shadow-none" : "bg-white border border-slate-200 shadow-xl shadow-slate-200/40",
                tag: isDarkMode ? "bg-blue-900/30 text-blue-300 border border-blue-800 rounded-md" : "bg-blue-50 text-blue-700 border border-blue-100 rounded-md",
                iconBox: isDarkMode ? "bg-blue-500/10 text-blue-400 rounded-lg" : "bg-blue-50 text-blue-600 rounded-lg"
            };

        case 'cyber':
            return {
                ...base,
                font: "font-mono",
                bg: "bg-black",
                text: "text-cyan-50",
                subtext: "text-cyan-200/70",
                card: "bg-black border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden",
                button: "bg-cyan-950 text-cyan-400 border border-cyan-500 hover:bg-cyan-900 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-widest text-xs font-bold",
                accent: "text-pink-500", // Contrast accent
                headerGradient: "from-black via-slate-900 to-black",
                tag: "bg-black border border-pink-500 text-pink-400 uppercase text-[10px] tracking-wider",
                iconBox: "bg-cyan-950 border border-cyan-500 text-cyan-400",
                progress: "bg-gradient-to-r from-cyan-500 to-pink-500"
            };

        case 'neobrutal':
            return {
                ...base,
                font: "font-display",
                bg: isDarkMode ? "bg-neutral-900" : "bg-yellow-100",
                text: isDarkMode ? "text-yellow-400" : "text-black",
                subtext: isDarkMode ? "text-yellow-200/80" : "text-gray-800",
                card: isDarkMode ? "bg-gray-800 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_#FACC15]" : "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                button: isDarkMode ? "bg-pink-500 text-black font-bold border-2 border-yellow-400 shadow-[4px_4px_0px_0px_#FACC15] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#FACC15] transition-all"
                    : "bg-[#FF5D5D] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all",
                accent: isDarkMode ? "text-pink-400" : "text-blue-700",
                headerGradient: isDarkMode ? "from-gray-900 to-gray-800" : "from-yellow-100 to-pink-100",
                tag: isDarkMode ? "bg-black text-yellow-400 border-2 border-yellow-400 font-bold" : "bg-white text-black border-2 border-black font-bold",
                iconBox: isDarkMode ? "bg-black border-2 border-yellow-400 text-yellow-400" : "bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            };

        case 'swiss':
            return {
                ...base,
                font: "font-sans tracking-tight",
                bg: isDarkMode ? "bg-neutral-900" : "bg-neutral-100",
                card: isDarkMode ? "bg-neutral-800 border-t-4 border-red-600" : "bg-white border-t-4 border-red-600 p-8 shadow-sm",
                button: "bg-red-600 text-white font-bold hover:bg-neutral-900 transition-colors rounded-none",
                accent: "text-red-600",
                headerGradient: isDarkMode ? "from-neutral-900 to-neutral-800" : "from-neutral-100 to-white",
                tag: "bg-transparent border border-red-600 text-red-600 text-xs font-bold uppercase rounded-none px-2 py-1",
                iconBox: "bg-red-600 text-white rounded-none",
                subtext: isDarkMode ? "text-neutral-400 font-medium" : "text-neutral-500 font-medium"
            };

        case 'lofi':
            return {
                ...base,
                font: "font-serif", // Or a rounded sans if available, using serif for cozy feel
                bg: isDarkMode ? "bg-stone-900" : "bg-[#FDF6E3]", // Solarized light-ish background
                text: isDarkMode ? "text-[#E0E0E0]" : "text-[#586E75]",
                subtext: isDarkMode ? "text-[#9E9E9E]" : "text-[#93A1A1]",
                card: isDarkMode ? "bg-stone-800 rounded-[2rem] border-none shadow-inner" : "bg-[#EEE8D5] rounded-[2rem] border-none shadow-inner",
                button: isDarkMode ? "bg-[#D33682] text-white rounded-xl shadow-sm hover:opacity-90" : "bg-[#2AA198] text-white rounded-xl shadow-sm hover:opacity-90",
                accent: isDarkMode ? "text-[#2AA198]" : "text-[#D33682]",
                headerGradient: isDarkMode ? "from-stone-900 to-stone-800" : "from-[#FDF6E3] to-[#EEE8D5]",
                tag: isDarkMode ? "bg-stone-700 text-[#2AA198] rounded-full px-4" : "bg-white/50 text-[#D33682] rounded-full px-4",
                iconBox: isDarkMode ? "bg-stone-700 text-[#2AA198] rounded-2xl" : "bg-white text-[#CB4B16] rounded-2xl"
            };

        default: // modern
            return base;
    }
};
