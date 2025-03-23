import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Определяем переводы для русского и английского языков
const resources = {
  en: {
    translation: {
      // Переводы для LandingPage (уже есть)
      product: 'Product',
      integrations: 'Integrations',
      training: 'Training',
      prices: 'Prices',
      accountingCompanies: 'Accounting Companies',
      signIn: 'Sign In',
      register: 'Register',
      mainHeader: 'Accounting program in the cloud that unites an accountant and a director',
      startUsing: 'Start Using',
      freeTrial: '30 days free trial',
      invoiceRecognitionTitle: 'Invoice recognition within 30 seconds',
      invoiceRecognitionFeatures: [
        'Full recognition within 30 seconds',
        'Recognition of non-standard invoices',
        'Bulk invoice processing with one click',
        'Automatic upload of the invoice to storage',
      ],
      tryRecognition: 'Try Recognition',
      kittenText: 'Our kitten loves cookies (just like us), that’s why it uses LEANID SOLAR',
      supportKitten: 'I SUPPORT THE KITTEN',

      // Переводы для LoginPage (уже есть)
      loginTitle: 'Sign in to the system',
      orUseLogin: 'Or use your login and password',
      username: 'Username',
      emailPlaceholder: 'Email',
      password: 'Password',
      passwordPlaceholder: 'Password',
      signInButton: 'Sign In',
      forgotPassword: 'Forgot password?',
      registerLink: 'Register',

      // Переводы для RegisterPage
      registerTitle: 'Create an account',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Enter your company name',
      email: 'Email',
      emailRegisterPlaceholder: 'Enter your email',
      phone: 'Phone',
      phonePlaceholder: 'Enter your phone number',
      passwordRegister: 'Password',
      passwordRegisterPlaceholder: 'Create a password',
      registerButton: 'Register',
      successMessage: 'Registration successful! Redirecting to onboarding...',
      errorMessage: 'Failed to register',

      // Переводы для OnboardingPage
      onboardingTitle: 'Set up your company',
      companyCode: 'Company Code',
      companyCodePlaceholder: 'Enter company code',
      directorName: 'Director Name',
      directorNamePlaceholder: 'Enter director name',
      completeSetup: 'Complete Setup',
      setupSuccess: 'Company successfully set up',
      setupError: 'Failed to complete setup',
    },
  },
  ru: {
    translation: {
      // Переводы для LandingPage (уже есть)
      product: 'Продукт',
      integrations: 'Интеграции',
      training: 'Обучение',
      prices: 'Цены',
      accountingCompanies: 'Бухгалтерские компании',
      signIn: 'Войти',
      register: 'Регистрация',
      mainHeader: 'Бухгалтерская программа в облаке, которая объединяет бухгалтера и директора',
      startUsing: 'Начать использовать',
      freeTrial: '30 дней бесплатного пробного периода',
      invoiceRecognitionTitle: 'Распознавание счетов за 30 секунд',
      invoiceRecognitionFeatures: [
        'Полное распознавание за 30 секунд',
        'Распознавание нестандартных счетов',
        'Массовая обработка счетов одним кликом',
        'Автоматическая загрузка счета в хранилище',
      ],
      tryRecognition: 'Попробовать распознавание',
      kittenText: 'Наш котёнок любит печенье (как и мы), поэтому он использует LEANID SOLAR',
      supportKitten: 'Я ПОДДЕРЖИВАЮ КОТЁНКА',

      // Переводы для LoginPage (уже есть)
      loginTitle: 'Вход в систему',
      orUseLogin: 'Или используйте логин и пароль',
      username: 'Логин',
      emailPlaceholder: 'Email',
      password: 'Пароль',
      passwordPlaceholder: 'Пароль',
      signInButton: 'Войти',
      forgotPassword: 'Забыли пароль?',
      registerLink: 'Регистрация',

      // Переводы для RegisterPage
      registerTitle: 'Создать аккаунт',
      companyName: 'Название компании',
      companyNamePlaceholder: 'Введите название вашей компании',
      email: 'Email',
      emailRegisterPlaceholder: 'Введите ваш email',
      phone: 'Телефон',
      phonePlaceholder: 'Введите ваш номер телефона',
      passwordRegister: 'Пароль',
      passwordRegisterPlaceholder: 'Создайте пароль',
      registerButton: 'Зарегистрироваться',
      successMessage: 'Регистрация прошла успешно! Перенаправляем на страницу настройки...',
      errorMessage: 'Не удалось зарегистрироваться',

      // Переводы для OnboardingPage
      onboardingTitle: 'Настройка вашей компании',
      companyCode: 'Код компании',
      companyCodePlaceholder: 'Введите код компании',
      directorName: 'Имя директора',
      directorNamePlaceholder: 'Введите имя директора',
      completeSetup: 'Завершить настройку',
      setupSuccess: 'Компания успешно настроена',
      setupError: 'Не удалось завершить настройку',
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