const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const FFMPEG_PATH = process.env.FFMPEG_PATH || '';
const FFPROBE_PATH = process.env.FFPROBE_PATH || '';

ffmpeg.setFfmpegPath(FFMPEG_PATH);
ffmpeg.setFfprobePath(FFPROBE_PATH);

const OUTPUT_DIR = path.join(__dirname, '../../output');

/**
 * Process video: crop and split
 * @param {string} inputPath 
 * @param {object} options { duration, crop, customOutputDir }
 * @returns {Promise<string[]>} array of generated clip paths (relative to output dir)
 */
async function processVideo(inputPath, options) {
    const { duration, crop, customOutputDir } = options;
    const finalOutputDir = customOutputDir || OUTPUT_DIR;

    // Ensure custom output dir exists
    if (customOutputDir) {
        await fs.ensureDir(customOutputDir);
    }
    const buffer = 5; // buffer between clips if needed, or just strict splitting

    // First, get video metadata to determine length and dimensions
    const metadata = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata);
        });
    });

    const videoStream = metadata.streams.find(s => s.codec_type === 'video');
    const videoDuration = metadata.format.duration;
    const width = videoStream.width;
    const height = videoStream.height;

    // Calculate crop filters
    let filters = [];
    if (crop) {
        // Target 9:16 aspect ratio
        const targetRatio = 9 / 16;
        let cropWidth, cropHeight, x, y;

        if (width / height > targetRatio) {
            // Too wide, crop width
            cropHeight = height;
            cropWidth = Math.floor(height * targetRatio);
            x = Math.floor((width - cropWidth) / 2);
            y = 0;
        } else {
            // Too tall (unlikely for yt) or already correct
            cropWidth = width;
            cropHeight = Math.floor(width / targetRatio);
            y = Math.floor((height - cropHeight) / 2);
            x = 0;
        }
        // Ensure even dimensions
        cropWidth = cropWidth - (cropWidth % 2);
        cropHeight = cropHeight - (cropHeight % 2);

        filters.push(`crop=${cropWidth}:${cropHeight}:${x}:${y}`);
    }

    // Generate clips
    const clipDuration = parseInt(duration);
    const numClips = Math.floor(videoDuration / clipDuration);
    const generatedClips = [];

    // We will run ffmpeg commands sequentially for simplicity and stability
    for (let i = 0; i < numClips; i++) {
        const startTime = i * clipDuration;
        const outputFilename = `clip_${i + 1}.mp4`;
        const outputPath = path.join(finalOutputDir, outputFilename);

        await new Promise((resolve, reject) => {
            let command = ffmpeg(inputPath)
                .setStartTime(startTime)
                .setDuration(clipDuration)
                .output(outputPath)
                .on('end', resolve)
                .on('error', reject);

            if (filters.length > 0) {
                command.videoFilters(filters);
            }

            command.run();
        });

        generatedClips.push(outputFilename);
    }

    return generatedClips;
}

module.exports = { processVideo };
