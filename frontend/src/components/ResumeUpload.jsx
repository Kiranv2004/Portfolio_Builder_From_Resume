import React, { useState, useRef, useEffect } from 'react';
import ResumeService from '../services/resume.service';
import PortfolioService from '../services/portfolio.service';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiCheck, FiX, FiFileText, FiCpu, FiLayout, FiClock, FiShield, FiCode, FiDatabase, FiServer } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeUpload = () => {
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, success, error
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [logLines, setLogLines] = useState([]);

    // More technical/detailed simulated logs for "Pro" feel
    const detailedLogs = [
        "Initializing secure upload channel...",
        "Handshaking with server [TLS 1.3]...",
        "Uploading document stream...",
        "Stream upload complete. Verifying checksum...",
        "Packet integrity verified.",
        "Initializing AI Parsing Engine (v2.4.0)...",
        "Loading NLP models [en_US]...",
        "Extracting text content from unstructured data...",
        "Identifying Applicant Name and Contact Info...",
        "Parsing Work History entities...",
        "Linking skills to industry taxonomy...",
        "Detecting project descriptions...",
        "Normalizing dates and locations...",
        "Generating semantic knowledge graph...",
        "Selecting optimal portfolio template...",
        "Hydrating components with user data...",
        "Optimizing assets for web performance...",
        "Finalizing build...",
        "Deployment ready."
    ];

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSelectFile(e.dataTransfer.files[0]);
        }
    };

    const validateAndSelectFile = (file) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
        if (file && validTypes.includes(file.type)) {
            setSelectedFile(file);
            setUploadState('idle');
            setErrorMessage("");
        } else {
            setSelectedFile(undefined);
            setErrorMessage("Please upload a PDF or DOCX file (Max 10MB)");
        }
    };

    const runSimulation = () => {
        let logIndex = 0;
        const totalDuration = 6000; // 6 seconds total simulation
        const intervalTime = totalDuration / detailedLogs.length;

        const interval = setInterval(() => {
            if (logIndex >= detailedLogs.length) {
                clearInterval(interval);
                return;
            }

            setLogLines(prev => [...prev.slice(-6), detailedLogs[logIndex]]); // Keep last 7 lines
            setProgress(Math.min(100, Math.round(((logIndex + 1) / detailedLogs.length) * 100)));
            logIndex++;
        }, intervalTime);

        return interval;
    };

    const upload = async () => {
        if (!selectedFile) return;

        setUploadState('uploading');
        setLogLines([]);
        const simInterval = runSimulation();

        try {
            // Actual API Calls
            // Start actual upload
            const response = await ResumeService.uploadResume(selectedFile);

            // Wait for minimal simulation time to ensure user sees the "cool" effects
            await new Promise(r => setTimeout(r, 4000));

            await PortfolioService.generatePortfolio(response.data.id);

            clearInterval(simInterval);
            setProgress(100);
            setUploadState('success');

            setTimeout(() => {
                navigate('/dashboard/editor');
            }, 1200);

        } catch (error) {
            clearInterval(simInterval);
            setUploadState('error');
            setErrorMessage("Processing failed. Please try a different file.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl z-10"
            >
                {/* Header - Only visible when not processing to reduce clutter */}
                <AnimatePresence>
                    {uploadState === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">
                                Transform your Resume
                            </h1>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                AI-powered extraction. Professional design. Instant portfolio.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Card */}
                <div className="relative group perspective-1000">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white/60 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">

                        {/* Glass Shine Effect */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

                        <div className="flex-1 flex flex-col relative">
                            {uploadState === 'uploading' || uploadState === 'success' ? (
                                /* PRO ANALYSIS UI */
                                <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
                                    {/* Grid Background for Technical Feel */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                                    <div className="z-10 w-full max-w-2xl">
                                        <div className="flex flex-col items-center mb-10">
                                            {/* Central Hub Animation */}
                                            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                                                {/* Spinning Rings */}
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-0 border-2 border-dashed border-indigo-200 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-2 border-2 border-dotted border-purple-200 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ scale: [1, 1.1, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="absolute inset-0 bg-indigo-50/50 rounded-full blur-xl"
                                                />

                                                {/* Central Icon */}
                                                <AnimatePresence mode="wait">
                                                    {uploadState === 'success' ? (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-200"
                                                        >
                                                            <FiCheck className="w-8 h-8" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            className="bg-white p-4 rounded-full shadow-lg border border-indigo-100 text-indigo-600 relative z-10"
                                                        >
                                                            <FiCpu className="w-8 h-8 animate-pulse" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Status Text with Glitch/Typewriter effect potential */}
                                            <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">
                                                {uploadState === 'success' ? 'Ready to Launch' : 'Analyzing Document'}
                                            </h2>
                                            <div className="h-1 w-full bg-slate-100 rounded-full max-w-xs overflow-hidden mb-2">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <p className="text-slate-400 font-mono text-sm">{progress}% Complete</p>
                                        </div>

                                        {/* Terminal Log Output */}
                                        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 font-mono text-xs md:text-sm relative">
                                            {/* Terminal Header */}
                                            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                                </div>
                                                <span className="ml-2 text-slate-400 text-[10px] uppercase tracking-wider">Analysis Console</span>
                                            </div>

                                            {/* Log Content */}
                                            <div className="p-4 h-48 overflow-hidden relative">
                                                <div className="space-y-1.5 font-mono">
                                                    {logLines.map((line, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="flex items-start gap-2 text-indigo-200/90"
                                                        >
                                                            <span className="text-green-400 shrink-0">➜</span>
                                                            <span className="break-all">{line}</span>
                                                        </motion.div>
                                                    ))}
                                                    <motion.div
                                                        animate={{ opacity: [0, 1, 0] }}
                                                        transition={{ duration: 0.8, repeat: Infinity }}
                                                        className="w-2 h-4 bg-green-400 inline-block align-middle ml-2"
                                                    />
                                                </div>
                                                {/* Scanline Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-4 animate-scan pointer-events-none"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* INITIAL UI */
                                <div className="flex-1 grid lg:grid-cols-2">
                                    {/* Left: Upload Zone */}
                                    <div className="p-8 md:p-12 flex flex-col justify-center space-y-8">
                                        <div
                                            className={`relative border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 group/drop ${dragActive
                                                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                                                    : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                                                } ${errorMessage ? 'border-red-300 bg-red-50/30' : ''}`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={(e) => validateAndSelectFile(e.target.files[0])}
                                                accept=".pdf,.docx"
                                                className="hidden"
                                            />

                                            <div className="flex flex-col items-center text-center space-y-6">
                                                <div className={`w-24 h-24 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${selectedFile ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300 rotate-[-3deg]' : 'bg-slate-100 text-slate-400 group-hover/drop:bg-indigo-50 group-hover/drop:text-indigo-500 group-hover/drop:scale-110'
                                                    }`}>
                                                    {selectedFile ? <FiFileText className="w-10 h-10" /> : <FiUploadCloud className="w-10 h-10" />}
                                                </div>

                                                <div className="space-y-2">
                                                    {selectedFile ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4 max-w-[280px] mx-auto text-left"
                                                        >
                                                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0 text-xl font-bold">PDF</div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-sm text-slate-900 truncate">{selectedFile.name}</p>
                                                                <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setSelectedFile(undefined); }}
                                                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <FiX />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <>
                                                            <h3 className="text-2xl font-display font-bold text-slate-900">
                                                                Drop resume here
                                                            </h3>
                                                            <p className="text-slate-500 max-w-[200px] mx-auto">
                                                                Support for PDF & DOCX up to 10MB
                                                            </p>
                                                        </>
                                                    )}
                                                </div>

                                                {!selectedFile && (
                                                    <span className="inline-flex py-2.5 px-6 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-600 shadow-sm group-hover/drop:shadow-md hover:text-indigo-600 transition-all">
                                                        Browse Files
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {errorMessage && (
                                            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100 animate-shake">
                                                {errorMessage}
                                            </div>
                                        )}

                                        <button
                                            onClick={upload}
                                            disabled={!selectedFile}
                                            className={`w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${selectedFile
                                                    ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.01] hover:shadow-2xl'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            <FiCpu className={selectedFile ? "animate-pulse" : ""} />
                                            <span>Generate Portfolio</span>
                                            {selectedFile && <FiCheck />}
                                        </button>
                                    </div>

                                    {/* Right: Info/Decor */}
                                    <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-50/50 border-l border-white/50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                                        <div className="relative z-10 space-y-8">
                                            <h3 className="text-xl font-bold text-slate-900 font-display">
                                                AI Processing Pipeline
                                            </h3>

                                            <div className="space-y-6">
                                                {[
                                                    {
                                                        icon: FiCode,
                                                        title: "Entity Extraction",
                                                        desc: "Identifies skills, roles, and technologies."
                                                    },
                                                    {
                                                        icon: FiLayout,
                                                        title: "Layout Engine",
                                                        desc: "Maps content to responsive portfolio templates."
                                                    },
                                                    {
                                                        icon: FiServer,
                                                        title: "Instant Deployment",
                                                        desc: "Allocates cloud resources for your live site."
                                                    }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                            <item.icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                                            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="pt-8 border-t border-slate-200">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-3">
                                                        {[1, 2, 3, 4].map(i => (
                                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm relative overflow-hidden">
                                                                <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-slate-900 font-bold">2,400+</span>
                                                            <span className="text-amber-500">★★★★★</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500">Portfolios generated this week</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ResumeUpload;
