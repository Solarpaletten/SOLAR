// controllers/purchasesExportController.js
const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const docx = require('docx');
const { Document, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, HeadingLevel, BorderStyle } = docx;

// Экспорт закупки в PDF
exports.exportPurchaseToPdf = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем данные о закупке с учетом прав пользователя
    const purchase = await prismaManager.prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      include: {
        client: true,
        warehouse: true,
        users: true
      }
    });
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    // Создаем PDF документ
    const doc = new PDFDocument({ margin: 50 });
    
    // Настройка заголовков ответа
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=purchase-${purchase.invoice_number}.pdf`);
    
    // Pipe к выходному потоку
    doc.pipe(res);
    
    // Добавляем содержимое
    // Заголовок
    doc.fontSize(20).text('PURCHASE INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Метаданные инвойса
    doc.fontSize(12).text(`Invoice Number: ${purchase.invoice_number}`);
    doc.text(`Document Number: ${purchase.doc_number}`);
    doc.text(`Date: ${new Date(purchase.doc_date).toLocaleDateString()}`);
    doc.text(`Purchase Date: ${purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString() : 'N/A'}`);
    doc.moveDown();
    
    // Информация о поставщике
    doc.text(`Supplier: ${purchase.client.name}`);
    doc.text(`Email: ${purchase.client.email}`);
    doc.text(`Phone: ${purchase.client.phone || 'N/A'}`);
    doc.moveDown();
    
    // Информация о складе
    doc.text(`Warehouse: ${purchase.warehouse.name}`);
    if (purchase.warehouse.address) {
      doc.text(`Address: ${purchase.warehouse.address}`);
    }
    doc.moveDown();
    
    // Финансовая информация
    const vatAmount = purchase.vat_rate 
      ? parseFloat(purchase.total_amount) * (parseFloat(purchase.vat_rate) / 100) 
      : 0;
    const subtotal = parseFloat(purchase.total_amount) - vatAmount;
    
    doc.text(`Subtotal: ${subtotal.toFixed(2)} ${purchase.currency}`);
    if (purchase.vat_rate) {
      doc.text(`VAT (${parseFloat(purchase.vat_rate)}%): ${vatAmount.toFixed(2)} ${purchase.currency}`);
    }
    doc.font('Helvetica-Bold');
    doc.text(`Total: ${parseFloat(purchase.total_amount).toFixed(2)} ${purchase.currency}`, { align: 'right' });
    doc.font('Helvetica');
    doc.moveDown();
    
    // Дополнительная информация
    doc.text(`Status: ${purchase.status.toUpperCase()}`);
    doc.text(`Created at: ${new Date(purchase.created_at).toLocaleString()}`);
    if (purchase.updated_at) {
      doc.text(`Last updated: ${new Date(purchase.updated_at).toLocaleString()}`);
    }
    
    // Завершаем документ
    doc.end();
  } catch (error) {
    logger.error('Error exporting purchase to PDF:', error);
    res.status(500).json({ error: 'Failed to export purchase to PDF' });
  }
};

// Экспорт закупки в Excel
exports.exportPurchaseToExcel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем данные о закупке с учетом прав пользователя
    const purchase = await prismaManager.prisma.purchases.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id,
      },
      include: {
        client: true,
        warehouse: true,
        users: true
      }
    });
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    // Создаем Excel документ
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Solar ERP';
    workbook.lastModifiedBy = 'Solar ERP';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    const worksheet = workbook.addWorksheet('Purchase Invoice');
    
    // Добавляем заголовок
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'PURCHASE INVOICE';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    
    // Добавляем метаданные инвойса
    worksheet.getCell('A3').value = 'Invoice Number:';
    worksheet.getCell('B3').value = purchase.invoice_number;
    
    worksheet.getCell('A4').value = 'Document Number:';
    worksheet.getCell('B4').value = purchase.doc_number;
    
    worksheet.getCell('A5').value = 'Date:';
    worksheet.getCell('B5').value = new Date(purchase.doc_date);
    worksheet.getCell('B5').numFmt = 'dd/mm/yyyy';
    
    worksheet.getCell('A6').value = 'Purchase Date:';
    worksheet.getCell('B6').value = purchase.purchase_date ? new Date(purchase.purchase_date) : 'N/A';
    if (purchase.purchase_date) {
      worksheet.getCell('B6').numFmt = 'dd/mm/yyyy';
    }
    
    // Информация о поставщике
    worksheet.getCell('A8').value = 'Supplier:';
    worksheet.getCell('B8').value = purchase.client.name;
    
    worksheet.getCell('A9').value = 'Email:';
    worksheet.getCell('B9').value = purchase.client.email;
    
    worksheet.getCell('A10').value = 'Phone:';
    worksheet.getCell('B10').value = purchase.client.phone || 'N/A';
    
    // Информация о складе
    worksheet.getCell('A12').value = 'Warehouse:';
    worksheet.getCell('B12').value = purchase.warehouse.name;
    
    worksheet.getCell('A13').value = 'Address:';
    worksheet.getCell('B13').value = purchase.warehouse.address || 'N/A';
    
    // Финансовая информация
    const vatAmount = purchase.vat_rate 
      ? parseFloat(purchase.total_amount) * (parseFloat(purchase.vat_rate) / 100) 
      : 0;
    const subtotal = parseFloat(purchase.total_amount) - vatAmount;
    
    worksheet.getCell('A15').value = 'Subtotal:';
    worksheet.getCell('B15').value = subtotal;
    worksheet.getCell('B15').numFmt = '#,##0.00';
    worksheet.getCell('C15').value = purchase.currency;
    
    if (purchase.vat_rate) {
      worksheet.getCell('A16').value = `VAT (${parseFloat(purchase.vat_rate)}%):`;
      worksheet.getCell('B16').value = vatAmount;
      worksheet.getCell('B16').numFmt = '#,##0.00';
      worksheet.getCell('C16').value = purchase.currency;
    }
    
    worksheet.getCell('A17').value = 'Total:';
    worksheet.getCell('B17').value = parseFloat(purchase.total_amount);
    worksheet.getCell('B17').numFmt = '#,##0.00';
    worksheet.getCell('C17').value = purchase.currency;
    worksheet.getCell('A17').font = { bold: true };
    worksheet.getCell('B17').font = { bold: true };
    
    // Дополнительная информация
    worksheet.getCell('A19').value = 'Status:';
    worksheet.getCell('B19').value = purchase.status.toUpperCase();
    
    worksheet.getCell('A20').value = 'Created at:';
    worksheet.getCell('B20').value = new Date(purchase.created_at);
    worksheet.getCell('B20').numFmt = 'dd/mm/yyyy hh:mm:ss';
    
    if (purchase.updated_at) {
      worksheet.getCell('A21').value = 'Last updated:';
      worksheet.getCell('B21').value = new Date(purchase.updated_at);
      worksheet.getCell('B21').numFmt = 'dd/mm/yyyy hh:mm:ss';
    }
    
    // Автоматическая настройка ширины колонок
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });
    
    // Настройка заголовков ответа
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=purchase-${purchase.invoice_number}.xlsx`);
    
    // Отправка файла
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error('Error exporting purchase to Excel:', error);
    res.status(500).json({ error: 'Failed to export purchase to Excel' });
  }
};

