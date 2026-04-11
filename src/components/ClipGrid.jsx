import React from 'react';
import { Download, Play, RefreshCw, LayoutGrid } from 'lucide-react';

export default function ClipGrid({ clips, onReset }) {
    const SERVER_URL = 'http://localhost:3000';

    return (
        <div className="w-full max-w-7xl mx-auto space-y-10 pb-16">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                        <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Your Clips</h2>
                        <p className="text-slate-400 text-sm">{clips.length} generated segments ready for download</p>
                    </div>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl transition-all font-medium border border-slate-700"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Process New Video</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {clips.map((clip, index) => {
                    const clipUrl = `${SERVER_URL}/downloads/${clip}`;
                    return (
                        <div key={index} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
                            <div className="aspect-[9/16] bg-slate-950 relative overflow-hidden">
                                <video
                                    src={clipUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4 bg-slate-900 border-t border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">Clip #{index + 1}</span>
                                    <a
                                        href={clipUrl}
                                        download
                                        className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                                        title="Download Clip"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
