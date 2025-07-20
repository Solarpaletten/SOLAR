// ПРОБЛЕМА: companyContextMiddleware применяется ко ВСЕМ роутам
// РЕШЕНИЕ: Применять его только к Company Level роутам

const apiRouter = express.Router();

// ===========================================
// 🏢 ACCOUNT LEVEL ROUTES (БЕЗ company middleware)
// ===========================================
apiRouter.use('/account', require('./routes/accountRoutes'));
apiRouter.use('/auth', require('./routes/authRoutes'));

// ===========================================
// 🏭 COMPANY LEVEL ROUTES (С company middleware)
// ===========================================
const companyRouter = express.Router();
companyRouter.use(companyContextMiddleware); // Применяем только к этим роутам

companyRouter.use('/clients', require('./routes/clientsRoutes'));
companyRouter.use('/companies', require('./routes/companyRoutes'));
companyRouter.use('/sales', require('./routes/salesRoutes'));
companyRouter.use('/purchases', require('./routes/purchasesRoutes'));
companyRouter.use('/bank-operations', require('./routes/bankRoutes'));

// Подключаем company роуты
apiRouter.use('/', companyRouter);
