const app = require('./app');
const http = require('http');
const { logger } = require('./config/logger');
const prismaManager = require('./utils/prismaManager');
const WebSocketService = require('./services/webSocketService');

// Создаем HTTP сервер
const server = http.createServer(app);

// Проверка состояния базы данных и запуск сервера
async function startServer() {
  try {
    await prismaManager.connect();
    logger.info('Database connected successfully');

    // Инициализируем WebSocket-сервис
    const webSocketService = new WebSocketService(server);
    
    // Сохраняем экземпляр WebSocketService в приложении для использования в контроллерах
    app.set('webSocketService', webSocketService);
    
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(`WebSocket server initialized`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();