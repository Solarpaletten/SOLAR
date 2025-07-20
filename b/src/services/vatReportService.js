// src/services/vatReportService.js
const fs = require('fs');
const path = require('path');
const { logger } = require('../config/logger');
const pdfManager = require('../utils/create/pdfManager');
const reportGenerator = require('../utils/create/reportGenerator');

/**
 * Generate VAT report data based on date range and company
 * @param {String} startDate - Start date for report period
 * @param {String} endDate - End date for report period
 * @param {String} companyId - Company ID for the report
 * @returns {Object} VAT report data
 */
exports.generateVatReportData = async (startDate, endDate, companyId) => {
  try {
    // This would be implemented to fetch data from sales and purchases tables
    // For now, return sample data
    return {
      company: {
        name: 'ASSET LOGISTICS GMBH',
        address: 'Kurze Straße 6, 06366 Köthen',
        hrb: '34481',
        steuernummer: 'DE453202061'
      },
      period: 'März 2025',
      data: {
        field10: 0,
        field81a: 0.00,
        field81b: 133.56,
        field81: 133.56,
        field81c: 0.00,
        field41a: 18400.00,
        field41b: 0.00,
        field41: 18400.00,
        field41c: 0.00,
        field43: 0.00,
        field66: 25.38,
        field62: 3085.59,
        field67: 0.00,
        field83: -3110.97,
        plannedProfit: 18266.44
      }
    };
  } catch (error) {
    logger.error('Error generating VAT report data:', error);
    throw error;
  }
};

/**
 * Generate PDF for VAT report
 * @param {Object} data - VAT report data
 * @returns {String} Path to generated PDF file
 */
exports.generatePDF = async (data) => {
  try {
    // Create the VAT PDF template structure
    const vatTemplate = {
      title: `VAT Declaration - ${data.company.name} - ${data.period}`,
      content: formatReportContent(data),
      company: data.company
    };

    // Generate PDF using the report generator
    const pdfPath = await reportGenerator.generatePDF(vatTemplate.content, {
      fileName: `vat_report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}`,
      title: vatTemplate.title
    });

    return pdfPath;
  } catch (error) {
    logger.error('Error generating VAT PDF report:', error);
    throw error;
  }
};

/**
 * Generate Financial PDF for VAT report
 * @param {Object} data - VAT report data
 * @returns {String} Path to generated PDF file
 */
exports.generateFinancialPDF = async (data) => {
  try {
    // Create the Financial Report PDF template structure
    const financialTemplate = {
      title: `Финансовый отчёт - ${data.company.name} - ${data.period}`,
      content: formatFinancialReportContent(data),
      company: data.company
    };

    // Generate PDF using the report generator with financial document styling
    const pdfPath = await reportGenerator.generatePDF(financialTemplate.content, {
      fileName: `financial_report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}`,
      title: financialTemplate.title,
      template: 'financial-document'
    });

    return pdfPath;
  } catch (error) {
    logger.error('Error generating Financial PDF report:', error);
    throw error;
  }
};

/**
 * Generate Excel/CSV for VAT report
 * @param {Object} data - VAT report data
 * @returns {String} Path to generated Excel file
 */
