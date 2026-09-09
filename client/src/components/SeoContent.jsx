import React from 'react';
import { Scissors, Download, Crop, Zap, Clock, Smartphone, Film, ArrowRight, Check, ChevronDown, ChevronUp } from 'lucide-react';
import AdBanner from './AdBanner';

/* ─── Feature Card ─── */
function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <div className="p-6 bg-slate-900/40 border border-slate-800/40 rounded-2xl hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

/* ─── Step Card ─── */
function StepCard({ num, title, desc }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                {num}
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a }) {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="border border-slate-800/40 rounded-2xl overflow-hidden bg-slate-900/30">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/20 transition-colors"
            >
                <span className="text-sm font-semibold text-slate-200 pr-4">{q}</span>
                {open ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/30 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}

/* ─── Main SEO Content Component ─── */
export default function SeoContent() {
    const features = [
        { icon: Download, title: 'Download Any YouTube Video', desc: 'Paste any YouTube link and download it in high quality up to 1080p. Works with shorts, live streams, and regular videos.' },
        { icon: Scissors, title: 'Auto-Split into Clips', desc: 'Automatically divide long videos into 30s, 45s, or 60s clips — perfect for TikTok, Instagram Reels, and YouTube Shorts.' },
        { icon: Crop, title: 'Vertical Crop (9:16)', desc: 'One-click crop to vertical format optimized for mobile. No manual editing needed — AI handles the framing.' },
        { icon: Zap, title: 'Instant Processing', desc: 'Fast server-side processing with real-time progress. Most videos process in under a minute.' },
        { icon: Clock, title: 'Choose Clip Duration', desc: 'Pick 30s, 45s, or 60s segments. The tool calculates how many clips you\'ll get before processing.' },
        { icon: Smartphone, title: 'Works on Mobile & Desktop', desc: 'Fully responsive web app — works in any browser on any device. No app install required.' },
    ];

    const faqs = [
        {
            q: 'Is YouTube Clipper really free?',
            a: 'Yes! YouTube Clipper is 100% free and open source. There are no hidden fees, no premium plans, and no watermarks on your clips. You can even self-host it on your own server.'
        },
        {
            q: 'Do I need to install any software?',
            a: 'No. YouTube Clipper runs entirely in your web browser. Just paste a YouTube link and start clipping. No downloads, no installations, no sign-ups.'
        },
        {
            q: 'What video formats are supported?',
            a: 'YouTube Clipper supports all YouTube video formats. It downloads in MP4 (H.264) and processes clips in MP4 as well, which is compatible with all social media platforms.'
        },
        {
            q: 'Can I use the clips on TikTok, Instagram Reels, and YouTube Shorts?',
            a: 'Absolutely! The 9:16 vertical crop is specifically optimized for TikTok, Instagram Reels, YouTube Shorts, and Facebook Reels. Just download and upload.'
        },
        {
            q: 'How long does it take to process a video?',
            a: 'Most videos process in 30-60 seconds depending on length and quality. You can see real-time progress in the app while it works.'
        },
        {
            q: 'Is there a limit on video length?',
            a: 'No limit! YouTube Clipper can handle videos of any length. A 10-hour video will just produce more clips. We recommend keeping individual uploads under 2 hours for best results.'
        },
        {
            q: 'Does this work with private or unlisted videos?',
            a: 'It works with any publicly accessible YouTube video. Private and unlisted videos require YouTube authentication which is not currently supported.'
        },
        {
            q: 'Can I self-host YouTube Clipper?',
            a: 'Yes! YouTube Clipper is open source. You can deploy it on your own server using Docker. Check the GitHub repository for deployment instructions.'
        },
    ];

    return (
        <div className="space-y-20 py-16">
            {/* ═══ Features Section ═══ */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-3">
                        Everything You Need to Create{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Viral Shorts</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Download, split, and crop YouTube videos into perfect vertical clips — all in one free tool.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <FeatureCard key={f.title} {...f} />
                    ))}
                </div>
            </section>

            {/* Ad between sections */}
            <AdBanner size="banner" />

            {/* ═══ How It Works Section ═══ */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-3">
                        How It{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Works</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Three simple steps to turn any YouTube video into scroll-stopping vertical clips.
                    </p>
                </div>
                <div className="max-w-2xl mx-auto space-y-8">
                    <StepCard num={1} title="Paste Your YouTube Link" desc="Copy any YouTube video URL and paste it into the input field. The tool will automatically fetch the video details and thumbnail." />
                    <StepCard num={2} title="Choose Your Settings" desc="Select clip duration (30s, 45s, or 60s), toggle vertical crop for 9:16 format, and set your preferred output location." />
                    <StepCard num={3} title="Download Your Clips" desc="Preview all generated clips, select the ones you like, and download them individually or all at once. Ready to upload!" />
                </div>
            </section>

            {/* ═══ Use Cases Section ═══ */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-3">
                        Perfect For{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Content Creators</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { emoji: '📱', title: 'TikTok Creators', desc: 'Turn long videos into viral TikToks' },
                        { emoji: '📸', title: 'Instagram Reels', desc: 'Create engaging Reels from any video' },
                        { emoji: '▶️', title: 'YouTube Shorts', desc: 'Repurpose content for Shorts' },
                        { emoji: '🎵', title: 'Music Channels', desc: 'Clip song highlights and moments' },
                    ].map((c) => (
                        <div key={c.title} className="p-5 bg-slate-900/40 border border-slate-800/40 rounded-2xl text-center hover:border-indigo-500/30 transition-all">
                            <div className="text-3xl mb-3">{c.emoji}</div>
                            <h3 className="text-sm font-bold text-slate-200 mb-1">{c.title}</h3>
                            <p className="text-xs text-slate-500">{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══ FAQ Section ═══ */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-3">
                        Frequently Asked{' '}
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Questions</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Everything you need to know about YouTube Clipper.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq) => (
                        <FaqItem key={faq.q} {...faq} />
                    ))}
                </div>
            </section>

            {/* ═══ Final CTA ═══ */}
            <section className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium mb-4">
                    <Film className="w-3.5 h-3.5" />
                    Start Creating Now
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-3">
                    Ready to Make Your First{' '}
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Short?</span>
                </h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                    No signup. No watermarks. No limits. Just paste a link and go.
                </p>
                <a
                    href="#top"
                    className="inline-flex items-center gap-2 btn-primary px-8 py-4 text-base rounded-2xl"
                >
                    <span>Paste a YouTube Link</span>
                    <ArrowRight className="w-5 h-5" />
                </a>
            </section>
        </div>
    );
}
