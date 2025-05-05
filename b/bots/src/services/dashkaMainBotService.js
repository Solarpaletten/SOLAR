// dashkaMainBotService.js — расширенный DashkaBot
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mime = require('mime-types');
const { transcribeAudio } = require('./whisperService');
const { replyWithVoice } = require('./dashkaVoiceReply');

const token = process.env.TELEGRAM_MAIN_DASHKA_BOT
const bot = new TelegramBot(token, { polling: true });

const baseDir = '/var/www/solar/s/b';
const logPath = path.join(baseDir, 'bots/logs/dashka.log');
const downloadDir = path.join(baseDir, 'bots/tmp');
const audioDir = path.join(baseDir, 'bots/audio');

// Гарантируем создание директорий
[logPath, downloadDir, audioDir].forEach(p => {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function logCommand(user, command) {
  const line = `[${new Date().toISOString()}] ${user.username || user.first_name} (${user.id}): ${command}\n`;
  fs.appendFileSync(logPath, line);
}

async function downloadFile(url, dest) {
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(dest);
    response.data.pipe(stream);
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  logCommand(msg.from, msg.text || '[non-text message]');

  try {
    // === ТЕКСТ ===
    if (msg.text) {
      const text = msg.text.toLowerCase();

      if (text.includes('привет')) {
        await bot.sendMessage(chatId, `Привет, ${username}! Чем могу помочь?`);
        return await replyWithVoice(bot, chatId, `Привет, ${username}! Чем могу помочь голосом?`);
      }

      if (text.startsWith('/say ')) {
        const toSay = msg.text.slice(5);
        return await replyWithVoice(bot, chatId, toSay);
      }

      return bot.sendMessage(chatId, `📨 Текст получен от ${username}:\n${msg.text}`);
    }

    // === ОБРАБОТКА МЕДИА ===
    const processAndRespond = async (file, label, lang = 'ru') => {
      const fileLink = await bot.getFileLink(file.file_id);
      const ext = mime.extension(file.mime_type || '') || 'ogg';
      const filePath = path.join(downloadDir, `${label}_${Date.now()}.${ext}`);
      await downloadFile(fileLink, filePath);
      await bot.sendMessage(chatId, `${label} получен:\n${filePath}`);

      if (['voice', 'audio'].includes(label)) {
        await bot.sendMessage(chatId, '🎧 Распознаю...');
        const transcript = await transcribeAudio(filePath, lang);
        await bot.sendMessage(chatId, `📝 Распознанный текст:\n${transcript}`);
        return await replyWithVoice(bot, chatId, transcript);
      }
    };

    if (msg.voice) await processAndRespond(msg.voice, 'voice');
    if (msg.audio) await processAndRespond(msg.audio, 'audio');
    if (msg.video) await processAndRespond(msg.video, 'video');
    if (msg.document) await processAndRespond(msg.document, 'document');

  } catch (err) {
    console.error('[DashkaBot Error]', err);
    bot.sendMessage(chatId, `⚠️ Ошибка:\n${err.message}`);
  }
});

console.log('[BOT] Dashka MainBot is running...');
