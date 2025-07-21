const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const session = require('express-session');
const { logger } = require('./config/logger');
const prismaManager = require('./utils/prismaManager');
// НЕ импортируем companyContextMiddleware глобально
// const { companyContextMiddleware } = require('./middleware/companySelector');

const app = express();

// Middleware
app.use(compression());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://207.154.220.86', 'https://solar.swapoil.de'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Company-Id'], // Добавили X-Company-Id
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

// Мидлвар для проверки неактивных HTTP сессий
app.use((req, res, next) => {
  if (req.session && req.session.lastActivity) {
    const currentTime = Date.now();
    const inactiveTime = currentTime - req.session.lastActivity;
    
    if (inactiveTime > 5 * 60 * 1000) {
      logger.info(`Destroying inactive HTTP session after ${Math.round(inactiveTime/1000/60)} minutes of inactivity`);
      req.session.destroy(err => {
        if (err) {
          logger.error('Error destroying session:', err);
        }
      });
    } else {
      req.session.lastActivity = currentTime;
    }
  } else if (req.session) {
    req.session.lastActivity = Date.now();
  }
  next();
});

// Логирование запросов
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// ===========================================
// �� КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ РОУТИНГА
// ===========================================

const apiRouter = express.Router();

// ===========================================
// 🧪 MOCK ROUTES (БЕЗ middleware - для тестирования)
// ===========================================
apiRouter.use('/mock', require('./routes/mockRoutes'));

// ===========================================
// 🏢 ACCOUNT LEVEL ROUTES (БЕЗ company middleware)
// ===========================================
apiRouter.use('/account', require('./routes/accountRoutes'));
apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/company-context', require('./routes/companyContextRoutes'));
apiRouter.use('/companies', require('./routes/companyRoutes'));        // ← ПЕРЕНЕСТИ СЮДА
apiRouter.use('/admin', require('./routes/adminRoutes'));              // ← ПЕРЕНЕСТИ СЮДА  
apiRouter.use('/onboarding', require('./routes/onboardingRoutes'));    // ← ПЕРЕНЕСТИ СЮДА
apiRouter.use('/account/companies', require('./routes/companyRoutes')); // Account Level


// ===========================================
// 🏭 COMPANY LEVEL ROUTES (С company middleware)
// ===========================================
const { companyContextMiddleware } = require('./middleware/companySelector');
const companyRouter = express.Router();

// Применяем company middleware ТОЛЬКО к company роутам
companyRouter.use(companyContextMiddleware);

companyRouter.use('/clients', require('./routes/clientsRoutes'));       // ← ОСТАЕТСЯ
companyRouter.use('/dashboard', require('./routes/dashboardRoutes'));  // Company Level  
companyRouter.use('/clients', require('./routes/clientsRoutes'));      // Company Level
companyRouter.use('/stats', require('./routes/statsRoutes'));           // ← ОСТАЕТСЯ
companyRouter.use('/sales', require('./routes/salesRoutes'));           // ← ОСТАЕТСЯ
companyRouter.use('/purchases', require('./routes/purchasesRoutes'));   // ← ОСТАЕТСЯ
companyRouter.use('/assistant', require('./routes/assistantRoutes'));   // ← ОСТАЕТСЯ
companyRouter.use('/bank-operations', require('./routes/bankRoutes')); // ← ОСТАЕТСЯ


// Подключаем company роуты к основному роутеру
apiRouter.use('/company', companyRouter); // Все company роуты под /api/company/*

// Тестовый роут
apiRouter.get('/test', (req, res) => {
  res.json({
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    routes: {
      mock: '/api/mock/*',
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
