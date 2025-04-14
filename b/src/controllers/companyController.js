const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const { standardizeCompanyCode } = require('../utils/companyUtils');

/**
 * Получение всех компаний пользователя
 */
const getAllCompanies = async (req, res) => {
  try {
    const companies = await prismaManager.prisma.companies.findMany({
      where: { user_id: req.user.id },
      include: {
        user: true
      }
    });
    res.json(companies);
  } catch (error) {
    logger.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

/**
 * Получение компании по ID
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prismaManager.prisma.companies.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      include: {
        user: true
      }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    logger.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
};

/**
 * Создание новой компании
 */
const createCompany = async (req, res) => {
  try {
    const { code, name, director_name } = req.body;
    
    // Дополнительное логирование для отладки
    logger.info('Creating company:', { 
      code, 
      name, 
      director_name, 
      user_id: req.user.id 
    });

    // Стандартизируем код компании
    const standardizedCode = standardizeCompanyCode(code);

    const company = await prismaManager.prisma.companies.create({
      data: {
        code: standardizedCode,
        name,
        director_name,
        user_id: req.user.id,
        is_active: true,
        setup_completed: true
      },
    });

    logger.info('Company created successfully:', { companyId: company.id });
    res.status(201).json(company);
  } catch (error) {
    logger.error('Error creating company:', error);
    
    // Обработка ошибок дублирования
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return res.status(409).json({ 
        error: 'Код компании уже используется. Пожалуйста, выберите другой код.',
        code: 'DUPLICATE_CODE'
      });
    }
    
    res.status(500).json({ error: 'Failed to create company' });
  }
};

/**
 * Обновление компании
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Если обновляется код компании, стандартизируем его
    if (updateData.code) {
      updateData.code = standardizeCompanyCode(updateData.code);
    }

    const company = await prismaManager.prisma.companies.updateMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      data: updateData,
    });

    if (company.count === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company updated successfully' });
  } catch (error) {
    logger.error('Error updating company:', error);
    
    // Обработка ошибок дублирования
    if (error.code === 'P2002' && error.meta?.target?.includes('code')) {
      return res.status(409).json({ 
        error: 'Код компании уже используется. Пожалуйста, выберите другой код.',
        code: 'DUPLICATE_CODE'
      });
    }
    
    res.status(500).json({ error: 'Failed to update company' });
  }
};

/**
 * Удаление компании
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prismaManager.prisma.companies.deleteMany({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany, 
  updateCompany,
  deleteCompany
};