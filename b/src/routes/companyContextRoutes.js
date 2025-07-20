// src/routes/companyContextRoutes.js
const express = require('express');
const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

const router = express.Router();

// Тест без авторизации
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Company context routes working!',
    timestamp: new Date().toISOString()
  });
});

// Получить список компаний (без авторизации для теста)
router.get('/available', async (req, res) => {
  try {
    const companies = await prismaManager.prisma.companies.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        short_name: true,
        is_active: true,
        created_at: true
      },
      where: {
        is_active: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    res.json({
      success: true,
      companies: companies,
      count: companies.length
    });
    
  } catch (error) {
    logger.error('Error getting companies:', error);
    res.status(500).json({ 
      error: 'Failed to get companies', 
      details: error.message 
    });
  }
});

module.exports = router;
