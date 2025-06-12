import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';

const joelThumbnail = 'https://raw.githubusercontent.com/joeljamestech2/JOEL-XMD/refs/heads/main/mydata/media/thumbnail.jpg';
const repoURL = 'https://github.com/joeljamestech2/JOEL-XMD';

const uploadMedia = async (buffer) => {
  const { ext } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('fileToUpload', buffer, 'file.' + ext);
  form.append('reqtype', 'fileupload');

  const response = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  });

  if (!response.ok) throw new Error('Failed to upload to joel xmd');
  return await response.text();
};

const tohdupscale = async (m, bot) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['gemini', 'upscale', 'tohd', 'to hd', 'hd'];

  if (validCommands.includes(cmd)) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`\`\`\`Reply to an image* to enhance it to HD using ${prefix + cmd}\`\`\``);
    }

    try {
      const loading = await bot.sendMessage(m.from, { text: '```joel xmd is Enhancing your image, please wait```' }, { quoted: m });

      const buffer = await m.quoted.download();
      if (!buffer) throw new Error('Media download failed');

      const imageUrl = await uploadMedia(buffer);

      const res = await fetch(`https://apis.davidcyriltech.my.id/remini?url=${imageUrl}`);
      const json = await res.json();

      if (!json?.status || !json?.url) throw new Error('Remini API failed or returned invalid result');

      await bot.sendMessage(m.from, {
        image: { url: json.url },
        caption: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ`,
        contextInfo: {
          externalAdReply: {
            title: `JOEL XMD GEMINE MENU`,
            body: "enjoy uploading media into hd",
            thumbnailUrl: joelThumbnail,
            sourceUrl: repoURL,
            mediaType: 1,
            renderLargerThumbnail: false,
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363317462952356@newsletter',
            newsletterName: "JOEL XMD BOT",
            serverMessageId: -1,
          },
        },
      }, { quoted: m });

    } catch (e) {
      console.error('[ERROR] HD command failed:', e);
      m.reply('```Failed to enhance image. Try again later.```');
    }
  }
};

export default tohdupscale;
