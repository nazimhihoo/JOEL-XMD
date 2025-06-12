import axios from 'axios';

const roseJoelCommand = async (m, sock) => {
  const text = m.body || '';
  const cmd = text.split(' ')[0].toLowerCase();

  // Only handle 'rose' or 'joel'
  if (!['rose', 'joel'].includes(cmd)) return;

  const query = text.slice(cmd.length).trim();
  if (!query) {
    return sock.sendMessage(m.from, {
      text: '```i am listening to you```',
    }, { quoted: m });
  }

  const isJoel = cmd === 'joel';
  const identityText = isJoel
    ? 'I am Joel AI trained by Lord Joel.'
    : 'I am a rose ai trained by rose.';
  const reactionEmoji = isJoel ? '⚡' : '🌹';
  const title = isJoel ? 'JOEL AI' : 'ROSE AL';
  const body = isJoel ? 'Powered by Lord Joel' : 'enjoy with rose ai';
  const newsletterName = isJoel ? 'JOEL AI' : 'ROSE AL';

  try {
    if (m.React) await m.React(reactionEmoji);

    const res = await axios.get(`https://iamtkm.vercel.app/ai/gemini?text=${encodeURIComponent(query)}`);
    let result = res.data?.result || '';

    // Replace Google's identity string
    result = result.replace(/I am a large language model, trained by Google\.?/gi, identityText);

    if (res.data.status && result) {
      return sock.sendMessage(
        m.from,
        {
          text: `\`\`\`${result}\`\`\``,
          contextInfo: {
            externalAdReply: {
              title,
              body,
              thumbnailUrl: "https://avatars.githubusercontent.com/u/162905644?v=4",
              sourceUrl: "https://github.com/joeljamestech/JOEL-XMD",
              mediaType: 1,
              renderLargerThumbnail: false,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363317462952356@newsletter',
              newsletterName,
              serverMessageId: -1,
            },
          },
        },
        { quoted: m }
      );
    } else {
      return sock.sendMessage(m.from, {
        text: `\`\`\`${title} could not respond. Please try again later.\`\`\``,
      }, { quoted: m });
    }

  } catch (err) {
    console.error(`${title} Error:`, err.message);
    return sock.sendMessage(m.from, {
      text: '```An error occurred while connecting to the AI service.```',
    }, { quoted: m });
  }
};

export default roseJoelCommand;
