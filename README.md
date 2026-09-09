# YouTube Clipper

A modern web application to download YouTube videos and split them into short clips using free tools (`yt-dlp` and `FFmpeg`).

[Screenshot placeholder]

## Features

- 🎥 Download YouTube videos using `yt-dlp`.
- ✂️ Automatically split videos into 30s, 45s, or 60s clips.
- 📱 Option to crop to vertical 9:16 (Shorts format).
- ⬇️ Download individual clips.
- 🧹 Auto-cleanup of temporary files after 1 hour.

## Prerequisites

Ensure the following tools are installed and available in your system PATH:

1. **Node.js**: [Download](https://nodejs.org/)
2. **FFmpeg**: [Download](https://ffmpeg.org/download.html)
3. **yt-dlp**: [Download](https://github.com/yt-dlp/yt-dlp)

## Installation

1. Clone the repository (or extract the project).

2. **Backend Setup**:

   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**:

   ```bash
   cd client
   npm install
   ```

## Running the Application

1. **Start the Backend**:

   ```bash
   cd server
   npm run dev
   ```

   The server will start on `http://localhost:3000`.

2. **Start the Frontend**:

   ```bash
   cd client
   npm run dev
   ```

   The client will start on `http://localhost:5173`.

## Usage

1. Open the frontend URL in your browser.
2. Paste a valid YouTube URL.
3. Select clip duration and crop settings.
4. Click "Start Processing".
5. Wait for the process to complete (downloading -> splitting).
6. Preview and download your clips!

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, Lucide React.
- **Backend**: Node.js, Express.
- **Tools**: yt-dlp, FFmpeg.

## Project Structure

- `server/`: Node.js Express API.
  - `temp/`: Temporary storage for raw downloads.
  - `output/`: Processed clips for download.
- `client/`: React Frontend.
