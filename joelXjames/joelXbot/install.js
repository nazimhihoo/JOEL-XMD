import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import config from '../../config.cjs';

const pluginDir = path.resolve(process.cwd(), '../joelXjames/joelXbot');

// Helper to find next free file name like file1.js to file100.js
async function getNextFileName() {
  for (let i = 1; i <= 100; i++) {
    const filename = `file${i}.js`;
    try {
      await fs.access(path.join(pluginDir, filename));
    } catch {
      return filename; // file does not exist, use this
    }
  }
  throw new Error('No free file names available from file1.js to file100.js');
}

const installUnstallCmd = async (m, sock) => {
  const prefix = config.PREFIX;
  const text = m.body || '';
  if (!text.startsWith(prefix)) return;

  const [cmd, ...args] = text.slice(prefix.length).trim().split(/\s+/);

  if (cmd === 'installcmd') {
    if (args.length === 0) {
      return sock.sendMessage(m.from, { text: `Usage: ${prefix}installcmd <url1> <url2> ...` }, { quoted: m });
    }

    let installedFiles = [];
    for (const url of args) {
      if (!url.startsWith('http')) {
        await sock.sendMessage(m.from, { text: `❌ Invalid URL: ${url}` }, { quoted: m });
        continue;
      }

      try {
        // Convert GitHub blob URL to raw URL if needed
        let rawUrl = url;
        if (url.includes('github.com') && url.includes('/blob/')) {
          rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }

        const response = await axios.get(rawUrl);
        const code = response.data;

        if (!code || !code.trim()) {
          await sock.sendMessage(m.from, { text: `❌ Empty content from URL: ${url}` }, { quoted: m });
          continue;
        }

        const filename = await getNextFileName();
        const filePath = path.join(pluginDir, filename);

        await fs.writeFile(filePath, code, 'utf-8');
        installedFiles.push(filename);
      } catch (err) {
        await sock.sendMessage(m.from, { text: `❌ Failed to fetch or save: ${url}\nError: ${err.message}` }, { quoted: m });
      }
    }

    if (installedFiles.length > 0) {
      await sock.sendMessage(
        m.from,
        { text: `✅ Installed plugin files:\n${installedFiles.join('\n')}` },
        { quoted: m }
      );
    }
    return;
  }

  if (cmd === 'unstall') {
    if (args.length === 0) {
      return sock.sendMessage(m.from, { text: `Usage: ${prefix}unstall <filename1.js> <filename2.js> ...` }, { quoted: m });
    }

    let deleted = [];
    let notFound = [];

    for (const filename of args) {
      if (!filename.endsWith('.js') || filename.includes('/') || filename.includes('\\')) {
        notFound.push(filename);
        continue;
      }

      const filePath = path.join(pluginDir, filename);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        deleted.push(filename);
      } catch {
        notFound.push(filename);
      }
    }

    let reply = '';
    if (deleted.length) reply += `✅ Deleted files:\n${deleted.join('\n')}\n\n`;
    if (notFound.length) reply += `❌ Files not found or invalid:\n${notFound.join('\n')}`;

    if (!reply) reply = 'No valid files specified to uninstall.';

    await sock.sendMessage(m.from, { text: reply }, { quoted: m });
    return;
  }
};

export default installUnstallCmd;
