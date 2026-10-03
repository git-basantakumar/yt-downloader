export default function handler(req: any, res: any) {
  const quality = req.query?.quality === '720p' ? '720p' : '1080p';
  // Redirect or serve the static high-definition MP4 stream hosted on Vercel CDN
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.redirect(302, `/media/master_${quality}.mp4`);
}
