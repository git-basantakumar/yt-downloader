import React, { useState, useEffect } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Copy, Check } from 'lucide-react';
import { getApiBaseUrl, setCustomBackendUrl, testBackendHealth } from '../services/downloadEngine';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getApiBaseUrl();
      setUrlInput(current);
      checkStatus(current);
    }
  }, [isOpen]);

  const checkStatus = async (targetUrl?: string) => {
    setIsTesting(true);
    const res = await testBackendHealth(targetUrl !== undefined ? targetUrl : urlInput);
    setStatus(res);
    setIsTesting(false);
  };

  const handleSave = () => {
    setCustomBackendUrl(urlInput.trim());
    checkStatus(urlInput.trim());
    onSaved();
  };

  const handleReset = () => {
    setUrlInput('');
    setCustomBackendUrl('');
    checkStatus('');
    onSaved();
  };

  const copyDockerCmd = () => {
    navigator.clipboard.writeText('docker build -t aurastream . && docker run -p 3000:3000 aurastream');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#11131A] border border-neutral-800 p-6 shadow-2xl text-neutral-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sky-400">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Backend Engine Configuration</h3>
              <p className="text-xs text-neutral-400">Connect to yt-dlp &amp; FFmpeg for full 4K downloads</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Health Status */}
        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
          status?.ok
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : 'bg-amber-950/30 border-amber-800/50 text-amber-300'
        }`}>
          {status?.ok ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 flex-1">
            <div className="font-medium text-sm text-white">
              {status?.ok ? 'Dedicated yt-dlp Backend Connected' : 'Vercel Serverless Mode'}
            </div>
            <p className="text-neutral-300 leading-relaxed">
              {status?.ok
                ? 'Full-resolution video downloads and 320kbps MP3 extractions are fully enabled.'
                : 'Vercel serverless cannot run local system binaries (yt-dlp/ffmpeg). Connect your backend on Railway/Render or localhost to enable authentic 4K downloads.'}
            </p>
          </div>
          <button
            onClick={() => checkStatus()}
            disabled={isTesting}
            className="p-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Backend URL Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-300">
            Custom Backend URL (Railway, Render, VPS, or localhost)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://aurastream-backend.railway.app or http://localhost:3000"
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
          {urlInput && (
            <button
              onClick={handleReset}
              className="text-[11px] text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
            >
              Reset to same-origin default
            </button>
          )}
        </div>

        {/* 1-Click Hosting Guide */}
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2.5 text-xs text-neutral-400">
          <div className="text-white font-medium text-xs flex items-center justify-between">
            <span>Deploy Free yt-dlp Backend (Render / Railway)</span>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-400">
            A production <code className="text-sky-300 bg-neutral-800 px-1 py-0.5 rounded">Dockerfile</code> with Python, yt-dlp, and FFmpeg is included in this repo. Deploy it on Railway or Render for free, then paste the public URL above.
          </p>
          <button
            onClick={copyDockerCmd}
            className="flex items-center gap-1.5 text-[11px] text-neutral-300 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Docker command copied!' : 'Copy Docker build command'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
