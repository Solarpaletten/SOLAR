// controllers/salesExportController.js
const prismaManager = require('../utils/prismaManager');
const { logger } = require('../config/logger');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const docx = require('docx');
const { Document, Paragraph, Table, TableRow, TableCell, TextRun, AlignmentType, HeadingLevel, BorderStyle } = docx;

// Экспорт продажи в PDF
exports.exportSaleToPdf = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем данные о продаже с учетом прав пользователя
    const sale = await prismaManager.prisma.sales.findFirst({
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
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Создаем PDF документ
    const doc = new PDFDocument({ margin: 50 });
    
    // Настройка заголовков ответа
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sale-${sale.invoice_number}.pdf`);
    
    // Pipe к выходному потоку
    doc.pipe(res);
    
    // Добавляем содержимое
    // Заголовок
    doc.fontSize(20).text('SALES INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Метаданные инвойса
    doc.fontSize(12).text(`Invoice Number: ${sale.invoice_number}`);
    doc.text(`Document Number: ${sale.doc_number}`);
    doc.text(`Date: ${new Date(sale.doc_date).toLocaleDateString()}`);
    doc.text(`Sale Date: ${sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}`);
    doc.moveDown();
    
    // Информация о клиенте
    doc.text(`Client: ${sale.client.name}`);
    doc.text(`Email: ${sale.client.email}`);
    doc.text(`Phone: ${sale.client.phone || 'N/A'}`);
    doc.moveDown();
    
    // Информация о складе
    doc.text(`Warehouse: ${sale.warehouse.name}`);
    if (sale.warehouse.address) {
      doc.text(`Address: ${sale.warehouse.address}`);
    }
    doc.moveDown();
    
    // Финансовая информация
    const vatAmount = sale.vat_rate 
      ? parseFloat(sale.total_amount) * (parseFloat(sale.vat_rate) / 100) 
      : 0;
    const subtotal = parseFloat(sale.total_amount) - vatAmount;
    
    doc.text(`Subtotal: ${subtotal.toFixed(2)} ${sale.currency}`);
    if (sale.vat_rate) {
      doc.text(`VAT (${parseFloat(sale.vat_rate)}%): ${vatAmount.toFixed(2)} ${sale.currency}`);
    }
    doc.font('Helvetica-Bold');
    doc.text(`Total: ${parseFloat(sale.total_amount).toFixed(2)} ${sale.currency}`, { align: 'right' });
    doc.font('Helvetica');
    doc.moveDown();
    
    // Дополнительная информация
    doc.text(`Status: ${sale.status.toUpperCase()}`);
    doc.text(`Created at: ${new Date(sale.created_at).toLocaleString()}`);
    if (sale.updated_at) {
      doc.text(`Last updated: ${new Date(sale.updated_at).toLocaleString()}`);
    }
    
    // Завершаем документ
    doc.end();
  } catch (error) {
    logger.error('Error exporting sale to PDF:', error);
    res.status(500).json({ error: 'Failed to export sale to PDF' });
  }
};

// Экспорт продажи в Excel
exports.exportSaleToExcel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем данные о продаже с учетом прав пользователя
    const sale = await prismaManager.prisma.sales.findFirst({
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
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Создаем Excel документ
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Solar ERP';
    workbook.lastModifiedBy = 'Solar ERP';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    const worksheet = workbook.addWorksheet('Sales Invoice');
    
    // Добавляем заголовок
    worksheet.mergeCells('A1:G1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'SALES INVOICE';
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: 'center' };
    
    // Добавляем метаданные инвойса
    worksheet.getCell('A3').value = 'Invoice Number:';
    worksheet.getCell('B3').value = sale.invoice_number;
    
    worksheet.getCell('A4').value = 'Document Number:';
    worksheet.getCell('B4').value = sale.doc_number;
    
    worksheet.getCell('A5').value = 'Date:';
    worksheet.getCell('B5').value = new Date(sale.doc_date);
    worksheet.getCell('B5').numFmt = 'dd/mm/yyyy';
    
    worksheet.getCell('A6').value = 'Sale Date:';
    worksheet.getCell('B6').value = sale.sale_date ? new Date(sale.sale_date) : 'N/A';
    if (sale.sale_date) {
      worksheet.getCell('B6').numFmt = 'dd/mm/yyyy';
    }
    
    // Информация о клиенте
    worksheet.getCell('A8').value = 'Client:';
    worksheet.getCell('B8').value = sale.client.name;
    
    worksheet.getCell('A9').value = 'Email:';
    worksheet.getCell('B9').value = sale.client.email;
    
    worksheet.getCell('A10').value = 'Phone:';
    worksheet.getCell('B10').value = sale.client.phone || 'N/A';
    
    // Информация о складе
    worksheet.getCell('A12').value = 'Warehouse:';
    worksheet.getCell('B12').value = sale.warehouse.name;
    
    worksheet.getCell('A13').value = 'Address:';
    worksheet.getCell('B13').value = sale.warehouse.address || 'N/A';
    
    // Финансовая информация
    const vatAmount = sale.vat_rate 
      ? parseFloat(sale.total_amount) * (parseFloat(sale.vat_rate) / 100) 
      : 0;
    const subtotal = parseFloat(sale.total_amount) - vatAmount;
    
    worksheet.getCell('A15').value = 'Subtotal:';
    worksheet.getCell('B15').value = subtotal;
    worksheet.getCell('B15').numFmt = '#,##0.00';
    worksheet.getCell('C15').value = sale.currency;
    
    if (sale.vat_rate) {
      worksheet.getCell('A16').value = `VAT (${parseFloat(sale.vat_rate)}%):`;
      worksheet.getCell('B16').value = vatAmount;
      worksheet.getCell('B16').numFmt = '#,##0.00';
      worksheet.getCell('C16').value = sale.currency;
    }
    
    worksheet.getCell('A17').value = 'Total:';
    worksheet.getCell('B17').value = parseFloat(sale.total_amount);
    worksheet.getCell('B17').numFmt = '#,##0.00';
    worksheet.getCell('C17').value = sale.currency;
    worksheet.getCell('A17').font = { bold: true };
    worksheet.getCell('B17').font = { bold: true };
    
    // Дополнительная информация
    worksheet.getCell('A19').value = 'Status:';
    worksheet.getCell('B19').value = sale.status.toUpperCase();
    
    worksheet.getCell('A20').value = 'Created at:';
    worksheet.getCell('B20').value = new Date(sale.created_at);
    worksheet.getCell('B20').numFmt = 'dd/mm/yyyy hh:mm:ss';
    
    if (sale.updated_at) {
      worksheet.getCell('A21').value = 'Last updated:';
      worksheet.getCell('B21').value = new Date(sale.updated_at);
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
    res.setHeader('Content-Disposition', `attachment; filename=sale-${sale.invoice_number}.xlsx`);
    
    // Отправка файла
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error('Error exporting sale to Excel:', error);
    res.status(500).json({ error: 'Failed to export sale to Excel' });
  }
};

// Экспорт продажи в Word
exports.exportSaleToWord = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем данные о продаже с учетом прав пользователя
    const sale = await prismaManager.prisma.sales.findFirst({
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
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Создаем Word документ
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Заголовок
          new Paragraph({
            text: 'SALES INVOICE',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          
          // Метаданные инвойса
          new Paragraph({
            text: `Invoice Number: ${sale.invoice_number}`,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: `Document Number: ${sale.doc_number}` }),
          new Paragraph({ text: `Date: ${new Date(sale.doc_date).toLocaleDateString()}` }),
          new Paragraph({ 
            text: `Sale Date: ${sale.sale_date ? new Date(sale.sale_date).toLocaleDateString() : 'N/A'}` 
          }),
          
          // Информация о клиенте
          new Paragraph({
            text: `Client: ${sale.client.name}`,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: `Email: ${sale.client.email}` }),
          new Paragraph({ text: `Phone: ${sale.client.phone || 'N/A'}` }),
          
          // Информация о складе
          new Paragraph({
            text: `Warehouse: ${sale.warehouse.name}`,
            spacing: { before: 400 },
          }),
          sale.warehouse.address 
            ? new Paragraph({ text: `Address: ${sale.warehouse.address}` })
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
    const vatAmount = sale.vat_rate 
      ? parseFloat(sale.total_amount) * (parseFloat(sale.vat_rate) / 100) 
      : 0;
    const subtotal = parseFloat(sale.total_amount) - vatAmount;
    
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
            new TableCell({ children: [new Paragraph({ text: sale.currency })] }),
          ],
        }),
      ],
    });
    
    // Добавляем строку VAT, если применимо
    if (sale.vat_rate) {
      financialTable.root.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: `VAT (${parseFloat(sale.vat_rate)}%)` })] }),
            new TableCell({ children: [new Paragraph({ text: vatAmount.toFixed(2) })] }),
            new TableCell({ children: [new Paragraph({ text: sale.currency })] }),
          ],
        })
      );
    }
    
    // Добавляем строку Total
    financialTable.root.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: "Total", bold: true })] }),
          new TableCell({ children: [new Paragraph({ text: parseFloat(sale.total_amount).toFixed(2), bold: true })] }),
          new TableCell({ children: [new Paragraph({ text: sale.currency, bold: true })] }),
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
        new Paragraph({ text: `Status: ${sale.status.toUpperCase()}` }),
        new Paragraph({ text: `Created at: ${new Date(sale.created_at).toLocaleString()}` }),
        sale.updated_at 
          ? new Paragraph({ text: `Last updated: ${new Date(sale.updated_at).toLocaleString()}` })
          : null,
      ]
    });
    
    // Преобразуем в buffer для отправки
    const buffer = await docx.Packer.toBuffer(doc);
    
    // Настройка заголовков ответа
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=sale-${sale.invoice_number}.docx`);
    
    // Отправка файла
    res.send(buffer);
  } catch (error) {
    logger.error('Error exporting sale to Word:', error);
    res.status(500).json({ error: 'Failed to export sale to Word' });
  }
};