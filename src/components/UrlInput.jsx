import React, { useState } from 'react';
import { Search, Loader2, Zap } from 'lucide-react';
import { getVideoInfo } from '../api/api';

export default function UrlInput({ onVideoFound }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [forceShorts, setForceShorts] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic YouTube URL validation
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
        <div className="w-full max-w-2xl mx-auto space-y-12 py-10">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                    YouTube Clipper
                </h1>
                <p className="text-slate-400 text-lg font-light">
                    Convert long videos into vertical shorts automatically
                </p>
            </div>

            <div className="card backdrop-blur-xl border-slate-800/60 shadow-2xl shadow-indigo-500/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste long video link here..."
                            className="input-field pl-14 text-lg py-4 group-hover:border-slate-600 transition-colors"
                            disabled={loading}
                        />
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-500 w-6 h-6 group-focus-within:text-indigo-400 transition-colors" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-slate-200">Convert to Vertical (Shorts)</div>
                                <div className="text-xs text-slate-500">Auto-crop and split into segments</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForceShorts(!forceShorts)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${forceShorts ? 'bg-indigo-600' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${forceShorts ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Analyzing Video...</span>
                            </>
                        ) : (
                            <span>Continue</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
