import React from 'react';
import { Search, Clipboard, X, ArrowRight, Loader2, Youtube, Music } from 'lucide-react';
import { DEMO_PRESETS } from '../services/mediaParser';

interface HeroSearchProps {
  inputUrl: string;
  setInputUrl: (val: string) => void;
  onAnalyze: (url?: string) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  inputUrl,
  setInputUrl,
  onAnalyze,
  isLoading,
  error,
  onClearError,
}) => {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
        onClearError();
        onAnalyze(text.trim());
      }
    } catch {
      const el = document.getElementById('media-url-input');
      el?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && inputUrl.trim()) {
      e.preventDefault();
      onAnalyze(inputUrl);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center pt-2 sm:pt-6">
      {/* Minimalist Title */}
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-2">
        YouTube Downloader
      </h1>
      <p className="text-sm text-neutral-400 mb-8 max-w-md mx-auto">
        Fast, direct downloads for 4K / 1080p MP4 video and 320kbps MP3 audio with zero compression loss.
      </p>

      {/* Main Input Box */}
      <div className="relative">
        <div
          className={`flex items-center rounded-xl bg-neutral-900/95 border transition-all duration-200 shadow-xl ${
            error
              ? 'border-red-500/70 ring-1 ring-red-500/20'
              : 'border-neutral-750 focus-within:border-neutral-400 focus-within:ring-1 focus-within:ring-neutral-400/20'
          } p-1.5`}
        >
          {/* Search Icon */}
          <div className="pl-3 pr-2 text-neutral-500">
            <Search className="h-4 w-4" />
          </div>

          {/* Input field */}
          <input
            id="media-url-input"
            type="url"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (error) onClearError();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste YouTube video or audio link..."
            className="w-full bg-transparent px-2 py-2 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear Button */}
          {inputUrl && (
            <button
              onClick={() => {
                setInputUrl('');
                onClearError();
              }}
              className="p-1.5 text-neutral-400 hover:text-white rounded-md transition-colors mr-1 cursor-pointer"
              title="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Paste button if empty */}
          {!inputUrl && (
            <button
              onClick={handlePaste}
              type="button"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md border border-neutral-700 transition-colors mr-1.5 whitespace-nowrap cursor-pointer"
            >
              <Clipboard className="h-3 w-3 text-neutral-400" />
              <span>Paste</span>
            </button>
          )}

          {/* Submit / Action Button */}
          <button
            onClick={() => onAnalyze(inputUrl)}
            disabled={isLoading || !inputUrl.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-black bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white rounded-lg transition-all whitespace-nowrap active:scale-98 shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Fetch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-red-950/40 border border-red-800/50 p-2.5 text-xs text-red-300 text-left animate-in fade-in">
            <span>{error}</span>
            <button
              onClick={onClearError}
              className="text-red-400 hover:text-red-200 ml-2 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Minimal quick demo links */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <span className="text-[11px] font-mono text-neutral-600">Sample:</span>
          {DEMO_PRESETS.slice(0, 2).map((preset) => (
            <button
              key={preset.url}
              onClick={() => {
                setInputUrl(preset.url);
                onClearError();
                onAnalyze(preset.url);
              }}
              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800/80 rounded-md transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
            >
              {preset.label.includes('Audio') ? (
                <Music className="h-3 w-3 text-red-400" />
              ) : (
                <Youtube className="h-3 w-3 text-red-500" />
              )}
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
