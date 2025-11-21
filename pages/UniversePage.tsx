import React, { useState, useRef } from 'react';
import StarryBackground, { StarryBackgroundHandle } from '../components/StarryBackground';
import HeroSection from '../components/HeroSection';
import BlogModal from '../components/BlogModal';
import { BlogPost } from '../types';

const UniversePage: React.FC = () => {
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
    const [clusterMode, setClusterMode] = useState<'none' | 'category' | 'date'>('date');
    const [menuOpen, setMenuOpen] = useState(false);
    const backgroundRef = useRef<StarryBackgroundHandle>(null);

    const handleStarClick = (blog: BlogPost) => {
        setSelectedBlog(blog);
    };

    const handleCloseModal = () => {
        setSelectedBlog(null);
    };

    return (
        <main className="relative w-screen h-screen bg-slate-950 text-white overflow-hidden">

            {/* Layer 1: Background and Interactive Stars */}
            <StarryBackground ref={backgroundRef} onStarClick={handleStarClick} clusterMode={clusterMode} />

            {/* Layer 2: Hero Content (Title & Quote) */}
            {/* We hide the hero content slightly or blur it when a modal is open for focus */}
            <div className={`transition-all duration-500 ${selectedBlog ? 'blur-sm scale-95 opacity-50' : 'blur-0 scale-100 opacity-100'}`}>
                <HeroSection />
            </div>

            {/* Layer 3: Modal Overlay */}
            <BlogModal blog={selectedBlog} onClose={handleCloseModal} />

            <div className="fixed top-4 right-4 z-50 pointer-events-auto flex flex-col items-end">
                <button
                    aria-label="Menu"
                    className={`group relative p-3 rounded-full bg-slate-900/50 border border-white/10 text-white/70 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-slate-800/60 hover:text-white hover:scale-110 hover:shadow-purple-500/20 ${menuOpen ? 'rotate-90 bg-slate-800' : ''}`}
                    onClick={() => setMenuOpen(v => !v)}
                >
                    <div className="flex flex-col gap-1.5 items-center justify-center w-6 h-6">
                        <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>

                <div className={`mt-4 w-72 p-5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500 origin-top-right transform ${menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-white tracking-wide">Control Center</h3>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    </div>

                    <div className="space-y-5">
                        {/* View Controls */}
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Navigation</label>
                            <button
                                onClick={() => {
                                    backgroundRef.current?.resetView();
                                    setMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-white/5 text-slate-200 hover:bg-slate-700/50 hover:border-purple-500/30 transition-all group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Reset View</span>
                            </button>
                        </div>

                        {/* Cluster Mode */}
                        <div>
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Constellation Mode</label>
                            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-800/50 border border-white/5">
                                {[
                                    { id: 'none', label: 'Free' },
                                    { id: 'category', label: 'Topic' },
                                    { id: 'date', label: 'Time' }
                                ].map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setClusterMode(mode.id as any)}
                                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${clusterMode === mode.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
                                    >
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Extra Actions */}
                        <div className="pt-4 border-t border-white/5 flex gap-2">
                            <button className="flex-1 py-2 rounded-lg bg-slate-800/30 border border-white/5 text-xs text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                                About
                            </button>
                            <button className="flex-1 py-2 rounded-lg bg-slate-800/30 border border-white/5 text-xs text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors">
                                Music
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
};

export default UniversePage;
