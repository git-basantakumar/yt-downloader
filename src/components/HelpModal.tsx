import React from 'react';
import { X, Youtube, Instagram, CheckCircle2, Copy, Sparkles, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-neutral-800 text-neutral-300">
              <HelpCircle className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-white">How to Download Media</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 space-y-5 text-xs text-neutral-300">
          {/* YouTube Guide */}
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Youtube className="h-4 w-4 text-red-500" />
              <span>YouTube Video &amp; Audio Downloader</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-400">
              <li>Open any YouTube video or YouTube Short.</li>
              <li>Tap <strong>Share</strong> and click <strong>Copy link</strong>.</li>
              <li>Paste the link into AuraStream and click <strong>Fetch Media</strong>.</li>
              <li>Choose between <strong>4K UHD</strong>, 1080p 60fps video, or <strong>320 kbps MP3</strong> audio.</li>
              <li>Use the <strong>Audio Trimmer</strong> if you only need a specific song chorus or clip.</li>
            </ol>
          </div>

          {/* Instagram Guide */}
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-2 text-white font-semibold mb-2">
              <Instagram className="h-4 w-4 text-pink-500" />
              <span>Instagram Reels &amp; Photo Carousels</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-400">
              <li>Open Instagram on your phone or web browser.</li>
              <li>On any Reel or Post, tap the three dots (<strong className="text-white">···</strong>) or the paper airplane icon.</li>
              <li>Select <strong>Copy link</strong>.</li>
              <li>Paste into AuraStream to get original 1080p 60fps video or extract audio directly.</li>
              <li>For multi-slide carousels, click <strong>Download All as ZIP</strong> to package all slides into one archive.</li>
            </ol>
          </div>

          {/* Tips */}
          <div className="p-3 rounded-lg bg-neutral-800/40 border border-neutral-700/60">
            <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Pro Tip: ID3 Tags</span>
            </div>
            <p className="text-neutral-400">
              When downloading audio files, click the <strong>ID3 Tag Editor</strong> to fill in Song Title, Artist, and Album so your music players categorize your library automatically.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
