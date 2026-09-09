import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

/**
 * VideoAd component — shows a skippable video ad between steps
 * 
 * Props:
 * - videoUrl: URL of the ad video (or use placeholder)
 * - duration: how many seconds before skip is allowed (default 5)
 * - onComplete: callback when ad finishes or is skipped
 * - adLabel: text label for the ad
 */
export default function VideoAd({
    videoUrl = '',
    duration = 5,
    onComplete,
    adLabel = 'Advertisement',
}) {
    const [countdown, setCountdown] = useState(duration);
    const [canSkip, setCanSkip] = useState(false);
    const [muted, setMuted] = useState(true);
    const [adEnded, setAdEnded] = useState(false);
    const videoRef = useRef(null);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) {
            setCanSkip(true);
            return;
        }
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSkip = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onComplete();
    };

    const handleVideoEnd = () => {
        setAdEnded(true);
        onComplete();
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-slide-up">
            {/* Ad container */}
            <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800/50 shadow-2xl">
                {/* Ad label */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10">
                    <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">{adLabel}</span>
                </div>

                {/* Mute toggle */}
                <button
                    onClick={() => {
                        setMuted(!muted);
                        if (videoRef.current) videoRef.current.muted = !muted;
                    }}
                    className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-black/80 transition-colors"
                >
                    {muted ? (
                        <VolumeX className="w-4 h-4 text-white/60" />
                    ) : (
                        <Volume2 className="w-4 h-4 text-white" />
                    )}
                </button>

                {/* Video */}
                {videoUrl ? (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        className="w-full aspect-video object-cover"
                        autoPlay
                        muted={muted}
                        playsInline
                        onEnded={handleVideoEnd}
                    />
                ) : (
                    /* Placeholder ad - animated gradient */
                    <div className="w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/20 animate-pulse">
                                <span className="text-3xl">📺</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-300">Your Ad Here</p>
                                <p className="text-xs text-slate-500 mt-1">Replace with your video ad</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4 pt-8">
                    <div className="flex items-center justify-between">
                        {/* Skip button */}
                        {canSkip ? (
                            <button
                                onClick={handleSkip}
                                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white text-sm font-medium transition-all active:scale-95"
                            >
                                <SkipForward className="w-4 h-4" />
                                Skip Ad
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-xs text-white/50">Skip in {countdown}s</span>
                                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white/40 rounded-full transition-all duration-1000"
                                        style={{ width: `${((duration - countdown) / duration) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Learn more */}
                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all active:scale-95"
                        >
                            Learn More →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
