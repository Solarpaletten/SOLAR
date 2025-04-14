const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Получение метрик о сессиях для админ-панели
router.get('/sessions/metrics', auth, adminController.getSessionMetrics);

// Получение детальной статистики о сессиях
router.get('/sessions/detailed', auth, adminController.getDetailedSessionStats);

// Экспорт метрик в формате CSV
router.get('/sessions/metrics/export-csv', auth, adminController.exportSessionMetricsCSV);

// Получение списка компаний с их статусом email-подтверждения
router.get('/companies', auth, adminController.getCompanies);

module.exports = router;