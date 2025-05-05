const startBot = require('../dualLanguageBotService');

const bot = startBot({
  token: process.env.TELEGRAM_ES_RU_BOT,
  defaultDirection: 'es-ru',
  name: 'Испанско-русский переводчик'
});
