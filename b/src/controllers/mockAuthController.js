const prismaManager = require('../utils/prismaManager');
const jwt = require('jsonwebtoken');
const { logger } = require('../config/logger');

/**
 * 🧪 MOCK AUTH CONTROLLER
 * Временная авторизация для тестирования без реального входа
 */

// Мок-вход с предустановленными данными
const mockLogin = async (req, res) => {
  try {
    logger.info('Mock Auth: попытка входа');

    // Ищем тестового пользователя
    let user = await prismaManager.getAccountPrisma().users.findFirst({
      where: {
        email: 'test@solar.com'
      }
    });

    if (!user) {
      // Создаем тестового пользователя с ВСЕМИ обязательными полями
      user = await prismaManager.getAccountPrisma().users.create({
        data: {
          username: 'test_user',
          email: 'test@solar.com',
          password_hash: 'mock_password',
          first_name: 'Test',
          last_name: 'User',
          phone: '+1234567890',
          email_verified: true,
          email_verified_at: new Date()
        }
      });

      logger.info('Mock Auth: создан тестовый пользователь', { userId: user.id });
    }

    // Создаем JWT токен с ПРАВИЛЬНЫМИ ПОЛЯМИ
    const token = jwt.sign(
      { 
        id: user.id,           // ← ИСПРАВЛЕНО: было userId, стало id
        email: user.email,
        role: user.role,       // ← ДОБАВЛЕНО: роль пользователя
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET || 'solar-secret-key',
      { expiresIn: '24h' }
    );

    // Получаем компании пользователя (если есть)
    let companies = [];
    try {
      companies = await prismaManager.getAccountPrisma().companies.findMany({
        where: {
          OR: [
            { owner_id: user.id },
            {
              employees: {
                some: {
                  user_id: user.id,
                  is_active: true
                }
              }
            }
          ]
        },
        include: {
          employees: {
            where: { user_id: user.id },
            select: { role: true }
          }
        }
      });
    } catch (companiesError) {
      logger.warn('Ошибка получения компаний:', companiesError.message);
      companies = [];
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone
        },
        token: token,
        companies: companies.map(c => ({
          id: c.id,
          name: c.name,
          code: c.code || c.name,
          role: c.employees[0]?.role || 'owner'
        }))
      },
      message: '🧪 Mock авторизация успешна!',
      testCommands: {
        accountLevel: `curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/account/test`,
        getCompanies: `curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/account/companies`,
        createCompany: `curl -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d '{"name":"Test Company","code":"TEST","description":"Test company"}' http://localhost:4000/api/account/companies`,
        companyLevel: companies.length > 0 ? `curl -H "Authorization: Bearer ${token}" -H "X-Company-Id: ${companies[0].id}" http://localhost:4000/api/company/clients` : 'Сначала создайте компанию'
      }
    });

  } catch (error) {
    logger.error('Mock Auth: ошибка входа:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка mock авторизации',
      details: error.message
    });
  }
};

// Получить готовый токен для тестирования
const getTestToken = async (req, res) => {
  try {
    // Ищем тестового пользователя
    const user = await prismaManager.getAccountPrisma().users.findFirst({
      where: {
        email: 'test@solar.com'
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Тестовый пользователь не найден. Сначала вызовите /api/mock/login'
      });
    }

    // Создаем токен с правильными полями
    const token = jwt.sign(
      { 
        id: user.id,           // ← ИСПРАВЛЕНО: было userId, стало id
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET || 'solar-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token: token,
      bearer: `Bearer ${token}`,
      testCommands: {
        accountLevel: `curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/account/test`,
        companies: `curl -H "Authorization: Bearer ${token}" http://localhost:4000/api/account/companies`,
        companyLevel: `curl -H "Authorization: Bearer ${token}" -H "X-Company-Id: 1" http://localhost:4000/api/company/clients`
      }
    });

  } catch (error) {
    logger.error('Mock Auth: ошибка получения токена:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка получения тестового токена'
    });
  }
};

module.exports = {
  mockLogin,
  getTestToken
};
