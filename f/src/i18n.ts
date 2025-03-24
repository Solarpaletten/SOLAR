import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      ru: {
        translation: {
          // Дополнительные ключи для страниц
          product: 'Продукт',
          integrations: 'Интеграции',
          training: 'Обучение',
          prices: 'Цены',
          accountingCompanies: 'Бухгалтерские компании',
          signIn: 'Войти',
          register: 'Регистрация',
          mainHeader: 'Управляйте бизнесом эффективно',
          startUsing: 'Начать использовать',
          freeTrial: 'Бесплатный пробный период 30 дней',
          
          // Логин и регистрация
          loginTitle: 'Вход в систему',
          orUseCredentials: 'Или используйте логин и пароль',
          username: 'Логин',
          password: 'Пароль',
          loggingIn: 'Вход...',
          forgotPassword: 'Забыли пароль?',
          
          registerTitle: 'Регистрация в IT Бухгалтерии',
          email: 'Email',
          phone: 'Телефон',
          firstName: 'Имя',
          lastName: 'Фамилия',
          agreeToTerms: 'Я согласен с правилами LEANID SOLAR',
          
          // Onboarding
          setupYourCompany: 'Настройка вашей компании',
          companyCode: 'Код компании',
          directorName: 'Имя директора',
          finishSetup: 'Завершить настройку',
          
          // Ошибки и сообщения
          exportError: 'Не удалось экспортировать данные',
          importError: 'Не удалось импортировать файл',
          deleteError: 'Ошибка при удалении',
          
          // Общие термины
          save: 'Сохранить',
          cancel: 'Отмена',
          edit: 'Редактировать',
          delete: 'Удалить',
          view: 'Просмотр',
          saving: 'Сохранение...',
          
          // Заголовки страниц
          purchases: 'Закупки',
          createPurchase: 'Создание закупки',
          editPurchase: 'Редактирование закупки',
          
          // Поля форм
          date: 'Дата',
          supplierLabel: 'Поставщик',
          selectSupplier: 'Выберите поставщика',
          invoiceNumber: 'Номер счета',
          total: 'Сумма',
          description: 'Описание',
          statusLabel: 'Статус',
          currency: 'Валюта',
          
          // Статусы закупок
          draft: 'Черновик',
          pending: 'В обработке',
          paid: 'Оплачено',
          delivered: 'Доставлено',
          completed: 'Завершено',
          cancelled: 'Отменено',
          
          // Сообщения
          purchaseCreated: 'Закупка успешно создана',
          purchaseUpdated: 'Закупка успешно обновлена',
          purchaseDeleted: 'Закупка удалена',
          exportSuccess: 'Экспорт успешно завершён',
          importSuccess: 'Импорт завершён успешно',
          
          // Фильтры
          startDate: 'Начальная дата',
          endDate: 'Конечная дата',
          allSuppliers: 'Все поставщики',
          allStatuses: 'Все статусы',
          showArchived: 'Показать архивные',
          
          // Таблица
          totalAmount: 'Всего:',
          selected: 'Выбрано:'
        }
      },
      en: {
        translation: {
          // Common terms
          save: 'Save',
          cancel: 'Cancel',
          edit: 'Edit',
          delete: 'Delete',
          view: 'View',
          saving: 'Saving...',
          
          // Page titles
          purchases: 'Purchases',
          createPurchase: 'Create Purchase',
          editPurchase: 'Edit Purchase',
          
          // Form fields
          date: 'Date',
          supplierLabel: 'Supplier',
          selectSupplier: 'Select supplier',
          invoiceNumber: 'Invoice Number',
          total: 'Total',
          description: 'Description',
          statusLabel: 'Status',
          currency: 'Currency',
          
          // Purchase statuses
          draft: 'Draft',
          pending: 'Pending',
          paid: 'Paid',
          delivered: 'Delivered',
          completed: 'Completed',
          cancelled: 'Cancelled',
          
          // Messages
          purchaseCreated: 'Purchase created successfully',
          purchaseUpdated: 'Purchase updated successfully',
          purchaseDeleted: 'Purchase deleted',
          exportSuccess: 'Export completed successfully',
          importSuccess: 'Import completed successfully',
          
          // Filters
          startDate: 'Start Date',
          endDate: 'End Date',
          allSuppliers: 'All suppliers',
          allStatuses: 'All statuses',
          showArchived: 'Show archived',
          
          // Table
          totalAmount: 'Total:',
          selected: 'Selected:',
          
          // Дополнительные ключи для страниц (на английском)
          product: 'Product',
          integrations: 'Integrations',
          training: 'Training',
          prices: 'Prices',
          accountingCompanies: 'Accounting Companies',
          signIn: 'Sign In',
          register: 'Register',
          mainHeader: 'Manage your business efficiently',
          startUsing: 'Start using',
          freeTrial: 'Free 30-day trial',
          
          // Login and registration
          loginTitle: 'Sign In',
          orUseCredentials: 'Or use your credentials',
          username: 'Username',
          password: 'Password',
          loggingIn: 'Signing in...',
          forgotPassword: 'Forgot password?',
          
          registerTitle: 'Register in IT Accounting',
          email: 'Email',
          phone: 'Phone',
          firstName: 'First name',
          lastName: 'Last name',
          agreeToTerms: 'I agree to LEANID SOLAR terms',
          
          // Onboarding
          setupYourCompany: 'Set up your company',
          companyCode: 'Company code',
          directorName: 'Director name',
          finishSetup: 'Finish setup',
          
          // Errors and messages
          exportError: 'Failed to export data',
          importError: 'Failed to import file',
          deleteError: 'Error deleting'
        }
      }
    }
  });

export default i18n;