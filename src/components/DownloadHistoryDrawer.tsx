import React from 'react';
import { History, Download, Trash2, HardDrive, CheckCircle2, Film, Music, FileArchive, X } from 'lucide-react';
import { DownloadHistoryItem } from '../types/media';

interface DownloadHistoryDrawerProps {
  history: DownloadHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
  onReDownload: (item: DownloadHistoryItem) => void;
}

export const DownloadHistoryDrawer: React.FC<DownloadHistoryDrawerProps> = ({
  history,
  onClearHistory,
  onDeleteItem,
  onReDownload,
}) => {
  const totalMB = Math.round(history.reduce((acc, curr) => acc + (curr.sizeMB || 0), 0) * 10) / 10;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-neutral-400" />
            <span>Local Download Archive</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Persisted in your browser cache. Easily re-save completed master files or manage stored entries.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-red-400 bg-neutral-900 border border-neutral-800 hover:border-red-900/60 rounded-md transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Archive</span>
          </button>
        )}
      </div>

      {/* Stats summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
          <div className="text-[11px] font-mono text-neutral-400">Total Downloads</div>
          <div className="text-lg font-semibold text-white font-mono mt-0.5 tabular-nums">
            {history.length} Files
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-neutral-800">
          <div className="text-[11px] font-mono text-neutral-400">Data Processed</div>
          <div className="text-lg font-semibold text-emerald-400 font-mono mt-0.5 tabular-nums">
            {totalMB > 1000 ? `${(totalMB / 1024).toFixed(2)} GB` : `${totalMB} MB`}
          </div>
        </div>
        <div className="p-3.5 rounded-lg bg-neutral-900/90 border border-neutral-800 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono text-neutral-400">Audio / Video Fidelity</div>
          <div className="text-lg font-semibold text-neutral-200 font-mono mt-0.5">
            4K UHD &amp; 320k Master
          </div>
        </div>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <HardDrive className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-neutral-300">No downloads saved yet</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Once you download a YouTube video, audio track, or Instagram post, it will be listed here for quick retrieval.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-neutral-800/80">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 shrink-0">
                    {item.type === 'audio' ? (
                      <Music className="h-4 w-4 text-emerald-400" />
                    ) : item.type === 'carousel' ? (
                      <FileArchive className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Film className="h-4 w-4 text-sky-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.mediaTitle}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 font-mono mt-0.5">
                      <span className="capitalize text-neutral-300">{item.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-400">{item.formatLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">~{item.sizeMB} MB</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => onReDownload(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded-md border border-neutral-700/70 transition-colors cursor-pointer"
                    title="Download file again"
                  >
                    <Download className="h-3 w-3" />
                    <span>Re-save</span>
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-md transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
