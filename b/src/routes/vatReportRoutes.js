// src/routes/vatReportRoutes.js
const express = require('express');
const router = express.Router();
const {
  getVatReport,
  generatePDF,
  generateFinancialPDF,
  generateExcel,
  generateJSON
} = require('../controllers/vatReportController');
const { auth } = require('../middleware/auth');

// Get VAT report data with authentication
router.get('/', auth, getVatReport);

// Generate reports with authentication
router.post('/pdf', auth, generatePDF);
router.post('/financial-pdf', auth, generateFinancialPDF);
router.post('/excel', auth, generateExcel);
router.post('/json', auth, generateJSON);

module.exports = router;