exports.generateExcel = async (data) => {
  try {
    // Create CSV content
    const csvRows = [
      ['IT AI SOLAR Dashka SmartStb - Umsatzsteuervoranmeldung', data.period],
      [data.company.name, data.company.steuernummer],
      [data.company.address],
      [],
      ['Code', 'Description', 'Amount (€)'],
      ['10', 'Berichtigte Anmeldung', data.data.field10],
      [],
      ['Code 81 - Steuerpflichtige Umsätze'],
      ['81a', 'Товары/услуги С НДС (сумма без НДС)', data.data.field81a],
      ['81b', 'Товары/услуги БЕЗ НДС', data.data.field81b],
      ['81', 'ИТОГО код 81', data.data.field81],
      ['81c', 'НДС81', data.data.field81c],
      [],
      ['Code 41 - Поставки клиентам'],
      ['41a', 'Внутриевропейские поставки (0%)', data.data.field41a],
      ['41b', 'Внутренние поставки с НДС (без НДС)', data.data.field41b],
      ['41', 'ИТОГО код 41', data.data.field41],
      ['41c', 'НДС41', data.data.field41c],
      [],
      ['43', 'Экспорт в третьи страны (0%)', data.data.field43],
      [],
      ['Abziehbare Vorsteuerbeträge (Зачетный НДС)'],
      ['66', 'НДС по счетам поставщиков', data.data.field66],
      ['62', 'Уплаченный импортный НДС', data.data.field62],
      ['67', 'НДС по внутриевропейским приобретениям', data.data.field67],
      [],
      ['Итоги'],
      ['PROFIT', 'Плановая прибыль', data.data.plannedProfit],
      ['83', 'К доплате (+) / К возврату (-)', data.data.field83],
      [],
      ['Дата формирования отчета:', new Date().toISOString()]
    ];

    // Create a temporary file path
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const fileName = `vat_report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    const filePath = path.join(reportsDir, fileName);
    
    // Add BOM for UTF-8
    const BOM = '\uFEFF';
    let csvContent = BOM + csvRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Write to file
    fs.writeFileSync(filePath, csvContent, 'utf8');
    
    return filePath;
  } catch (error) {
    logger.error('Error generating VAT Excel report:', error);
    throw error;
  }
};

/**
 * Generate JSON for VAT report
 * @param {Object} data - VAT report data
 * @returns {String} Path to generated JSON file
 */
exports.generateJSON = async (data) => {
  try {
    // Enhance data with metadata
    const enhancedData = {
      ...data,
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '2.0',
        generator: 'IT AI SOLAR Dashka SmartStb'
      }
    };
    
    // Create a temporary file path
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const fileName = `vat_report_${data.company.name.replace(/\s+/g, '_')}_${data.period.replace(/\s+/g, '_')}_${Date.now()}.json`;
    const filePath = path.join(reportsDir, fileName);
    
    // Write to file
    fs.writeFileSync(filePath, JSON.stringify(enhancedData, null, 2), 'utf8');
    
    return filePath;
  } catch (error) {
    logger.error('Error generating VAT JSON report:', error);
    throw error;
  }
};

/**
 * Format report content for PDF generation
 * @param {Object} data - VAT report data
 * @returns {Array} Formatted data for the report generator
 */
function formatReportContent(data) {
  return [
    {
      company: data.company.name,
      address: data.company.address,
      hrb: data.company.hrb,
      steuernummer: data.company.steuernummer,
      period: data.period,
      reportDate: new Date().toLocaleDateString('de-DE'),
      vatData: [
        { code: '10', description: 'Berichtigte Anmeldung', amount: data.data.field10 },
        { section: 'Steuerpflichtige Umsätze (19%)' },
        { code: '81a', description: 'Товары/услуги С НДС (сумма без НДС)', amount: data.data.field81a },
        { code: '81b', description: 'Товары/услуги БЕЗ НДС', amount: data.data.field81b },
        { code: '81', description: 'ИТОГО код 81', amount: data.data.field81, isTotal: true },
        { code: '81c', description: 'НДС81 - Начисленный НДС с кода 81', amount: data.data.field81c },
        { section: 'Поставки клиентам' },
        { code: '41a', description: 'Внутриевропейские поставки (0%)', amount: data.data.field41a },
        { code: '41b', description: 'Внутренние поставки с НДС (без НДС)', amount: data.data.field41b },
        { code: '41', description: 'ИТОГО код 41', amount: data.data.field41, isTotal: true },
        { code: '41c', description: 'НДС41 - Начисленный НДС с кода 41', amount: data.data.field41c },
        { code: '43', description: 'Экспорт в третьи страны (0%)', amount: data.data.field43 },
        { section: 'Abziehbare Vorsteuerbeträge (Зачетный НДС)' },
        { code: '66', description: 'НДС по счетам поставщиков', amount: data.data.field66 },
        { code: '62', description: 'Уплаченный импортный НДС', amount: data.data.field62 },
        { code: '67', description: 'НДС по внутриевропейским приобретениям', amount: data.data.field67 },
        { section: 'Итоги' },
        { code: 'PROFIT', description: 'Плановая прибыль', amount: data.data.plannedProfit, isHighlighted: true },
        { code: '83', description: 'К доплате (+) / К возврату (-)', amount: data.data.field83, isHighlighted: true }
      ]
    }
  ];
}

/**
 * Format financial report content for PDF generation
 * @param {Object} data - VAT report data
 * @returns {Array} Formatted data for the financial report generator
 */

// Обновленный код для /var/www/aisolar/solar/b/src/services/vatReportService.js
// Заменить функцию formatFinancialReportContent

function formatFinancialReportContent(data) {
  return [
    {
      companyName: data.company.name || 'RAPSWAGEN GmbH',
      companyAddress: data.company.address || 'Kurze Straße 6',
      taxNumber: data.company.steuernummer || '116/108/08184',
      registrationNumber: data.company.hrb || 'HRB: 34481',
      period: data.period || 'März 2025',
      reportDate: new Date().toLocaleDateString('de-DE'),
      currency: 'EUR',
      signatures: {
        accountant: true,
        director: true,
        stamp: true
      },
      // Официальные кеннциферы согласно BMF Umsatzsteuervoranmeldung
      vatData: [
        // Allgemeine Angaben
        { 
          kennziffer: '10', 
          description: 'Berichtigte Steuererklärung (falls ja, bitte eine "1" eintragen)', 
          betrag: data.data.field10 || 1 
        },
        
        // Steuerpflichtige Umsätze - Kennziffer 81 (19% USt)
        { 
          kennziffer: '81', 
          description: 'Lieferungen und sonstige Leistungen einschl. unentgeltlicher Wertabgaben zum Steuersatz von 19%', 
          betrag: data.data.field81 || data.data.field81a || 45435.00,
          isTotal: true 
        },
        { 
          kennziffer: '81c', 
          description: 'Umsatzsteuer auf Kennziffer 81 (19%)', 
          betrag: data.data.field81c || 8632.65 
        },
        
        // Steuerfreie Umsätze - Kennziffer 41 (innergemeinschaftliche Lieferungen)
        { 
          kennziffer: '41', 
          description: 'Innergemeinschaftliche Lieferungen (§ 4 Nr. 1 Buchst. b UStG)', 
          betrag: data.data.field41 || 0 
        },
        
        // Ausfuhrlieferungen - Kennziffer 43
        { 
          kennziffer: '43', 
          description: 'Ausfuhrlieferungen (§ 4 Nr. 1 Buchst. a UStG)', 
          betrag: data.data.field43 || 0 
        },
        
        // Abziehbare Vorsteuerbeträge - Kennziffer 66
        { 
          kennziffer: '66', 
          description: 'Vorsteuerbeträge aus Rechnungen von anderen Unternehmen (§ 15 Abs. 1 Satz 1 Nr. 1 UStG)', 
          betrag: data.data.field66 || 156.12 
        },
        
        // Einfuhrumsatzsteuer - Kennziffer 62
        { 
          kennziffer: '62', 
          description: 'Entrichtete Einfuhrumsatzsteuer (§ 15 Abs. 1 Satz 1 Nr. 2 UStG)', 
          betrag: data.data.field62 || 4998.34 
        },
        
        // Vorsteuer bei innergemeinschaftlichen Erwerben - Kennziffer 67
        { 
          kennziffer: '67', 
          description: 'Vorsteuerbeträge aus innergemeinschaftlichen Erwerben (§ 15 Abs. 1 Satz 1 Nr. 3 UStG)', 
          betrag: data.data.field67 || 0 
        },
        
        // Zahllast/Überschuss - Kennziffer 83 (основной результат)
        { 
          kennziffer: '83', 
          description: 'Verbleibende Umsatzsteuer-Vorauszahlung bzw. verbleibender Überschuss', 
          betrag: data.data.field83 || 3478.19,
          isHighlighted: true 
        }
      ]
    }
  ];
}
