// src/controllers/vatReportController.js
const path = require('path');
const fs = require('fs');
const { logger } = require('../config/logger');
const vatReportService = require('../services/vatReportService');

/**
 * Get VAT report data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getVatReport = async (req, res) => {
  try {
    const { startDate, endDate, companyId } = req.query;

    // Get VAT report data using the service
    const reportData = await vatReportService.generateVatReportData(
      startDate,
      endDate,
      companyId
    );

    res.json(reportData);
  } catch (error) {
    logger.error('Error in getVatReport:', error);
    res.status(500).json({ error: 'Failed to get VAT report data' });
  }
};

/**
 * Generate and download PDF report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generatePDF = async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate PDF using the service
    const pdfPath = await vatReportService.generatePDF(data);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=VAT_Report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.pdf`);

    // Stream the file
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    // Delete the file after sending
    fileStream.on('end', () => {
      fs.unlink(pdfPath, (err) => {
        if (err) {
          logger.error(`Failed to delete temporary PDF file ${pdfPath}:`, err);
        }
      });
    });
  } catch (error) {
    logger.error('Error generating PDF report:', error);
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
};

/**
 * Generate and download Financial Report PDF
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateFinancialPDF = async (req, res) => {
  try {
    const data = req.body;

    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate Financial PDF using the service
    const pdfPath = await vatReportService.generateFinancialPDF(data);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Financial_Report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.pdf`);

    // Stream the file
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);

    // Delete the file after sending
    fileStream.on('end', () => {
      fs.unlink(pdfPath, (err) => {
        if (err) {
          logger.error(`Failed to delete temporary PDF file ${pdfPath}:`, err);
        }
      });
    });
  } catch (error) {
    logger.error('Error generating Financial PDF report:', error);
    res.status(500).json({ error: 'Failed to generate Financial PDF report' });
  }
};

/**
 * Generate and download Excel/CSV report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateExcel = async (req, res) => {
  try {
    const data = req.body;
    
    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate CSV using the service
    const csvPath = await vatReportService.generateExcel(data);
    
    // Set response headers with BOM for UTF-8
    res.setHeader('Content-Type', 'text/csv;charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=VAT_Report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.csv`);
    
    // Stream the file
    const fileStream = fs.createReadStream(csvPath);
    fileStream.pipe(res);

    // Delete the file after sending
    fileStream.on('end', () => {
      fs.unlink(csvPath, (err) => {
        if (err) {
          logger.error(`Failed to delete temporary CSV file ${csvPath}:`, err);
        }
      });
    });
  } catch (error) {
    logger.error('Error generating Excel report:', error);
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
};

/**
 * Generate and download JSON report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateJSON = async (req, res) => {
  try {
    const data = req.body;
    
    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate JSON using the service
    const jsonPath = await vatReportService.generateJSON(data);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=VAT_Report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.json`);
    
    // Stream the file
    const fileStream = fs.createReadStream(jsonPath);
    fileStream.pipe(res);

    // Delete the file after sending
    fileStream.on('end', () => {
      fs.unlink(jsonPath, (err) => {
        if (err) {
          logger.error(`Failed to delete temporary JSON file ${jsonPath}:`, err);
        }
      });
    });
  } catch (error) {
    logger.error('Error generating JSON report:', error);
    res.status(500).json({ error: 'Failed to generate JSON report' });
  }
};