const startBot = require('../dualLanguageBotService');

const bot = startBot({
  token: process.env.TELEGRAM_CS_RU_BOT,
  defaultDirection: 'cs-ru',
  name: 'Чешско-русский переводчик'
});
