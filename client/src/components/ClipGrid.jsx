import React, { useState, useCallback, useMemo } from 'react';
import { Download, RefreshCw, Play, Sparkles, Check, Square, CheckSquare, DownloadCloud } from 'lucide-react';
import AdBanner from './AdBanner';

export default function ClipGrid({ clips, onDownloadClip, onReset }) {
    const [selected, setSelected] = useState(new Set());

    // Create object URLs for client-side clips (Uint8Array)
    const clipUrls = useMemo(() => {
        return clips.map((clip) => {
            if (clip.url) return clip.url; // Server URL
            if (clip.data instanceof Uint8Array) {
                const blob = new Blob([clip.data], { type: 'video/mp4' });
                return URL.createObjectURL(blob);
            }
            return '';
        });
    }, [clips]);

    // Cleanup object URLs on unmount
    React.useEffect(() => {
        return () => {
            clipUrls.forEach((url) => {
                if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, [clipUrls]);

    const toggleSelect = useCallback((index) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    }, []);

    const toggleAll = useCallback(() => {
        if (selected.size === clips.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(clips.map((_, i) => i)));
        }
    }, [clips, selected.size]);

    const downloadSelected = useCallback(() => {
        selected.forEach((index) => {
            if (onDownloadClip) {
                onDownloadClip(clips[index]);
            }
        });
    }, [selected, clips, onDownloadClip]);

    const allSelected = selected.size === clips.length;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 animate-slide-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100">Your Clips</h2>
                            <p className="text-slate-500 text-sm">
                                {clips.length} clips ready
                                {selected.size > 0 && (
                                    <span className="text-indigo-400 ml-2">
                                        · {selected.size} selected
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Select all */}
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium border border-slate-700/50 hover:border-slate-600 text-sm"
                    >
                        {allSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                        ) : (
                            <Square className="w-4 h-4" />
                        )}
                        <span>{allSelected ? 'Deselect' : 'Select All'}</span>
                    </button>

                    {/* Download selected */}
                    {selected.size > 0 && (
                        <button
                            onClick={downloadSelected}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold text-sm shadow-lg shadow-indigo-500/25 active:scale-95"
                        >
                            <DownloadCloud className="w-4 h-4" />
                            <span>Download ({selected.size})</span>
                        </button>
                    )}

                    {/* Reset */}
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium border border-slate-700/50 hover:border-slate-600 group"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="hidden sm:inline">New Video</span>
                    </button>
                </div>
            </div>

            {/* Content: Clips + Sidebar Ad */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Clips grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {clips.map((clip, index) => {
                        const clipUrl = clipUrls[index];
                        const isSelected = selected.has(index);
                        return (
                            <div
                                key={index}
                                onClick={() => toggleSelect(index)}
                                className={`group relative bg-slate-900/60 rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                                    isSelected
                                        ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/30'
                                        : 'border-slate-800/50 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10'
                                }`}
                            >
                                {/* Video preview */}
                                <div className="aspect-[9/16] bg-slate-950 relative overflow-hidden">
                                    <video
                                        src={clipUrl}
                                        className="w-full h-full object-cover"
                                        preload="metadata"
                                        onMouseEnter={(e) => e.target.play()}
                                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Selection checkbox */}
                                    <div className={`absolute top-3 left-3 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                        isSelected
                                            ? 'bg-indigo-500 shadow-lg shadow-indigo-500/40'
                                            : 'bg-black/50 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100'
                                    }`}>
                                        {isSelected ? (
                                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                        ) : (
                                            <Square className="w-3.5 h-3.5 text-white/70" />
                                        )}
                                    </div>

                                    {/* Clip number */}
                                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-semibold text-white/90 border border-white/10">
                                        #{index + 1}
                                    </div>

                                    {/* Play indicator */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                                            <Play className="w-5 h-5 text-white ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-3.5 bg-slate-900/80 border-t border-slate-800/50">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-medium transition-colors ${
                                            isSelected ? 'text-indigo-300' : 'text-slate-400 group-hover:text-indigo-300'
                                        }`}>
                                            Clip #{index + 1}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onDownloadClip) onDownloadClip(clip);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md shadow-indigo-500/20 active:scale-95"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            <span>Save</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar Ad */}
                <div className="hidden lg:flex flex-col items-center gap-4 sticky top-8 self-start w-[300px] flex-shrink-0">
                    <AdBanner size="sidebar" />
                    <AdBanner size="inline" />
                </div>
            </div>
        </div>
    );
}
