// dashkaVoiceReply.js
const fs = require('fs');
const path = require('path');
const { speakText } = require('./textToSpeechService');

/**
 * Отправляет голосовой ответ пользователю.
 * @param {TelegramBot} bot - Инстанс Telegram-бота
 * @param {number} chatId - ID чата Telegram
 * @param {string} text - Текст, который нужно озвучить
 */
async function replyWithVoice(bot, chatId, text) {
  try {
    const voicePath = path.join(__dirname, '../shared/audio', `reply_${Date.now()}.ogg`);
    await speakText(text, voicePath);
    await bot.sendVoice(chatId, voicePath);
    // Можно очистить старые файлы позже (или cron)
  } catch (err) {
    console.error('[Dashka Voice Reply Error]', err);
    bot.sendMessage(chatId, '⚠️ Ошибка при генерации голосового ответа.');
  }
}

module.exports = { replyWithVoice };
