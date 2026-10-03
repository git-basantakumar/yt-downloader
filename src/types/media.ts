export type PlatformType = 'youtube' | 'instagram';
export type MediaType = 'video' | 'audio' | 'reel' | 'post' | 'carousel';

export interface VideoResolution {
  id: string;
  label: string; // e.g., "4K 2160p 60fps", "1080p 60fps"
  resolution: string; // "3840x2160", "1920x1080"
  fps: number;
  codec: string; // "AV1", "H.264", "VP9"
  sizeMB: number;
  ext: 'mp4' | 'webm';
  hasAudio: boolean;
  bitrate: string;
  isPopular?: boolean;
}

export interface AudioFormat {
  id: string;
  label: string; // e.g., "MP3 320 kbps High Quality"
  quality: string; // "320 kbps", "Lossless", "256 kbps"
  sampleRate: string; // "48 kHz", "44.1 kHz"
  sizeMB: number;
  ext: 'mp3' | 'wav' | 'flac' | 'm4a';
  isPopular?: boolean;
}

export interface CarouselSlide {
  id: string;
  index: number;
  type: 'image' | 'video';
  url: string;
  previewUrl: string;
  resolution: string;
  sizeMB: number;
  aspectRatio: string;
}

export interface MediaSubtitle {
  lang: string;
  label: string;
  format: 'srt' | 'vtt';
}

export interface MediaThumbnail {
  label: string;
  url: string;
  dimension: string;
  ext: string;
}

export interface ParsedMedia {
  id: string;
  originalUrl: string;
  platform: PlatformType;
  type: MediaType;
  title: string;
  author: string;
  authorHandle?: string;
  authorAvatar?: string;
  thumbnail: string;
  previewVideoUrl?: string;
  previewAudioUrl?: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "04:18"
  views?: string;
  likes?: string;
  uploadDate?: string;
  caption?: string;
  hashtags?: string[];
  videoResolutions: VideoResolution[];
  audioFormats: AudioFormat[];
  carouselSlides?: CarouselSlide[];
  thumbnails?: MediaThumbnail[];
  subtitles?: MediaSubtitle[];
}

export interface DownloadHistoryItem {
  id: string;
  mediaTitle: string;
  platform: PlatformType;
  type: MediaType;
  formatLabel: string;
  resolutionOrQuality: string;
  sizeMB: number;
  timestamp: number;
  filename: string;
}

export interface AudioTrimOptions {
  startTime: number;
  endTime: number;
  title: string;
  artist: string;
  album: string;
  bitrate: string;
  format: 'mp3' | 'wav';
}
