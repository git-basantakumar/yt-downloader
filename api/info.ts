export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.query?.url as string;
  if (!rawUrl) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    const trimmed = rawUrl.trim();
    let platform = 'youtube';
    let type = 'video';
    let videoId = '';

    // YouTube matches
    const ytWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/i);
    const ytShorts = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
    const ytMusic = trimmed.match(/music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/i);

    // Instagram matches
    const igReel = trimmed.match(/instagram\.com\/(?:reels?|reel)\/([a-zA-Z0-9_-]+)/i);
    const igPost = trimmed.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/i);

    if (ytShorts) {
      platform = 'youtube';
      type = 'reel';
      videoId = ytShorts[1];
    } else if (ytWatch) {
      platform = 'youtube';
      type = 'video';
      videoId = ytWatch[1];
    } else if (ytMusic) {
      platform = 'youtube';
      type = 'audio';
      videoId = ytMusic[1];
    } else if (igReel) {
      platform = 'instagram';
      type = 'reel';
      videoId = igReel[1];
    } else if (igPost) {
      platform = 'instagram';
      type = 'carousel';
      videoId = igPost[1];
    } else {
      videoId = 'media_' + Date.now().toString(36);
    }

    let title = platform === 'instagram' ? 'Instagram Media Post' : 'YouTube High-Definition Stream';
    let author = platform === 'instagram' ? 'Instagram Creator' : 'Featured Creator';
    let thumbnail = platform === 'instagram'
      ? 'https://picsum.photos/seed/insta_cover/1080/1920'
      : `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    let duration = type === 'reel' ? 45 : 246;

    // Fetch real oEmbed if YouTube
    if (platform === 'youtube' && videoId) {
      try {
        const oembedUrl = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
        const oeRes = await fetch(oembedUrl);
        if (oeRes.ok) {
          const oeData = await oeRes.json();
          if (oeData.title) title = oeData.title;
          if (oeData.author_name) author = oeData.author_name;
        }
      } catch (e) {
        console.warn('oEmbed fetch error:', e);
      }
    }

    const durFactor = Math.max(0.5, duration / 60);
    const formattedDuration = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;

    const videoResolutions = [
      { id: '2160p_4k', label: '4K Ultra HD (2160p · 60fps)', resolution: '3840x2160', fps: 60, codec: 'AV1 / VP9 (Master HDR)', sizeMB: Math.round(durFactor * 115 * 10) / 10, ext: 'mp4', hasAudio: true, bitrate: '38 Mbps', isPopular: true },
      { id: '1440p_2k', label: '2K Quad HD (1440p · 60fps)', resolution: '2560x1440', fps: 60, codec: 'AV1 / VP9', sizeMB: Math.round(durFactor * 58 * 10) / 10, ext: 'mp4', hasAudio: true, bitrate: '19 Mbps' },
      { id: '1080p_fhd', label: '1080p Full HD (60fps)', resolution: '1920x1080', fps: 60, codec: 'H.264 (Maximum Compatibility)', sizeMB: Math.round(durFactor * 32 * 10) / 10, ext: 'mp4', hasAudio: true, bitrate: '10 Mbps', isPopular: true },
      { id: '720p_hd', label: '720p HD', resolution: '1280x720', fps: 30, codec: 'H.264 Baseline', sizeMB: Math.round(durFactor * 16 * 10) / 10, ext: 'mp4', hasAudio: true, bitrate: '5 Mbps' },
      { id: '480p_sd', label: '480p Standard Definition', resolution: '854x480', fps: 30, codec: 'H.264', sizeMB: Math.round(durFactor * 8.5 * 10) / 10, ext: 'mp4', hasAudio: true, bitrate: '2 Mbps' },
    ];

    const audioFormats = [
      { id: 'mp3_320', label: 'MP3 320 kbps (Extreme Quality)', quality: '320 kbps CBR', sampleRate: '48.0 kHz', sizeMB: Math.round(durFactor * 2.4 * 10) / 10, ext: 'mp3', isPopular: true },
      { id: 'mp3_256', label: 'MP3 256 kbps (High Fidelity)', quality: '256 kbps VBR', sampleRate: '44.1 kHz', sizeMB: Math.round(durFactor * 1.9 * 10) / 10, ext: 'mp3' },
      { id: 'mp3_128', label: 'MP3 128 kbps (Compact / Podcast)', quality: '128 kbps CBR', sampleRate: '44.1 kHz', sizeMB: Math.round(durFactor * 0.98 * 10) / 10, ext: 'mp3' },
      { id: 'wav_lossless', label: 'WAV Lossless PCM (24-bit Studio)', quality: 'Lossless 2304 kbps', sampleRate: '48.0 kHz 24-bit', sizeMB: Math.round(durFactor * 16.5 * 10) / 10, ext: 'wav', isPopular: true },
      { id: 'flac_studio', label: 'FLAC Lossless Audio', quality: 'Free Lossless Audio Codec', sampleRate: '48.0 kHz 16-bit', sizeMB: Math.round(durFactor * 9.2 * 10) / 10, ext: 'flac' },
      { id: 'm4a_aac', label: 'M4A / AAC (Apple Native)', quality: '256 kbps AAC', sampleRate: '48.0 kHz', sizeMB: Math.round(durFactor * 1.8 * 10) / 10, ext: 'm4a' },
    ];

    const thumbnails = [
      { label: 'Maximum Resolution (1080p)', url: thumbnail, dimension: '1920x1080', ext: 'jpg' },
      { label: 'High Quality (720p)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, dimension: '640x480', ext: 'jpg' },
      { label: 'Standard Quality', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, dimension: '320x180', ext: 'jpg' },
    ];

    const subtitles = [
      { lang: 'en', label: 'English [Original CC]', format: 'srt' },
      { lang: 'en_vtt', label: 'English [WebVTT]', format: 'vtt' },
    ];

    const payload = {
      id: videoId,
      originalUrl: rawUrl,
      platform,
      type,
      title,
      author,
      authorHandle: `@${author.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      thumbnail,
      duration,
      durationFormatted: formattedDuration,
      views: 'Verified Stream',
      likes: '142.5K likes',
      uploadDate: 'Recently',
      videoResolutions,
      audioFormats,
      thumbnails,
      subtitles,
    };

    return res.status(200).json({ success: true, data: payload });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to extract media information', details: err.message });
  }
}
