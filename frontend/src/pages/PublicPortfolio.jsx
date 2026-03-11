import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PortfolioService from '../services/portfolio.service';
import { getThemeStyles, themes } from '../utils/themeConfig';
import { FiSun, FiMoon } from 'react-icons/fi';
import StandardLayout from '../components/layouts/StandardLayout';
import BentoLayout from '../components/layouts/BentoLayout';
import SplitLayout from '../components/layouts/SplitLayout';

const PublicPortfolio = () => {
    const { username } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false); // Default to light

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
        <div className="flex justify-center items-center h-screen bg-white text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current"></div>
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
    const themeId = content.theme || 'modern';
    // Find theme definition to get layout preference
    const themeDef = themes.find(t => t.id === themeId) || themes[0];
    const layoutType = themeDef.layout || 'standard';

    // Get styles (shared across layouts)
    const styles = getThemeStyles(themeId, isDarkMode);

    const renderLayout = () => {
        const props = { portfolio, styles, isDarkMode };
        switch (layoutType) {
            case 'bento': return <BentoLayout {...props} />;
            case 'split': return <SplitLayout {...props} />;
            case 'standard':
            default: return <StandardLayout {...props} />;
        }
    };

    return (
        <>
            {/* Global Dark Mode Toggle (Absolute, High Z-Index) */}
            <button
                onClick={toggleTheme}
                className={`fixed top-4 right-4 z-[9999] p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                title="Toggle Dark Mode"
            >
                {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {renderLayout()}
        </>
    );
};

export default PublicPortfolio;
