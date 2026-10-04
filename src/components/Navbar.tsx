import React, { useState, useEffect } from 'react';
import { Download, Clipboard, Server, Settings } from 'lucide-react';
import { testBackendHealth } from '../services/downloadEngine';

interface NavbarProps {
  onQuickPaste: () => void;
  onOpenSettings: () => void;
  statusRefreshKey?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickPaste, onOpenSettings, statusRefreshKey }) => {
  const [isBackendLive, setIsBackendLive] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    testBackendHealth().then((res) => {
      if (mounted) setIsBackendLive(res.ok);
    });
    return () => {
      mounted = false;
    };
  }, [statusRefreshKey]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-neutral-800/80 bg-[#090A0F]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-700/60 text-white shadow-inner">
            <Download className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white">
            AuraStream
          </span>

          {/* Engine Status Pill */}
          <button
            onClick={onOpenSettings}
            className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full ml-1 border transition-colors cursor-pointer ${
              isBackendLive === true
                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50 hover:bg-emerald-950/60'
                : 'text-amber-400 bg-amber-950/40 border-amber-800/50 hover:bg-amber-950/60'
            }`}
            title="Click to configure backend engine"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isBackendLive === true ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isBackendLive === true ? 'yt-dlp Live' : 'Serverless Mode'}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Backend Settings"
          >
            <Settings className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Engine</span>
          </button>

          <button
            onClick={onQuickPaste}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/70 rounded-lg transition-colors whitespace-nowrap active:scale-95 cursor-pointer shadow-sm"
            title="Paste link from clipboard"
          >
            <Clipboard className="h-3.5 w-3.5 text-neutral-400" />
            <span>Paste Link</span>
          </button>
        </div>
      </div>
    </header>
  );
};
