const startBot = require('../dualLanguageBotService');

const bot = startBot({
  token: process.env.TELEGRAM_DE_RU_BOT,
  defaultDirection: 'de-ru',
  name: 'Немецко-русский переводчик'
});
