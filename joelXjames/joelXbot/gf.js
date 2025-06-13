import axios from 'axios';

const gfCommand = async (m, sock) => {
  const text = m.body || '';
  const cmd = text.split(' ')[0].toLowerCase();

  if (cmd !== 'gf') return;

  const query = text.slice(cmd.length).trim();
  if (!query) {
    return sock.sendMessage(m.from, {
      text: '```Hey babe, talk to me 💕```',
    }, { quoted: m });
  }

  try {
    if (m.React) await m.React('💖');

    const res = await axios.get(`https://iamtkm.vercel.app/ai/gemini?text=${encodeURIComponent(query)}`);
    let result = res.data?.result || '';

    result = result
      .replace(/I am a large language model, trained by Google\.?/gi, 'I’m your loving virtual girlfriend 💋')
      .replace(/by Google/gi, 'by your GF')
      .replace(/large language model/gi, 'romantic AI girlfriend');

    if (res.data.status && result) {
      return sock.sendMessage(
        m.from,
        {
          text: `\`\`\`${result}\`\`\``,
          contextInfo: {
            externalAdReply: {
              title: 'Your GF AI 💘',
              body: 'Chat with your virtual girlfriend anytime',
              thumbnailUrl: "https://i.imgur.com/ltZ6QqT.jpg",
              sourceUrl: "https://github.com/joeljamestech/JOEL-XMD",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: m }
      );
    } else {
      return sock.sendMessage(m.from, {
        text: '```Your GF is thinking... Try again soon! 💭```',
      }, { quoted: m });
    }

  } catch (err) {
    console.error(`GF Error:`, err.message);
    return sock.sendMessage(m.from, {
      text: '```Oops! Your GF encountered an error.```',
    }, { quoted: m });
  }
};

export default gfCommand;
