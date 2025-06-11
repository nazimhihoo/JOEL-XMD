

import axios from 'axios';
import yts from 'yt-search';

const joelThumbnail = 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/thumbnail.jpg';

export async function videoHandler(m, sock, prefix) {
  try {
    if (!m?.from || !m?.body || !sock) {
      console.error('Invalid message or socket object');
      return;
    }

    const body = m.body || '';
    if (!body.startsWith(prefix)) return;

    const cmd = body.slice(prefix.length).split(' ')[0].toLowerCase();
    const text = body.slice(prefix.length + cmd.length).trim();
    const validCommands = ['video', 'ytmp4', 'v'];
    if (!validCommands.includes(cmd)) return;

    if (!text) {
      await sock.sendMessage(m.from, {
        text: "```Oops! Please provide a video name or keyword!```",
      }, { quoted: m });
      if (typeof m.React === 'function') await m.React('❌');
      return;
    }

    if (typeof m.React === 'function') await m.React('⏳');

    const yt = await yts(text);
    const vid = yt.videos?.[0];
    if (!vid) throw new Error("No video found");

    let videoData;

    // 🟢 Try Primary API
    try {
      const primaryRes = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(vid.url)}`);
      const result = primaryRes.data?.result;
      if (!result?.download_url) throw new Error("Primary failed");
      videoData = {
        title: result.title,
        thumbnail: result.thumbnail,
        download_url: result.download_url,
        quality: result.quality || 'Unknown',
      };
    } catch (err) {
      // 🔁 Fallback API
      const fallbackRes = await axios.get(`https://iamtkm.vercel.app/downloaders/ytmp4?url=${encodeURIComponent(vid.url)}`);
      const result = fallbackRes.data?.data;
      if (!result?.url) throw new Error("Fallback failed");
      videoData = {
        title: result.title || vid.title,
        thumbnail: vid.thumbnail,
        download_url: result.url,
        quality: 'Unknown (fallback)',
      };
    }

    const { title, thumbnail, download_url, quality } = videoData;

    await sock.sendMessage(m.from, {
      image: { url: thumbnail },
      caption: `

│  Title: ${title}
│  Duration: ${vid.timestamp}
│  Views: ${vid.views}
│  Quality: ${quality}
│  Published: ${vid.ago}
╰───────────────━⊷
Powered by lord joel`,
      contextInfo: {
        externalAdReply: {
          title: `JOEL XMD YT MENU`,
          body: "Streaming via joel xmd bot",
          thumbnailUrl: joelThumbnail,
          sourceUrl: vid.url,
          mediaType: 1,
          renderLargerThumbnail: false,
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363317462952356@newsletter',
          newsletterName: "JOEL XMD BOT",
          serverMessageId: -1,
        },
      },
    }, { quoted: m, isForwarded: true, forwardingScore: 999 });

    await sock.sendMessage(m.from, {
      video: { url: download_url },
      mimetype: "video/mp4",
      caption: "```now playing ↻ ◁ II ▷ ↺```",
      thumbnail: joelThumbnail,
      contextInfo: {
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363317462952356@newsletter',
          newsletterName: "JOEL XMD BOT",
          serverMessageId: -1,
        },
        externalAdReply: {
          title: "JOEL XMD BOT ",
          body: "Streaming now ↻ ◁ II ▷ ↺",
          thumbnailUrl: thumbnail,
          sourceUrl: vid.url,
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    }, { quoted: m });

    if (typeof m.React === 'function') await m.React('🎥');

  } catch (error) {
    console.error('Error in videoHandler:', error.message || error);
    await sock.sendMessage(m.from, {
      text: "```An unexpected error occurred! Both primary and fallback failed.```",
    }, { quoted: m });
    if (typeof m.React === 'function') await m.React('❌');
  }
}
