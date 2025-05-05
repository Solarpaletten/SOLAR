// jimmyBotService.js
const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { transcribeAudio } = require('./whisperService'); // подключаем модуль распознавания речи

const token = process.env.TELEGRAM_JIMMY_BOT
const bot = new TelegramBot(token, { polling: true });

const baseDir = '/var/www/solar/s/b';
const tmpDir = path.join(baseDir, 'bots/tmp');

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, `Привет! Я Джимми 🤖. Исполняю технические задачи от Дашки.`);
});

// 📦 Установка npm-пакета
bot.onText(/\/install (.+)/, (msg, match) => {
  const pkg = match[1];
  exec(`npm install ${pkg}`, (err, stdout, stderr) => {
    bot.sendMessage(msg.chat.id, err ? `❌ Ошибка установки:\n${stderr}` : `✅ Установлен пакет: ${pkg}`);
  });
});

// ⚙️ Выполнение shell-команды
bot.onText(/\/exec (.+)/, (msg, match) => {
  const command = match[1];
  exec(command, (err, stdout, stderr) => {
    bot.sendMessage(msg.chat.id, err ? `❌ Ошибка:\n${stderr}` : `📄 Результат:\n${stdout.slice(0, 4000)}`);
  });
});

// 📅 Получение файла
bot.onText(/\/get (.+)/, (msg, match) => {
  const relPath = match[1];
  const filePath = path.join(baseDir, relPath);
  if (!fs.existsSync(filePath)) {
    return bot.sendMessage(msg.chat.id, `❌ Файл не найден.`);
  }
  bot.sendDocument(msg.chat.id, filePath);
});

// 📊 Листинг папки
bot.onText(/\/list (.+)/, (msg, match) => {
  const dir = path.join(baseDir, match[1]);
  if (!fs.existsSync(dir)) {
    return bot.sendMessage(msg.chat.id, `❌ Папка не найдена.`);
  }
  const files = fs.readdirSync(dir).join('\n');
  bot.sendMessage(msg.chat.id, `📂 Содержимое папки:\n${files}`);
});

// 🎤 Распознавание аудиофайла (Whisper)
bot.onText(/\/transcribe (.+)/, async (msg, match) => {
  const relPath = match[1];
  const filePath = path.join(baseDir, relPath);
  if (!fs.existsSync(filePath)) {
    return bot.sendMessage(msg.chat.id, `❌ Аудиофайл не найден.`);
  }
  try {
    const text = await transcribeAudio(filePath, 'auto');
    bot.sendMessage(msg.chat.id, `🖋текст:
${text}`);
  } catch (err) {
    console.error('[Whisper Error]', err);
    bot.sendMessage(msg.chat.id, `❌ Ошибка при распознавании: ${err.message}`);
  }
});

console.log('[BOT] JimmyBot is running...');
