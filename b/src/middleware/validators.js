// middleware/validators.js
const { body, validationResult } = require('express-validator');
const { logger } = require('../config/logger');

// Общая функция проверки результатов валидации
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation errors:', { errors: errors.array() });
    return res.status(400).json({ 
      error: 'Ошибка валидации данных', 
      details: errors.array()
    });
  }
  next();
};

// Валидаторы для компании
const companyValidators = {
  // Валидация при создании компании через онбординг
  setupCompany: [
    body('companyCode')
      .notEmpty().withMessage('Код компании обязателен')
      .isLength({ min: 3, max: 50 }).withMessage('Код компании должен содержать от 3 до 50 символов')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Код компании может содержать только буквы, цифры, дефис и подчеркивание'),
    
    body('directorName')
      .notEmpty().withMessage('Имя директора обязательно')
      .isLength({ min: 2, max: 100 }).withMessage('Имя директора должно содержать от 2 до 100 символов'),
    
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 }).withMessage('Название компании должно содержать от 2 до 100 символов'),
    
    body('email')
      .optional()
      .isEmail().withMessage('Некорректный формат email'),
    
    body('phone')
      .optional()
      .isLength({ min: 7, max: 20 }).withMessage('Номер телефона должен содержать от 7 до 20 символов'),
    
    validate
  ]
};

// Валидаторы для аутентификации пользователей
const authValidators = {
  // Валидация при регистрации
  register: [
    body('email')
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Некорректный формат email'),
    
    body('username')
      .notEmpty().withMessage('Имя пользователя обязательно')
      .isLength({ min: 3, max: 50 }).withMessage('Имя пользователя должно содержать от 3 до 50 символов')
      .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Имя пользователя может содержать только буквы, цифры, дефис и подчеркивание'),
    
    body('password')
      .notEmpty().withMessage('Пароль обязателен')
      .isLength({ min: 8 }).withMessage('Пароль должен содержать минимум 8 символов')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Пароль должен содержать как минимум одну заглавную букву, одну строчную букву и одну цифру'),
    
    validate
  ],
  
  // Валидация при входе
  login: [
    body('email')
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Некорректный формат email'),
    
    body('password')
      .notEmpty().withMessage('Пароль обязателен'),
    
    validate
  ],
  
  // Валидация при сбросе пароля
  resetPassword: [
    body('token')
      .notEmpty().withMessage('Токен сброса пароля обязателен'),
    
    body('password')
      .notEmpty().withMessage('Пароль обязателен')
      .isLength({ min: 8 }).withMessage('Пароль должен содержать минимум 8 символов')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).withMessage('Пароль должен содержать как минимум одну заглавную букву, одну строчную букву и одну цифру'),
    
    validate
  ],
  
  // Валидация при запросе восстановления пароля
  forgotPassword: [
    body('email')
      .notEmpty().withMessage('Email обязателен')
      .isEmail().withMessage('Некорректный формат email'),
    
    validate
  ]
};

module.exports = {
  companyValidators,
  authValidators
};