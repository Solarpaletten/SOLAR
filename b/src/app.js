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
    origin: ['https://npmfr-snpq.onrender.com', 'http://localhost:3000', 'http://localhost:5173', 'http://207.154.220.86'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// express-session для управления HTTP сессиями уже импортирован выше
app.use(session({
  secret: process.env.SESSION_SECRET || 'solar-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 5 * 60 * 1000, // 5 минут в миллисекундах
    rolling: true // Обновлять время жизни сессии при активности
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
  // Проверяем, истек ли таймаут сессии
  if (req.session && req.session.lastActivity) {
    const currentTime = Date.now();
    const inactiveTime = currentTime - req.session.lastActivity;
    
    // Если прошло больше 5 минут бездействия
    if (inactiveTime > 5 * 60 * 1000) {
      logger.info(`Destroying inactive HTTP session after ${Math.round(inactiveTime/1000/60)} minutes of inactivity`);
      req.session.destroy(err => {
        if (err) {
          logger.error('Error destroying session:', err);
        }
      });
    } else {
      // Обновляем время последней активности
      req.session.lastActivity = currentTime;
    }
  } else if (req.session) {
    // Инициализируем время активности для новой сессии
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

// Импорт маршрутов
const apiRouter = express.Router();
apiRouter.use('/auth', require('./routes/authRoutes'));
apiRouter.use('/clients', require('./routes/clientsRoutes'));
apiRouter.use('/companies', require('./routes/companyRoutes'));
apiRouter.use('/stats', require('./routes/statsRoutes'));
apiRouter.use('/admin', require('./routes/adminRoutes'));

// Добавить новый маршрут для онбординга
apiRouter.use('/onboarding', require('./routes/onboardingRoutes'));

// Добавим маршруты для продаж и покупок
apiRouter.use('/sales', require('./routes/salesRoutes'));
apiRouter.use('/purchases', require('./routes/purchasesRoutes'));
// В файле app.js добавить:
apiRouter.use('/assistant', require('./routes/assistantRoutes'));

apiRouter.get('/test', (req, res) => {
  res.json({
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRouter);

// Health-check endpoint с информацией о таблицах
app.get('/api/health', async (req, res) => {
  try {
    // Проверяем соединение с БД через prismaManager
    await prismaManager.prisma.$queryRaw`SELECT 1`;

    // Получаем список таблиц
    const tables = await prismaManager.prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;

    res.json({
      status: 'healthy',
      timestamp: new Date(),
      tables: tables.map((t) => t.table_name),
      database_url: process.env.DATABASE_URL?.split('@')[1], // Показываем только хост
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
