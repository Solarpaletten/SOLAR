const fs = require('fs');
const path = require('path');
const googleTTS = require('google-tts-api');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

async function speakText(text, lang = 'en') {
  try {
    const mp3Name = `speech_${Date.now()}.mp3`;
    const oggName = mp3Name.replace('.mp3', '.ogg');
    const mp3Path = path.join(__dirname, '../../tmp', mp3Name);
    const oggPath = path.join(__dirname, '../../tmp', oggName);

    const url = googleTTS.getAudioUrl(text, { lang, slow: false });

    const response = await axios({ method: 'GET', url, responseType: 'arraybuffer' });
    fs.writeFileSync(mp3Path, response.data);

    await new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .audioCodec('libopus')
        .format('ogg')
        .on('end', resolve)
        .on('error', reject)
        .save(oggPath);
    });

    return oggPath;
  } catch (error) {
    console.error('Ошибка при генерации аудио:', error);
    throw error;
  }
}

module.exports = { speakText };
