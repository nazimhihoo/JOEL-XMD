// rose.js - Emoji + Animation handler for JOEL XMD / HUNTER-MD-BOT

import config from '../../config.js';
const prefix = config.PREFIX || '!';

// Emoji and animation response map
const emotionMap = {
  heart: ['❤️', '💖', '💘', '💝', '💕', '💗', '💓', '💞'],
  shy: ['😳', '🥺', '🙈', '😅', '😊'],
  sad: ['😢', '😭', '💔', '😞', '😔'],
  happy: ['😁', '😊', '😄', '😃', '🥰'],
  angry: ['😠', '😡', '🤬', '👿', '💢'],
  teddy: ['🧸', '🐻', '💗', '🤗', '🎁'],
};

// Animation-style string responses
const animationMap = {
  plane: '🛫🛬\n🛫    ✈️    🛬\n🛫        🛩️        🛬\n🛫            🛫            🛬',
  snake: '🐍〰️〰️〰️🐍〰️〰️〰️🐍',
  moon: '🌑🌒🌓🌔🌕🌖🌗🌘🌑',
  world: '🌍🌎🌏🌍🌎🌏🌍🌎🌏',
};

// Main command logic
const roseCmds = async (m, bot) => {
  try {
    const cmd = m.body.startsWith(prefix)
      ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
      : '';

    if (emotionMap[cmd]) {
      const emojis = emotionMap[cmd].join(' ');
      return await bot.sendMessage(m.from, {
        text: `_${cmd.toUpperCase()} mode:_\n${emojis}`
      }, { quoted: m });
    }

    if (animationMap[cmd]) {
      return await bot.sendMessage(m.from, {
        text: `_${cmd.toUpperCase()} animation:_\n${animationMap[cmd]}`
      }, { quoted: m });
    }
  } catch (err) {
    console.error('Error in roseCmds:', err);
    await m.reply('```Something went wrong while processing your emoji command.```');
  }
};

export default roseCmds;
