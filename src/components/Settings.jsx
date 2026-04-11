import React, { useState } from 'react';
import { Clock, Crop, ArrowRight, Play, FolderOpen } from 'lucide-react';

export default function Settings({ videoInfo, onStartProcessing }) {
    const [duration, setDuration] = useState(30);
    const [crop, setCrop] = useState(videoInfo.shortsOnly || true);
    const [outputDir, setOutputDir] = useState('');

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            <div className="card space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex gap-6 items-start">
                    <div className="relative group">
                        <img
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            className="w-40 h-28 object-cover rounded-xl shadow-lg ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all rounded-xl" />
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                        <h3 className="text-xl font-semibold text-slate-100 leading-snug line-clamp-2" title={videoInfo.title}>
                            {videoInfo.title}
                        </h3>
                        <p className="text-indigo-400 text-sm mt-2 font-medium bg-indigo-500/10 inline-block px-3 py-1 rounded-full">
                            {videoInfo.duration}s
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" /> Save To (Server Path)
                        </label>
                        <input
                            type="text"
                            value={outputDir}
                            onChange={(e) => setOutputDir(e.target.value)}
                            placeholder="Leave empty for default server output folder..."
                            className="input-field w-full"
                        />
                        <p className="text-[10px] text-slate-500 mt-2 px-1">
                            * Files will be saved on the server at this absolute path if provided.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Clip Duration
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {[30, 45, 60].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 border ${duration === d
                                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                                            : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    {d}s
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                            <Crop className="w-4 h-4" /> Output Format
                        </label>

                        <button
                            onClick={() => setCrop(!crop)}
                            disabled={videoInfo.shortsOnly}
                            className={`w-full p-5 rounded-xl border transition-all duration-300 flex items-center justify-between group ${crop
                                    ? 'border-indigo-500/50 bg-indigo-500/10'
                                    : 'border-slate-800 bg-slate-800/30 hover:bg-slate-800/50'
                                } ${videoInfo.shortsOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-16 rounded-lg border-2 transition-colors ${crop ? 'border-indigo-400 bg-indigo-500/10' : 'border-slate-600 bg-slate-800'} flex items-center justify-center`}>
                                    <Play className={`w-4 h-4 ${crop ? 'text-indigo-400' : 'text-slate-500'}`} />
                                </div>
                                <div className="text-left">
                                    <div className={`font-medium text-lg ${crop ? 'text-indigo-400' : 'text-slate-300'} group-hover:text-indigo-300 transition-colors`}>
                                        Youtube Shorts (9:16)
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {videoInfo.shortsOnly ? 'Locked for Shorts mode' : 'Optimized for TikTok, Reels, and Shorts'}
                                    </div>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${crop ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                                }`}>
                                {crop && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
                            </div>
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => onStartProcessing(duration, crop, outputDir, videoInfo.shortsOnly)}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-lg"
                >
                    <span>Start Processing</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
