import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { MediaResultCard } from './components/MediaResultCard';
import { AudioTrimmerModal } from './components/AudioTrimmerModal';
import { DownloadProgressModal } from './components/DownloadProgressModal';
import { Toast } from './components/Toast';

import {
  ParsedMedia,
  VideoResolution,
  AudioFormat,
  MediaThumbnail,
} from './types/media';

import { parseMediaUrl } from './services/mediaParser';
import {
  triggerFileDownload,
  fetchRealVideoBlob,
  fetchRealAudioBlob,
  fetchOriginalThumbnailBlob,
} from './services/downloadEngine';

import { Disc3, Zap } from 'lucide-react';

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedMedia, setParsedMedia] = useState<ParsedMedia | null>(null);

  // Modals state
  const [isTrimmerOpen, setIsTrimmerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Download progress overlay state
  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean;
    title: string;
    filename: string;
    progress: number;
    stageMessage: string;
    speed: string;
    isComplete: boolean;
  }>({
    isOpen: false,
    title: '',
    filename: '',
    progress: 0,
    stageMessage: '',
    speed: '24.5 MB/s',
    isComplete: false,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Analyze URL handler
  const handleAnalyze = async (urlToAnalyze?: string) => {
    const targetUrl = (urlToAnalyze !== undefined ? urlToAnalyze : inputUrl).trim();
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseMediaUrl(targetUrl);
      setParsedMedia(result);
      setIsLoading(false);
      showToast(`Loaded: ${result.title.slice(0, 40)}...`);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Could not parse media link. Please verify the URL.');
    }
  };

  // Quick paste trigger from Navbar
  const handleQuickPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
        setError(null);
        handleAnalyze(text.trim());
      }
    } catch {
      const el = document.getElementById('media-url-input');
      el?.focus();
    }
  };

  // Video download execution
  const handleDownloadVideo = async (
    media: ParsedMedia,
    res: VideoResolution,
    includeThumb: boolean = true
  ) => {
    const safeTitle = media.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeTitle}_${res.resolution}.${res.ext}`;

    setDownloadModal({
      isOpen: true,
      title: media.title,
      filename,
      progress: 10,
      stageMessage: `Connecting to ${res.label} direct stream...`,
      speed: '28.4 MB/s',
      isComplete: false,
    });

    try {
      const requestedQuality =
        res.id.includes('4k') || res.id.includes('2160') ? '4k' :
        res.id.includes('2k') || res.id.includes('1440') ? '2k' :
        res.id.includes('720') ? '720p' :
        res.id.includes('480') ? '480p' : '1080p';

      const videoBlob = await fetchRealVideoBlob(
        media.originalUrl,
        requestedQuality,
        media.title,
        (prog, stage) => {
          setDownloadModal((prev) => ({
            ...prev,
            progress: prog,
            stageMessage: stage,
          }));
        }
      );

      triggerFileDownload(videoBlob, filename);

      if (includeThumb) {
        setTimeout(async () => {
          try {
            const thumbBlob = await fetchOriginalThumbnailBlob(media.thumbnail);
            triggerFileDownload(thumbBlob, `${safeTitle}_cover.jpg`);
          } catch {}
        }, 500);
      }

      setDownloadModal((prev) => ({
        ...prev,
        progress: 100,
        stageMessage: 'Download complete.',
        isComplete: true,
      }));

      showToast(`Saved: ${filename}`);

      // Auto-close modal smoothly after download
      setTimeout(() => {
        setDownloadModal((prev) => ({ ...prev, isOpen: false, isComplete: false }));
      }, 1500);
    } catch (err: any) {
      const errMsg = err?.message || 'Video download failed';
      console.error('Video download error:', err);
      setDownloadModal((prev) => ({ ...prev, isOpen: false, isComplete: false }));
      setError(`Download failed: ${errMsg}`);
      showToast(`Error: ${errMsg.slice(0, 80)}`);
    }
  };

  // Audio download execution
  const handleDownloadAudio = async (
    media: ParsedMedia,
    format: AudioFormat,
    includeThumb: boolean = true
  ) => {
    const safeTitle = media.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeTitle}_${format.quality.replace(/\s+/g, '_')}.${format.ext}`;

    setDownloadModal({
      isOpen: true,
      title: media.title,
      filename,
      progress: 10,
      stageMessage: `Starting ${format.ext.toUpperCase()} extraction via yt-dlp...`,
      speed: '—',
      isComplete: false,
    });

    try {
      const finalAudioBlob = await fetchRealAudioBlob(
        media.originalUrl,
        format.ext,
        format.quality,
        media.title,
        (prog, stage) => {
          setDownloadModal((prev) => ({
            ...prev,
            progress: prog,
            stageMessage: stage,
          }));
        }
      );

      triggerFileDownload(finalAudioBlob, filename);

      setDownloadModal((prev) => ({
        ...prev,
        progress: 100,
        stageMessage: 'Audio extraction complete with album art.',
        isComplete: true,
      }));

      showToast(`Saved Audio: ${filename}`);

      // Auto-close modal smoothly after download
      setTimeout(() => {
        setDownloadModal((prev) => ({ ...prev, isOpen: false, isComplete: false }));
      }, 1500);
    } catch (err: any) {
      const errMsg = err?.message || 'Audio extraction failed';
      console.error('Audio download error:', err);
      setDownloadModal((prev) => ({ ...prev, isOpen: false, isComplete: false }));
      setError(`Download failed: ${errMsg}`);
      showToast(`Error: ${errMsg.slice(0, 80)}`);
    }
  };


  // Thumbnail download
  const handleDownloadThumbnail = async (thumb?: MediaThumbnail) => {
    if (!parsedMedia) return;
    const targetUrl = thumb?.url || parsedMedia.thumbnail;
    const safeTitle = parsedMedia.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeTitle}_1080p_cover.jpg`;

    try {
      const blob = await fetchOriginalThumbnailBlob(targetUrl);
      triggerFileDownload(blob, filename);
      showToast(`Saved Cover: ${filename}`);
    } catch (e) {
      showToast('Failed to save cover');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#ECEEF2]">
      {/* Clean Minimal Navbar */}
      <Navbar onQuickPaste={handleQuickPaste} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="space-y-8">
          {/* Minimal Search */}
          <HeroSearch
            inputUrl={inputUrl}
            setInputUrl={setInputUrl}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            error={error}
            onClearError={() => setError(null)}
          />

          {/* Media Card */}
          {parsedMedia && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
              <MediaResultCard
                media={parsedMedia}
                onDownloadVideo={handleDownloadVideo}
                onDownloadAudio={handleDownloadAudio}
                onDownloadThumbnail={handleDownloadThumbnail}
                onOpenTrimmer={() => setIsTrimmerOpen(true)}
              />
            </div>
          )}

          {/* Clean feature badges if no media loaded yet */}
          {!parsedMedia && (
            <div className="pt-8 sm:pt-12 border-t border-neutral-850/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-400">
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                  <Zap className="h-4 w-4 text-sky-400" />
                  <span>4K &amp; 1080p 60fps Video</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  High-speed MP4 container packaging with faststart positioning for instant playback.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60">
                <div className="flex items-center gap-2 text-white font-medium text-sm mb-1">
                  <Disc3 className="h-4 w-4 text-emerald-400" />
                  <span>320 kbps Extreme MP3 Audio</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pristine audio extraction with native ID3 tags, album artwork, and integrated clip trimmer.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-neutral-900/80 py-5 text-xs text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-neutral-400">AuraStream · YouTube Media Downloader</span>
          <span className="font-mono text-[11px] text-neutral-600">Zero Re-encoding Loss</span>
        </div>
      </footer>

      {/* Audio Trimmer Modal */}
      {parsedMedia && (
        <AudioTrimmerModal
          media={parsedMedia}
          isOpen={isTrimmerOpen}
          onClose={() => setIsTrimmerOpen(false)}
          onTriggerToast={showToast}
        />
      )}

      {/* Download Progress Overlay */}
      <DownloadProgressModal
        isOpen={downloadModal.isOpen}
        title={downloadModal.title}
        filename={downloadModal.filename}
        progress={downloadModal.progress}
        stageMessage={downloadModal.stageMessage}
        speed={downloadModal.speed}
        isComplete={downloadModal.isComplete}
        onCancel={() => setDownloadModal((prev) => ({ ...prev, isOpen: false }))}
        onClose={() => setDownloadModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Minimalist Floating Toast */}
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </div>
  );
}
