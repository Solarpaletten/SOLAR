/**
 * Conversation Log Service
 * Manages logging, tracking, and analysis of conversation data
 */
const { logger } = require('../config/logger');
const prisma = require('../utils/prismaManager');
const conversationManager = require('../utils/create/conversationManager');

class ConversationLogService {
  constructor() {
    logger.info('ConversationLogService initialized');
  }

  /**
   * Log a user message
   * @param {number} userId - User ID
   * @param {number} sessionId - Conversation session ID
   * @param {string} message - Message content
   * @param {Object} metadata - Additional message metadata
   * @returns {Promise<Object>} - Logged message
   */
  async logUserMessage(userId, sessionId, message, metadata = {}) {
    try {
      logger.info('Logging user message', { userId, sessionId });
      
      // Create activity log
      await prisma.user_activities.create({
        data: {
          user_id: userId,
          module_id: 'assistant',
          action: 'send_message',
          metadata: {
            sessionId,
            messageLength: message.length,
            timestamp: new Date(),
            ...metadata
          }
        }
      });
      
      // Return added message via conversation manager
      return await conversationManager.addMessage(
        sessionId,
        message,
        'user',
        metadata.messageType || 'TEXT',
        {
          sourceLanguage: metadata.sourceLanguage,
          targetLanguage: metadata.targetLanguage,
          translatedContent: metadata.translatedContent
        }
      );
    } catch (error) {
      logger.error('Error logging user message:', error);
      throw error;
    }
  }

  /**
   * Log an assistant message
   * @param {number} sessionId - Conversation session ID
   * @param {string} message - Message content
   * @param {Object} metadata - Additional message metadata
   * @returns {Promise<Object>} - Logged message
   */
  async logAssistantMessage(sessionId, message, metadata = {}) {
    try {
      logger.info('Logging assistant message', { sessionId });
      
      // Return added message via conversation manager
      return await conversationManager.addMessage(
        sessionId,
        message,
        'assistant',
        metadata.messageType || 'TEXT',
        {
          sourceLanguage: metadata.sourceLanguage,
          targetLanguage: metadata.targetLanguage,
          translatedContent: metadata.translatedContent
        }
      );
    } catch (error) {
      logger.error('Error logging assistant message:', error);
      throw error;
    }
  }

  /**
   * Generate conversation summary
   * @param {number} sessionId - Conversation session ID
   * @returns {Promise<Object>} - Conversation summary
   */
  async generateConversationSummary(sessionId) {
    try {
      logger.info('Generating conversation summary', { sessionId });
      
      const messages = await conversationManager.getConversationHistory(sessionId);
      const analysis = await conversationManager.analyzeConversation(sessionId);
      
      // Get session details
      const session = await prisma.conversation_sessions.findUnique({
        where: { id: sessionId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          client: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      
      // Generate summary
      // TODO: Implement actual summarization logic
      // For now, return basic statistics
      return {
        sessionId,
        startTime: session.created_at,
        endTime: session.end_time || new Date(),
        duration: this._calculateDuration(session.created_at, session.end_time),
        user: session.user,
        client: session.client,
        primaryLanguage: session.primary_language,
        secondaryLanguage: session.secondary_language,
        messageCount: messages.length,
        sentiment: analysis.sentiment,
        topics: analysis.topics
      };
    } catch (error) {
      logger.error('Error generating conversation summary:', error);
      throw error;
    }
  }

  /**
   * Get conversation statistics for a user
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - User's conversation statistics
   */
  async getUserConversationStats(userId) {
    try {
      logger.info('Getting user conversation statistics', { userId });
      
      // Get all sessions for the user
      const sessions = await prisma.conversation_sessions.findMany({
        where: {
          user_id: userId
        },
        include: {
          conversation_messages: true
        }
      });
      
      // Calculate statistics
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter(s => s.status === 'COMPLETED').length;
      const totalMessages = sessions.reduce((sum, session) => sum + session.conversation_messages.length, 0);
      
      // Average messages per session
      const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;
      
      // Most active client
      const clientCounts = {};
      sessions.forEach(session => {
        if (session.client_id) {
          clientCounts[session.client_id] = (clientCounts[session.client_id] || 0) + 1;
        }
      });
      
      const mostActiveClientId = Object.keys(clientCounts).reduce((a, b) => 
        clientCounts[a] > clientCounts[b] ? a : b, null);
      
      return {
        userId,
        totalSessions,
        completedSessions,
        activeSessions: totalSessions - completedSessions,
        totalMessages,
        avgMessagesPerSession: Math.round(avgMessagesPerSession * 10) / 10,
        mostActiveClientId: mostActiveClientId ? parseInt(mostActiveClientId) : null
      };
    } catch (error) {
      logger.error('Error getting user conversation stats:', error);
      throw error;
    }
  }

  /**
   * Calculate duration between two dates
   * @private
   */
  _calculateDuration(startTime, endTime) {
    const end = endTime || new Date();
    const diffMs = end.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return diffMins;
  }
}

module.exports = new ConversationLogService();