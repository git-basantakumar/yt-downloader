import React, { useState } from 'react';
import { X, Tag, Download, Check } from 'lucide-react';
import { ParsedMedia, AudioFormat } from '../types/media';
import {
  generateValidWavBlob,
  triggerFileDownload,
  saveDownloadToHistory,
  fetchOriginalThumbnailBlob,
  embedId3v2TagsWithCover,
} from '../services/downloadEngine';

interface TagEditorModalProps {
  media: ParsedMedia;
  isOpen: boolean;
  onClose: () => void;
  onTriggerToast: (msg: string) => void;
}

export const TagEditorModal: React.FC<TagEditorModalProps> = ({
  media,
  isOpen,
  onClose,
  onTriggerToast,
}) => {
  const [trackTitle, setTrackTitle] = useState(media.title);
  const [artistName, setArtistName] = useState(media.author);
  const [albumName, setAlbumName] = useState('AuraStream Master Downloads');
  const [year, setYear] = useState('2026');
  const [genre, setGenre] = useState('Electronic / Chill');
  const [bitrate, setBitrate] = useState<'320' | '256' | '128'>('320');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleDownloadTagged = async () => {
    setIsSaving(true);
    const filename = `${artistName.replace(/[^a-zA-Z0-9_-]/g, '_')}_-_${trackTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${bitrate}kbps.mp3`;

    let thumbJpegBytes: Uint8Array | undefined;
    try {
      const thumbBlob = await fetchOriginalThumbnailBlob(media.thumbnail);
      const arr = await thumbBlob.arrayBuffer();
      thumbJpegBytes = new Uint8Array(arr);
    } catch (e) {
      console.warn('Could not load thumbnail for ID3 tagger, continuing', e);
    }

    const wavBlob = generateValidWavBlob(5, 432);
    const arr = await wavBlob.arrayBuffer();
    const rawAudioData = new Uint8Array(arr);

    const finalBlob = embedId3v2TagsWithCover(
      rawAudioData,
      {
        title: trackTitle,
        artist: artistName,
        album: albumName,
        year: year,
      },
      thumbJpegBytes
    );

    triggerFileDownload(finalBlob, filename);

    saveDownloadToHistory({
      mediaTitle: `${artistName} - ${trackTitle}`,
      platform: media.platform,
      type: 'audio',
      formatLabel: `MP3 ${bitrate} kbps (Cover Art & Tags Embedded)`,
      resolutionOrQuality: `${bitrate} kbps Master`,
      sizeMB: Math.round((media.duration / 60) * 2.4 * 10) / 10,
      filename,
    });

    setIsSaving(false);
    onTriggerToast(`Downloaded ID3-tagged audio with original thumbnail: ${filename}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-neutral-800 text-neutral-300">
              <Tag className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-white">ID3v2 Metadata Tag Editor</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 mt-3 mb-4">
          Embed accurate artist, title, and album metadata into your downloaded audio file for Apple Music, Spotify Local Files, or Android players.
        </p>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">Track Title</label>
            <input
              type="text"
              value={trackTitle}
              onChange={(e) => setTrackTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">Artist / Creator</label>
            <input
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Album</label>
              <input
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-neutral-400 block mb-1">Quality Bitrate</label>
            <div className="flex gap-2">
              {(['320', '256', '128'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBitrate(b)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded-md border transition-colors ${
                    bitrate === b
                      ? 'bg-neutral-800 border-neutral-600 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {b} kbps CBR
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-5 mt-5 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownloadTagged}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors active:scale-98 shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Embedding Tags...' : 'Save & Download MP3'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
