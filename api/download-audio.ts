export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const format = (req.query?.format as string) || 'mp3';
  const title = (req.query?.title as string) || 'Audio';
  const safeTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Generate a valid 16-bit PCM WAV audio buffer
  const sampleRate = 44100;
  const numChannels = 2;
  const durationSec = 6;
  const numSamples = sampleRate * durationSec;
  const bufferSize = 44 + numSamples * numChannels * 2;
  const buffer = Buffer.alloc(bufferSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * numChannels * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * 2, 28);
  buffer.writeUInt16LE(numChannels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * numChannels * 2, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 0.7);
    const wave = (Math.sin(2 * Math.PI * 440 * t) * 0.7) * envelope;
    const sample = Math.max(-32768, Math.min(32767, Math.floor(wave * 32767)));
    buffer.writeInt16LE(sample, offset);
    buffer.writeInt16LE(sample, offset + 2);
    offset += 4;
  }

  res.setHeader('Content-Type', 'audio/wav');
  res.setHeader('Content-Length', buffer.length);
  res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_audio.wav"`);
  return res.status(200).send(buffer);
}
