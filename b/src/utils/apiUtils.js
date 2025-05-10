/**
 * Утилиты для работы с API
 * Преобразование данных между frontend и backend форматами
 */

/**
 * Преобразует ID из числового в строковый формат
 * @param {Object} item - Объект с данными
 * @returns {Object} - Объект с преобразованным ID
 */
const convertIdToString = (item) => {
  if (!item) return null;
  
  const result = { ...item };
  if (result.id !== undefined) {
    result.id = String(result.id);
  }
  return result;
};

/**
 * Преобразует массив объектов, конвертируя их ID в строковый формат
 * @param {Array} items - Массив объектов
 * @returns {Array} - Массив с преобразованными объектами
 */
const convertArrayIds = (items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(convertIdToString);
};

/**
 * Конвертирует snake_case ключи в camelCase
 * @param {string} snakeKey - Ключ в формате snake_case
 * @returns {string} - Ключ в формате camelCase
 */
const snakeToCamel = (snakeKey) => {
  return snakeKey.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Конвертирует camelCase ключи в snake_case
 * @param {string} camelKey - Ключ в формате camelCase
 * @returns {string} - Ключ в формате snake_case
 */
const camelToSnake = (camelKey) => {
  return camelKey.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Преобразует объект из snake_case в camelCase
 * @param {Object} obj - Объект с ключами в snake_case
 * @returns {Object} - Объект с ключами в camelCase
 */
const convertToCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const result = {};
  Object.entries(obj).forEach(([key, value]) => {
    let camelKey = snakeToCamel(key);
    
    // Рекурсивно обрабатываем вложенные объекты и массивы
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[camelKey] = value.map(item => 
          typeof item === 'object' && item !== null ? convertToCamelCase(item) : item
        );
      } else {
        result[camelKey] = convertToCamelCase(value);
      }
    } else {
      result[camelKey] = value;
    }
  });

  return result;
};

/**
 * Преобразует объект из camelCase в snake_case
 * @param {Object} obj - Объект с ключами в camelCase
 * @returns {Object} - Объект с ключами в snake_case
 */
const convertToSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;

  const result = {};
  Object.entries(obj).forEach(([key, value]) => {
    let snakeKey = camelToSnake(key);
    
    // Рекурсивно обрабатываем вложенные объекты и массивы
    if (value !== null && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[snakeKey] = value.map(item => 
          typeof item === 'object' && item !== null ? convertToSnakeCase(item) : item
        );
      } else {
        result[snakeKey] = convertToSnakeCase(value);
      }
    } else {
      result[snakeKey] = value;
    }
  });

  return result;
};

/**
 * Преобразует данные из формата БД в формат API 
 * (преобразуем ID в строку и конвертируем в camelCase)
 * @param {Object|Array} data - Данные для преобразования
 * @returns {Object|Array} - Преобразованные данные
 */
const transformToApiFormat = (data) => {
  if (!data) return null;
  
  // Обрабатываем массив
  if (Array.isArray(data)) {
    return data.map(item => transformToApiFormat(item));
  }
  
  // Обрабатываем объект
  const stringIdData = convertIdToString(data);
  return convertToCamelCase(stringIdData);
};

/**
 * Преобразует данные из формата API в формат БД
 * (конвертируем из camelCase в snake_case)
 * @param {Object|Array} data - Данные для преобразования
 * @returns {Object|Array} - Преобразованные данные
 */
const transformToDbFormat = (data) => {
  if (!data) return null;
  
  // Обрабатываем массив
  if (Array.isArray(data)) {
    return data.map(item => transformToDbFormat(item));
  }
  
  // Обрабатываем объект
  return convertToSnakeCase(data);
};

module.exports = {
  convertIdToString,
  convertArrayIds,
  snakeToCamel,
  camelToSnake,
  convertToCamelCase,
  convertToSnakeCase,
  transformToApiFormat,
  transformToDbFormat
};