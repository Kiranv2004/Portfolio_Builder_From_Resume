import React, { useState } from 'react';
import ResumeService from '../services/resume.service';
import PortfolioService from '../services/portfolio.service';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiFileText, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ResumeUpload = () => {
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const navigate = useNavigate();

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
            setSelectedFile(e.dataTransfer.files[0]);
        }
    };

    const selectFile = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const upload = async () => {
        if (!selectedFile) {
            setMessage("Please select a file first!");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const response = await ResumeService.uploadResume(selectedFile);
            // Auto generate portfolio
            await PortfolioService.generatePortfolio(response.data.id);
            navigate('/dashboard/editor');
        } catch (error) {
            setMessage("Could not upload the file! Please try again.");
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-display">Upload Resume</h2>
                <p className="mt-2 text-gray-500">We support PDF and DOCX formats</p>
            </div>

            <div className="card">
                <div
                    className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={selectFile}
                        accept=".pdf,.docx,.doc"
                    />

                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                            {selectedFile ? <FiCheck className="w-8 h-8" /> : <FiUploadCloud className="w-8 h-8" />}
                        </div>

                        <div className="space-y-1">
                            <p className="text-lg font-medium text-gray-900">
                                {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX up to 10MB'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={upload}
                        disabled={!selectedFile || uploading}
                        className={`w-full btn-primary py-3 flex items-center justify-center ${(!selectedFile || uploading) && 'opacity-50 cursor-not-allowed'}`}
                    >
                        {uploading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            'Generate Portfolio'
                        )}
                    </button>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center"
                    >
                        {message}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ResumeUpload;