// Экспорт закупки в Word
exports.exportPurchaseToWord = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Получаем данные о закупке с учетом прав пользователя
      const purchase = await prismaManager.prisma.purchases.findFirst({
        where: {
          id: parseInt(id),
          user_id: req.user.id,
        },
        include: {
          client: true,
          warehouse: true,
          users: true
        }
      });
      
      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }
      
      // Создаем Word документ
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Заголовок
            new Paragraph({
              text: 'PURCHASE INVOICE',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            
            // Метаданные инвойса
            new Paragraph({
              text: `Invoice Number: ${purchase.invoice_number}`,
              spacing: { before: 400 },
            }),
            new Paragraph({ text: `Document Number: ${purchase.doc_number}` }),
            new Paragraph({ text: `Date: ${new Date(purchase.doc_date).toLocaleDateString()}` }),
            new Paragraph({ 
              text: `Purchase Date: ${purchase.purchase_date ? new Date(purchase.purchase_date).toLocaleDateString() : 'N/A'}` 
            }),
            
            // Информация о поставщике
            new Paragraph({
              text: `Supplier: ${purchase.client.name}`,
              spacing: { before: 400 },
            }),
            new Paragraph({ text: `Email: ${purchase.client.email}` }),
            new Paragraph({ text: `Phone: ${purchase.client.phone || 'N/A'}` }),
            
            // Информация о складе
            new Paragraph({
              text: `Warehouse: ${purchase.warehouse.name}`,
              spacing: { before: 400 },
            }),
            purchase.warehouse.address 
              ? new Paragraph({ text: `Address: ${purchase.warehouse.address}` })
              : new Paragraph({ text: `Address: N/A` }),
            
            // Финансовая информация
            new Paragraph({
              text: `Financial Details`,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400 },
            }),
          ]
        }]
      });
      
      // Вычисляем финансовые значения
      const vatAmount = purchase.vat_rate 
        ? parseFloat(purchase.total_amount) * (parseFloat(purchase.vat_rate) / 100) 
        : 0;
      const subtotal = parseFloat(purchase.total_amount) - vatAmount;
      
      // Добавляем финансовую таблицу
      const financialTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Description" })] }),
              new TableCell({ children: [new Paragraph({ text: "Amount" })] }),
              new TableCell({ children: [new Paragraph({ text: "Currency" })] }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: "Subtotal" })] }),
              new TableCell({ children: [new Paragraph({ text: subtotal.toFixed(2) })] }),
              new TableCell({ children: [new Paragraph({ text: purchase.currency })] }),
            ],
          }),
        ],
      });
      
      // Добавляем строку VAT, если применимо
      if (purchase.vat_rate) {
        financialTable.root.push(
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph({ text: `VAT (${parseFloat(purchase.vat_rate)}%)` })] }),
              new TableCell({ children: [new Paragraph({ text: vatAmount.toFixed(2) })] }),
              new TableCell({ children: [new Paragraph({ text: purchase.currency })] }),
            ],
          })
        );
      }
      
      // Добавляем строку Total
      financialTable.root.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: "Total", bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: parseFloat(purchase.total_amount).toFixed(2), bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: purchase.currency, bold: true })] }),
          ],
        })
      );
      
      // Добавляем таблицу в документ
      doc.addSection({
        children: [financialTable]
      });
      
      // Добавляем дополнительную информацию
      doc.addSection({
        children: [
          new Paragraph({
            text: `Additional Information`,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: `Status: ${purchase.status.toUpperCase()}` }),
          new Paragraph({ text: `Created at: ${new Date(purchase.created_at).toLocaleString()}` }),
          purchase.updated_at 
            ? new Paragraph({ text: `Last updated: ${new Date(purchase.updated_at).toLocaleString()}` })
            : null,
        ]
      });
      
      // Преобразуем в buffer для отправки
      const buffer = await docx.Packer.toBuffer(doc);
      
      // Настройка заголовков ответа
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename=purchase-${purchase.invoice_number}.docx`);
      
      // Отправка файла
      res.send(buffer);
    } catch (error) {
      logger.error('Error exporting purchase to Word:', error);
      res.status(500).json({ error: 'Failed to export purchase to Word' });
    }
  };