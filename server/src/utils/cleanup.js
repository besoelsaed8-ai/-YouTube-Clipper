const fs = require('fs-extra');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '../../temp');
const OUTPUT_DIR = path.join(__dirname, '../../output');
const MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

async function cleanupDirectory(directory) {
    try {
        if (!await fs.pathExists(directory)) return;

        const files = await fs.readdir(directory);
        const now = Date.now();

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stats = await fs.stat(filePath);

            if (now - stats.mtimeMs > MAX_AGE_MS) {
                await fs.remove(filePath);
                console.log(`Deleted old file: ${file}`);
            }
        }
    } catch (error) {
        console.error(`Error cleaning up directory ${directory}:`, error);
    }
}

async function cleanupTempFiles() {
    await cleanupDirectory(TEMP_DIR);
    await cleanupDirectory(OUTPUT_DIR);
}

module.exports = { cleanupTempFiles };
