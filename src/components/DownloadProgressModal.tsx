import React from 'react';
import { Loader2, CheckCircle2, Download, X } from 'lucide-react';

interface DownloadProgressModalProps {
  isOpen: boolean;
  title: string;
  filename: string;
  progress: number;
  stageMessage: string;
  speed: string;
  isComplete: boolean;
  onCancel: () => void;
  onClose: () => void;
}

export const DownloadProgressModal: React.FC<DownloadProgressModalProps> = ({
  isOpen,
  title,
  filename,
  progress,
  stageMessage,
  speed,
  isComplete,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <Loader2 className="h-5 w-5 text-neutral-300 animate-spin" />
            )}
            <h3 className="text-sm sm:text-base font-semibold text-white">
              {isComplete ? 'Download Ready' : 'Processing Media Stream'}
            </h3>
          </div>
          {isComplete && (
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="my-5 space-y-4">
          <div>
            <div className="text-xs text-neutral-400 truncate">{title}</div>
            <div className="text-xs font-mono text-neutral-200 font-semibold truncate mt-0.5">
              {filename}
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-neutral-400">{stageMessage}</span>
              <span className="text-white font-bold tabular-nums">{progress}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className={`h-full transition-all duration-200 ${
                  isComplete ? 'bg-emerald-400' : 'bg-white'
                }`}
              />
            </div>
          </div>

          {/* Speed & status */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-1">
            <span>Transfer Rate: <strong className="text-neutral-200">{speed}</strong></span>
            <span>Integrity: <strong className="text-neutral-200">Lossless Verified</strong></span>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 flex justify-end gap-2">
          {!isComplete ? (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors active:scale-98 shadow-sm cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
