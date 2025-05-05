// src/services/dualLanguageBotService.js
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const axios = require('axios');
const { transcribeAudio } = require('./whisperService');
const { translateText } = require('./translationService');
const { speakText } = require('./textToSpeechService');
const languageConfig = require('./languageConfig');
const { handleSmartVoice } = require('./smartVoicePipeline');

function startBot(config) {
  // Установка значений по умолчанию
  if (!config.token) {
    throw new Error('❌ Token not provided. Please pass config.token.');
  }

  if (!config.defaultDirection) {
    throw new Error('❌ defaultDirection not provided. Please pass config.defaultDirection.');
  }
  const botToken = config.token;
  const defaultDirection = config.defaultDirection;
  const botName = config.name || 'Translator Bot';
  
  // Создаем tmp директорию
  const tmpDir = path.join(__dirname, '../../tmp');
  fs.mkdirSync(tmpDir, { recursive: true });

  // Хранение настроек пользователей
  const userSettings = new Map();
  
  // Инициализация бота
  const bot = new TelegramBot(botToken, { polling: true });
  
  // Функция очистки временных файлов
  setupFileCleaning(tmpDir);
  
  // Функция для получения настроек пользователя
  function getUserSettings(chatId) {
    if (!userSettings.has(chatId)) {
      userSettings.set(chatId, { direction: defaultDirection });
    }
    return userSettings.get(chatId);
  }

  // Команда старта
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const settings = getUserSettings(chatId);
    const langPair = languageConfig[settings.direction];
    
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: `${langPair.emoji.from} → ${langPair.emoji.to}`, callback_data: `current` },
          { text: "Сменить направление", callback_data: "switch_direction" }
        ]
      ]
    };
    
    bot.sendMessage(chatId, 
      `👋 Привет! Я ${botName}.\\n\\n` +
      `Текущий режим перевода: ${langPair.emoji.from} → ${langPair.emoji.to}\\n\\n` +
      `Просто отправьте текст или голосовое сообщение для перевода!`,
      { reply_markup: replyMarkup }
    );
  });
  
  // Обработка нажатий на inline кнопки
  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const settings = getUserSettings(chatId);
    
    if (query.data === "switch_direction") {
      // Создаем кнопки для всех возможных языковых пар
      const keyboard = Object.entries(languageConfig).map(([dirCode, langData]) => {
        return [{ 
          text: `${langData.emoji.from} → ${langData.emoji.to}`, 
          callback_data: `set_${dirCode}` 
        }];
      });
      
      bot.sendMessage(chatId, "Выберите направление перевода:", {
        reply_markup: { inline_keyboard: keyboard }
      });
    } 
    else if (query.data.startsWith("set_")) {
      const direction = query.data.replace("set_", "");
      if (languageConfig[direction]) {
        settings.direction = direction;
        const langPair = languageConfig[direction];
        bot.answerCallbackQuery(query.id, { 
          text: `Установлено направление ${langPair.emoji.from} → ${langPair.emoji.to}` 
        });
        
        bot.sendMessage(chatId, 
          `✅ Направление перевода изменено на ${langPair.emoji.from} → ${langPair.emoji.to}`
        );
      }
    }
  });
  
  // Обработка голосовых сообщений
  bot.on('voice', async (msg) => {
    const chatId = msg.chat.id;
    const settings = getUserSettings(chatId);
    const langPair = languageConfig[settings.direction];
    
    const fileId = msg.voice.file_id;
    try {
      // Отправляем статус обработки
      const statusMsg = await bot.sendMessage(chatId, '🔄 Обрабатываю голосовое сообщение...');
      
      // Получаем информацию о файле
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${botToken}/${file.file_path}`;
      const filePath = path.join(tmpDir, `${fileId}.ogg`);
      
      // Скачиваем файл с использованием axios
      const response = await axios({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream'
      });
      
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      
      // Распознаем речь
      const transcript = await transcribeAudio(filePath, langPair.source);
      console.log(`[BOT] Распознан текст: "${transcript}"`);
      
      // Переводим
      const translated = await translateText(transcript, langPair.target, langPair.source);
      console.log(`[BOT] Переведенный текст: "${translated}"`);
      
      // Озвучиваем перевод
      const audioPath = await speakText(translated, langPair.target);
      
      // Удаляем сообщение о статусе
      await bot.deleteMessage(chatId, statusMsg.message_id);
      
      // Отправляем результаты
      await bot.sendMessage(chatId, 
        `${langPair.emoji.from} Распознано:\\n"${transcript}"\\n\\n` +
        `${langPair.emoji.to} Перевод:\\n"${translated}"`
      );
      
      // Отправляем озвучку перевода
      await bot.sendAudio(chatId, audioPath, {
        caption: `🔊 Озвучка перевода на ${getLanguageName(langPair.target)} языке`
      });
    } catch (error) {
      console.error('Ошибка при обработке голосового:', error);
      bot.sendMessage(chatId, '⚠️ Ошибка при обработке голосового сообщения');
    }
  });
  
  // Обработка текстовых сообщений (без команд)
  bot.on('text', async (msg) => {
    // Игнорируем сообщения с командами
    if (msg.text.startsWith('/')) return;
    
    const chatId = msg.chat.id;
    const text = msg.text;
    const settings = getUserSettings(chatId);
    const langPair = languageConfig[settings.direction];
    
    try {
      // Выполняем перевод
      const translated = await translateText(text, langPair.target, langPair.source);
      
      // Отправляем результат
      bot.sendMessage(chatId, 
        `${langPair.emoji.to} ${translated}`
      );
    } catch (error) {
      console.error('Ошибка при переводе текста:', error);
      bot.sendMessage(chatId, '⚠️ Ошибка при переводе текста');
    }
  });
  
  // Вспомогательная функция для получения названия языка
  function getLanguageName(langCode) {
    const names = {
      'de': 'немецком',
      'ru': 'русском',
      'cs': 'чешском',
      'pl': 'польском',
      'en': 'английском'
      // Добавить другие языки по мере необходимости
    };
    return names[langCode] || langCode;
  }
  
  console.log(`[BOT] ${botName} запущен`);
  return bot;
}

function setupFileCleaning(tmpDir) {
  setInterval(() => {
    fs.readdir(tmpDir, (err, files) => {
      if (err) return;
      files.forEach(file => {
        const filePath = path.join(tmpDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          const now = Date.now();
          const age = now - stats.mtimeMs;
          if (age > 10 * 60 * 1000) fs.unlink(filePath, () => {});
        });
      });
    });
  }, 5 * 60 * 1000);
}

module.exports = startBot;