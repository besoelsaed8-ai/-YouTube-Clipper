import React, { useState } from 'react';
import { Clock, Crop, ArrowRight, Play, FolderOpen, ArrowLeft, Check, Video, Gem } from 'lucide-react';

export default function Settings({ videoInfo, onStartProcessing, onBack }) {
    const [duration, setDuration] = useState(30);
    const [crop, setCrop] = useState(videoInfo.shortsOnly || true);
    const [outputDir, setOutputDir] = useState('');
    const [quality, setQuality] = useState('best');

    const qualities = [
        { value: 'best', label: 'Best', desc: 'Highest available' },
        { value: '2160', label: '4K', desc: '2160p' },
        { value: '1080', label: '1080p', desc: 'Full HD' },
        { value: '720', label: '720p', desc: 'HD' },
        { value: '480', label: '480p', desc: 'SD' },
    ];

    const formatDuration = (s) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
            </button>

            <div className="card space-y-8 animate-slide-up">
                {/* Video preview */}
                <div className="flex gap-5 items-start">
                    <div className="relative group flex-shrink-0">
                        <img
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            className="w-44 h-28 object-cover rounded-2xl shadow-xl ring-1 ring-white/10 group-hover:ring-indigo-500/40 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white/90">
                            <Clock className="w-3 h-3" />
                            {formatDuration(videoInfo.duration)}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                        <h3 className="text-lg font-semibold text-slate-100 leading-snug line-clamp-2" title={videoInfo.title}>
                            {videoInfo.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                {videoInfo.duration}s total
                            </span>
                            <span className="text-xs text-slate-500">
                                → ~{Math.floor(videoInfo.duration / duration)} clips
                            </span>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                    {/* Output dir */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" /> Save To (Server Path)
                        </label>
                        <input
                            type="text"
                            value={outputDir}
                            onChange={(e) => setOutputDir(e.target.value)}
                            placeholder="Default: server output folder"
                            className="input-field w-full rounded-xl"
                        />
                        <p className="text-[11px] text-slate-600 mt-2 px-1">
                            Leave empty for default location
                        </p>
                    </div>

                    {/* Clip duration */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Clip Duration
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[30, 45, 60].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 border text-center ${
                                        duration === d
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                                            : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-300'
                                    }`}
                                >
                                    <div className="text-lg">{d}s</div>
                                    <div className="text-[10px] opacity-60 mt-0.5">~{Math.floor(videoInfo.duration / d)} clips</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Crop format */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                            <Crop className="w-4 h-4" /> Output Format
                        </label>

                        <button
                            onClick={() => setCrop(!crop)}
                            disabled={videoInfo.shortsOnly}
                            className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                                crop
                                    ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-500/10 to-purple-500/10'
                                    : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
                            } ${videoInfo.shortsOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-[60px] rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                                    crop ? 'border-indigo-400 bg-indigo-500/10 shadow-inner' : 'border-slate-600 bg-slate-800'
                                }`}>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${crop ? 'bg-indigo-400' : 'bg-slate-500'}`} />
                                        <div className={`w-4 h-1 rounded-full ${crop ? 'bg-indigo-400/50' : 'bg-slate-500/50'}`} />
                                        <div className={`w-4 h-1 rounded-full ${crop ? 'bg-indigo-400/50' : 'bg-slate-500/50'}`} />
                                        <div className={`w-3 h-1 rounded-full ${crop ? 'bg-indigo-400/50' : 'bg-slate-500/50'}`} />
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className={`font-semibold text-base ${crop ? 'text-indigo-300' : 'text-slate-300'} transition-colors`}>
                                        YouTube Shorts (9:16)
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {videoInfo.shortsOnly ? 'Auto-enabled for Shorts' : 'Optimized for TikTok, Reels & Shorts'}
                                    </div>
                                </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                crop ? 'border-indigo-500 bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-slate-600'
                            }`}>
                                {crop && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Quality selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                            <Gem className="w-4 h-4" /> Video Quality
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {qualities.map((q) => (
                                <button
                                    key={q.value}
                                    onClick={() => setQuality(q.value)}
                                    className={`py-3 px-2 rounded-xl font-semibold transition-all duration-300 border text-center ${
                                        quality === q.value
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-500/50 shadow-lg shadow-indigo-500/20'
                                            : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-300'
                                    }`}
                                >
                                    <div className="text-sm font-bold">{q.label}</div>
                                    <div className="text-[10px] opacity-60 mt-0.5">{q.desc}</div>
                                </button>
                            ))}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-2 px-1">
                            {quality === 'best' ? 'Downloads the highest quality available from YouTube' : `Caps download at ${qualities.find(q => q.value === quality)?.label || quality} resolution`}
                        </p>
                    </div>

                {/* Start button */}
                <button
                    onClick={() => onStartProcessing(duration, crop, outputDir, videoInfo.shortsOnly, quality)}
                    className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base rounded-2xl"
                >
                    <Play className="w-5 h-5" />
                    <span>Start Processing</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
