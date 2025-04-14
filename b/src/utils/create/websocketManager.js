const WebSocket = require('ws');
const { logger } = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.channels = new Map();

    this.initialize();
  }

  initialize() {
    this.wss.on('connection', (ws, req) => {
      const clientId = uuidv4();
      const clientInfo = {
        id: clientId,
        ws,
        channels: new Set(),
        ip: req.socket.remoteAddress,
        connectTime: new Date(),
        lastActivity: Date.now(), // Время последней активности
      };

      this.clients.set(clientId, clientInfo);
      logger.info('WebSocket client connected:', {
        clientId,
        ip: clientInfo.ip,
      });

      // Обработка сообщений
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(clientId, data);
        } catch (error) {
          logger.error('WebSocket message error:', {
            clientId,
            error: error.message,
          });
          this.sendError(ws, 'Invalid message format');
        }
      });

      // Обработка отключения
      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });

      // Обработка ошибок
      ws.on('error', (error) => {
        logger.error('WebSocket client error:', {
          clientId,
          error: error.message,
        });
      });

      // Отправка приветственного сообщения с информацией о тайм-ауте сессии
      this.send(ws, {
        type: 'welcome',
        data: { 
          clientId,
          sessionTimeout: 5 * 60, // таймаут сессии в секундах
        },
      });
    });

    // Периодическая проверка соединений
    setInterval(() => {
      this.checkConnections();
    }, 30000);
  }

  // Обработка входящих сообщений
  handleMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    // Обновляем время последней активности при каждом сообщении
    client.lastActivity = Date.now();

    switch (message.type) {
      case 'subscribe':
        this.handleSubscribe(clientId, message.channels);
        break;
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, message.channels);
        break;
      case 'message':
        this.handleClientMessage(clientId, message);
        break;
      case 'ping':
        this.send(client.ws, { type: 'pong' });
        break;
      default:
        logger.warn('Unknown message type:', { clientId, type: message.type });
    }
  }

  // Подписка на каналы
  handleSubscribe(clientId, channelNames) {
    const client = this.clients.get(clientId);
    if (!client) return;

    channelNames.forEach((channelName) => {
      if (!this.channels.has(channelName)) {
        this.channels.set(channelName, new Set());
      }
      this.channels.get(channelName).add(clientId);
      client.channels.add(channelName);
    });

    this.send(client.ws, {
      type: 'subscribed',
      channels: Array.from(client.channels),
    });
  }

  // Отписка от каналов
  handleUnsubscribe(clientId, channelNames) {
    const client = this.clients.get(clientId);
    if (!client) return;

    channelNames.forEach((channelName) => {
      const channel = this.channels.get(channelName);
      if (channel) {
        channel.delete(clientId);
        if (channel.size === 0) {
          this.channels.delete(channelName);
        }
      }
      client.channels.delete(channelName);
    });

    this.send(client.ws, {
      type: 'unsubscribed',
      channels: Array.from(client.channels),
    });
  }

  // Отправка сообщения в канал
  broadcast(channel, message, excludeClientId = null) {
    const subscribers = this.channels.get(channel);
    if (!subscribers) return;

    subscribers.forEach((clientId) => {
      if (clientId !== excludeClientId) {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
          this.send(client.ws, message);
        }
      }
    });
  }

  // Отправка сообщения конкретному клиенту
  send(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // Отправка сообщения об ошибке
  sendError(ws, error) {
    this.send(ws, {
      type: 'error',
      error,
    });
  }

  // Обработка отключения клиента
  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Удаляем клиента из всех каналов
    client.channels.forEach((channelName) => {
      const channel = this.channels.get(channelName);
      if (channel) {
        channel.delete(clientId);
        if (channel.size === 0) {
          this.channels.delete(channelName);
        }
      }
    });

    this.clients.delete(clientId);
    logger.info('WebSocket client disconnected:', { clientId });
  }

  // Проверка соединений и закрытие неактивных
  checkConnections() {
    const now = Date.now();
    const INACTIVE_TIMEOUT = 5 * 60 * 1000; // 5 минут неактивности
    let closedCount = 0;
    
    this.clients.forEach((client, clientId) => {
      // Проверка на закрытые соединения
      if (client.ws.readyState === WebSocket.CLOSED) {
        this.handleDisconnect(clientId);
        closedCount++;
      } 
      // Проверка на неактивные соединения
      else if (now - client.lastActivity > INACTIVE_TIMEOUT) {
        logger.info(`Closing inactive connection for client ${clientId}, inactive for ${Math.round((now - client.lastActivity) / 1000 / 60)} minutes`);
        client.ws.close(4000, 'Session timeout due to inactivity');
        this.handleDisconnect(clientId);
        closedCount++;
      }
    });
    
    if (closedCount > 0) {
      logger.info(`Cleaned up ${closedCount} connections (closed or inactive)`);
    }
  }

  // Получение статистики
  getStats() {
    return {
      totalClients: this.clients.size,
      totalChannels: this.channels.size,
      channels: Array.from(this.channels.entries()).map(([name, clients]) => ({
        name,
        subscribers: clients.size,
      })),
    };
  }
}

module.exports = WebSocketManager;
