/**
 * Client-side video processor using ffmpeg.wasm
 * All processing happens in the browser — no server load!
 */
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;
let ffmpegLoading = false;

/**
 * Initialize FFmpeg WASM (loads once)
 */
export async function initFFmpeg(onLog) {
    if (ffmpeg && ffmpeg.loaded) return ffmpeg;
    if (ffmpegLoading) {
        // Wait for ongoing load
        while (ffmpegLoading) await new Promise(r => setTimeout(r, 100));
        return ffmpeg;
    }

    ffmpegLoading = true;
    ffmpeg = new FFmpeg();

    if (onLog) onLog('Loading FFmpeg engine...');

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegLoading = false;
    console.log('[FFmpeg WASM] Loaded successfully');
    return ffmpeg;
}

/**
 * Get video duration by running a quick ffmpeg command and parsing stderr
 */
async function getVideoDuration(ff, inputName, onLog) {
    return new Promise((resolve) => {
        let duration = 0;

        // Listen for log messages containing duration
        const handler = ({ message }) => {
            const match = message.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
            if (match) {
                const h = parseInt(match[1]);
                const m = parseInt(match[2]);
                const s = parseInt(match[3]);
                duration = h * 3600 + m * 60 + s;
            }
        };

        ff.on('log', handler);

        // Run a quick probe command
        ff.exec(['-i', inputName, '-f', 'null', '-'])
            .then(() => {
                ff.off('log', handler);
                if (onLog) onLog(`Video duration: ${duration}s`);
                resolve(duration);
            })
            .catch(() => {
                ff.off('log', handler);
                resolve(duration);
            });
    });
}

/**
 * Process video: split into clips and optionally crop to 9:16
 * @param {File|Blob|Uint8Array} videoFile - the video to process
 * @param {object} options - { duration, crop, onProgress, onLog }
 * @returns {Promise<Array<{name: string, data: Uint8Array}>>} generated clips
 */
export async function processVideoClient(videoFile, options) {
    const { duration, crop, onProgress, onLog } = options;

    // Step 1: Initialize FFmpeg
    const ff = await initFFmpeg(onLog);

    // Step 2: Write input file
    if (onLog) onLog('Loading video into FFmpeg...');
    const inputName = 'input.mp4';
    const fileData = await fetchFile(videoFile);
    await ff.writeFile(inputName, fileData);

    // Step 3: Get duration
    if (onProgress) onProgress(5);
    const videoDuration = await getVideoDuration(ff, inputName, onLog);

    if (videoDuration === 0) {
        await ff.deleteFile(inputName);
        throw new Error('Could not determine video duration. The file may be corrupted.');
    }

    // Step 4: Calculate clips
    const clipDuration = parseInt(duration);
    const numClips = Math.floor(videoDuration / clipDuration);

    if (numClips === 0) {
        await ff.deleteFile(inputName);
        throw new Error(`Video (${Math.round(videoDuration)}s) is shorter than clip duration (${clipDuration}s)`);
    }

    if (onLog) onLog(`Creating ${numClips} clips of ${clipDuration}s each`);

    // Step 5: Generate clips
    const clips = [];

    for (let i = 0; i < numClips; i++) {
        const startTime = i * clipDuration;
        const outputName = `clip_${i + 1}.mp4`;

        if (onLog) onLog(`Processing clip ${i + 1}/${numClips}...`);

        const args = [
            '-ss', String(startTime),
            '-i', inputName,
            '-t', String(clipDuration),
        ];

        if (crop) {
            // Center-crop to 9:16 (vertical)
            args.push('-vf', 'crop=ih*9/16:ih:(iw-ih*9/16)/2:0');
        }

        args.push(
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '28',
            '-c:a', 'aac',
            '-b:a', '96k',
            '-ar', '44100',
            '-movflags', '+faststart',
            outputName
        );

        await ff.exec(args);

        const data = await ff.readFile(outputName);
        clips.push({ name: outputName, data });

        await ff.deleteFile(outputName);

        if (onProgress) {
            onProgress(Math.round(((i + 1) / numClips) * 100));
        }
    }

    // Cleanup
    await ff.deleteFile(inputName);

    if (onLog) onLog(`Done! Created ${clips.length} clips`);
    return clips;
}

/**
 * Download a clip from Uint8Array
 */
export function downloadClip(clipData, filename) {
    const blob = new Blob([clipData], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
