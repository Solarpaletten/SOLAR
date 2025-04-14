const { logger } = require('../config/logger');
const index = require('../index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Метод для получения информации о компаниях и их статусе активации
const getCompanies = async (req, res) => {
  try {
    // Проверка прав доступа
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const companies = await prisma.companies.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            email_verified: true,
            username: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(companies);
  } catch (error) {
    logger.error('Error getting companies info:', error);
    res.status(500).json({ error: 'Failed to fetch companies information' });
  }
};

// Контроллер для получения метрик по сессиям
const getSessionMetrics = (req, res) => {
  try {
    // Проверка роли пользователя - доступно только администраторам
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Получение параметра timeRange из запроса
    const timeRange = req.query.timeRange || 'hour'; // По умолчанию - час
    
    // Получение метрик из webSocketService с учетом timeRange
    const webSocketService = index.webSocketService();
    const metrics = webSocketService.getSessionMetrics(timeRange);
    
    return res.status(200).json(metrics);
  } catch (error) {
    logger.error('Error getting session metrics:', error);
    return res.status(500).json({ error: 'Failed to get session metrics' });
  }
};

// Контроллер для получения подробной статистики по сессиям
const getDetailedSessionStats = (req, res) => {
  try {
    // Проверка роли пользователя - доступно только администраторам
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Получение подробных данных из webSocketService
    const webSocketService = index.webSocketService();
    const metrics = webSocketService.getSessionMetrics();
    const clientsInfo = Array.from(webSocketService.clients.keys()).map(userId => {
      const lastActivity = webSocketService.lastActivity.get(userId);
      return {
        userId,
        lastActiveAt: lastActivity,
        inactiveFor: lastActivity ? Math.round((Date.now() - lastActivity) / 1000) : null
      };
    });
    
    return res.status(200).json({
      ...metrics,
      clientsInfo,
      currentTime: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error getting detailed session stats:', error);
    return res.status(500).json({ error: 'Failed to get detailed session stats' });
  }
};

// Контроллер для экспорта метрик в CSV
const exportSessionMetricsCSV = (req, res) => {
  try {
    // Проверка прав доступа
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Получение параметра timeRange из запроса
    const timeRange = req.query.timeRange || 'hour'; // По умолчанию - час
    
    const webSocketService = index.webSocketService();
    const metrics = webSocketService.getSessionMetrics(timeRange);
    
    // Преобразование данных в CSV формат
    let csvContent = 'timestamp,active_sessions,closed_sessions\n';
    metrics.history.forEach(item => {
      csvContent += `${item.timestamp},${item.active},${item.closed}\n`;
    });
    
    // Установка заголовков для скачивания файла
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=session_metrics_${new Date().toISOString().split('T')[0]}.csv`);
    
    // Отправка CSV
    return res.status(200).send(csvContent);
  } catch (error) {
    logger.error('Error exporting CSV:', error);
    return res.status(500).json({ error: 'Failed to export metrics' });
  }
};

module.exports = {
  getSessionMetrics,
  getDetailedSessionStats,
  exportSessionMetricsCSV,
  getCompanies
};