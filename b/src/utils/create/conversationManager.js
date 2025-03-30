/**
 * Conversation Manager for SOLAR Assistant
 * Manages conversation flow, context tracking, and state transitions
 */
const { logger } = require('../../config/logger');
const prisma = require('../../utils/prismaManager');

class ConversationManager {
  constructor() {
    logger.info('ConversationManager initialized');
  }

  /**
   * Initialize a new conversation
   * @param {number} userId - User ID
   * @param {number} clientId - Optional client ID for business conversations
   * @param {string} primaryLanguage - User's primary language
   * @param {string} secondaryLanguage - Translation target language
   * @returns {Promise<Object>} - Created conversation session
   */
  async createConversation(userId, clientId = null, primaryLanguage = 'ENGLISH', secondaryLanguage = null) {
    try {
      logger.info('Creating new conversation', { userId, clientId, primaryLanguage, secondaryLanguage });
      
      const session = await prisma.conversation_sessions.create({
        data: {
          user_id: userId,
          client_id: clientId,
          primary_language: primaryLanguage,
          secondary_language: secondaryLanguage,
          status: 'ACTIVE',
          created_at: new Date()
        }
      });
      
      return session;
    } catch (error) {
      logger.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Add a message to the conversation
   * @param {number} sessionId - Conversation session ID
   * @param {string} content - Message content
   * @param {string} senderType - Who sent the message (user/assistant)
   * @param {string} messageType - Type of message (text/audio)
   * @param {Object} options - Additional options like languages
   * @returns {Promise<Object>} - Created message
   */
  async addMessage(sessionId, content, senderType = 'user', messageType = 'TEXT', options = {}) {
    try {
      const { sourceLanguage, targetLanguage, translatedContent } = options;
      
      logger.info('Adding message to conversation', {
        sessionId,
        senderType,
        messageType,
        sourceLanguage,
        targetLanguage
      });
      
      const message = await prisma.conversation_messages.create({
        data: {
          session_id: sessionId,
          sender_type: senderType,
          message_type: messageType,
          original_content: content,
          translated_content: translatedContent || null,
          source_language: sourceLanguage || null,
          target_language: targetLanguage || null,
          created_at: new Date()
        }
      });
      
      return message;
    } catch (error) {
      logger.error('Error adding message to conversation:', error);
      throw error;
    }
  }

  /**
   * Retrieve conversation history
   * @param {number} sessionId - Conversation session ID
   * @param {number} limit - Maximum number of messag