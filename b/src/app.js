// b/src/app.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const { logger } = require('./config/logger');
const prismaManager = require('./utils/prismaManager');

// ===============================================
// 📁 ИМПОРТЫ MIDDLEWARE
// ===============================================
const auth = require('./middleware/auth');
const companyContext = require('./middleware/companyContext');

// ===============================================
// 📁 ИМПОРТЫ ROUTES
// ===============================================
// Account Level Routes
const accountRoutes = require('./routes/account/accountRoutes');
const authRoutes = require('./routes/account/authRoutes');

// Company Level Routes  
const clientsRoutes = require('./routes/company/clientsRoutes');
const dashboardRoutes = require('./routes/company/dashboardRoutes');
const productsRoutes = require('./routes/company/productsRoutes');

// Опционально (если существуют):
const salesRoutes = require('./routes/company/salesRoutes');
const purchasesRoutes = require('./routes/company/purchasesRoutes');
// Chart of Accounts routes
const chartOfAccountsRoutes = require('./routes/company/chartOfAccountsRoutes');
const warehouseRoutes = require('./routes/company/warehouseRoutes');

const batchRoutes = require('./routes/company/batchesRoutes');

const app = express();


// ===============================================
// 🛡️ SECURITY & MIDDLEWARE SETUP
// ===============================================
app.use(compression());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://207.154.220.86', 'https://solar.swapoil.de', 'https://itsolar.pl'],
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

// ===============================================
// 📊 LOGGING MIDDLEWARE
// ===============================================
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// ===============================================
// 🏥 HEALTH CHECK
// ===============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Solar ERP Backend',
    version: '1.8.0-preview'
  });
});

// ===============================================
// 🏢 ACCOUNT LEVEL ROUTES (БЕЗ company middleware)
// ===============================================
try {
  app.use('/api/account', auth, accountRoutes);
  logger.info('✅ Account routes loaded');
} catch (error) {
  logger.error('❌ Failed to load account routes:', error);
}


// ПОЛНЫЙ ПРИМЕР РЕГИСТРАЦИИ ROUTES В APP.JS
// Account Level Routes
app.use('/api/account', accountRoutes);
app.use('/api/account/companies', companyRoutes);



try {
  app.use('/api/auth', authRoutes);
  logger.info('✅ Auth routes loaded');
} catch (error) {
  logger.error('❌ Failed to load auth routes:', error);
}


// COMPANY LEVEL ROUTES (С auth + company middleware)

// // Company Level Routes  
// app.use('/api/company/clients', clientRoutes);
// app.use('/api/company/products', productRoutes);
// app.use('/api/company/sales', salesRoutes);
// app.use('/api/company/purchases', purchaseRoutes);
// app.use('/api/company/warehouses', warehouseRoutes);
// app.use('/api/company/banking', bankingRoutes);

// // НОВОЕ: Партийная система
// app.use('/api/company/batches', batchRoutes);

// Authentication Routes
app.use('/api/auth', authRoutes);

try {
  app.use('/api/company/clients', auth, companyContext, clientsRoutes);
  logger.info('✅ Company clients routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company clients routes:', error);
}

try {
  app.use('/api/company/dashboard', auth, companyContext, dashboardRoutes);
  logger.info('✅ Company dashboard routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company dashboard routes:', error);
}

try {
  app.use('/api/company/products', auth, companyContext, productsRoutes);
  logger.info('✅ Company products routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company products routes:', error);
}

//
try {
  app.use('/api/company/sales', auth, companyContext, salesRoutes);
  logger.info('✅ Company sales routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company sales routes:', error);
}

try {
  app.use('/api/company/purchases', auth, companyContext, purchasesRoutes);
  logger.info('✅ Company purchases routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company purchases routes:', error);
}

try {
app.use('/api/company/chart-of-accounts', auth, companyContext, chartOfAccountsRoutes);
logger.info('✅ Company chart of accounts routes loaded');
} catch (error) {
  ogger.error('❌ Failed to load company chart of accounts routes:', error);
}

try {
  app.use('/api/company/warehouses', auth, companyContext, warehouseRoutes);
  logger.info('✅ Company warehouse routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company warehouse routes:', error);
}

try {
  app.use('/api/company/batches', auth, companyContext, batchRoutes);
  logger.info('✅ Company batch routes loaded');
} catch (error) {
  logger.error('❌ Failed to load company batch routes:', error);
}



// ===============================================
// 🧪 TEST ENDPOINTS
// ===============================================
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    version: '1.8.0-preview',
    endpoints: {
      account: '/api/account/*',
      auth: '/api/auth/*',
      clients: '/api/company/clients',
      dashboard: '/api/company/dashboard',
      products: '/api/company/products'
    }
  });
});

// Company context test endpoint
app.get('/api/company/test', auth, companyContext, (req, res) => {
  res.json({
    message: 'Company context test endpoint',
    companyId: req.companyId,
    user: {
      id: req.user.id,
      email: req.user.email
    },
    timestamp: new Date().toISOString(),
    status: 'Company context is working!'
  });
});

// ГОТОВЫЕ API ENDPOINTS ПОСЛЕ РЕГИСТРАЦИИ
// ===============================================
// 🚫 ERROR HANDLERS
// ===============================================
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/api/auth/login',
      '/api/account/companies', 
      '/api/company/clients',
      '/api/company/dashboard',
      '/api/company/products'
    ]
  });
});


// Global error handler
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