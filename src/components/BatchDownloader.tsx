import React, { useState } from 'react';
import { Layers, Play, CheckCircle2, Download, Trash2, Loader2, AlertCircle, Plus } from 'lucide-react';
import { parseMediaUrl, DEMO_PRESETS } from '../services/mediaParser';
import { ParsedMedia } from '../types/media';

interface BatchItem {
  id: string;
  url: string;
  media?: ParsedMedia;
  status: 'idle' | 'parsing' | 'ready' | 'downloading' | 'completed' | 'error';
  error?: string;
  selectedFormatType: 'video' | 'audio';
  progress: number;
}

interface BatchDownloaderProps {
  onProcessBatchDownload: (items: BatchItem[]) => void;
  onTriggerToast: (msg: string) => void;
}

export const BatchDownloader: React.FC<BatchDownloaderProps> = ({
  onProcessBatchDownload,
  onTriggerToast,
}) => {
  const [urlInputText, setUrlInputText] = useState(
    'https://www.youtube.com/watch?v=LXb3EKWsInQ\nhttps://www.youtube.com/watch?v=jfKfPfyJRdk\nhttps://www.instagram.com/reel/C_kXp5lRxk1/'
  );
  const [batchQueue, setBatchQueue] = useState<BatchItem[]>([]);
  const [isParsingBatch, setIsParsingBatch] = useState(false);

  const handleQueueLinks = async () => {
    const urls = urlInputText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 5);

    if (urls.length === 0) {
      onTriggerToast('Please enter at least one valid YouTube or Instagram URL');
      return;
    }

    setIsParsingBatch(true);
    const newItems: BatchItem[] = urls.map((url, i) => ({
      id: `batch_${Date.now()}_${i}`,
      url,
      status: 'parsing',
      selectedFormatType: 'video',
      progress: 0,
    }));

    setBatchQueue(newItems);

    // Parse each item
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      try {
        const parsed = await parseMediaUrl(item.url);
        setBatchQueue((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  media: parsed,
                  status: 'ready',
                  selectedFormatType: parsed.type === 'audio' ? 'audio' : 'video',
                }
              : it
          )
        );
      } catch (err: any) {
        setBatchQueue((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: 'error', error: err.message || 'Failed to parse' }
              : it
          )
        );
      }
    }
    setIsParsingBatch(false);
    onTriggerToast(`Processed ${urls.length} links in batch queue`);
  };

  const handleClearQueue = () => {
    setBatchQueue([]);
  };

  const handleRemoveItem = (id: string) => {
    setBatchQueue((prev) => prev.filter((it) => it.id !== id));
  };

  const handleToggleFormat = (id: string, format: 'video' | 'audio') => {
    setBatchQueue((prev) =>
      prev.map((it) => (it.id === id ? { ...it, selectedFormatType: format } : it))
    );
  };

  const handleStartBatchDownload = () => {
    const readyItems = batchQueue.filter((it) => it.status === 'ready' && it.media);
    if (readyItems.length === 0) {
      onTriggerToast('No prepared links ready for download');
      return;
    }
    onProcessBatchDownload(readyItems);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-neutral-400" />
            <span>Multi-URL Batch Downloader</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Paste multiple YouTube or Instagram links (one per line) to process and queue high-speed downloads in bulk.
          </p>
        </div>

        {batchQueue.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearQueue}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-md transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Queue</span>
            </button>
            <button
              onClick={handleStartBatchDownload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors active:scale-98 shadow-sm cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Batch ({batchQueue.filter((b) => b.status === 'ready').length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Textarea if queue is empty or modifying */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 p-4 sm:p-5 shadow-xl">
        <label className="text-xs font-mono text-neutral-300 block mb-2">
          Paste URLs (One link per line):
        </label>
        <textarea
          value={urlInputText}
          onChange={(e) => setUrlInputText(e.target.value)}
          rows={4}
          placeholder="https://www.youtube.com/watch?v=...&#10;https://www.instagram.com/reel/...&#10;https://www.youtube.com/watch?v=..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Supports: YouTube 4K/Audio &amp; Instagram Reels/Posts</span>
          </div>

          <button
            onClick={handleQueueLinks}
            disabled={isParsingBatch}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isParsingBatch ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Links...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Parse &amp; Queue Links</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Batch Items Table / List */}
      {batchQueue.length > 0 && (
        <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
          <div className="px-4 py-3 bg-neutral-950/60 border-b border-neutral-800 text-xs font-medium text-neutral-400 flex items-center justify-between">
            <span>Queued Items ({batchQueue.length})</span>
            <span className="font-mono text-[11px]">Instant Container Extraction</span>
          </div>

          <div className="divide-y divide-neutral-800/80">
            {batchQueue.map((item, index) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-800/30 transition-colors"
              >
                {/* Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="text-xs font-mono text-neutral-400 w-6">#{index + 1}</div>
                  {item.media ? (
                    <div className="w-12 h-12 rounded bg-neutral-950 overflow-hidden shrink-0 border border-neutral-800">
                      <img
                        src={item.media.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded bg-neutral-950 flex items-center justify-center text-neutral-400 shrink-0 border border-neutral-800">
                      {item.status === 'parsing' ? (
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-white truncate">
                      {item.media ? item.media.title : item.url}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                      {item.media && (
                        <>
                          <span className="capitalize">{item.media.platform}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.media.author}</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span
                        className={
                          item.status === 'ready'
                            ? 'text-emerald-400'
                            : item.status === 'error'
                            ? 'text-red-400'
                            : 'text-neutral-400'
                        }
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {item.media && (
                    <div className="flex bg-neutral-950 p-1 rounded-md border border-neutral-800">
                      <button
                        onClick={() => handleToggleFormat(item.id, 'video')}
                        className={`px-2 py-1 text-[11px] rounded transition-colors ${
                          item.selectedFormatType === 'video'
                            ? 'bg-neutral-800 text-white font-medium'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Video (1080p/4K)
                      </button>
                      <button
                        onClick={() => handleToggleFormat(item.id, 'audio')}
                        className={`px-2 py-1 text-[11px] rounded transition-colors ${
                          item.selectedFormatType === 'audio'
                            ? 'bg-neutral-800 text-white font-medium'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Audio (320k)
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
