const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { logger } = require('../config/logger');
const dateManager = require('./dateManager');

class ReportGenerator {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }

  // Генерация Excel отчета
  async generateExcel(data, options = {}) {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(options.sheetName || 'Report');

      // Установка заголовков
      if (options.headers) {
        worksheet.columns = options.headers.map((header) => ({
          header: header.label,
          key: header.key,
          width: header.width || 15,
        }));
      }

      // Добавление данных
      worksheet.addRows(data);

      // Стилизация
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Сохранение файла
      const fileName = `${options.fileName || 'report'}-${dateManager.format(
        new Date(),
        'YYYY-MM-DD-HHmmss'
      )}.xlsx`;
      const filePath = path.join(this.reportsDir, fileName);

      await workbook.xlsx.writeFile(filePath);
      logger.info('Excel report generated:', { path: filePath });

      return filePath;
    } catch (error) {
      logger.error('Error generating Excel report:', error);
      throw error;
    }
  }

  // Генерация PDF отчета
  async generatePDF(data, options = {}) {
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: options.size || 'A4',
      });

      const fileName = `${options.fileName || 'report'}-${dateManager.format(
        new Date(),
        'YYYY-MM-DD-HHmmss'
      )}.pdf`;
      const filePath = path.join(this.reportsDir, fileName);

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Проверяем, используется ли шаблон финансового документа
      if (options.template === 'financial-document') {
        this.generateFinancialDocument(doc, data, options);
      } else {
        // Стандартный шаблон
        this.generateStandardDocument(doc, data, options);
      }

      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          logger.info('PDF report generated:', { path: filePath });
          resolve(filePath);
        });
        stream.on('error', reject);
      });
    } catch (error) {
      logger.error('Error generating PDF report:', error);
      throw error;
    }
  }

  // Стандартный шаблон PDF
  generateStandardDocument(doc, data, options) {
    // Добавление заголовка
    if (options.title) {
      doc.fontSize(20).text(options.title, { align: 'center' }).moveDown();
    }

    // Добавление даты
    doc
      .fontSize(12)
      .text(
        `Generated: ${dateManager.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`
      )
      .moveDown();

    // Добавление данных
    if (Array.isArray(data)) {
      data.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`);
        });
        doc.moveDown();
      });
    } else {
      doc.text(JSON.stringify(data, null, 2));
    }
  }

  // Шаблон финансового документа с улучшенным форматированием
  // Обновленный код для /var/www/aisolar/solar/b/src/utils/create/reportGenerator.js
// Заменить функцию generateFinancialDocument

  // Шаблон официальной немецкой декларации НДС (Umsatzsteuervoranmeldung)
  generateFinancialDocument(doc, data, options) {
    if (!Array.isArray(data) || data.length === 0) {
      return doc.text('No data provided');
    }

    const reportData = data[0];

    // Номер документа в правом верхнем углу
    doc.fontSize(10)
      .fillColor('#000')
      .text('3608/2090', doc.page.width - 150, 50, { align: 'right' });

    // Основной заголовок - RAPSWAGEN GmbH
    doc.fontSize(12)
      .fillColor('#000')
      .text(reportData.companyName || 'RAPSWAGEN GmbH', 50, 80)
      .text(reportData.companyAddress || 'Kurze Straße 6', 50, 95)
      .text('06366 Köthen', 50, 110)
      .text(reportData.taxNumber || '116/108/08184', 50, 125);

    // Заголовок "Umsatzsteuervoranmeldung" зеленым цветом
    doc.fontSize(16)
      .fillColor('#4CAF50')
      .font('Helvetica-Bold')
      .text('Umsatzsteuervoranmeldung', 50, 160)
      .moveDown(1);

    // Строка с периодом, налоговым номером и статусом
    const infoY = 190;
    doc.fontSize(10)
      .font('Helvetica')
      .fillColor('#4CAF50')
      .text(`Meldezeitraum: ${reportData.period || 'Nov 2022'}`, 50, infoY)
      .fillColor('#000')
      .text(`Steuernummer: ${reportData.taxNumber || '116/108/08184'}`, 200, infoY)
      .fillColor('#4CAF50')
      .text(`Status: Übermittelt`, 400, infoY);

    doc.fontSize(10)
      .fillColor('#4CAF50')
      .text('Betrieb', 50, infoY + 15);

    // Заголовок таблицы
    const tableStartY = 230;
    const tableHeaders = [
      { text: 'Konto', width: 40, x: 50 },
      { text: 'Bezeichnung', width: 200, x: 90 },
      { text: 'Kennziffer', width: 60, x: 290 },
      { text: 'Wert', width: 50, x: 350 },
      { text: 'Kennziffer', width: 60, x: 400 },
      { text: 'BMG (lt.UStVA)', width: 70, x: 460 },
      { text: 'Kennziffer', width: 60, x: 530 },
      { text: 'Steuer (lt.UStVA)', width: 80, x: 590 },
      { text: 'BMG (gebucht)', width: 70, x: 670 },
      { text: 'Steuer (gebucht)', width: 80, x: 740 }
    ];

    // Рисуем заголовок таблицы
    doc.fontSize(8)
      .fillColor('#000')
      .font('Helvetica-Bold');

    let currentY = tableStartY;
    
    tableHeaders.forEach(header => {
      doc.text(header.text, header.x, currentY, { width: header.width, align: 'center' });
    });

    currentY += 20;

    // Линия под заголовком
    doc.lineWidth(0.5)
      .strokeColor('#000')
      .moveTo(50, currentY)
      .lineTo(820, currentY)
      .stroke();

    currentY += 10;

    // Секции данных с официальными кеннциферами
    const sections = [
      {
        title: 'Allgemeine Angaben',
        color: '#4CAF50',
        rows: [
          {
            bezeichnung: 'Berichtigte Steuererklärung (falls ja, bitte eine "1" eintragen)',
            kennziffer: '10',
            wert: '1'
          }
        ]
      },
      {
        title: 'Steuerpflichtige Umsätze',
        color: '#4CAF50',
        rows: [
          {
            bezeichnung: 'Lieferungen und sonstige Leistungen einschl. unentgeltlicher Wertabgaben zum Steuersatz von 19%',
            kennziffer: '81',
            bmgUstva: this.formatCurrency(reportData.vatData?.find(item => item.kennziffer === '81')?.betrag || 45435.00),
            steuerUstva: this.formatCurrency(reportData.vatData?.find(item => item.kennziffer === '81c')?.betrag || 8632.65),
            bmgGebucht: this.formatCurrency(45435.60),
            steuerGebucht: this.formatCurrency(8632.76)
          }
        ]
      },
      {
        title: 'Abziehbare Vorsteuerbeträge',
        color: '#4CAF50',
        rows: [
          {
            bezeichnung: 'Vorsteuerbeträge aus Rechnungen von anderen Unternehmen (§ 15 Abs. 1 Satz 1 Nr. 1 UStG) und aus Leistungen im Sinne des § 13a Abs. 1 Nr. 6 UStG (§ 15 Abs. 1 Satz 1 Nr. 5 UStG) und aus innergemeinschaftlichen Dreiecksgeschäften (§25b Abs. 5 UStG)',
            kennziffer: '66',
            steuerUstva: this.formatCurrency(reportData.vatData?.find(item => item.kennziffer === '66')?.betrag || 156.12),
            steuerGebucht: this.formatCurrency(156.12)
          },
          {
            bezeichnung: 'Entrichtete Einfuhrumsatzsteuer (§ 15 Abs. 1 Satz 1 Nr. 2 UStG)',
            kennziffer: '62',
            steuerUstva: this.formatCurrency(reportData.vatData?.find(item => item.kennziffer === '62')?.betrag || 4998.34),
            steuerGebucht: this.formatCurrency(4998.34)
          }
        ]
      },
      {
        title: 'Zahllast',
        color: '#4CAF50',
        rows: [
          {
            bezeichnung: 'Verbleibende Umsatzsteuer-Vorauszahlung bzw. verbleibender Überschuss',
            kennziffer: '83',
            steuerUstva: this.formatCurrency(reportData.vatData?.find(item => item.kennziffer === '83')?.betrag || 3478.19)
          }
        ]
      }
    ];

    // Рендеринг секций
    sections.forEach(section => {
      // Заголовок секции
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor(section.color)
        .text(section.title, 50, currentY);
      
      currentY += 15;

      // Строки секции
      section.rows.forEach(row => {
        doc.fontSize(8)
          .font('Helvetica')
          .fillColor('#000');

        // Konto (пустое)
        doc.text('', 50, currentY, { width: 40 });
        
        // Bezeichnung
        doc.text(row.bezeichnung, 90, currentY, { width: 200 });
        
        // Kennziffer
        doc.text(row.kennziffer || '', 290, currentY, { width: 60, align: 'center' });
        
        // Wert
        doc.text(row.wert || '', 350, currentY, { width: 50, align: 'center' });
        
        // Kennziffer (2)
        doc.text('', 400, currentY, { width: 60, align: 'center' });
        
        // BMG (lt.UStVA)
        doc.text(row.bmgUstva || '', 460, currentY, { width: 70, align: 'right' });
        
        // Kennziffer (3)
        doc.text('', 530, currentY, { width: 60, align: 'center' });
        
        // Steuer (lt.UStVA)
        doc.text(row.steuerUstva || '', 590, currentY, { width: 80, align: 'right' });
        
        // BMG (gebucht)
        doc.text(row.bmgGebucht || '', 670, currentY, { width: 70, align: 'right' });
        
        // Steuer (gebucht)
        doc.text(row.steuerGebucht || '', 740, currentY, { width: 80, align: 'right' });

        currentY += 25;
      });

      currentY += 10;
    });

    // Нижний колонтитул с подписью IT AI SOLAR
    const pageBottom = doc.page.height - 50;
    doc.fontSize(8)
      .fillColor('#999')
      .text(`🚀 IT AI SOLAR Dashka SmartStb v2.0 | ${new Date().toLocaleDateString('de-DE')}`, 50, pageBottom, { 
        align: 'center',
        width: doc.page.width - 100 
      });

    // Информация о команде разработчиков
    doc.fontSize(7)
      .fillColor('#666')
      .text('Модульная архитектура v2.0 | By Leonid (architect), Dasha (senior), Claude (super-senior) → Jimmy (developer)', 50, pageBottom + 15, {
        align: 'center',
        width: doc.page.width - 100
      });

    doc.fontSize(7)
      .fillColor('#666')
      .text('Modules: vat-calculator.js | export-manager.js | data-loader.js | dashka.styles.css', 50, pageBottom + 25, {
        align: 'center',
        width: doc.page.width - 100
      });
  }

  // Функция форматирования валюты (если не существует)
  formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === '') return '';
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num) + ' €';
  }

  // Очистка старых отчетов
  async cleanupOldReports(maxAge = 7) {
    // maxAge в днях
    try {
      const files = await fs.promises.readdir(this.reportsDir);
      const now = new Date();

      for (const file of files) {
        const filePath = path.join(this.reportsDir, file);
        const stats = await fs.promises.stat(filePath);
        const fileAge = dateManager.getDiff(now, stats.mtime, 'day');

        if (fileAge > maxAge) {
          await fs.promises.unlink(filePath);
          logger.info('Deleted old report:', { path: filePath });
        }
      }
    } catch (error) {
      logger.error('Error cleaning up old reports:', error);
      throw error;
    }
  }
}

module.exports = new ReportGenerator();
