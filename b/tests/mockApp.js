// Мок-версия приложения для тестов
const express = require('express');
const cors = require('cors');

// Импортируем мок-маршруты
const createMockOnboardingRoutes = require('./routes/mockOnboardingRoutes');

// Создаем экземпляр Express приложения
const app = express();

// Middleware для JSON и CORS
app.use(express.json());
app.use(cors());

// Настраиваем маршруты для тестов
const mockOnboardingRoutes = createMockOnboardingRoutes();
app.use('/api/onboarding', mockOnboardingRoutes);

module.exports = app;