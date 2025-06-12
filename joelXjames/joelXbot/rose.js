import axios from 'axios';
import config from '../../config.cjs';

const voiceCommands = {
  ".menu": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  "joel": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  ".repo": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  ".alive": "https://github.com/betingrich3/Bentley_DATABASE/raw/refs/heads/main/autovoice/",
  "hi": "https://github.com/betingrich3/Bentley_DATABASE/raw/refs/heads/main/autovoice/y2mate.com%20-%20_original%20sound%20-%20ferrari_forza.mp3",
  "hello": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  "morning": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/good_morning.mp3",
  "good morning": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/good_morning.mp3",
  "night": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/good_night.mp3",
  "good night": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/good_night.mp3",
  "hm": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  "hmm": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  "aww": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  "oye": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/oya_kawada.mp3",
  "ustad": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/oya_kawada.mp3",
  "haha": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/oya_kawada.mp3",
  "hehe": "https://github.com/tharumin/Alexa_Voice/raw/refs/heads/main/hm.mp3",
  "oka": "https://github.com/VajiraTech/IZUMI-AUTO-VOICER/raw/main/kawa.mp3",
  "wow": "https://github.com/VajiraTech/IZUMI-AUTO-VOICER/raw/main/kellek%20oni.mp3",
  "geo": "https://github.com/VajiraTech/IZUMI-AUTO-VOICER/raw/main/wesi(tbg).mp3",
  "i love you": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/i_love_you.mp3",
  "love": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/i_love_you.mp3",
  "love you": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/i_love_you.mp3",
  "ohh": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/i_love_you.mp3",
  "dear": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/pakaya.mp3",
  "sir": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/pakaya.mp3",
  "sobx": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/pakaya.mp3",
  "nice": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/pakaya.mp3",
  "bye": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/pakaya.mp3",
  "by": "https://github.com/sadiyamin/alexa-database/raw/refs/heads/main/Media/pakaya.mp3"
};

const handleCommands = async (m, sock) => {
  try {
    const msgText = m.body?.toLowerCase().trim();
    if (!msgText) return;

    // 1. Always respond to voice commands regardless of private/public mode
    if (voiceCommands[msgText]) {
      try {
        const audioUrl = voiceCommands[msgText];
        const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });

        await sock.sendMessage(
          m.from,
          {
            audio: Buffer.from(response.data),
            mimetype: 'audio/mp4',
            ptt: true,
          },
          { quoted: m }
        );
      } catch (audioError) {
        console.error(`❌ Error sending voice for "${msgText}":`, audioError.message);
        await sock.sendMessage(m.from, { text: `❌ Failed to send voice for "${msgText}"` }, { quoted: m });
      }
      return; // Important: Stop further command processing after voice command
    }

    // 2. Other commands (example with private/public check)
    // if (config.privateMode && !isOwner(m.sender)) return; // your private mode check here
    // if (msgText.startsWith(config.PREFIX)) {
    //   // your other command handlers
    // }

  } catch (err) {
    console.error('❌ handleCommands error:', err);
  }
};

export default handleCommands;
