import React from 'react';
import { Sliders, ShieldCheck, Film, Music, Sparkles } from 'lucide-react';

export const FormatSpecsGuide: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-neutral-800">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Sliders className="h-5 w-5 text-neutral-400" />
          <span>Resolution &amp; Audio Fidelity Matrix</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Technical specifications, bitrates, and hardware codec compatibility for all supported formats.
        </p>
      </div>

      {/* Video Resolutions Table */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-semibold text-white">Video Resolution Profiles</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Direct MP4 / AV1 Master</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-mono text-[11px] border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-4">Quality Tier</th>
                <th className="py-2.5 px-4">Resolution</th>
                <th className="py-2.5 px-4">Frame Rate</th>
                <th className="py-2.5 px-4">Video Codec</th>
                <th className="py-2.5 px-4">Average Bitrate</th>
                <th className="py-2.5 px-4">Ideal For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono">
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>4K Ultra HD</span>
                </td>
                <td className="py-3 px-4">3840 × 2160</td>
                <td className="py-3 px-4">60 fps</td>
                <td className="py-3 px-4">AV1 / VP9 HDR</td>
                <td className="py-3 px-4 tabular-nums">35.0 Mbps</td>
                <td className="py-3 px-4 font-sans text-neutral-400">OLED TVs &amp; 4K Displays</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>2K Quad HD</span>
                </td>
                <td className="py-3 px-4">2560 × 1440</td>
                <td className="py-3 px-4">60 fps</td>
                <td className="py-3 px-4">AV1 / VP9</td>
                <td className="py-3 px-4 tabular-nums">18.0 Mbps</td>
                <td className="py-3 px-4 font-sans text-neutral-400">Gaming &amp; Pro Monitors</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                  <span>1080p Full HD</span>
                </td>
                <td className="py-3 px-4">1920 × 1080</td>
                <td className="py-3 px-4">60 fps</td>
                <td className="py-3 px-4">H.264 AVC1</td>
                <td className="py-3 px-4 tabular-nums">10.2 Mbps</td>
                <td className="py-3 px-4 font-sans text-neutral-400">All Devices &amp; Phones</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
                  <span>720p HD</span>
                </td>
                <td className="py-3 px-4">1280 × 720</td>
                <td className="py-3 px-4">30 fps</td>
                <td className="py-3 px-4">H.264</td>
                <td className="py-3 px-4 tabular-nums">4.8 Mbps</td>
                <td className="py-3 px-4 font-sans text-neutral-400">Quick WhatsApp / Sharing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audio Fidelity Table */}
      <div className="rounded-xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-neutral-950/60 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white">Audio Formats &amp; Bitrates</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Uncompressed &amp; MP3 Studio</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 font-mono text-[11px] border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4">Bitrate / Spec</th>
                <th className="py-2.5 px-4">Sample Rate</th>
                <th className="py-2.5 px-4">Size (per min)</th>
                <th className="py-2.5 px-4">Recommended Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300 font-mono">
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white">MP3 320 kbps</td>
                <td className="py-3 px-4">320 kbps CBR</td>
                <td className="py-3 px-4">48.0 kHz Stereo</td>
                <td className="py-3 px-4 tabular-nums">~2.4 MB</td>
                <td className="py-3 px-4 font-sans text-neutral-400">DJ Sets, Audiophiles, Cars</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white">WAV PCM</td>
                <td className="py-3 px-4">2304 kbps Lossless</td>
                <td className="py-3 px-4">48.0 kHz 24-bit</td>
                <td className="py-3 px-4 tabular-nums">~16.5 MB</td>
                <td className="py-3 px-4 font-sans text-neutral-400">DAW Mixing &amp; Studio Sampling</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white">FLAC</td>
                <td className="py-3 px-4">Lossless Variable</td>
                <td className="py-3 px-4">48.0 kHz 16-bit</td>
                <td className="py-3 px-4 tabular-nums">~9.2 MB</td>
                <td className="py-3 px-4 font-sans text-neutral-400">Archival Lossless Listening</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-sans font-semibold text-white">M4A / AAC</td>
                <td className="py-3 px-4">256 kbps AAC</td>
                <td className="py-3 px-4">48.0 kHz</td>
                <td className="py-3 px-4 tabular-nums">~1.8 MB</td>
                <td className="py-3 px-4 font-sans text-neutral-400">iPhone &amp; Apple Ecosystem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
