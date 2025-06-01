// services/translationService.js
const axios = require('axios');
const { logger, createServiceLogger } = require('../config/logger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// !>7405< ;>335@ 4;O A5@28A0 ?5@52>40
const serviceLogger = createServiceLogger('translation');

/**
 * 5@52>48B B5:AB A >4=>3> O7K:0 =0 4@C3>9
 * @param {string} text - AE>4=K9 B5:AB 4;O ?5@52>40
 * @param {string} sourceLanguage - AE>4=K9 O7K: (87 enum Language)
 * @param {string} targetLanguage - &5;52>9 O7K: (87 enum Language)
 * @returns {Promise<string>} - 5@52545==K9 B5:AB
 */
async function translateText(text, sourceLanguage, targetLanguage) {
  try {
    serviceLogger.info('Translating text', { 
      textLength: text.length, 
      sourceLanguage, 
      targetLanguage 
    });

    // @>25@O5< :MH ?5@52>4>2
    const cachedTranslation = await checkTranslationCache(text, sourceLanguage, targetLanguage);
    if (cachedTranslation) {
      serviceLogger.debug('Using cached translation');
      return cachedTranslation;
    }

    // A;8 O7K:8 >48=0:>2K5, =5 ?5@52>48<
    if (sourceLanguage === targetLanguage) {
      return text;
    }

    // A?>;L7C5< 2=5H=89 API 4;O ?5@52>40 (2 MB>< ?@8<5@5 - Google Translate API)
    //  @50;L=>9 8<?;5<5=B0F88 =C6=> 8A?>;L7>20BL >D8F80;L=K9 API 8;8 4@C3>9 A5@28A
    const translatedText = await translateWithExternalAPI(text, sourceLanguage, targetLanguage);

    // !>E@0=O5< ?5@52>4 2 :MH
    await cacheTranslation(text, translatedText, sourceLanguage, targetLanguage);

    serviceLogger.info('Translation completed successfully');
    return translatedText;
  } catch (error) {
    serviceLogger.error('Translation error', { 
      error: error.message, 
      stack: error.stack,
      sourceLanguage,
      targetLanguage
    });
    //  A;CG05 >H81:8 2>72@0I05< 8AE>4=K9 B5:AB
    return text;
  }
}

/**
 * @>25@O5B =0;8G85 ?5@52>40 2 :MH5
 * @param {string} text - AE>4=K9 B5:AB
 * @param {string} sourceLanguage - AE>4=K9 O7K:
 * @param {string} targetLanguage - &5;52>9 O7K:
 * @returns {Promise<string|null>} - MH8@>20==K9 ?5@52>4 8;8 null
 */
async function checkTranslationCache(text, sourceLanguage, targetLanguage) {
  try {
    // I5< ?5@52>4 2 1075 40==KE
    const cachedTranslation = await prisma.translation_cache.findUnique({
      where: {
        original_text_source_language_target_language: {
          original_text: text,
          source_language: sourceLanguage,
          target_language: targetLanguage
        }
      }
    });

    if (cachedTranslation) {
      // 1=>2;O5< AG5BG8: 8A?>;L7>20=8O 8 40BC ?>A;54=53> 8A?>;L7>20=8O
      await prisma.translation_cache.update({
        where: { id: cachedTranslation.id },
        data: {
          usage_count: { increment: 1 },
          last_used: new Date()
        }
      });
      return cachedTranslation.translated_text;
    }

    return null;
  } catch (error) {
    serviceLogger.error('Translation cache check error', { error: error.message });
    return null;
  }
}

/**
 * !>E@0=O5B ?5@52>4 2 :MH
 * @param {string} originalText - AE>4=K9 B5:AB
 * @param {string} translatedText - 5@52545==K9 B5:AB
 * @param {string} sourceLanguage - AE>4=K9 O7K:
 * @param {string} targetLanguage - &5;52>9 O7K:
 */
async function cacheTranslation(originalText, translatedText, sourceLanguage, targetLanguage) {
  try {
    await prisma.translation_cache.upsert({
      where: {
        original_text_source_language_target_language: {
          original_text: originalText,
          source_language: sourceLanguage,
          target_language: targetLanguage
        }
      },
      update: {
        translated_text: translatedText,
        usage_count: { increment: 1 },
        last_used: new Date()
      },
      create: {
        original_text: originalText,
        translated_text: translatedText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        usage_count: 1,
        last_used: new Date()
      }
    });
  } catch (error) {
    serviceLogger.error('Translation cache save error', { error: error.message });
  }
}

/**
 * 5@52>48B B5:AB A ?><>ILN 2=5H=53> API
 * @param {string} text - AE>4=K9 B5:AB
 * @param {string} sourceLanguage - AE>4=K9 O7K:
 * @param {string} targetLanguage - &5;52>9 O7K:
 * @returns {Promise<string>} - 5@52545==K9 B5:AB
 */
async function translateWithExternalAPI(text, sourceLanguage, targetLanguage) {
  try {
    // 0??8=3 O7K:>2 87 enum 2 :>4K 4;O API
    const languageMap = {
      'ENGLISH': 'en',
      'RUSSIAN': 'ru',
      'GERMAN': 'de',
      'POLISH': 'pl'
    };

    const sourceLang = languageMap[sourceLanguage] || 'en';
    const targetLang = languageMap[targetLanguage] || 'en';

    // TODO: 0<5=8BL =0 8=B53@0F8N A @50;L=K< API ?5@52>40
    // 45AL 2@5<5==0O @50;870F8O 4;O 45<>=AB@0F88
    
    // @8<5@K ?@>ABKE ?5@52>4>2 4;O 45<>=AB@0F88
    const demoTranslations = {
      'en-ru': {
        'hello': '?@825B',
        'world': '<8@',
        'how are you': ':0: 45;0',
        'thank you': 'A?0A81>',
        'goodbye': '4> A2840=8O'
      },
      'ru-en': {
        '?@825B': 'hello',
        '<8@': 'world',
        ':0: 45;0': 'how are you',
        'A?0A81>': 'thank you',
        '4> A2840=8O': 'goodbye'
      }
    };

    const translationKey = `${sourceLang}-${targetLang}`;
    if (demoTranslations[translationKey] && demoTranslations[translationKey][text.toLowerCase()]) {
      return demoTranslations[translationKey][text.toLowerCase()];
    }

    // @5<5==0O M<C;OF8O ?5@52>40 A ?@5D8:A><
    return `[${targetLang}] ${text}`;
    
    /* 
    // @8<5@ @50;L=>9 8=B53@0F88 A API ?5@52>40
    const response = await axios.post('https://translation-api.example.com/translate', {
      text: text,
      source: sourceLang,
      target: targetLang
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.TRANSLATION_API_KEY}`
      }
    });

    return response.data.translatedText;
    */
  } catch (error) {
    serviceLogger.error('External API translation error', { error: error.message });
    //  A;CG05 >H81:8 2>72@0I05< 8AE>4=K9 B5:AB
    return text;
  }
}

module.exports = {
  translateText
};