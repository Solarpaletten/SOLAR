const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');

const getAllClients = async (req, res) => {
  try {
    // ВРЕМЕННО: используем компанию ID=1, потом будет req.user.current_company_id
    const company_id = 1;
    
    const clients = await prismaManager.prisma.clients.findMany({
      where: { 
        company_id: company_id 
      },
      include: {
        sales: true,
        purchases: true,
        company: {
          select: {
            id: true,
            name: true,
            base_currency: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    res.json(clients);
  } catch (error) {
    logger.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = 1; // ВРЕМЕННО
    
    const client = await prismaManager.prisma.clients.findFirst({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
      include: {
        sales: true,
        purchases: true,
        company: true
      },
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    logger.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

const createClient = async (req, res) => {
  try {
    const { 
      name, email, phone, abbreviation, code, vat_code, vat_rate,
      website, fax, is_juridical, auto_debt_reminder, foreigner_country,
      registration_date, date_of_birth, credit_sum, pay_per, currency,
      eori_code, foreign_taxpayer_code, legal_address, actual_address,
      bank_account, bank_name, contact_information, notes, business_license_code
    } = req.body;
    
    const company_id = 1; // ВРЕМЕННО
    const user_id = 1;    // ВРЕМЕННО
    
    const client = await prismaManager.prisma.clients.create({
      data: {
        // Основные поля
        name,
        email,
        phone,
        abbreviation,
        code,
        vat_code,
        vat_rate: vat_rate ? parseFloat(vat_rate) : null,
        website,
        fax,
        
        // Статусы
        is_juridical: is_juridical !== undefined ? is_juridical : true,
        auto_debt_reminder: auto_debt_reminder || false,
        is_active: true,
        
        // География
        foreigner_country,
        legal_address,
        actual_address,
        
        // Финансы
        credit_sum: credit_sum ? parseFloat(credit_sum) : 0,
        pay_per,
        currency: currency || 'EUR',
        
        // Коды
        business_license_code,
        eori_code,
        foreign_taxpayer_code,
        
        // Банковские данные
        bank_account,
        bank_name,
        
        // Даты
        registration_date: registration_date ? new Date(registration_date) : null,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        
        // Дополнительно
        contact_information,
        notes,
        
        // Системные поля
        company_id: company_id,
        user_id: user_id,
      },
      include: {
        company: true
      }
    });
    
    res.status(201).json(client);
  } catch (error) {
    logger.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = 1; // ВРЕМЕННО
    const updateData = { ...req.body };
    
    // Преобразуем даты если они есть
    if (updateData.registration_date) {
      updateData.registration_date = new Date(updateData.registration_date);
    }
    if (updateData.date_of_birth) {
      updateData.date_of_birth = new Date(updateData.date_of_birth);
    }
    
    // Преобразуем числовые поля
    if (updateData.vat_rate) {
      updateData.vat_rate = parseFloat(updateData.vat_rate);
    }
    if (updateData.credit_sum) {
      updateData.credit_sum = parseFloat(updateData.credit_sum);
    }
    
    const client = await prismaManager.prisma.clients.updateMany({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
      data: updateData,
    });
    
    if (client.count === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Возвращаем обновленного клиента
    const updatedClient = await prismaManager.prisma.clients.findFirst({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
      include: {
        company: true
      }
    });
    
    res.json(updatedClient);
  } catch (error) {
    logger.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = 1; // ВРЕМЕННО
    
    const result = await prismaManager.prisma.clients.deleteMany({
      where: {
        id: parseInt(id),
        company_id: company_id
      },
    });
    
    if (result.count === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
};

const getMyCompanies = async (req, res) => {
  try {
    const user_id = 1; // ВРЕМЕННО
    
    // Получаем компании где пользователь является владельцем
    const ownedCompanies = await prismaManager.prisma.companies.findMany({
      where: { 
        owner_id: user_id 
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            username: true
          }
        }
      }
    });
    
    // Получаем компании где пользователь является сотрудником
    const memberCompanies = await prismaManager.prisma.company_users.findMany({
      where: {
        user_id: user_id,
        is_active: true
      },
      include: {
        company: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                username: true
              }
            }
          }
        }
      }
    });
    
    // Объединяем результаты
    const allCompanies = [
      ...ownedCompanies,
      ...memberCompanies.map(membership => ({
        ...membership.company,
        role: membership.role
      }))
    ];
    
    res.status(200).json(allCompanies);
  } catch (error) {
    logger.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
};

// Новая функция для получения статистики клиентов
const getClientsStats = async (req, res) => {
  try {
    const company_id = 1; // ВРЕМЕННО
    
    const stats = await prismaManager.prisma.clients.groupBy({
      by: ['role'],
      where: {
        company_id: company_id
      },
      _count: {
        id: true
      }
    });
    
    const totalClients = await prismaManager.prisma.clients.count({
      where: {
        company_id: company_id,
        is_active: true
      }
    });
    
    res.json({
      total: totalClients,
      by_role: stats
    });
  } catch (error) {
    logger.error('Error fetching clients stats:', error);
    res.status(500).json({ error: 'Failed to fetch clients stats' });
  }
};

module.exports = {
  getAllClients,
  getClientById, 
  createClient,
  updateClient,
  deleteClient,
  getMyCompanies,
  getClientsStats // Новая функция
};
