// services/textToSpeechService.js
const fs = require('fs');
const path = require('path');
const util = require('util');
const { createServiceLogger } = require('../config/logger');
const googleTTS = require('google-tts-api');

// !>7405< ;>335@ 4;O A5@28A0 A8=B570 @5G8
const serviceLogger = createServiceLogger('textToSpeech');

// @5>1@07C5< :>;1M:-DC=:F88 2 ?@><8AK
const writeFileAsync = util.promisify(fs.writeFile);
const mkdirAsync = util.promisify(fs.mkdir);

/**
 * @5>1@07C5B B5:AB 2 @5GL 8 A>E@0=O5B :0: 0C48>D09;
 * @param {string} text - "5:AB 4;O ?@5>1@07>20=8O
 * @param {string} language - /7K: B5:AB0 (87 enum Language)
 * @param {string} [outputDir='/var/www/aisolar/solar/b/src/uploads/audio'] - 8@5:B>@8O 4;O A>E@0=5=8O 0C48>D09;0
 * @returns {Promise<string>} - CBL : A>740==><C 0C48>D09;C
 */
async function synthesize(text, language = 'ENGLISH', outputDir = path.join(process.cwd(), 'src/uploads/audio')) {
  try {
    serviceLogger.info('Starting text-to-speech synthesis', { 
      textLength: text.length, 
      language 
    });

    // @>25@O5< ACI5AB2>20=85 48@5:B>@88
    await ensureDirectoryExists(outputDir);

    // ?@545;O5< O7K: 4;O API (87 enum 2 :>4 O7K:0)
    const languageMap = {
      'ENGLISH': 'en',
      'RUSSIAN': 'ru',
      'GERMAN': 'de',
      'POLISH': 'pl'
    };
    const languageCode = languageMap[language] || 'en';

    // 5=5@8@C5< 8<O D09;0
    const filename = `tts_${Date.now()}.mp3`;
    const outputPath = path.join(outputDir, filename);

    // !8=B578@C5< @5GL
    const audioContent = await synthesizeWithGoogleTTS(text, languageCode);
    
    // !>E@0=O5< 0C48>D09;
    await writeFileAsync(outputPath, audioContent);

    serviceLogger.info('Speech synthesis completed successfully', { outputPath });
    return outputPath;
  } catch (error) {
    serviceLogger.error('Speech synthesis error', { 
      error: error.message, 
      stack: error.stack,
      textLength: text.length,
      language
    });
    throw error;
  }
}

/**
 * !8=B578@C5B @5GL A ?><>ILN Google TTS API
 * @param {string} text - "5:AB 4;O ?@5>1@07>20=8O
 * @param {string} languageCode - >4 O7K:0 (en, ru, de, pl)
 * @returns {Promise<Buffer>} - C48>40==K5 2 D>@<0B5 Buffer
 */
async function synthesizeWithGoogleTTS(text, languageCode) {
  try {
    // A?>;L7C5< 15A?;0B=CN 25@A8N Google TTS API G5@57 npm-?0:5B
    const url = await googleTTS.getAudioUrl(text, {
      lang: languageCode,
      slow: false,
      host: 'https://translate.google.com',
    });

    // >;CG05< 0C48>D09;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download audio: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    serviceLogger.error('Google TTS API synthesis error', { 
      error: error.message, 
      stack: error.stack
    });
    throw error;
  }
}

/**
 * @>25@O5B ACI5AB2>20=85 48@5:B>@88 8 A>7405B 5Q ?@8 =5>1E>48<>AB8
 * @param {string} directory - CBL : 48@5:B>@88
 */
async function ensureDirectoryExists(directory) {
  try {
    // @>25@O5< ACI5AB2>20=85 48@5:B>@88
    if (!fs.existsSync(directory)) {
      await mkdirAsync(directory, { recursive: true });
      serviceLogger.info(`Created directory: ${directory}`);
    }
  } catch (error) {
    serviceLogger.error('Failed to create directory', { 
      directory, 
      error: error.message 
    });
    throw error;
  }
}

module.exports = {
  synthesize
};