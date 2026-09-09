import React, { useState, useEffect } from 'react';
import { Search, Loader2, Zap, ArrowRight, Film, Scissors, Sparkles } from 'lucide-react';
import { getVideoInfo } from '../api/api';
import SeoContent from './SeoContent';

export default function UrlInput({ onVideoFound }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forceShorts, setForceShorts] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
        if (!regex.test(url)) {
            setError('Please enter a valid YouTube URL');
            return;
        }

        setLoading(true);
        try {
            const info = await getVideoInfo(url);
            onVideoFound(url, { ...info, shortsOnly: forceShorts });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch video info');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-10 py-8">
            {/* Hero title */}
            <div className={`text-center space-y-5 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Free &amp; Open Source
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                        YouTube
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Clipper
                    </span>
                </h1>
                <p className="text-slate-400 text-lg font-light max-w-md mx-auto leading-relaxed">
                    Paste a video link → get vertical short clips in seconds
                </p>
            </div>

            {/* Feature pills */}
            <div className={`flex flex-wrap items-center justify-center gap-3 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {[
                    { icon: Film, text: 'Download' },
                    { icon: Scissors, text: 'Split' },
                    { icon: Zap, text: 'Crop 9:16' },
                ].map(({ icon: Icon, text }, i) => (
                    <div key={text} className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-sm text-slate-400">
                        <Icon className="w-4 h-4 text-indigo-400" />
                        {text}
                    </div>
                ))}
            </div>

            {/* Main card */}
            <div className={`card pulse-glow transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* URL input */}
                    <div className="relative group">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste YouTube link here..."
                            className="input-field pl-14 text-base py-4 rounded-2xl"
                            disabled={loading}
                        />
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                        {url && !loading && (
                            <button
                                type="button"
                                onClick={() => { setUrl(''); setError(''); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Shorts toggle */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl text-indigo-400">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-slate-200">Vertical Shorts Mode</div>
                                <div className="text-xs text-slate-500">Auto-crop to 9:16 aspect ratio</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForceShorts(!forceShorts)}
                            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${forceShorts ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${forceShorts ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex items-center gap-3 animate-slide-up">
                            <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="btn-primary w-full flex items-center justify-center gap-3 text-base py-4 rounded-2xl"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Analyzing Video...</span>
                            </>
                        ) : (
                            <>
                                <span>Analyze Video</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* SEO Content Sections */}
            <div className="max-w-5xl mx-auto">
                <SeoContent />
            </div>
        </div>
    );
}
