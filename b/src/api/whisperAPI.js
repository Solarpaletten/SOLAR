const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const config = require('../config/speechServices');
const { logger } = require('../config/logger');

class WhisperAPI {
  constructor() {
    this.apiKey = config.whisperApiKey;
    this.baseUrl = 'https://api.openai.com/v1/audio/transcriptions';
  }

  async transcribeAudio(audioFilePath, language) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(audioFilePath));
      formData.append('model', 'whisper-1');
      
      if (language) {
        formData.append('language', this.mapLanguageCode(language));
      }

      logger.info('Sending audio to Whisper API for transcription', {
        language: language
      });

      const response = await axios.post(this.baseUrl, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data.text;
    } catch (error) {
      logger.error('Whisper API error:', error.response?.data || error.message);
      throw new Error('Failed to transcribe audio');
    }
  }

  mapLanguageCode(language) {
    // Сопоставление языков из перечисления в ISO коды языков
    const languageMap = {
      'ENGLISH': 'en',
      'RUSSIAN': 'ru',
      'GERMAN': 'de',
      'POLISH': 'pl'
    };
    
    return languageMap[language] || 'en';
  }
}

module.exports = new WhisperAPI();