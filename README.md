# AuraStream — High-Definition Media Downloader

Minimalist YouTube audio/video and Instagram post/reel downloader supporting 4K UHD, 1080p 60fps, 320kbps lossless audio, carousel extraction, and audio trimming.

## Vercel Deployment Guide

AuraStream is pre-configured with `vercel.json` for one-click deployment on [Vercel](https://vercel.com).

### Option 1: Deploy with Git (Recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Click **Import Repository** and select your repository.
4. Framework Preset will auto-detect as **Vite**.
5. Build and Output Settings (already pre-configured in `vercel.json`):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. Click **Deploy**.

### Option 2: Deploy with Vercel CLI

Run the following in your terminal:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### What is Included for Vercel:

- **`vercel.json`**: Configures Vite routing (`/index.html` SPA rewrites), `/api/*` serverless routing, and byte-range HTTP headers for video streaming (`/media/*`).
- **`/public/media/`**: High-definition pre-encoded 1080p and 720p H.264/AAC media streams automatically served by Vercel's Global Edge CDN.
- **`/api/proxy-thumbnail.ts`**: Serverless function to proxy YouTube and Instagram original thumbnails without CORS restrictions.
- **`/api/video-stream.ts`**: Edge redirection for fast-start MP4 video playback across all devices.
