/**
 * Валидация данных для модуля продаж
 * Использует простую самописную валидацию, так как Zod не установлен
 */

// Валидация создания продажи
const validateCreateSale = (data) => {
  const errors = [];

  // Обязательные поля
  if (!data.doc_number) {
    errors.push('Document number is required');
  }

  if (!data.doc_date) {
    errors.push('Document date is required');
  } else if (isNaN(new Date(data.doc_date).getTime())) {
    errors.push('Invalid document date format');
  }

  if (!data.client_id) {
    errors.push('Client ID is required');
  } else if (isNaN(parseInt(data.client_id))) {
    errors.push('Client ID must be a number');
  }

  if (!data.warehouse_id) {
    errors.push('Warehouse ID is required');
  } else if (isNaN(parseInt(data.warehouse_id))) {
    errors.push('Warehouse ID must be a number');
  }

  if (!data.total_amount) {
    errors.push('Total amount is required');
  } else if (isNaN(parseFloat(data.total_amount))) {
    errors.push('Total amount must be a number');
  }

  if (!data.invoice_number) {
    errors.push('Invoice number is required');
  }

  // Валидация позиций продажи
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item, index) => {
      if (!item.product_id) {
        errors.push(`Item #${index + 1}: Product ID is required`);
      } else if (isNaN(parseInt(item.product_id))) {
        errors.push(`Item #${index + 1}: Product ID must be a number`);
      }

      if (!item.quantity) {
        errors.push(`Item #${index + 1}: Quantity is required`);
      } else if (isNaN(parseFloat(item.quantity))) {
        errors.push(`Item #${index + 1}: Quantity must be a number`);
      }

      if (!item.unit_price) {
        errors.push(`Item #${index + 1}: Unit price is required`);
      } else if (isNaN(parseFloat(item.unit_price))) {
        errors.push(`Item #${index + 1}: Unit price must be a number`);
      }

      if (!item.amount) {
        errors.push(`Item #${index + 1}: Amount is required`);
      } else if (isNaN(parseFloat(item.amount))) {
        errors.push(`Item #${index + 1}: Amount must be a number`);
      }

      // Проверка вычисляемых полей
      const calculatedAmount = parseFloat(item.quantity) * parseFloat(item.unit_price);
      if (Math.abs(parseFloat(item.amount) - calculatedAmount) > 0.01) {
        errors.push(`Item #${index + 1}: Amount does not match quantity * unit price`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
};

// Валидация обновления продажи
const validateUpdateSale = (data) => {
  const errors = [];

  // Проверяем только предоставленные поля
  if (data.doc_number === '') {
    errors.push('Document number cannot be empty');
  }

  if (data.doc_date && isNaN(new Date(data.doc_date).getTime())) {
    errors.push('Invalid document date format');
  }

  if (data.client_id && isNaN(parseInt(data.client_id))) {
    errors.push('Client ID must be a number');
  }

  if (data.warehouse_id && isNaN(parseInt(data.warehouse_id))) {
    errors.push('Warehouse ID must be a number');
  }

  if (data.total_amount && isNaN(parseFloat(data.total_amount))) {
    errors.push('Total amount must be a number');
  }

  // Валидация позиций продажи, если они обновляются
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item, index) => {
      if (item.product_id && isNaN(parseInt(item.product_id))) {
        errors.push(`Item #${index + 1}: Product ID must be a number`);
      }

      if (item.quantity && isNaN(parseFloat(item.quantity))) {
        errors.push(`Item #${index + 1}: Quantity must be a number`);
      }

      if (item.unit_price && isNaN(parseFloat(item.unit_price))) {
        errors.push(`Item #${index + 1}: Unit price must be a number`);
      }

      if (item.amount && isNaN(parseFloat(item.amount))) {
        errors.push(`Item #${index + 1}: Amount must be a number`);
      }

      // Проверка вычисляемых полей только если предоставлены все необходимые поля
      if (item.quantity && item.unit_price && item.amount) {
        const calculatedAmount = parseFloat(item.quantity) * parseFloat(item.unit_price);
        if (Math.abs(parseFloat(item.amount) - calculatedAmount) > 0.01) {
          errors.push(`Item #${index + 1}: Amount does not match quantity * unit price`);
        }
      }
    });
  }

  return { isValid: errors.length === 0, errors };
};

module.exports = {
  validateCreateSale,
  validateUpdateSale
};