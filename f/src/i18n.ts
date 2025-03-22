import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Определяем переводы для русского и английского языков
const resources = {
  en: {
    translation: {
      // Навигационное меню
      product: 'Product',
      integrations: 'Integrations',
      training: 'Training',
      prices: 'Prices',
      accountingCompanies: 'Accounting Companies',
      signIn: 'Sign In',
      register: 'Register',

      // Главный заголовок
      mainHeader: 'Accounting program in the cloud that unites an accountant and a director',
      startUsing: 'Start Using',
      freeTrial: '30 days free trial',

      // Секция "Распознавание счетов"
      invoiceRecognitionTitle: 'Invoice recognition within 30 seconds',
      invoiceRecognitionFeatures: [
        'Full recognition within 30 seconds',
        'Recognition of non-standard invoices',
        'Bulk invoice processing with one click',
        'Automatic upload of the invoice to storage',
      ],
      tryRecognition: 'Try Recognition',

      // Секция с котиком
      kittenText: 'Our kitten loves cookies (just like us), that’s why it uses LEANID SOLAR',
      supportKitten: 'I SUPPORT THE KITTEN',
    },
  },
  ru: {
    translation: {
      // Навигационное меню
      product: 'Продукт',
      integrations: 'Интеграции',
      training: 'Обучение',
      prices: 'Цены',
      accountingCompanies: 'Бухгалтерские компании',
      signIn: 'Войти',
      register: 'Регистрация',

      // Главный заголовок
      mainHeader: 'Бухгалтерская программа в облаке, которая объединяет бухгалтера и директора',
      startUsing: 'Начать использовать',
      freeTrial: '30 дней бесплатного пробного периода',

      // Секция "Распознавание счетов"
      invoiceRecognitionTitle: 'Распознавание счетов за 30 секунд',
      invoiceRecognitionFeatures: [
        'Полное распознавание за 30 секунд',
        'Распознавание нестандартных счетов',
        'Массовая обработка счетов одним кликом',
        'Автоматическая загрузка счета в хранилище',
      ],
      tryRecognition: 'Попробовать распознавание',

      // Секция с котиком
      kittenText: 'Наш котёнок любит печенье (как и мы), поэтому он использует LEANID SOLAR',
      supportKitten: 'Я ПОДДЕРЖИВАЮ КОТЁНКА',
    },
  },
};

// Инициализируем i18next
i18n
  .use(LanguageDetector) // Автоматическое определение языка
  .use(initReactI18next) // Интеграция с React
  .init({
    resources,
    fallbackLng: 'en', // Язык по умолчанию, если не удалось определить язык пользователя
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
  });

export default i18n;