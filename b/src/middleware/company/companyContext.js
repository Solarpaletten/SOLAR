// src/middleware/companyContext.js
const { PrismaClient } = require('@prisma/client');

// Модели которые должны фильтроваться по company_id
const COMPANY_SCOPED_MODELS = [
  'clients',
  'products', 
  'sales',
  'purchases',
  'warehouses',
  'bank_operations',
  'chart_of_accounts',
  'purchase_items',
  'sale_items'
];

/**
 * Добавляет middleware для автоматической фильтрации по company_id
 * @param {PrismaClient} prisma 
 * @param {number} companyId 
 */
function addCompanyMiddleware(prisma, companyId) {
  if (!companyId) {
    throw new Error('Company ID is required for database operations');
  }

  prisma.$use(async (params, next) => {
    // Проверяем является ли модель company-scoped
    if (COMPANY_SCOPED_MODELS.includes(params.model)) {
      
      // CREATE операции - автоматически добавляем company_id
      if (params.action === 'create') {
        if (params.args.data) {
          params.args.data.company_id = companyId;
        }
      }
      
      // CREATE MANY операции
      if (params.action === 'createMany') {
        if (params.args.data && Array.isArray(params.args.data)) {
          params.args.data = params.args.data.map(item => ({
            ...item,
            company_id: companyId
          }));
        }
      }
      
      // READ операции - автоматически фильтруем по company_id
      if (['findFirst', 'findUnique', 'findMany'].includes(params.action)) {
        if (!params.args) {
          params.args = {};
        }
        if (!params.args.where) {
          params.args.where = {};
        }
        
        // Добавляем фильтр по company_id только если его еще нет
        if (!params.args.where.company_id) {
          params.args.where.company_id = companyId;
        }
      }
      
      // UPDATE операции - фильтруем по company_id
      if (['update', 'updateMany', 'upsert'].includes(params.action)) {
        if (!params.args) {
          params.args = {};
        }
        if (!params.args.where) {
          params.args.where = {};
        }
        
        // Добавляем фильтр по company_id
        if (!params.args.where.company_id) {
          params.args.where.company_id = companyId;
        }
      }
      
      // DELETE операции - фильтруем по company_id
      if (['delete', 'deleteMany'].includes(params.action)) {
        if (!params.args) {
          params.args = {};
        }
        if (!params.args.where) {
          params.args.where = {};
        }
        
        // Добавляем фильтр по company_id
        if (!params.args.where.company_id) {
          params.args.where.company_id = companyId;
        }
      }
    }
    
    return next(params);
  });
}

/**
 * Класс для управления контекстом компаний
 */
class PrismaContextManager {
  constructor() {
    this.prismaClients = new Map();
    this.accountPrisma = new PrismaClient();
  }

  /**
   * Получить Prisma для Account Level (без фильтрации по компаниям)
   * @returns {PrismaClient}
   */
  getAccountPrisma() {
    return this.accountPrisma;
  }

  /**
   * Получить Prisma для конкретной компании (с автоматической фильтрацией)
   * @param {number} companyId 
   * @returns {PrismaClient}
   */
  getCompanyPrisma(companyId) {
    if (!this.prismaClients.has(companyId)) {
      const prisma = new PrismaClient();
      addCompanyMiddleware(prisma, companyId);
      this.prismaClients.set(companyId, prisma);
    }
    
    return this.prismaClients.get(companyId);
  }

  /**
   * Очистить контекст компании
   * @param {number} companyId 
   */
  async clearCompanyContext(companyId) {
    const prisma = this.prismaClients.get(companyId);
    if (prisma) {
      await prisma.$disconnect();
      this.prismaClients.delete(companyId);
    }
  }

  /**
   * Закрыть все соединения
   */
  async disconnect() {
    await this.accountPrisma.$disconnect();
    
    for (const [companyId, prisma] of this.prismaClients) {
      await prisma.$disconnect();
    }
    
    this.prismaClients.clear();
  }
}

// Singleton instance
let prismaManager = null;

/**
 * Получить singleton instance менеджера
 * @returns {PrismaContextManager}
 */
function getPrismaManager() {
  if (!prismaManager) {
    prismaManager = new PrismaContextManager();
  }
  return prismaManager;
}

module.exports = {
  PrismaContextManager,
  getPrismaManager,
  addCompanyMiddleware,
  COMPANY_SCOPED_MODELS
};
