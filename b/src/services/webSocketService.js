// services/webSocketService.js
const WebSocket = require('ws');
const prisma = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const translationService = require('../services/translationService');
const speechToTextService = require('../services/speechToTextService');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // userId -> WebSocket
    this.sessions = new Map(); // sessionId -> {userIds: []}
    this.initializeWebSocket();

      // Создаем директорию для аудиофайлов, если она не существует
      const uploadsDir = path.join(__dirname, '../uploads/audio');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    
    logger.info('WebSocket service initialized');
  }

  initializeWebSocket() {
    this.wss.on('connection', async (ws, req) => {
      try {
        // Извлечь токен из запроса
        const token = this.extractTokenFromUrl(req.url);
        if (!token) {
          ws.close(4001, 'Authentication required');
          return;
        }
        
        // Проверить токен и получить userId
        const userData = await this.verifyToken(token);
        if (!userData) {
          ws.close(4003, 'Invalid token');
          return;
        }
        
        const userId = userData.id;
        
        // Сохранить соединение
        this.clients.set(userId, ws);
        
        logger.info(`WebSocket connection established for user ${userId}`);
        
        // Отправить подтверждение подключения
        ws.send(JSON.stringify({
          type: 'CONNECTION_ESTABLISHED',
          userId: userId
        }));
        
        // Обработка сообщений
        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message.toString());
            await this.handleMessage(userId, data, ws);
          } catch (error) {
            logger.error('Error processing WebSocket message:', error);
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: 'Failed to process message'
            }));
          }
        });
        
        // Обработка закрытия соединения
        ws.on('close', () => {
          this.clients.delete(userId);
          logger.info(`WebSocket connection closed for user ${userId}`);
          
          // Удалить пользователя из всех активных сессий
          for (const [sessionId, sessionData] of this.sessions.entries()) {
            if (sessionData.userIds.includes(userId)) {
              sessionData.userIds = sessionData.userIds.filter(id => id !== userId);
              if (sessionData.userIds.length === 0) {
                this.sessions.delete(sessionId);
              }
            }
          }
        });
        
        // Обработка ошибок
        ws.on('error', (error) => {
          logger.error(`WebSocket error for user ${userId}:`, error);
          this.clients.delete(userId);
        });
        
      } catch (error) {
        logger.error('WebSocket connection error:', error);
        ws.close(4000, 'Connection error');
      }
    });
  }

  async handleMessage(userId, data, ws) {
    switch (data.type) {
      case 'JOIN_SESSION':
        await this.handleJoinSession(userId, data.sessionId, ws);
        break;
        
      case 'LEAVE_SESSION':
        await this.handleLeaveSession(userId, data.sessionId);
        break;
        
      case 'TEXT_MESSAGE':
        await this.handleTextMessage(userId, data);
        break;
        
      case 'AUDIO_MESSAGE':
        await this.handleAudioMessage(userId, data);
        break;
        
      case 'TYPING_INDICATOR':
        await this.broadcastTypingIndicator(userId, data.sessionId, data.isTyping);
        break;
        
      default:
        logger.warn(`Unknown message type: ${data.type}`);
        ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Unknown message type'
        }));
    }
  }

  async handleJoinSession(userId, sessionId, ws) {
    try {
      // Проверить существование сессии
      const session = await prisma.conversation_sessions.findUnique({
        where: { id: parseInt(sessionId) },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          },
          client: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      if (!session) {
        ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Session not found'
        }));
        return;
      }
      
      // Получить историю сообщений
      const messages = await prisma.conversation_messages.findMany({
        where: { session_id: parseInt(sessionId) },
        orderBy: { created_at: 'asc' }
      });
      
      // Добавить пользователя в сессию
      if (!this.sessions.has(sessionId)) {
        this.sessions.set(sessionId, { userIds: [userId] });
      } else {
        const sessionData = this.sessions.get(sessionId);
        if (!sessionData.userIds.includes(userId)) {
          sessionData.userIds.push(userId);
        }
      }
      
      // Отправить информацию о сессии и историю сообщений
      ws.send(JSON.stringify({
        type: 'SESSION_JOINED',
        session,
        messages
      }));
      
      logger.info(`User ${userId} joined session ${sessionId}`);
      
      // Уведомить других участников сессии
      this.broadcastToSession(sessionId, {
        type: 'USER_JOINED',
        userId,
        username: session.user.id === userId ? session.user.username : 'Client'
      }, [userId]); // Исключить текущего пользователя
      
    } catch (error) {
      logger.error(`Error joining session ${sessionId}:`, error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Failed to join session'
      }));
    }
  }

  async handleLeaveSession(userId, sessionId) {
    if (this.sessions.has(sessionId)) {
      const sessionData = this.sessions.get(sessionId);
      sessionData.userIds = sessionData.userIds.filter(id => id !== userId);
      
      if (sessionData.userIds.length === 0) {
        this.sessions.delete(sessionId);
      } else {
        // Уведомить других участников о выходе
        this.broadcastToSession(sessionId, {
          type: 'USER_LEFT',
          userId
        });
      }
      
      logger.info(`User ${userId} left session ${sessionId}`);
    }
  }

  async handleTextMessage(userId, data) {
    try {
      const { sessionId, content, sourceLanguage, targetLanguage } = data;
      
      // Получить данные сессии
      const session = await prisma.conversation_sessions.findUnique({
        where: { id: parseInt(sessionId) }
      });
      
      if (!session) {
        logger.warn(`Session ${sessionId} not found for message`);
        return;
      }
      
      // Определить тип отправителя
      const senderType = session.user_id === userId ? 'user' : 'client';
      
      // Получить перевод
      const translatedContent = await translationService.translateText(
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
          translated_content: translatedContent,
          source_language: sourceLanguage,
          target_language: targetLanguage
        }
      });
      
      // Отправить сообщение всем участникам сессии
      this.broadcastToSession(sessionId, {
        type: 'NEW_MESSAGE',
        message
      });
      
      logger.info(`Text message sent in session ${sessionId} by user ${userId}`);
      
    } catch (error) {
      logger.error('Error handling text message:', error);
      
      // Отправить уведомление об ошибке отправителю
      const ws = this.clients.get(userId);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Failed to process text message'
        }));
      }
    }
  }

  async handleAudioMessage(userId, data) {
    try {
      const { sessionId, audioData, sourceLanguage, targetLanguage } = data;
      
      // Получить данные сессии
      const session = await prisma.conversation_sessions.findUnique({
        where: { id: parseInt(sessionId) }
      });
      
      if (!session) {
        logger.warn(`Session ${sessionId} not found for audio message`);
        return;
      }
      
      // Определить тип отправителя
      const senderType = session.user_id === userId ? 'user' : 'client';
      
      // Сохранить аудиофайл
      const audioFilePath = await this.saveAudioFile(audioData, userId, sessionId);
      
      // Отправить уведомление о получении аудио
      this.broadcastToSession(sessionId, {
        type: 'AUDIO_RECEIVED',
        userId,
        sessionId
      });
      
      // Преобразовать аудио в текст
      const transcribedText = await speechToTextService.transcribe(
        audioFilePath,
        sourceLanguage
      );
      
      // Получить перевод
      const translatedContent = await translationService.translateText(
        transcribedText,
        sourceLanguage,
        targetLanguage
      );
      
      // Сохранить сообщение в базе данных
      const message = await prisma.conversation_messages.create({
        data: {
          session_id: parseInt(sessionId),
          sender_type: senderType,
          message_type: 'AUDIO',
          original_content: transcribedText,
          translated_content: translatedContent,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          audio_file_path: audioFilePath
        }
      });
      
      // Отправить сообщение всем участникам сессии
      this.broadcastToSession(sessionId, {
        type: 'NEW_AUDIO_MESSAGE',
        message,
        transcribedText,
        translatedContent
      });
      
      logger.info(`Audio message processed in session ${sessionId} by user ${userId}`);
      
    } catch (error) {
      logger.error('Error handling audio message:', error);
      
      // Отправить уведомление об ошибке отправителю
      const ws = this.clients.get(userId);
      if (ws) {
        ws.send(JSON.stringify({
          type: 'ERROR',
          message: 'Failed to process audio message'
        }));
      }
    }
  }

  async broadcastTypingIndicator(userId, sessionId, isTyping) {
    this.broadcastToSession(sessionId, {
      type: 'TYPING_INDICATOR',
      userId,
      isTyping
    }, [userId]); // Исключить отправителя
  }

  // Вспомогательные методы

  async saveAudioFile(audioData, userId, sessionId) {
    // Здесь должна быть реализация сохранения аудио-файла
    // Это пример базовой реализации
    const fs = require('fs');
    const path = require('path');
    
    const uploadsDir = path.join(__dirname, '../uploads/audio');
    
    // Создать папку, если не существует
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filename = `audio_${sessionId}_${userId}_${Date.now()}.webm`;
    const filePath = path.join(uploadsDir, filename);
    
    // Декодировать base64 данные
    const buffer = Buffer.from(audioData.split(',')[1], 'base64');
    
    // Записать файл
    fs.writeFileSync(filePath, buffer);
    
    return filePath;
  }

  broadcastToSession(sessionId, data, excludeUserIds = []) {
    if (!this.sessions.has(sessionId)) {
      return;
    }
    
    const sessionData = this.sessions.get(sessionId);
    const userIds = sessionData.userIds.filter(id => !excludeUserIds.includes(id));
    
    userIds.forEach(userId => {
      const ws = this.clients.get(userId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }

  extractTokenFromUrl(url) {
    if (!url) return null;
    
    const urlObj = new URL(url, 'http://localhost');
    return urlObj.searchParams.get('token');
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, jwtSecret);
      return decoded;
    } catch (error) {
      logger.error('Token verification error:', error);
      return null;
    }
  }
}

module.exports = WebSocketService;