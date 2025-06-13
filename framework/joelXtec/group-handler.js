import moment from 'moment-timezone';
import config from '../../config.cjs';

export default async function GroupParticipants(sock, { id, participants, action }) {
   try {
      const metadata = await sock.groupMetadata(id);

      for (const jid of participants) {
         let profile;
         try {
            profile = await sock.profilePictureUrl(jid, "image");
         } catch {
            profile = "https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu";
         }

         const userName = jid.split('@')[0];
         const time = moment.tz('Africa/Tanzania').format('HH:mm:ss');
         const date = moment.tz('Africa/Tanzania').format('DD/MM/YYYY');
         const membersCount = metadata.participants.length;

         // 🟢 WELCOME
         if (action === "add" && config.WELCOME) {
            await sock.sendMessage(id, {
               text: `┌─❖\n│『  *Hi..!! 🐦*  』\n└┬\n ◎ 「  @${userName} 」\n │ ➪  *Welcome To*\n ◎      ${metadata.subject} \n │ ➪  *Member :*\n ◎      ${membersCount}th\n │ ➪  *Joined :*\n ◎      ${time} ${date}\n │ ➪  *Support by Subscribe :*\n ◎      https://m.youtube.com/@joeltech255\n └─────────────||`,
               contextInfo: {
                  mentionedJid: [jid],
                  externalAdReply: {
                     title: "ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴏᴜʀ ɢʀᴏᴜᴘ",
                     mediaType: 1,
                     previewType: 0,
                     renderLargerThumbnail: true,
                     thumbnailUrl: profile,
                     sourceUrl: 'https://github.com/joeljamestech2/JOEL-XMD'
                  }
               }
            });
         }

         // 🔴 ANTILEFT
         if (action === "remove") {
            if (config.ANTILEFT) {
               try {
                  // Attempt to re-add the user
                  await sock.groupParticipantsUpdate(id, [jid], 'add');

                  // Then send warning image
                  await sock.sendMessage(id, {
                     image: { url: profile },
                     caption: `\`\`\`👋 Hello .. @${userName}\n🚫 Don't leave the group ${metadata.subject}\n You can only leave after 90 days, else your account will be banned permanently!\`\`\``,
                     contextInfo: {
                        mentionedJid: [jid]
                     }
                  });

               } catch (err) {
                  console.error(`Failed to re-add ${jid}:`, err.message);
                  await sock.sendMessage(id, {
                     text: `❌ Couldn't add @${userName} back.\nMaybe their privacy settings block it.`,
                     contextInfo: {
                        mentionedJid: [jid]
                     }
                  });
               }
            } else if (config.WELCOME) {
               // Normal goodbye if ANTILEFT is off
               await sock.sendMessage(id, {
                  text: `┌─❖\n│『  *Gᴏᴏᴅʙʏᴇ..!! 🍁*  』\n└┬\n ◎ 「  @${userName} 」\n │ ➪  *Left from*\n ◎      ${metadata.subject}\n │ ➪  *Member :*\n ◎      ${membersCount}th\n │ ➪  *Time :*\n ◎      ${time} ${date}\n │ ➪  *Support by Subscribe :*\n ◎      https://m.youtube.com/@joeltech255\n └─────────────||`,
                  contextInfo: {
                     mentionedJid: [jid],
                     externalAdReply: {
                        title: "ɢᴏᴏᴅʙʏᴇ ᴀ ғᴏʟʟᴇɴ sᴏʟᴅɪᴇʀ",
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: profile,
                        sourceUrl: 'https://github.com/joeljamestech2/JOEL-XMD'
                     }
                  }
               });
            }
         }
      }
   } catch (err) {
      console.error('GroupParticipants error:', err);
   }
}
