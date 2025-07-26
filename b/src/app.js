const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const { logger } = require('./config/logger');
const prismaManager = require('./utils/prismaManager');

const app = express();

// Middleware
app.use(compression());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://207.154.220.86', 'https://solar.swapoil.de'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Company-Id'],
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

// API Router
const apiRouter = express.Router();

// ===========================================
// 🏢 ACCOUNT LEVEL ROUTES (БЕЗ company middleware)
// ===========================================
apiRouter.use('/account', require('./routes/account/accountRoutes'));
apiRouter.use('/auth', require('./routes/account/authRoutes'));

// ===========================================
// 🏭 COMPANY LEVEL ROUTES (С company middleware)
// ===========================================
apiRouter.use('/company/clients', require('./routes/company/clientsRoutes'));
apiRouter.use('/company/dashboard', require('./routes/company/dashboardRoutes'));

// Тестовый роут
apiRouter.get('/test', (req, res) => {
  res.json({
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    routes: {
      account: '/api/account/*', 
      auth: '/api/auth/*',
      company: '/api/company/*'
    }
  });
});

// Подключаем API роуты
app.use('/api', apiRouter);

// Health-check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prismaManager.prisma.$queryRaw`SELECT 1`;
    const tables = await prismaManager.prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

    res.json({
      status: 'healthy',
      timestamp: new Date(),
      tables: tables.map((t) => t.table_name),
      database_url: process.env.DATABASE_URL?.split('@')[1],
      connection: 'Connected via PrismaManager',
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date(),
      connection: 'Failed via PrismaManager',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
