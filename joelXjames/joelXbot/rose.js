import audioMap from '../framework/autovoice.json' assert { type: 'json' };
import config from '../../config.cjs';

const audioCommand = async (m, sock) => {
  try {
    // ✅ BOTREPLY toggle must be enabled
    if (!config.BOTREPLY) return;

    // ✅ Basic safety checks
    if (!m?.from || !m?.body || !sock) return;

    const messageText = m.body.trim().toLowerCase();

    // ✅ Check for match in JSON (no prefix)
    const matchedKey = Object.keys(audioMap).find(k => k.toLowerCase() === messageText);
    const audioUrl = matchedKey ? audioMap[matchedKey].trim() : null;

    // ❌ If not found or invalid, ignore silently
    if (!audioUrl || !audioUrl.endsWith('.mp3')) return;

    // ✅ Send audio
    if (typeof m.React === 'function') await m.React('');

    await sock.sendMessage(m.from, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false,
    }, { quoted: m });

    if (typeof m.React === 'function') await m.React('');

  } catch (err) {
    console.error('Audio command error:', err);
  }
};

export default audioCommand;
