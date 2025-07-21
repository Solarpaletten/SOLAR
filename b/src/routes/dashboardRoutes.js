// b/src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

// GET /api/company/dashboard - Company Level Dashboard
router.get('/', async (req, res) => {
  try {
    console.log('🏭 Company Dashboard request for company:', req.companyContext?.companyId);
    
    const companyId = req.companyContext?.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required'
      });
    }

    // Получаем статистику компании
    const [clientsCount, salesCount, purchasesCount] = await Promise.all([
      // Клиенты
      prismaManager.prisma.clients.count({
        where: { 
          company_id: parseInt(companyId),
          is_active: true 
        }
      }),
      
      // Продажи (если есть таблица)
      prismaManager.prisma.sales ? 
        prismaManager.prisma.sales.count({
          where: { company_id: parseInt(companyId) }
        }) : 0,
      
      // Покупки (если есть таблица)  
      prismaManager.prisma.purchases ?
        prismaManager.prisma.purchases.count({
          where: { company_id: parseInt(companyId) }
        }) : 0
    ]);

    // Получаем информацию о компании
    const company = await prismaManager.prisma.companies.findUnique({
      where: { id: parseInt(companyId) },
      select: {
        id: true,
        name: true,
        code: true,
        director_name: true,
        base_currency: true,
        is_active: true
      }
    });

    const dashboardData = {
      success: true,
      company: company,
      stats: {
        clients: clientsCount,
        sales: salesCount,
        purchases: purchasesCount,
        revenue: 0, // TODO: подсчитать реальную выручку
        expenses: 0  // TODO: подсчитать реальные расходы
      },
      recentActivities: [
        {
          id: 1,
          type: 'client_created',
          message: `New client added`,
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          type: 'system',
          message: 'Company dashboard accessed',
          timestamp: new Date().toISOString()
        }
      ],
      companyId: parseInt(companyId)
    };

    console.log('✅ Dashboard data prepared for company:', companyId);
    res.json(dashboardData);

  } catch (error) {
    logger.error('Error getting company dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard data',
      details: error.message
    });
  }
});

// GET /api/company/dashboard/stats - Quick stats endpoint
router.get('/stats', async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required'
      });
    }

    const stats = {
      success: true,
      companyId: parseInt(companyId),
      timestamp: new Date().toISOString(),
      data: {
        clients: await prismaManager.prisma.clients.count({
          where: { 
            company_id: parseInt(companyId),
            is_active: true 
          }
        }),
        revenue: 0,
        expenses: 0,
        profit: 0
      }
    };

    res.json(stats);

  } catch (error) {
    logger.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load stats'
    });
  }
});

module.exports = router;
