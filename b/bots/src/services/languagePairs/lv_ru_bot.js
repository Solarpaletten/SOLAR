const startBot = require('../dualLanguageBotService');

const bot = startBot({
  token: process.env.TELEGRAM_LV_RU_BOT,
  defaultDirection: 'lv-ru',
  name: 'Латвийско-русский переводчик'
});
