const startBot = require('../dualLanguageBotService');

const bot = startBot({
  token: process.env.TELEGRAM_PL_RU_BOT,
  defaultDirection: 'pl-ru',
  name: 'Польско-русский переводчик'
});
