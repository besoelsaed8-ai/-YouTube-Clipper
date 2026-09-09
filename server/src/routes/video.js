const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getVideoInfo, downloadVideo } = require('../services/downloader');
const { processVideo } = require('../services/processor');
const fs = require('fs-extra');

const router = express.Router();

// In-memory job store (Note: cleared on server restart)
const jobs = {};

router.post('/info', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const info = await getVideoInfo(url);
        res.json(info);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/process', async (req, res) => {
    try {
        const { url, duration, crop, outputDir, shortsOnly, quality } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const jobId = uuidv4();
        jobs[jobId] = { status: 'pending', progress: 0 };

        // Start processing in background
        (async () => {
            try {
                jobs[jobId].status = 'downloading';
                jobs[jobId].progress = 10;

                const videoPath = await downloadVideo(url, (percent) => {
                    jobs[jobId].progress = Math.floor(10 + (percent * 0.3));
                }, quality);

                jobs[jobId].status = 'processing';
                jobs[jobId].progress = 40;

                const clips = await processVideo(videoPath, {
                    duration,
                    crop: shortsOnly ? true : crop,
                    customOutputDir: outputDir
                });

                jobs[jobId].status = 'completed';
                jobs[jobId].progress = 100;
                jobs[jobId].clips = clips;

                await fs.remove(videoPath).catch(console.error);
            } catch (error) {
                console.error(`Job ${jobId} failed:`, error);
                jobs[jobId].status = 'failed';
                jobs[jobId].error = error.message;
            }
        })();

        res.json({ jobId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status/:id', (req, res) => {
    const job = jobs[req.params.id];
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
});

/**
 * Download-only endpoint: returns the video file for client-side processing.
 * Server only handles downloading via yt-dlp.
 * All CPU-heavy work (split, crop) happens in the browser with ffmpeg.wasm.
 */
router.post('/download', async (req, res) => {
    try {
        const { url, quality } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        console.log(`[API] Download request: ${url} (quality: ${quality || 'best'})`);

        const videoPath = await downloadVideo(url, null, quality || 'best');

        res.sendFile(videoPath, async (err) => {
            await fs.remove(videoPath).catch(console.error);
            if (err && !res.headersSent) {
                console.error('[API] Send error:', err);
                res.status(500).json({ error: 'Failed to send video file' });
            }
        });
    } catch (error) {
        console.error('[API] Download error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
