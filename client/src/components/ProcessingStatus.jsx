import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Download, Scissors, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProcessingStatus({ status, progress, error }) {
    const getStatusText = (s) => {
        switch (s) {
            case 'downloading': return 'Downloading video...';
            case 'processing': return 'Creating clips...';
            case 'completed': return 'All done!';
            case 'failed': return 'Something went wrong';
            default: return 'Preparing...';
        }
    };

    const getStatusIcon = (s) => {
        switch (s) {
            case 'downloading': return Download;
            case 'processing': return Scissors;
            case 'completed': return CheckCircle;
            case 'failed': return AlertCircle;
            default: return Loader2;
        }
    };

    const steps = [
        { key: 'pending', label: 'Initializing', icon: Loader2 },
        { key: 'downloading', label: 'Downloading', icon: Download },
        { key: 'processing', label: 'Processing', icon: Scissors },
        { key: 'completed', label: 'Done', icon: CheckCircle },
    ];

    const stepOrder = ['pending', 'downloading', 'processing', 'completed'];
    const currentIdx = stepOrder.indexOf(status);

    if (status === 'failed') {
        return (
            <div className="w-full max-w-lg mx-auto space-y-8 text-center py-12 card animate-slide-up">
                <div className="text-red-400 space-y-5">
                    <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 rotate-3">
                        <AlertCircle className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Processing Failed</h2>
                        <p className="text-slate-400 mt-2 text-sm max-w-sm mx-auto leading-relaxed">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'completed') {
        return (
            <div className="w-full max-w-lg mx-auto space-y-8 text-center py-12 card animate-slide-up">
                <div className="text-emerald-400 space-y-5">
                    <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">All Done!</h2>
                        <p className="text-slate-400 mt-1 text-sm">Your clips are ready to download</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto space-y-10 text-center py-12 card animate-slide-up">
            <div className="space-y-8">
                {/* Animated spinner */}
                <div className="relative">
                    <div className="w-24 h-24 mx-auto relative">
                        <div className="absolute inset-0 rounded-2xl border-[3px] border-indigo-500/10" />
                        <div className="absolute inset-0 rounded-2xl border-[3px] border-transparent border-t-indigo-500 animate-spin" />
                        <div className="absolute inset-3 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            {React.createElement(getStatusIcon(status), {
                                className: "w-8 h-8 text-indigo-400 animate-pulse"
                            })}
                        </div>
                    </div>
                </div>

                {/* Status text */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-100">{getStatusText(status)}</h2>
                    <p className="text-slate-400 text-base font-medium">{Math.round(progress)}%</p>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs mx-auto bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-1.5 pt-2">
                    {steps.map((s, i) => {
                        const isActive = i === currentIdx;
                        const isDone = i < currentIdx;
                        return (
                            <div
                                key={s.key}
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    isActive ? 'w-8 bg-indigo-500' : isDone ? 'w-4 bg-emerald-500/60' : 'w-4 bg-slate-700/50'
                                }`}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
