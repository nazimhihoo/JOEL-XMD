import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../../config.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginDir = path.resolve(__dirname, '../../joelXjames/joelXbot');

const installCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmdName = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';

  if (cmdName !== 'installcmd') return;

  const args = m.body.slice(prefix.length + cmdName.length).trim().split(' ');
  const fileName = args.shift();
  const jsCode = args.join(' ');

  if (!fileName || !fileName.endsWith('.js')) {
    return sock.sendMessage(m.from, {
      text: '❌ Invalid file name. It must end with `.js`\n\nUsage:\n.installcmd joke.js console.log("hi");',
    }, { quoted: m });
  }

  if (!jsCode) {
    return sock.sendMessage(m.from, {
      text: '❌ No code provided.\n\nUsage:\n.installcmd joke.js export default async () => {}',
    }, { quoted: m });
  }

  const filePath = path.join(pluginDir, fileName);

  try {
    await fs.writeFile(filePath, jsCode, 'utf8');
    await m.react?.('✅');
    return sock.sendMessage(m.from, {
      text: `✅ *Plugin installed:* \`${fileName}\`\n\nUse \`${prefix}allcmds\` to see it.`,
    }, { quoted: m });
  } catch (err) {
    console.error('Install error:', err);
    await m.react?.('❌');
    return sock.sendMessage(m.from, {
      text: `❌ Failed to write plugin:\n${err.message}`,
    }, { quoted: m });
  }
};

export default installCmd;
