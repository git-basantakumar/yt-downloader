import React from 'react';
import { Download, Clipboard, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  onQuickPaste: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuickPaste }) => {
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
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-0.5 rounded-full ml-1">
            <CheckCircle2 className="h-2.5 w-2.5" />
            <span>Engine Active</span>
          </span>
        </div>

        {/* Action */}
        <div className="flex items-center gap-2">
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
