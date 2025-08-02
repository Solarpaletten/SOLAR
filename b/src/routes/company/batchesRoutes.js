// 🎯 ЧИСТЫЕ ROUTES ДЛЯ ПАРТИЙНОЙ СИСТЕМЫ
// b/src/routes/company/batches.js

const express = require('express');
const router = express.Router();
const batchController = require('../../controllers/company/batchController');

// ===============================================
// 📦 ОСНОВНЫЕ BATCH ENDPOINTS
// ===============================================

// Получить партии товара на складе
router.get('/product/:productId/warehouse/:warehouseId', 
  batchController.getBatchesByProduct
);

// FIFO автоматическое распределение партий
router.post('/allocate', 
  batchController.allocateBatchesForSale
);

// История движений партии
router.get('/:batchId/movements', 
  batchController.getBatchMovements
);

// Создать движение партии
router.post('/movements', 
  batchController.createBatchMovement
);

// Отчёт по партиям склада
router.get('/warehouses/:warehouseId/report', 
  batchController.getWarehouseBatchesReport
);

// ===============================================
// 🎯 ENTERPRISE ANALYTICS ENDPOINTS
// ===============================================

// Партии с истекающим сроком
router.get('/expiring', 
  batchController.getExpiringBatches
);

// Партии от поставщика
router.get('/supplier/:supplierId', 
  batchController.getBatchesBySupplier
);

// Анализ себестоимости
router.get('/analytics/costs', 
  batchController.getCostAnalytics
);

module.exports = router;