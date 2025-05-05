const languageConfig = require('../src/services/languageConfig');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Указываем все файлы конфигурации ботов
const botFiles = [
  {
    file: 'de_ru_bot.js',
    tokenKey: 'TELEGRAM_DE_RU_BOT',
    defaultDirection: 'de-ru',
  },
  {
    file: 'cs_ru_bot.js',
    tokenKey: 'TELEGRAM_CS_RU_BOT',
    defaultDirection: 'cs-ru',
  },
  {
    file: 'es_ru_bot.js',
    tokenKey: 'TELEGRAM_ES_RU_BOT',
    defaultDirection: 'es-ru',
  },
  {
    file: 'pl_ru_bot.js',
    tokenKey: 'TELEGRAM_PL_RU_BOT',
    defaultDirection: 'pl-ru',
  },
  {
    file: 'lv_ru_bot.js',
    tokenKey: 'TELEGRAM_LV_RU_BOT',
    defaultDirection: 'lv-ru',
  },
  {
    file: 'en_ru_bot.js',
    tokenKey: 'TELEGRAM_EN_RU_BOT',
    defaultDirection: 'en-ru',
  },
  // Добавь новые боты здесь
];

let allPassed = true;

for (const bot of botFiles) {
  const token = process.env[bot.tokenKey];
  const direction = bot.defaultDirection;
  const lang = languageConfig[direction];

  console.log(`\n🔍 Проверка ${bot.file}`);

  if (!token) {
    console.error(`❌ Нет токена ${bot.tokenKey} в .env`);
    allPassed = false;
  } else {
    console.log(`✅ Токен ${bot.tokenKey} найден`);
  }

  if (!lang) {
    console.error(`❌ Направление ${direction} не найдено в languageConfig`);
    allPassed = false;
  } else {
    if (!lang.source || !lang.target || !lang.emoji) {
      console.error(`❌ Направление ${direction} неполное:`, lang);
      allPassed = false;
    } else {
      console.log(`✅ Языковая пара ${direction} валидна (${lang.emoji.from} → ${lang.emoji.to})`);
    }
  }
}

if (allPassed) {
  console.log('\n🎉 Все конфигурации ботов прошли проверку!');
  process.exit(0);
} else {
  console.error('\n❗ Ошибки найдены в конфигурациях ботов. Проверь .env и languageConfig.js');
  process.exit(1);
}
