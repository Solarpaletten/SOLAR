const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../prisma/generated/test');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');
const prisma = new PrismaClient();

// Добавим отладку
logger.info('Prisma Client initialized in clientsRoutes.js');

router.get('/', auth, async (req, res) => {
  try {
    logger.info('Fetching all clients for user:', { userId: req.user.id });
    const clients = await prisma.clientsT.findMany({
      where: {
        user_id: req.user.id,
      },
    });
    res.json(clients);
  } catch (error) {
    logger.error('Error getting clients:', error);
    res.status(500).json({ error: 'Failed to get clients' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    logger.info('Fetching client by ID:', {
      id: req.params.id,
      userId: req.user.id,
    });
    const client = await prisma.clientsT.findFirst({
      where: {
        id: parseInt(req.params.id),
        user_id: req.user.id,
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    logger.error('Error getting client:', error);
    res.status(500).json({ error: 'Failed to get client' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error('User not authenticated or missing ID');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const requiredFields = ['name', 'email', 'code', 'vat_code'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    logger.info('Creating new client:', {
      data: req.body,
      userId: req.user.id,
    });
    const client = await prisma.clientsT.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        code: req.body.code,
        vat_code: req.body.vat_code,
        user_id: req.user.id,
      },
    });

    logger.info(`Client created successfully for user ${req.user.id}`);
    res.status(201).json(client);
  } catch (error) {
    logger.error('Error creating client:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid user reference' });
    }
    res.status(500).json({ error: 'Failed to create client' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10);

    logger.info('Checking for existing client:', {
      clientId,
      userId: req.user.id,
    });
    const existingClient = await prisma.clientsT.findFirst({
      where: {
        AND: [{ id: clientId }, { user_id: req.user.id }],
      },
    });

    if (!existingClient) {
      logger.error(`Client not found: ${clientId} for user ${req.user.id}`);
      return res.status(404).json({ error: 'Client not found' });
    }

    logger.info('Updating client:', { clientId, data: req.body });
    const updatedClient = await prisma.clientsT.update({
      where: {
        id: clientId,
      },
      data: {
        name: req.body.name,
        email: existingClient.email,
        code: existingClient.code,
        vat_code: existingClient.vat_code,
        user_id: req.user.id,
      },
    });

    logger.info(
      `Client ${clientId} updated successfully for user ${req.user.id}`
    );
    res.json(updatedClient);
  } catch (error) {
    logger.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id, 10);
    logger.info('Checking for existing client to delete:', {
      clientId,
      userId: req.user.id,
    });
    const existingClient = await prisma.clientsT.findFirst({
      where: {
        id: clientId,
        user_id: req.user.id,
      },
    });

    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await prisma.clientsT.delete({
      where: {
        id: clientId,
        user_id: req.user.id,
      },
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;