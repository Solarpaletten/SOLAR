// src/controllers/vatController.js
const path = require('path');
const fs = require('fs');
const { logger } = require('../config/logger');

// Import report generator
const vatReportGenerator = path.resolve(__dirname, '../../../vat-declaration/backend/generateReport.js');
let reportGenerator;

try {
  reportGenerator = require(vatReportGenerator);
} catch (error) {
  console.error(`Error loading report generator from ${vatReportGenerator}:`, error);
}

exports.getDeclaration = async (req, res) => {
  try {
    res.json({ message: 'VAT declaration GET endpoint working!' });
  } catch (error) {
    console.error('Error in getDeclaration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.submitDeclaration = async (req, res) => {
  try {
    const data = req.body;
    // Здесь ты можешь валидировать/сохранять данные
    res.status(201).json({ message: 'VAT declaration submitted', data });
  } catch (error) {
    console.error('Error in submitDeclaration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate PDF report
exports.generatePDF = async (req, res) => {
  try {
    if (!reportGenerator) {
      throw new Error('Report generator module not loaded');
    }

    const data = req.body;
    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate PDF
    const pdfPath = await reportGenerator.generatePDF(data);
    
    // Send the file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=VAT_Declaration_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.pdf`);
    
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

// Generate Excel (CSV) report
exports.generateExcel = async (req, res) => {
  try {
    if (!reportGenerator) {
      throw new Error('Report generator module not loaded');
    }

    const data = req.body;
    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate Excel (CSV)
    const csvPath = await reportGenerator.generateCSV(data);
    
    // Send the file
    res.setHeader('Content-Type', 'text/csv;charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=VAT_Declaration_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.csv`);
    
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

// Generate JSON report
exports.generateJSON = async (req, res) => {
  try {
    if (!reportGenerator) {
      throw new Error('Report generator module not loaded');
    }

    const data = req.body;
    if (!data || !data.company || !data.period || !data.data) {
      return res.status(400).json({ error: 'Invalid VAT data provided' });
    }

    // Generate JSON
    const jsonPath = await reportGenerator.generateJSON(data);
    
    // Send the file
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=VAT_Declaration_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}.json`);
    
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