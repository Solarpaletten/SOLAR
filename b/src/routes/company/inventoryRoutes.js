// b/src/routes/company/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/company/inventoryController');
const { logger } = require('../../config/logger');

logger.info('📦 Inventory routes initialized');

// ===============================================
// 📦 INVENTORY ROUTES - Company Level
// ===============================================

// 📊 GET /api/company/inventory/stats - Общая статистика складов
router.get('/stats', inventoryController.getInventoryStats);

// 📦 GET /api/company/inventory/products - Остатки товаров
router.get('/products', inventoryController.getProductInventory);

// 📈 GET /api/company/inventory/movements/:productId - История движений товара  
router.get('/movements/:productId', inventoryController.getProductMovements);

// 📊 GET /api/company/inventory/warehouse/:warehouseId - Остатки по складу
router.get('/warehouse/:warehouseId', inventoryController.getWarehouseInventory);

// ⚙️ POST /api/company/inventory/update-stock - Обновление остатков
router.post('/update-stock', inventoryController.updateProductStock);

// ===============================================
// 🧪 TEST ROUTE
// ===============================================

router.get('/test/health', (req, res) => {
  res.json({
    message: '📦 Inventory API is working!',
    companyId: req.companyContext?.companyId || 'Not set',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/company/inventory/stats - Inventory statistics',
      'GET /api/company/inventory/products - Product inventory',
      'GET /api/company/inventory/movements/:productId - Product movements history',
      'GET /api/company/inventory/warehouse/:warehouseId - Warehouse inventory',
      'POST /api/company/inventory/update-stock - Update product stock'
    ]
  });
});

module.exports = router;