/**
 * Утилиты для работы с данными компании
 */
const { logger } = require('../config/logger');

/**
 * Стандартизирует код компании, удаляя суффикс с временной меткой, если он есть
 * @param {string} code Код компании (может быть с суффиксом или без)
 * @returns {string} Очищенный код компании без суффикса
 */
const standardizeCompanyCode = (code) => {
  if (!code) return '';
  
  // Удаляем суффикс временной метки, если он есть
  // Формат: "14926445_525518" -> "14926445"
  const originalCode = code;
  const cleanCode = code.split('_')[0];
  
  // Если код был изменён, логируем это
  if (originalCode !== cleanCode) {
    logger.info(`Стандартизирован код компании: ${originalCode} -> ${cleanCode}`);
  }
  
  return cleanCode;
};

/**
 * Middleware для стандартизации кода компании
 * Преобразует код компании в запросе перед дальнейшей обработкой
 */
const standardizeCompanyCodeMiddleware = (req, res, next) => {
  try {
    // Проверяем наличие поля companyCode в запросе
    if (req.body && req.body.companyCode) {
      // Логируем исходное значение для отладки
      logger.debug('Получен код компании:', { 
        originalCode: req.body.companyCode 
      });
      
      // Стандартизируем код
      req.body.companyCode = standardizeCompanyCode(req.body.companyCode);
      
      // Логируем результат для отладки
      logger.debug('Стандартизирован код компании:', { 
        standardizedCode: req.body.companyCode 
      });
    }
    
    next();
  } catch (error) {
    logger.error('Ошибка при стандартизации кода компании:', error);
    next(error); // Передаем ошибку дальше для обработки
  }
};

module.exports = {
  standardizeCompanyCode,
  standardizeCompanyCodeMiddleware
};