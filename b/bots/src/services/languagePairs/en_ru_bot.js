const startBot = require('../dualLanguageBotService');

const bot = startBot({
  token: process.env.TELEGRAM_EN_RU_BOT,
  defaultDirection: 'en-ru',
  name: 'Англо-русский переводчик'
});
