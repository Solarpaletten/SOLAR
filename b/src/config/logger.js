const winston = require('winston');
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');

// Создаем директории для логов, если их нет
const logsBaseDir = path.join(process.cwd(), 'logs');
const serviceLogs = path.join(logsBaseDir, 'services');
const accessLogs = path.join(logsBaseDir, 'access');
const errorLogs = path.join(logsBaseDir, 'errors');

[logsBaseDir, serviceLogs, accessLogs, errorLogs].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Настройка уровней логирования
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Определение уровня логирования на основе окружения
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Форматирование логов
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.printf(({ level, message, timestamp, metadata, stack }) => {
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    if (Object.keys(metadata).length > 0 && metadata.constructor === Object) {
      log += ` ${JSON.stringify(metadata)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// Ротация логов
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logsBaseDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const errorRotateTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  filename: path.join(errorLogs, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const httpRotateTransport = new winston.transports.DailyRotateFile({
  level: 'http',
  filename: path.join(accessLogs, 'access-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d'
});

// Создание логгера
const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    errorRotateTransport,
    fileRotateTransport,
    httpRotateTransport
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(errorLogs, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    })
  ],
  rejectionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: path.join(errorLogs, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    })
  ],
});

// Создание сервисных логгеров
const createServiceLogger = (serviceName) => {
  const serviceLogDir = path.join(serviceLogs, serviceName);
  if (!fs.existsSync(serviceLogDir)) {
    fs.mkdirSync(serviceLogDir, { recursive: true });
  }

  return winston.createLogger({
    level: level(),
    format: winston.format.combine(
      winston.format.label({ label: serviceName }),
      winston.format.timestamp(),
      logFormat
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
      new winston.transports.DailyRotateFile({
        filename: path.join(serviceLogDir, '%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxFiles: '7d'
      })
    ]
  });
};

// Функция для логирования HTTP запросов
const httpLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.headers['x-forwarded-for'] || req.ip,
      userId: req.user ? req.user.id : null
    };
    
    if (res.statusCode >= 400) {
      logger.warn(`HTTP ${req.method} ${logData.url} ${res.statusCode}`, logData);
    } else {
      logger.http(`HTTP ${req.method} ${logData.url}`, logData);
    }
  });
  next();
};

// Функция для логирования ошибок базы данных
const dbLogger = {
  query: (query) => {
    logger.debug('Database Query:', {
      query: query.query,
      params: query.params,
      duration: query.duration,
    });
  },
  error: (error) => {
    logger.error('Database Error:', {
      message: error.message,
      stack: error.stack,
    });
  },
};

// Утилиты для логирования
const logUtils = {
  // Логирование производительности
  measurePerformance: async (name, fn) => {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      logger.info(`Performance: ${name}`, { duration: `${duration}ms` });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logger.error(`Performance Error: ${name}`, {
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  // Логирование бизнес-событий
  logBusinessEvent: (event, data) => {
    logger.info(`Business Event: ${event}`, data);
  },

  // Логирование безопасности
  logSecurity: (event, data) => {
    logger.warn(`Security Event: ${event}`, data);
  },
  
  // Создание сервисного логгера
  getServiceLogger: (serviceName) => {
    return createServiceLogger(serviceName);
  }
};

module.exports = {
  logger,
  httpLogger,
  dbLogger,
  logUtils,
  createServiceLogger
};