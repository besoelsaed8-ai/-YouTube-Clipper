import React from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProcessingStatus({ status, progress, error }) {
    const getStatusText = (s) => {
        switch (s) {
            case 'downloading': return 'Downloading original video...';
            case 'processing': return 'Splitting and cropping clips...';
            case 'completed': return 'Processing complete!';
            case 'failed': return 'Processing failed';
            default: return 'Initializing...';
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-10 text-center py-16 card">
            {status === 'failed' ? (
                <div className="text-red-400 space-y-6">
                    <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">Something went wrong</h2>
                        <p className="text-slate-400 mt-2 max-w-md mx-auto">{error}</p>
                    </div>
                </div>
            ) : status === 'completed' ? (
                <div className="text-emerald-400 space-y-6">
                    <div className="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold">All done!</h2>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="relative">
                        <div className="w-28 h-28 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                            <Loader2 className="w-12 h-12 text-indigo-500 animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-slate-100">{getStatusText(status)}</h2>
                        <p className="text-slate-400 text-lg font-medium">{progress}% Complete</p>
                    </div>

                    <div className="w-full max-w-lg mx-auto bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
