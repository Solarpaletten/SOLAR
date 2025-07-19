// src/routes/companyContextRoutes.js
const express = require('express');
const { getPrismaManager } = require('../middleware/companyContext');

const router = express.Router();

// Тест без авторизации
router.get('/test', (req, res) => {
  res.json({ message: 'Company context routes working!' });
});

// Получить список компаний (без авторизации для теста)
router.get('/available', async (req, res) => {
  try {
    const prismaManager = getPrismaManager();
    const accountPrisma = prismaManager.getAccountPrisma();
    
    const companies = await accountPrisma.companies.findMany({
      select: {
        id: true,
        name: true,
        abbreviation: true,
        is_active: true
      },
      where: {
        is_active: true
      }
    });
    
    res.json({
      companies: companies
    });
    
  } catch (error) {
    console.error('Error getting companies:', error);
    res.status(500).json({ error: 'Failed to get companies', details: error.message });
  }
});

module.exports = router;
