// services/speechToTextService.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { createServiceLogger } = require('../config/logger');

// !>7405< ;>335@ 4;O A5@28A0 @0A?>7=020=8O @5G8
const serviceLogger = createServiceLogger('speechToText');

/**
 * "@0=A:@818@C5B 0C48>D09; 2 B5:AB
 * @param {string} audioFilePath - CBL : 0C48>D09;C
 * @param {string} language - /7K: 0C48> (87 enum Language)
 * @returns {Promise<string>} -  0A?>7=0==K9 B5:AB
 */
async function transcribe(audioFilePath, language = 'ENGLISH') {
  try {
    serviceLogger.info('Starting audio transcription', { 
      audioFilePath, 
      language 
    });

    // @>25@O5< ACI5AB2>20=85 D09;0
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    // ?@545;O5< O7K: 4;O API (87 enum 2 :>4 O7K:0)
    const languageMap = {
      'ENGLISH': 'en',
      'RUSSIAN': 'ru',
      'GERMAN': 'de',
      'POLISH': 'pl'
    };
    const languageCode = languageMap[language] || 'en';

    // A?>;L7C5< Whisper API 4;O B@0=A:@8?F88
    //  45<>-25@A88 ?@>AB> M<C;8@C5< ?@>F5AA
    const transcribedText = await transcribeWithWhisperAPI(audioFilePath, languageCode);

    serviceLogger.info('Transcription completed successfully', { 
      audioFilePath,
      textLength: transcribedText.length
    });

    return transcribedText;
  } catch (error) {
    serviceLogger.error('Transcription error', { 
      error: error.message, 
      stack: error.stack,
      audioFilePath,
      language
    });
    //  A;CG05 >H81:8 2>72@0I05< ?CABCN AB@>:C
    return 'Error transcribing audio';
  }
}

/**
 * "@0=A:@818@C5B 0C48>D09; A ?><>ILN Whisper API
 * @param {string} audioFilePath - CBL : 0C48>D09;C
 * @param {string} languageCode - >4 O7K:0 (en, ru, de, pl)
 * @returns {Promise<string>} -  0A?>7=0==K9 B5:AB
 */
async function transcribeWithWhisperAPI(audioFilePath, languageCode) {
  try {
    // TODO: 0<5=8BL =0 @50;L=CN 8=B53@0F8N A Whisper API
    // 45AL 2@5<5==0O @50;870F8O 4;O 45<>=AB@0F88
    
    // 5<>-@50;870F8O - ?@>AB> 2>72@0I05< B5:AB =0 >A=>25 8<5=8 D09;0
    const filename = path.basename(audioFilePath);
    
    // -<C;OF8O 7045@6:8 4;O @50;8AB8G=>AB8
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // @>25@O5< D>@<0B D09;0
    const fileExt = path.extname(audioFilePath).toLowerCase();
    if (!['.mp3', '.wav', '.ogg', '.m4a', '.webm'].includes(fileExt)) {
      serviceLogger.warn('Unsupported audio format', { 
        format: fileExt,
        supportedFormats: '.mp3, .wav, .ogg, .m4a, .webm'
      });
    }

    // ?@545;O5< 45<>->B25B 2 7028A8<>AB8 >B O7K:0
    const demoResponses = {
      'en': 'This is a sample transcription of an English audio message.',
      'ru': '-B> ?@8<5@ B@0=A:@8?F88 0C48>A>>1I5=8O =0 @CAA:>< O7K:5.',
      'de': 'Dies ist ein Beispiel für die Transkription einer deutschen Audionachricht.',
      'pl': 'To jest przykBadowa transkrypcja wiadomo[ci audio w jzyku polskim.'
    };

    return demoResponses[languageCode] || demoResponses['en'];
    
    /* 
    // @8<5@ @50;L=>9 8=B53@0F88 A Whisper API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioFilePath));
    formData.append('model', 'whisper-1');
    formData.append('language', languageCode);
    
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', 
      formData, 
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.text;
    */
  } catch (error) {
    serviceLogger.error('Whisper API transcription error', { 
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

module.exports = {
  transcribe
};