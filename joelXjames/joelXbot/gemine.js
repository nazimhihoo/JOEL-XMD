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

  if (!response.ok) throw new Error('Failed to upload to Joel XMD');
  return await response.text();
};

const tohdupscale = async (m, bot) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const validCommands = ['gemini', 'upscale', 'tohd', 'to hd', 'hd'];

  if (validCommands.includes(cmd)) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`\`\`\`Reply to an image to enhance it to HD using ${prefix + cmd}\`\`\``);
    }

    try {
      await bot.sendMessage(m.from, { text: '```Joel Xmd is enhancing your image, please wait...```' }, { quoted: m });

      const buffer = await m.quoted.download();
      if (!buffer) throw new Error('Media download failed');

      const uploadedUrl = await uploadMedia(buffer);
      const imageUrl = `https://apis.davidcyriltech.my.id/remini?url=${uploadedUrl}`;

      await bot.sendMessage(m.from, {
        image: { url: imageUrl },
        caption: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʟᴏʀᴅ ᴊᴏᴇʟ`,
        contextInfo: {
          externalAdReply: {
            title: `JOEL XMD GEMINE MENU`,
            body: "Enjoy uploading media in HD",
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
