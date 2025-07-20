// src/routes/vat.js
const express = require('express');
const router = express.Router();
const { 
  getDeclaration, 
  submitDeclaration, 
  generatePDF, 
  generateExcel, 
  generateJSON 
} = require('../controllers/vatController');

// Get VAT declaration data
router.get('/', getDeclaration);

// Submit VAT declaration data
router.post('/submit', submitDeclaration);

// Generate reports
router.post('/report/pdf', generatePDF);
router.post('/report/excel', generateExcel);
router.post('/report/json', generateJSON);

module.exports = router;