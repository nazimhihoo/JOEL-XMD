/*                                   
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
─██████──────────██████████████──████████████████────████████████────────────────────────────██████──██████████████──██████████████──██████─────────
─██░░██──────────██░░░░░░░░░░██──██░░░░░░░░░░░░██────██░░░░░░░░████──────────────────────────██░░██──██░░░░░░░░░░██──██░░░░░░░░░░██──██░░██─────────
─██░░██──────────██░░██████░░██──██░░████████░░██────██░░████░░░░██──────────────────────────██░░██──██░░██████░░██──██░░██████████──██░░██─────────
─██░░██──────────██░░██──██░░██──██░░██────██░░██────██░░██──██░░██──────────────────────────██░░██──██░░██──██░░██──██░░██──────────██░░██─────────
─██░░██──────────██░░██──██░░██──██░░████████░░██────██░░██──██░░██──██████████████──────────██░░██──██░░██──██░░██──██░░██████████──██░░██─────────
─██░░██──────────██░░██──██░░██──██░░░░░░░░░░░░██────██░░██──██░░██──██░░░░░░░░░░██──────────██░░██──██░░██──██░░██──██░░░░░░░░░░██──██░░██─────────
─██░░██──────────██░░██──██░░██──██░░██████░░████────██░░██──██░░██──██████████████──██████──██░░██──██░░██──██░░██──██░░██████████──██░░██─────────
─██░░██──────────██░░██──██░░██──██░░██──██░░██──────██░░██──██░░██──────────────────██░░██──██░░██──██░░██──██░░██──██░░██──────────██░░██─────────
─██░░██████████──██░░██████░░██──██░░██──██░░██████──██░░████░░░░██──────────────────██░░██████░░██──██░░██████░░██──██░░██████████──██░░██████████─
─██░░░░░░░░░░██──██░░░░░░░░░░██──██░░██──██░░░░░░██──██░░░░░░░░████──────────────────██░░░░░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░██──██░░░░░░░░░░██─
─██████████████──██████████████──██████──██████████──████████████────────────────────██████████████──██████████████──██████████████──██████████████─
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
made by lord joel
contact owner +2557114595078

CURRENTLY RUNNING ON BETA VERSION!!
*
   * @project_name : JOEL XMD
   * @author : LORD_JOEL
   * @youtube : https://www.youtube.com/@joeljamestech255
   * @description : Joel MD, A Multi-functional WhatsApp user bot.
   * @version 10 
*
   * Licensed under the GPL-3.0 License;
* 
   * ┌┤Created By Joel Tech Info.
   * © 2025 Joel MD ✭ ⛥.
   * plugin date : 11/1/2025
* 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
*/

import config from '../../config.cjs';

const OwnerCmd = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const ownerNumber = config.OWNER_NUMBER + '923701335041@s.whatsapp.net';
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();
  const isOwner = m.sender === ownerNumber;
  const isBot = m.sender === botNumber;
  const isAllowed = isOwner || isBot; // Only Owner and Bot can use

  // 📨 Forward message to provided JIDs in private chats (PM)
  if (cmd === 'forward') {
    if (!isAllowed) return m.reply('❌ *You are not authorized to use this command!*');
    if (!text) return m.reply('📢 *Please provide a message and JIDs!*');

    const splitText = text.split('\n');
    const message = splitText[0];
    const jids = splitText.slice(1).map(jid => jid.trim()).filter(jid => jid.endsWith('@s.whatsapp.net'));

    if (jids.length === 0) return m.reply('⚠️ *No valid JIDs provided!*');

    try {
      for (const jid of jids) {
        // Send the message to each JID in PM (Private message)
        await Matrix.sendMessage(jid, { text: message }, { quoted: null });
      }
      m.reply('✅ *Message successfully sent to all provided JIDs in PM!*');
    } catch (error) {
      console.error('Forward Error:', error);
      m.reply('❌ *Failed to send to some or all JIDs!*');
    }
  }

  // 🔍 Get all group member JIDs
  if (cmd === 'getall') {
    if (!isAllowed) return m.reply('❌ *You are not authorized to use this command!*');
    if (!m.isGroup) return m.reply('👥 *This command only works inside groups!*');

    try {
      const groupMetadata = await Matrix.groupMetadata(m.from);
      const participants = groupMetadata.participants.map(p => p.id);
      const memberList = participants.join('\n');

      m.reply(`\n\n${memberList}`);
    } catch (error) {
      console.error('GetAll Error:', error);
      m.reply('⚠️ *Failed to fetch group members!*');
    }
  }
};

// Export the command
export default OwnerCmd;
