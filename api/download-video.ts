export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const quality = (req.query?.quality as string) || '1080p';
  const targetQuality = quality.includes('720') ? '720p' : '1080p';

  // Redirect to CDN video master asset hosted in /media/
  return res.redirect(302, `/media/master_${targetQuality}.mp4`);
}
