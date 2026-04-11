import React, { useState, useEffect } from 'react';
import UrlInput from './components/UrlInput';
import Settings from './components/Settings';
import ProcessingStatus from './components/ProcessingStatus';
import ClipGrid from './components/ClipGrid';
import { processVideo, getJobStatus } from './api/api';

function App() {
  const [step, setStep] = useState('input'); // input, settings, processing, results
  const [videoInfo, setVideoInfo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState({ status: 'pending', progress: 0 });
  const [clips, setClips] = useState([]);

  useEffect(() => {
    let interval;
    if (step === 'processing' && jobId) {
      interval = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId);
          setJobStatus(status);

          if (status.status === 'completed') {
            setClips(status.clips);
            setStep('results');
            clearInterval(interval);
          } else if (status.status === 'failed') {
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error polling status:', error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, jobId]);

  const handleVideoFound = (url, info) => {
    setVideoUrl(url);
    setVideoInfo(info);
    setStep('settings');
  };

  const handleStartProcessing = async (duration, crop, outputDir, shortsOnly) => {
    try {
      setStep('processing');
      const { jobId } = await processVideo(videoUrl, duration, crop, outputDir, shortsOnly);
      setJobId(jobId);
    } catch (error) {
      console.error('Error starting processing:', error);
      setStep('settings');
    }
  };

  const handleReset = () => {
    setStep('input');
    setVideoInfo(null);
    setVideoUrl('');
    setJobId(null);
    setClips([]);
    setJobStatus({ status: 'pending', progress: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-screen">
        {step === 'input' && (
          <UrlInput onVideoFound={handleVideoFound} />
        )}

        {step === 'settings' && videoInfo && (
          <Settings
            videoInfo={videoInfo}
            onStartProcessing={handleStartProcessing}
          />
        )}

        {step === 'processing' && (
          <ProcessingStatus
            status={jobStatus.status}
            progress={jobStatus.progress}
            error={jobStatus.error}
          />
        )}

        {step === 'results' && (
          <ClipGrid clips={clips} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

export default App;
