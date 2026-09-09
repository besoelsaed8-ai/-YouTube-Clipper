import React, { useState, useRef } from 'react';
import UrlInput from './components/UrlInput';
import Settings from './components/Settings';
import ProcessingStatus from './components/ProcessingStatus';
import ClipGrid from './components/ClipGrid';
import VideoAd from './components/VideoAd';
import { downloadVideoFile } from './api/api';
import { processVideoClient, downloadClip } from './api/clientProcessor';
import { Scissors } from 'lucide-react';
import AdBanner from './components/AdBanner';

// ══════════════════════════════════════════════
// 📌 CONFIGURATION — Change these to your ad URLs
// ══════════════════════════════════════════════
const ADS = {
    // Video ad shown BEFORE processing starts
    preProcess: {
        videoUrl: '', // ← Paste your ad video URL here
        duration: 5,  // seconds before skip is allowed
    },
    // Video ad shown AFTER processing completes
    postProcess: {
        videoUrl: '', // ← Paste your ad video URL here
        duration: 5,
    },
};
// ══════════════════════════════════════════════

function App() {
  const [step, setStep] = useState('input');
  const [videoInfo, setVideoInfo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [jobStatus, setJobStatus] = useState({ status: 'pending', progress: 0 });
  const [clips, setClips] = useState([]);
  const [pendingSettings, setPendingSettings] = useState(null);
  const abortRef = useRef(false);

  const handleVideoFound = (url, info) => {
    setVideoUrl(url);
    setVideoInfo(info);
    setStep('settings');
  };

  // User clicks "Start Processing" → show pre-process ad first
  const handleStartProcessing = (duration, crop, outputDir, shortsOnly, quality) => {
    setPendingSettings({ duration, crop, outputDir, shortsOnly, quality });
    setStep('ad-pre');
  };

  // Pre-process ad finished → start actual processing
  const handleAdPreComplete = async () => {
    if (!pendingSettings) return;
    const { duration, crop, outputDir, shortsOnly, quality } = pendingSettings;

    setStep('processing');
    abortRef.current = false;

    try {
      // Step 1: Download from server
      setJobStatus({ status: 'downloading', progress: 0, error: null });

      const videoBlob = await downloadVideoFile(videoUrl, quality || 'best', (percent) => {
        setJobStatus(prev => ({ ...prev, progress: Math.floor(percent * 0.4) }));
      });

      if (abortRef.current) return;

      // Step 2: Process in browser with ffmpeg.wasm
      setJobStatus({ status: 'processing', progress: 40, error: null });

      const processedClips = await processVideoClient(videoBlob, {
        duration,
        crop: shortsOnly ? true : crop,
        onProgress: (percent) => {
          setJobStatus(prev => ({ ...prev, progress: Math.floor(40 + percent * 0.6) }));
        },
        onLog: (msg) => console.log('[Client]', msg),
      });

      if (abortRef.current) return;

      // Step 3: Processing done → show post-process ad
      setClips(processedClips);
      setJobStatus({ status: 'completed', progress: 100, error: null });
      setStep('ad-post');

    } catch (error) {
      console.error('Processing error:', error);
      setJobStatus({ status: 'failed', progress: 0, error: error.message });
    }
  };

  // Post-process ad finished → show results
  const handleAdPostComplete = () => {
    setStep('results');
  };

  const handleDownloadClip = (clip) => {
    downloadClip(clip.data, clip.name);
  };

  const handleReset = () => {
    abortRef.current = true;
    setStep('input');
    setVideoInfo(null);
    setVideoUrl('');
    setClips([]);
    setPendingSettings(null);
    setJobStatus({ status: 'pending', progress: 0 });
  };

  const steps = [
    { key: 'input', label: 'URL' },
    { key: 'settings', label: 'Settings' },
    { key: 'processing', label: 'Processing' },
    { key: 'results', label: 'Results' },
  ];

  const stepOrder = ['input', 'settings', 'processing', 'results'];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-animated relative">
      {/* Animated glow orbs */}
      <div className="glow-orb w-96 h-96 bg-indigo-600 top-[-10%] left-[-5%]" style={{ animationDelay: '0s' }} />
      <div className="glow-orb w-80 h-80 bg-purple-600 bottom-[-10%] right-[-5%]" style={{ animationDelay: '-7s' }} />
      <div className="glow-orb w-64 h-64 bg-blue-600 top-[40%] right-[10%]" style={{ animationDelay: '-14s' }} />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a2e15_1px,transparent_1px),linear-gradient(to_bottom,#1a1a2e15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
        {/* Top Ad Banner */}
        <AdBanner size="banner" className="mb-4" />

        {/* Header */}
        <header className="flex items-center justify-center gap-3 py-4 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20">
            <Scissors className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="text-lg font-bold text-slate-200 tracking-tight">YouTube Clipper</span>
        </header>

        {/* Step indicator */}
        {step !== 'input' && !step.startsWith('ad-') && (
          <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
            {steps.map((s, i) => (
              <React.Fragment key={s.key}>
                <div className="flex items-center gap-2">
                  <div className={`step-dot ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'inactive'}`} />
                  <span className={`text-xs font-medium ${i <= currentIdx ? 'text-slate-300' : 'text-slate-600'}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px ${i < currentIdx ? 'bg-emerald-500/50' : 'bg-slate-700/50'} transition-colors duration-500`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* ── Input Step ── */}
            {step === 'input' && (
              <UrlInput onVideoFound={handleVideoFound} />
            )}

            {/* ── Settings Step ── */}
            {step === 'settings' && videoInfo && (
              <Settings
                videoInfo={videoInfo}
                onStartProcessing={handleStartProcessing}
                onBack={() => setStep('input')}
              />
            )}

            {/* ── Pre-Process Ad ── */}
            {step === 'ad-pre' && (
              <VideoAd
                videoUrl={ADS.preProcess.videoUrl}
                duration={ADS.preProcess.duration}
                onComplete={handleAdPreComplete}
                adLabel="Sponsored"
              />
            )}

            {/* ── Processing Step ── */}
            {step === 'processing' && (
              <ProcessingStatus
                status={jobStatus.status}
                progress={jobStatus.progress}
                error={jobStatus.error}
              />
            )}

            {/* ── Post-Process Ad ── */}
            {step === 'ad-post' && (
              <VideoAd
                videoUrl={ADS.postProcess.videoUrl}
                duration={ADS.postProcess.duration}
                onComplete={handleAdPostComplete}
                adLabel="Sponsored"
              />
            )}

            {/* ── Results Step ── */}
            {step === 'results' && (
              <ClipGrid clips={clips} onDownloadClip={handleDownloadClip} onReset={handleReset} />
            )}
          </div>
        </main>

        {/* Bottom Ad Banner */}
        <AdBanner size="banner" className="mt-auto pt-4" />

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-slate-600 text-xs">
            Free &amp; open source · Powered by yt-dlp &amp; FFmpeg
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
