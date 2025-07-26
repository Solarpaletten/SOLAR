const prismaManager = require('../../utils/prismaManager');
const { logger } = require('../../config/logger');

const getAllClients = async (req, res) => {
  try {
    const companyId = req.companyContext?.companyId;
    
    if (!companyId) {
      return res.status(400).json({ 
        error: 'Company context required',
        hint: 'Add X-Company-Id header'
      });
    }
    
    const clients = await req.prisma.clients.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });
    
    res.json({
      success: true,
      clients: clients,
      count: clients.length,
      companyId: companyId
    });
    
  } catch (error) {
    logger.error('Error fetching clients:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch clients',
      details: error.message 
    });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, email, phone, role, country, currency } = req.body;
    const companyId = req.companyContext?.companyId;
    const userId = req.user?.id || 1; // Fallback для теста
    
    if (!companyId) {
      return res.status(400).json({ 
        error: 'Company context required'
      });
    }

    logger.info('Creating client:', { name, email, companyId, userId });
    
    // НЕ указываем company - middleware уже добавляет company_id!
    const client = await req.prisma.clients.create({
      data: {
        name: name,
        email: email,
        phone: phone || null,
        role: role || 'CLIENT',
        country: country || null,
        currency: currency || 'EUR',
        is_juridical: true,
        is_active: true,
        created_by: userId
        // НЕ добавляем company или company_id - middleware делает это автоматически!
      }
    });
    
    logger.info('Client created successfully:', { clientId: client.id });
    
    res.status(201).json({
      success: true,
      client: client,
      message: 'Клиент успешно создан!'
    });
    
  } catch (error) {
    logger.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create client',
      details: error.message
    });
  }
};

const getClientById = async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    const companyId = req.companyContext?.companyId;
    
    console.log(`🔍 Getting client ${clientId} for company ${companyId}`);
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID is required'
      });
    }

    // Используйте req.prisma вместо prismaManager.prisma (для консистентности)
    const client = await req.prisma.clients.findFirst({
      where: {
        id: clientId,
        company_id: parseInt(companyId)
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    res.json({
      success: true,
      client: client,
      companyId: parseInt(companyId)
    });

  } catch (error) {
    logger.error('Error getting client by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get client'
    });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    const client = await req.prisma.clients.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    
    res.json({
      success: true,
      client: client
    });
    
  } catch (error) {
    logger.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update client'
    });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    
    await req.prisma.clients.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
    
  } catch (error) {
    logger.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete client'
    });
  }
};

const getMyCompanies = async (req, res) => {
  res.json({
    success: true,
    companies: [],
    message: 'Use /api/account/companies instead'
  });
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getMyCompanies
};
