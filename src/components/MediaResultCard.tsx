import React, { useState } from 'react';
import {
  ParsedMedia,
  VideoResolution,
  AudioFormat,
  MediaThumbnail,
} from '../types/media';
import {
  Download,
  Play,
  Volume2,
  Scissors,
  Image,
  Youtube,
  Eye,
  Clock,
  Video,
  Music,
} from 'lucide-react';

interface MediaResultCardProps {
  media: ParsedMedia;
  onDownloadVideo: (
    media: ParsedMedia,
    res: VideoResolution,
    includeThumb: boolean
  ) => void;
  onDownloadAudio: (
    media: ParsedMedia,
    format: AudioFormat,
    includeThumb: boolean
  ) => void;
  onDownloadThumbnail: (thumb?: MediaThumbnail) => void;
  onOpenTrimmer: () => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({
  media,
  onDownloadVideo,
  onDownloadAudio,
  onDownloadThumbnail,
  onOpenTrimmer,
}) => {
  const hasVideo = media.videoResolutions.length > 0;
  const hasAudio = media.audioFormats.length > 0;

  // Active tab: 'video' | 'audio'
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>(
    hasVideo ? 'video' : 'audio'
  );

  const [includeThumbnail, setIncludeThumbnail] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl bg-neutral-900/90 border border-neutral-800 shadow-2xl overflow-hidden transition-all text-left">
      {/* Media Info Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-800/80">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {/* Thumbnail Box */}
          <div className="relative w-full sm:w-52 aspect-video rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
            <img
              src={`/api/proxy-thumbnail?url=${encodeURIComponent(media.thumbnail)}`}
              alt={media.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                // Fallback to direct URL
                if (!img.src.includes('no-referrer-fallback')) {
                  img.src = media.thumbnail;
                  img.setAttribute('referrerPolicy', 'no-referrer');
                  img.setAttribute('data-fallback', 'no-referrer-fallback');
                }
              }}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] font-mono text-neutral-200 bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm">
              <Clock className="h-3 w-3 text-neutral-400" />
              <span>{media.durationFormatted}</span>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-1.5">
                <span className="flex items-center gap-1 text-red-400 font-medium">
                  <Youtube className="h-3.5 w-3.5" />
                  <span>YouTube</span>
                </span>
                <button
                  onClick={() => onDownloadThumbnail()}
                  className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md border border-neutral-700 transition-colors cursor-pointer"
                  title="Download Original Thumbnail"
                >
                  <Image className="h-3 w-3 text-neutral-400" />
                  <span>Save Cover</span>
                </button>
              </div>

              <h2 className="text-base font-semibold text-white tracking-tight line-clamp-2 mb-1.5 leading-snug">
                {media.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span className="text-neutral-300">{media.author}</span>
                {media.views && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="flex items-center gap-1 font-mono text-neutral-400">
                      <Eye className="h-3 w-3" />
                      <span>{media.views}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail checkbox */}
            <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-neutral-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeThumbnail}
                  onChange={(e) => setIncludeThumbnail(e.target.checked)}
                  className="accent-white rounded cursor-pointer"
                />
                <span>Save original 1080p cover thumbnail</span>
              </label>

              {activeTab === 'audio' && (
                <button
                  onClick={onOpenTrimmer}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md border border-neutral-700 transition-colors cursor-pointer"
                >
                  <Scissors className="h-3 w-3 text-neutral-400" />
                  <span>Trim Clip</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Format Selection Tabs */}
      <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-neutral-800/60 bg-neutral-950/40">
        <div className="flex items-center gap-2">
          {hasVideo && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>Video (MP4)</span>
            </button>
          )}

          {hasAudio && (
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'audio'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Music className="h-3.5 w-3.5" />
              <span>Audio (MP3 / WAV / M4A)</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-4 sm:p-5">
        {/* --- VIDEO PANEL --- */}
        {activeTab === 'video' && hasVideo && (
          <div className="grid grid-cols-1 gap-2">
            {media.videoResolutions.map((res) => (
              <div
                key={res.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  res.isPopular
                    ? 'bg-neutral-800/40 border-neutral-700/80 hover:border-neutral-600'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white tracking-tight">
                      {res.label}
                    </span>
                    {res.isPopular && (
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                        Best
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-0.5">
                    <span>{res.resolution}</span>
                    <span>·</span>
                    <span className="uppercase">{res.ext}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 tabular-nums">
                    ~{res.sizeMB} MB
                  </span>
                  <button
                    onClick={() => onDownloadVideo(media, res, includeThumbnail)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-white hover:bg-neutral-200 rounded-md transition-colors active:scale-98 shadow-sm cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- AUDIO PANEL --- */}
        {activeTab === 'audio' && hasAudio && (
          <div className="grid grid-cols-1 gap-2">
            {media.audioFormats.map((fmt) => (
              <div
                key={fmt.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  fmt.isPopular
                    ? 'bg-neutral-800/40 border-neutral-700/80 hover:border-neutral-600'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white tracking-tight">
                      {fmt.label}
                    </span>
                    {fmt.isPopular && (
                      <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-0.5">
                    <span>{fmt.quality}</span>
                    <span>·</span>
                    <span>{fmt.sampleRate}</span>
                    <span>·</span>
                    <span className="uppercase">{fmt.ext}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-400 tabular-nums">
                    ~{fmt.sizeMB} MB
                  </span>
                  <button
                    onClick={() => onDownloadAudio(media, fmt, includeThumbnail)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-white hover:bg-neutral-200 rounded-md transition-colors active:scale-98 shadow-sm cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
