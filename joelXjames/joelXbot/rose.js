import axios from 'axios';

const roseCommand = async (m, sock) => {
  const text = m.body || '';
  const cmd = text.split(' ')[0].toLowerCase();

  // Trigger only if message starts with 'rose'
  if (cmd !== 'rose') return;

  const query = text.slice(cmd.length).trim();
  if (!query) {
    return sock.sendMessage(m.from, {
      text: `\`\`\`i am listening to you\`\`\``,
    }, { quoted: m });
  }

  try {
    await m.React('🌹');

    const res = await axios.get(`https://iamtkm.vercel.app/ai/gemini?text=${encodeURIComponent(query)}`);
    let result = res.data?.result || '';

    // Format if it mentions Google's default identity
    if (result.includes("I am a large language model, trained by Google.")) {
      result = result.replace(
        /I am a large language model, trained by Google\./g,
        'I am a rose ai trained by rose.'
      );
    }

    if (res.data.status && result) {
      return sock.sendMessage(m.from, {
        text: `\`\`\`${result}\`\`\``,
      }, { quoted: m });
    } else {
      return sock.sendMessage(m.from, {
        text: '``` Rose could not respond. Please try again later.```',
      }, { quoted: m });
    }

  } catch (err) {
    console.error('Rose Error:', err.message);
    return sock.sendMessage(m.from, {
      text: '```An error occurred while connecting to Rose AI.```',
    }, { quoted: m });
  }
};

export default roseCommand;
