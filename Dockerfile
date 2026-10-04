FROM node:20-bookworm-slim

# Install Python, FFmpeg, and yt-dlp
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    ca-certificates \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Build Vite frontend bundle
RUN npm run build

# Default environment
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Start Express + yt-dlp full-stack server
CMD ["npm", "start"]
