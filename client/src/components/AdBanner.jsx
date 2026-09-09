import React from 'react';
import { Megaphone } from 'lucide-react';

/**
 * AdBanner component - reusable ad placeholder
 * 
 * Sizes: "banner" (728x90), "sidebar" (300x250), "inline" (fluid)
 * Replace the placeholder content with your actual ad code (Google AdSense, etc.)
 */
export default function AdBanner({ size = 'banner', className = '' }) {
    const dimensions = {
        banner: 'w-full max-w-[728px] h-[90px]',
        sidebar: 'w-full max-w-[300px] h-[250px]',
        inline: 'w-full max-w-[468px] h-[60px]',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${dimensions[size]} bg-slate-900/40 border border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-600 overflow-hidden relative`}
            >
                {/* 
                    ============================================
                    📌.Replace this placeholder with your ad code
                    
                    For Google AdSense:
                    - Remove everything inside this div
                    - Paste your AdSense <ins> tag here
                    
                    For other ad networks:
                    - Paste their script/tag here
                    
                    For affiliate links:
                    - Replace with your <a> tag and image
                    ============================================
                */}
                <Megaphone className="w-5 h-5 text-slate-600/50" />
                <span className="text-xs font-medium text-slate-600/50 uppercase tracking-wider">
                    Advertisement
                </span>
            </div>
        </div>
    );
}
