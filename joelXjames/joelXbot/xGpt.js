import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import config from '../../config.cjs';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const chatHistoryFile = path.resolve(__dirname, '../../framework/history.json');

const deepSeekSystemPrompt = "You are an intelligent AI assistant.";

async function readChatHistoryFromFile() {
    try {
        const data = await fs.readFile(chatHistoryFile, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

async function writeChatHistoryToFile(chatHistory) {
    try {
        await fs.writeFile(chatHistoryFile, JSON.stringify(chatHistory, null, 2));
    } catch (err) {
        console.error('Error writing chat history to file:', err);
    }
}

async function updateChatHistory(chatHistory, sender, message) {
    if (!chatHistory[sender]) {
        chatHistory[sender] = [];
    }
    chatHistory[sender].push(message);
    if (chatHistory[sender].length > 20) {
        chatHistory[sender].shift();
    }
    await writeChatHistoryToFile(chatHistory);
}

async function deleteChatHistory(chatHistory, userId) {
    delete chatHistory[userId];
    await writeChatHistoryToFile(chatHistory);
}

const deepseek = async (m, Matrix) => {
    const chatHistory = await readChatHistoryFromFile();
    const text = m.body.toLowerCase();

    if (text === "/forget") {
        await deleteChatHistory(chatHistory, m.sender);
        await Matrix.sendMessage(m.from, { text: 'Conversation deleted successfully' }, { quoted: m });
        return;
    }

    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const prompt = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['gpt', 'bot', 'ai', 'al', 'gt3', 'deepseek'];

    if (validCommands.includes(cmd)) {
        if (!prompt) {
            await Matrix.sendMessage(m.from, { text: 'Please give me a prompt' }, { quoted: m });
            return;
        }

        try {
            const senderChatHistory = chatHistory[m.sender] || [];
            const messages = [
                { role: "system", content: deepSeekSystemPrompt },
                ...senderChatHistory,
                { role: "user", content: prompt }
            ];

            await m.React("⏳");

            const apiUrl = `https://api.paxsenix.biz.id/ai/gemini-realtime?text=${encodeURIComponent(prompt)}&session_id=ZXlKaklqb2lZMTg0T0RKall6TTNNek13TVdFNE1qazNJaXdpY2lJNkluSmZNbU01TUdGa05ETmtNVFF3WmpNNU5pSXNJbU5vSWpvaWNtTmZZVE16TURWaE1qTmpNR1ExTnpObFl5Sjk`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            let answer = responseData.message;

            // Replace identity phrases
            answer = answer
                .replace(/I am a large language model, trained by Google\.?/gi, "I am Joel XMD bot, trained by Lord Joel.")
                .replace(/by Google/gi, "by Lord Joel")
                .replace(/large language model/gi, "Joel XMD bot");

            await updateChatHistory(chatHistory, m.sender, { role: "user", content: prompt });
            await updateChatHistory(chatHistory, m.sender, { role: "assistant", content: answer });

            await Matrix.sendMessage(m.from, {
                text: `\`\`\`${answer}\`\`\``,
                contextInfo: {
                    externalAdReply: {
                        title: 'JOEL XMD AI',
                        body: 'Chat with joel assistant anytime',
                        thumbnailUrl: "https://i.imgur.com/ltZ6QqT.jpg",
                        sourceUrl: "https://github.com/joeljamestech/JOEL-XMD",
                        mediaType: 1,
                        renderLargerThumbnail: true,
                    }
                }
            }, { quoted: m });

            await m.React("✅");
        } catch (err) {
            await Matrix.sendMessage(m.from, { text: "Something went wrong, please try again." }, { quoted: m });
            console.error('Error fetching response from DeepSeek API:', err);
            await m.React("❌");
        }
    }
};

export default deepseek;
