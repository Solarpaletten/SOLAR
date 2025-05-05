const axios = require('axios');
require('dotenv').config();

const MAX_CHUNK_LENGTH = 1000;

function splitTextIntoChunks(text, maxLength = MAX_CHUNK_LENGTH) {
  const words = text.split(' ');
  const chunks = [];
  let chunk = '';

  for (const word of words) {
    if ((chunk + word).length > maxLength) {
      chunks.push(chunk.trim());
      chunk = '';
    }
    chunk += word + ' ';
  }

  if (chunk.trim()) {
    chunks.push(chunk.trim());
  }

  return chunks;
}

async function translateChunk(text, targetLang = 'en') {
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Translate this to ${targetLang}: "${text}"`,
        },
      ],
      temperature: 0.5,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

async function translateText(text, targetLang = 'en') {
  try {
    const chunks = splitTextIntoChunks(text);
    const translatedChunks = [];

    for (const chunk of chunks) {
      const translated = await translateChunk(chunk, targetLang);
      translatedChunks.push(translated);
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Ошибка перевода:', error.response?.data || error.message);
    throw new Error('Не удалось перевести текст');
  }
}

module.exports = { translateText };
