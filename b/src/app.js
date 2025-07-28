// b/src/app.js - БЕЗ app.listen() в конце
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const { logger } = require('./config/logger');
const { getPrismaManager } = require('./utils/prismaManager');

const app = express();

// Middleware
app.use(compression());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://207.154.220.86', 'https://solar.swapoil.de'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-company-id'],
  })
);

app.use(session({
  secret: process.env.SESSION_SECRET || 'solar-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000,
    rolling: true
  }
}));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Solar ERP Backend',
    version: '1.7.0'
  });
});

// API Router
const apiRouter = express.Router();

// ===========================================
// 🏢 ACCOUNT LEVEL ROUTES (БЕЗ company middleware)
// ===========================================
try {
  apiRouter.use('/account', require('./routes/account/accountRoutes'));
  logger.info('✅ Account routes loaded');
} catch (error) {
  logger.error('❌ Failed to load account routes:', error);
}

try {
  apiRouter.use('/auth', require('./routes/account/authRoutes'));
  logger.info('✅ Auth routes loaded');
} catch (error) {
  logger.error('❌ Failed to load auth routes:', error);
}

// ===========================================
// 🏭 COMPANY LEVEL ROUTES (С company middleware)
// ===========================================
try {
  apiRouter.use('/company/clients', require('./routes/company/clientsRoutes'));
  logger.info('✅ Company clients routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company clients routes:', error);
}

try {
  apiRouter.use('/company/dashboard', require('./routes/company/dashboardRoutes'));
  logger.info('✅ Company dashboard routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company dashboard routes:', error);
}

// Тестовые роуты
apiRouter.get('/test', (req, res) => {
  res.json({
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      account: '/api/account/*',
      auth: '/api/auth/*',
      clients: '/api/company/clients',
      dashboard: '/api/company/dashboard'
    }
  });
});

// Company context test endpoint
apiRouter.get('/company/test', (req, res) => {
  const companyId = req.headers['x-company-id'];
  const authorization = req.headers.authorization;
  
  res.json({
    message: 'Company context test endpoint',
    receivedCompanyId: companyId,
    companyIdType: typeof companyId,
    authorization: authorization ? 'Present' : 'Missing',
    timestamp: new Date().toISOString(),
    headers: {
      'x-company-id': companyId,
      'authorization': authorization ? 'Bearer ***' : 'Missing'
    },
    instructions: {
      usage: 'Send x-company-id header and Authorization Bearer token',
      example: 'curl -H "x-company-id: 1" -H "Authorization: Bearer TOKEN" http://localhost:4000/api/company/test'
    }
  });
});

// Подключаем API роуты
app.use('/api', apiRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((error, req, res, next) => {
  logger.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack
    })
  });
});

// ✅ ВАЖНО: НЕ ЗАПУСКАЕМ СЕРВЕР ЗДЕСЬ!
// Сервер запускается в index.js или server.js

module.exports = app;
