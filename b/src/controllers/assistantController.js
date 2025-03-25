// controllers/assistantController.js
const prisma = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const translationService = require('../services/translationService');
const speechToTextService = require('../services/speechToTextService');
const textToSpeechService = require('../services/textToSpeechService');

// Начать новую сессию разговора
exports.startConversation = async (req, res) => {
  try {
    const { primaryLanguage, secondaryLanguage, clientId, name } = req.body;
    const userId = req.user.id;
    
    logger.info('Starting new conversation session', {
      userId,
      clientId,
      primaryLanguage,
      secondaryLanguage
    });
    
    const session = await prisma.conversation_sessions.create({
      data: {
        name,
        primary_language: primaryLanguage,
        secondary_language: secondaryLanguage,
        user_id: userId,
        client_id: clientId || null,
        status: 'ACTIVE'
      }
    });
    
    res.status(201).json(session);
  } catch (error) {
    logger.error('Error starting conversation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Завершить сессию разговора
exports.endConversation = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    logger.info(`Ending conversation session ${sessionId}`);
    
    await prisma.conversation_sessions.update({
      where: { id: parseInt(sessionId) },
      data: {
        status: 'COMPLETED',
        end_time: new Date()
      }
    });
    
    res.status(200).json({ message: 'Conversation ended successfully' });
  } catch (error) {
    logger.error('Error ending conversation:', error);
    res.status(500).json({ error: error.message });
  }
};

// Обработать текстовое сообщение
exports.processTextMessage = async (req, res) => {
  try {
    const { sessionId, content, sourceLanguage, targetLanguage } = req.body;
    const senderType = req.body.senderType || 'user';
    
    logger.info('Processing text message', {
      sessionId,
      senderType,
      sourceLanguage,
      targetLanguage
    });
    
    // Выполнить перевод
    const translated = await translationService.translateText(
      content,
      sourceLanguage,
      targetLanguage
    );
    
    // Сохранить сообщение в базе данных
    const message = await prisma.conversation_messages.create({
      data: {
        session_id: parseInt(sessionId),
        sender_type: senderType,
        message_type: 'TEXT',
        original_content: content,
        translated_content: translated,
        source_language: sourceLanguage,
        target_language: targetLanguage
      }
    });
    
    res.status(201).json(message);
  } catch (error) {
    logger.error('Error processing text message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Обработать аудио сообщение
exports.processAudioMessage = async (req, res) => {
  try {
    const { sessionId, sourceLanguage, targetLanguage } = req.body;
    const audioFile = req.file;
    const senderType = req.body.senderType || 'user';
    
    if (!audioFile) {
      logger.warn('No audio file provided');
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    logger.info('Processing audio message', {
      sessionId,
      sourceLanguage,
      targetLanguage,
      audioFileName: audioFile.filename
    });
    
    // Преобразовать аудио в текст
    const transcribedText = await speechToTextService.transcribe(
      audioFile.path,
      sourceLanguage
    );
    
    // Перевести текст
    const translatedText = await translationService.translateText(
      transcribedText,
      sourceLanguage,
      targetLanguage
    );
    
    // Сохранить сообщение
    const message = await prisma.conversation_messages.create({
      data: {
        session_id: parseInt(sessionId),
        sender_type: senderType,
        message_type: 'AUDIO',
        original_content: transcribedText,
        translated_content: translatedText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        audio_file_path: audioFile.path
      }
    });
    
    res.status(201).json({
      message,
      transcribedText,
      translatedText
    });
  } catch (error) {
    logger.error('Error processing audio message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получить историю разговора
exports.getConversationHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    logger.info(`Fetching conversation history for session ${sessionId}`);
    
    const messages = await prisma.conversation_messages.findMany({
      where: {
        session_id: parseInt(sessionId)
      },
      orderBy: {
        created_at: 'asc'
      }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error fetching conversation history:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получить предпочтения пользователя
exports.getUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info(`Fetching assistant preferences for user ${userId}`);
    
    let preferences = await prisma.assistant_preferences.findUnique({
      where: { user_id: userId }
    });
    
    if (!preferences) {
      // Создать предпочтения по умолчанию, если они не существуют
      logger.info(`Creating default preferences for user ${userId}`);
      preferences = await prisma.assistant_preferences.create({
        data: {
          user_id: userId,
          default_language: 'ENGLISH'
        }
      });
    }
    
    res.status(200).json(preferences);
  } catch (error) {
    logger.error('Error fetching user preferences:', error);
    res.status(500).json({ error: error.message });
  }
};

// Обновить предпочтения пользователя
exports.updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      defaultLanguage,
      voiceEnabled,
      translationEnabled,
      assistantTheme,
      autoTranscribe
    } = req.body;
    
    logger.info(`Updating preferences for user ${userId}`, req.body);
    
    const preferences = await prisma.assistant_preferences.upsert({
      where: {
        user_id: userId
      },
      update: {
        default_language: defaultLanguage,
        voice_enabled: voiceEnabled,
        translation_enabled: translationEnabled,
        assistant_theme: assistantTheme,
        auto_transcribe: autoTranscribe
      },
      create: {
        user_id: userId,
        default_language: defaultLanguage || 'ENGLISH',
        voice_enabled: voiceEnabled !== undefined ? voiceEnabled : true,
        translation_enabled: translationEnabled !== undefined ? translationEnabled : true,
        assistant_theme: assistantTheme,
        auto_transcribe: autoTranscribe !== undefined ? autoTranscribe : true
      }
    });
    
    res.status(200).json(preferences);
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получить доступные сессии для пользователя
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info(`Fetching conversation sessions for user ${userId}`);
    
    const sessions = await prisma.conversation_sessions.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: 'desc'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(200).json(sessions);
  } catch (error) {
    logger.error('Error fetching user sessions:', error);
    res.status(500).json({ error: error.message });
  }
};