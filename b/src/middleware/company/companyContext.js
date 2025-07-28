// b/src/middleware/company/companyContext.js
const { getPrismaManager } = require('../../utils/prismaManager');
const { logger } = require('../../config/logger');

/**
 * 🏭 COMPANY CONTEXT MIDDLEWARE
 * Обеспечивает multi-tenant изоляцию данных между компаниями
 */
const companyContext = async (req, res, next) => {
  try {
    // 1. Получаем Company ID из headers или session
    const companyId = req.headers['x-company-id'] || 
                     req.session?.currentCompanyId ||
                     req.body?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company context missing. Please select a company first.',
        code: 'COMPANY_CONTEXT_REQUIRED'
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    logger.info('Company Context Middleware:', {
      userId,
      companyId,
      path: req.path,
      method: req.method
    });

    // 2. Проверяем права доступа пользователя к компании
    const prismaManager = getPrismaManager();
    const accountPrisma = prismaManager.getAccountPrisma();
    const userCompanyAccess = await accountPrisma.company_users.findFirst({
      where: {
        user_id: parseInt(userId),
        company_id: parseInt(companyId)
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            code: true,
            is_active: true
          }
        }
      }
    });

    if (!userCompanyAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this company',
        code: 'COMPANY_ACCESS_DENIED'
      });
    }

    if (!userCompanyAccess.company.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Company is not active',
        code: 'COMPANY_INACTIVE'
      });
    }

    // 3. Устанавливаем контекст компании
    req.companyContext = {
      companyId: parseInt(companyId),
      company: userCompanyAccess.company,
      userRole: userCompanyAccess.role,
      userPermissions: userCompanyAccess.permissions
    };

    // 4. Получаем Prisma для этой компании (с автоматическим middleware)
    try {
      req.prisma = prismaManager.getCompanyPrisma(companyId);
    } catch (prismaError) {
      logger.error('Failed to get company Prisma instance:', prismaError);
      return res.status(500).json({
        success: false,
        error: 'Database connection error for company',
        code: 'COMPANY_DB_ERROR'
      });
    }

    // 5. Сохраняем в сессии для следующих запросов
    req.session.currentCompanyId = parseInt(companyId);

    logger.info('✅ Company context established:', {
      companyId: req.companyContext.companyId,
      companyName: req.companyContext.company.name,
      userRole: req.companyContext.userRole
    });

    next();

  } catch (error) {
    logger.error('Company Context Middleware Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to establish company context',
      code: 'COMPANY_CONTEXT_ERROR',
      details: error.message
    });
  }
};

module.exports = companyContext;