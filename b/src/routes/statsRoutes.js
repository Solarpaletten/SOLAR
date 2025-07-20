// src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

// Информация о базе данных
router.get('/database-info', async (req, res) => {
  try {
    const tables = await prismaManager.prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const tableStats = [];
    
    for (const table of tables) {
      try {
        const tableName = table.table_name;
        
        if (tableName.startsWith('_prisma')) {
          continue;
        }
        
        const countResult = await prismaManager.prisma.$queryRawUnsafe(
          `SELECT COUNT(*) as count FROM "${tableName}"`
        );
        
        const count = parseInt(countResult[0].count);
        
        tableStats.push({
          name: tableName,
          recordCount: count
        });
      } catch (error) {
        tableStats.push({
          name: table.table_name,
          recordCount: 'N/A'
        });
      }
    }

    res.json({
      success: true,
      tables: tableStats,
      totalTables: tableStats.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Failed to get database info:', error);
    res.status(500).json({ 
      error: 'Failed to get database info',
      details: error.message
    });
  }
});

module.exports = router;
