// b/src/routes/company/batches.js
const express = require('express');
const router = express.Router();

const {
  getBatches,
  createBatches,
  updateBatches,
  deleteBatches,
  getBatchesStats,
  testHealth
} = require('../../controllers/company/batchesController');

    // 🧪 Test routes

router.get('/test/health', testHealth);

// 📊 Main CRUD routes
router.get('/', getBatches);
router.post('/', createBatches);
router.put('/:id', updateBatches);
router.delete('/:id', deleteBatches);
router.get('/stats', getBatchesStats);

module.exports = 