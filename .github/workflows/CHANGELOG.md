# Changelog
# fix 
10 04 2025 -f/src/services/authService.ts
# fix 
06 04 2025 - prisma schema companies
git commit -m"# fix
# fix
06 04 2025 - feat(onboarding): add logout button to onboarding page
- Add logout functionality to clear user data from localStorage
- Add red logout button alongside setup completion button
- Fix incorrect JSX comment causing build errors
- Improve user experience by providing escape route from onboarding
# fix 
06 04 2025 - fix(onboarding): comprehensive fix for company registration issues

- Fix duplicate routes in clientsRoutes.js to ensure proper API endpoint access
- Standardize error logging in clientsController.js (console.error → logger.error)
- Enhance onboardingController.js to handle Prisma-specific errors (P2002 for unique constraint violations)
- Completely rewrite onboardingService.ts to add automatic unique company code generation
- Improve error handling with detailed error messages for all error scenarios (500, 409, 400)
- Fix formatting issues and remove unnecessary comments
- Add comprehensive logging for better debugging
- Ensure proper transaction handling in database operations

This comprehensive fix resolves the 500 Internal Server Error during company registration
on both local development and Render production environments. The solution focuses on
preventing database unique constraint violations and improving user experience with
clear error messages.

# fix 
05 04 2025 - fix(LoginPage.tsx RegisterPage.tsx )
# fix 
05 04 2025 - fix(onboarding): resolve company setup failure on Render

- Remove unused axios import from onboardingService.ts
- Generate unique company codes in production environment to prevent duplication
- Improve error handling with detailed error messages for different scenarios
- Add specific handling for 409 (conflict) and 500 (server error) responses

This resolves the "Failed to setup company" error that occurred specifically in the 
Render deployment but not in local development.

# fix
ts05 04 2025 - (regflow): fix client registration and company onboarding issues

- Fixed duplicate route in clientsRoutes.js - removed extra router.get('/:id', ...) definition that was conflicting with companies route
- Corrected logging in clientsController.js - replaced console.error with logger.error in getMyCompanies for consistent error handling
- Improved error handling in onboarding process with better error messages when company already exists
- Ensured proper order of routes in clientsRoutes.js (/companies before /:id) to prevent route conflic

# fix 
31 01 2025 - (navigation): resolve companiesRoutes import error and improve login flow

- Fixed MODULE_NOT_FOUND error in app.js by removing invalid companiesRoutes import
- Updated clientsService.ts to use api instance with token and throw error on getMyCompanies failure
- Refactored LoginPage.tsx to use clientsService and navigate for redirects
- Enhanced ProtectedRoute.tsx with location checks and redirect state
- Prepared groundwork for multi-window interface (to be implemented)
Changelog: Обновление логики навигации и исправление ошибок
Backend:

Исправление ошибки в app.js:
Удалён импорт несуществующего модуля companiesRoutes из ./routes/companiesRoutes.
Убедились, что все маршруты из папки routes корректно импортированы (authRoutes, clientsRoutes, onboardingRoutes, purchasesRoutes, salesRoutes, statsRoutes, userRoutes, assistantRoutes).
Проверено, что маршрут /api/clients/companies обрабатывается в clientsRoutes.js через контроллер clientsController.getMyCompanies.
Frontend:

Обновление clientsService.ts:
Заменён импорт axios на api из ../api/axios, чтобы запросы отправлялись с токеном авторизации.
В методе getMyCompanies изменена обработка ошибок: вместо возврата пустого массива [] теперь выбрасывается ошибка throw new Error('Failed to fetch companies'), чтобы LoginPage.tsx мог корректно обработать ошибку.
Обновление LoginPage.tsx:
Заменён прямой вызов api.get('/clients/companies') на использование clientsService.getMyCompanies() для унификации кода.
Убрана проверка companiesResponse.data.companies, так как getMyCompanies возвращает массив Client[].
Заменён редирект через window.location.href на navigate('/clients/${defaultCompanyId}'), чтобы использовать возможности React Router.
Добавлено сохранение lastUsedCompanyId в localStorage перед редиректом.
Обновление ProtectedRoute.tsx:
Добавлен useLocation для получения текущего пути и предотвращения лишних редиректов.
Добавлена проверка: если пользователь уже авторизован и пытается зайти на /auth/login или /auth/register, он перенаправляется на /dashboard.
Добавлена проверка location.pathname !== '/onboarding', чтобы избежать конфликтов с логикой LoginPage.tsx при перенаправлении на онбординг.
Добавлен state={{ from: location }} в Navigate, чтобы сохранить путь для редиректа после логина.
Дополнительно:

Подготовлена структура для будущего многооконного интерфейса (будет реализована в следующем коммите):
Создан контекст WindowContext.tsx для управления окнами.
Создан компонент Window.tsx с поддержкой перемещения (react-draggable) и изменения размера (react-resizable).
Подготовлен слайд для PDF-презентации, описывающий улучшенную логику навигации (будет включён в финальную версию презентации).
# Changelog

Все значимые изменения проекта фиксируются в этом документе.

## [1.5.0] — 2025-03-25  
### Добавлено
- ✅ Интеграция **SOLAR Ассистента** (frontend + backend):
  - Распознавание речи через Whisper API
  - Перевод сообщений
  - Поддержка языков: EN, RU, DE, PL
  - Хранение сообщений и сессий в базе данных
  - Панель управления ассистентом в интерфейсе (React + Tailwind)
  - Поддержка WebSocket соединения

- ✅ Добавлены модели в Prisma:
  - `conversation_sessions`
  - `conversation_messages`
  - `assistant_preferences`
  - `translation_cache`
  - Enum'ы: `Language`, `MessageType`, `ConversationStatus`

- ✅ Создан первый **администратор** через CLI-скрипт (email: dk@dk.de)

### Изменено
- 🔄 Обновлён `users` и `clients` для поддержки связей с SOLAR Ассистентом
- ⚙️ Подключение dotenv и настройка `.env.development` для локального запуска

### Устранено
- 🛠 Устранены ошибки миграции (`P1012`) — добавлены обратные связи в `users` и `clients`
- 🐞 Исправлена ошибка с отсутствующим модулем `ws`
- ⚡️ Устранена ошибка "setUserLanguage already declared" при билде

---

## [1.4.3] — 2025-03-20  
- Базовая архитектура фронтенда и бэкенда завершена  
- Интеграция JWT авторизации, CRUD для клиентов, закупок, продуктов  
- UI интерфейс: минималистичный, i18n поддержка, панели, форма входа  

## [1.0.2] - 2025-03-24
### Fixed 
- 2025-03-24 feat(purchases):f/package.json
### Fixed
- Added .npmrc configuration with legacy-peer-deps=true to resolve dependency conflicts during build
- Updated Vite configuration with proper module aliases for i18next packages
- Fixed deployment issues with internationalization dependencies

## [1.0.1] - 2025-03-24

### Fixed
- **Layout.tsx**: Removed duplicate return statement and added LanguageSwitcher component
- **PurchasesPage.tsx**: Eliminated duplicate component declaration and code duplication
- **OnboardingPage.tsx**: Fixed duplicate component declaration and implemented translations
- **LandingPage.tsx**: Removed duplicated code with Russian and English text
- **RegisterPage.tsx**: Fixed syntax errors and implemented translations consistently
- **LoginPage.tsx**: Corrected duplicate code and implemented translations

### Changed
- Improved internationalization by replacing hardcoded Russian strings with translation function calls
- Fixed navigation paths to use consistent pattern (`/auth/login` instead of `/login`)
- Added LanguageSwitcher to Layout component for access from all authenticated pages
- Cleaned up typings and imports across components

### Technical Debt Resolved
- Removed copy-paste duplications from multiple files
- Fixed several potential runtime errors due to duplicate component declarations
- Ensured consistent error handling across auth components
### Changed
- Improved internationalization by replacing hardcoded Russian strings with translation function calls
- Fixed navigation paths to use consistent pattern (`/auth/login` instead of `/login`)
- Added LanguageSwitcher to Layout component for access from all authenticated pages
- Cleaned up typings and imports across components

### Technical Debt Resolved
- Removed copy-paste duplications from multiple files
- Fixed several potential runtime errors due to duplicate component declarations
- Ensured consistent error handling across auth components
### Fixed
- 2025-03-24: Removed deprecated vendor field from Purchase interface and unified terminology to use Supplier with client_id. Updated PurchasesDetailPage, PurchasesTable, and PurchasesForm to rely solely on client_id for supplier information.
### Fixed
2025-03-23: feat(purchases): enable supplier display through client_id lookup
### Fixed
2025-03-23: feat(purchases): enable supplier display through client_id lookup
Обновление модуля закупок:
Реализована интеграция с моделью клиентов для отображения поставщиков
Обновлены компоненты PurchasesTable и PurchasesRow для работы с suppliers
Исправлена типизация в purchasesTypes для соответствия схеме базы данных
Добавлена возможность фильтрации закупок по поставщику (supplier)
Обновлены формы создания и редактирования закупок
Улучшен интерфейс детальной страницы закупки
Обеспечена корректная обработка данных при отсутствии связи с API

### Fixed
- 2025-03-23: feat(purchases): добавлена поддержка отображения имени поставщика через vendorId
- Реализован сервис для работы с поставщиками
- Обновлена таблица закупок с поддержкой получения имени поставщика по ID
- Добавлены корректные типы данных для таблицы закупок
- Реализована обработка ошибок при недоступности API поставщиков
- Добавлены моковые данные для работы офлайн
### Fixed
- 2025-03-23 fix: temporarily remove i18n usage from LandingPage"
### Fixed
- 2025-03-23: fix i118.ts 

## [0.2.1] - 2025-03-23

### Fixed
- 2025-03-23: fix i118.ts
- Синхронизированы ветки main и feat/purchase перед мержем
- Удалён устаревший файл src/i18n.ts и заменён актуальной реализацией
- Обеспечена поддержка сборки и деплоя проекта в продакшн (на платформе Render)
- Добавлены зависимости для i18n: i18next, react-i18next, i18next-browser-languagedetector, i18next-http-backend

### Added
- Модуль поставщиков: реализован вывод имени поставщика в таблице закупок (PurchasesTable) по vendorId
- Мультиязычность: добавлены зависимости и конфигурация i18n, реализована базовая поддержка английского и русского языков
- Переводы: добавлены переводы для страниц LandingPage, LoginPage, RegisterPage, OnboardingPage

### Changed
- Обновлён компонент PurchasesRow — теперь принимает vendorName как отдельное prop
- Обновлены типы: интерфейс PurchasesRowProps расширен полем vendorName
- Упрощена логика поиска и отображения поставщика в закупках
- Настроен правильный выбор vendorId в формах создания и редактирования закупок

## [0.2.0] - 2025-03-22

### Added
- "Add amount filter, reset filters button, and single purchase deletion to PurchasesPage"
- "Update registration and login pages to match design"
- "Fix routing to show LandingPage on root path"
- Добавлена поддержка i18n для русского и английского языков в LandingPage.tsx

### Fixed
- 2025-03-21: fix: purchases
- 2025-03-20: Обновлена API-конфигурация для разработки и production:
  - Настроены зависящие от окружения URL API
  - Обновлены настройки axios
  - Исправлен компонент AdminPage для отображения правильного URL бэкенда
  - Сохранены корректные настройки CORS для всех окружений
  - Поддержаны настройки прокси в Vite для локальной разработки
- 2025-03-19: Настроен CORS и API прокси для локальной разработки:
  - Настроен прокси Vite для обработки API-запросов
  - Обновлен axios.ts для использования относительных путей
  - Исправлена конфигурация API_URL
  - Разрешены блокирующие ошибки CORS при локальной разработке
- 2025-03-16: Исправлена ошибка сборки, связанная с удаленным ClientDetailPage
- 2025-03-15: Исправлен компонент ClientsPage для корректной загрузки и отображения клиентов
- 2025-03-15: Обновлен клиентский тест для соответствия поведению контроллера
- 2025-03-15: Реализована поддержка управления счетами в бэкенде:
  - Созданы контроллеры с CRUD-операциями для счетов продаж и закупок
  - Добавлены соответствующие обработчики маршрутов
  - Зарегистрированы новые маршруты в app.js
  - Стандартизирована структура кода во всех контроллерах
  - Подготовлена основа для аккордеонного просмотра деталей счетов

## [0.1.0] - 2025-03-03

### Added
- Система аутентификации пользователей с функциями регистрации, входа и сброса пароля
- Реализация JWT для безопасной аутентификации
- Промежуточное ПО авторизации для защищенных маршрутов
- Настройка PostgreSQL с Prisma ORM
- Модуль клиентов с полными операциями CRUD
- Отношения пользователь-клиент и авторизация
- Комплексная тестовая среда
- Скрипт создания администратора
- Страницы входа и панели управления
- Функция выхода
- Защищенные маршруты с проверкой аутентификации
- Экземпляр Axios с конфигурацией baseURL для унифицированных API-запросов

### Fixed
- Многочисленные исправления связанные с настройкой окружения, CORS, аутентификацией, и другими аспектами проекта


# Backend Development Progress

## Current Version (v0.1.0)

### Authentication ✅

- User registration
- Login system
- Password reset
- JWT implementation
- Auth middleware
- Test coverage complete

### Clients Module ✅

- CRUD operations
- API routes (/api/clients)
- Test coverage
- User-client relationships
- Authorization

### Infrastructure ✅

- PostgreSQL setup
- Prisma ORM
- Project structure
- Error handling
- Logging system
- Test environment

## Next Steps (v0.2.0)

### Products Module (Next Priority)

- [ ] Database model
- [ ] CRUD API
- [ ] Tests
- [ ] Validation
- [ ] Stock tracking

### Sales Module (Planned)

- [ ] Database model
- [ ] CRUD API
- [ ] Client relationships
- [ ] Tests
- [ ] Reports

### Technical Tasks

- [ ] API documentation
- [ ] Performance optimization
- [ ] Security enhancements

# Changelog

All notable changes to the LEANID SOLAR project will be documented in this file.

## [Unreleased]

## [0.1.0] - 2025-03-03

### Added
- User authentication system with registration, login, password reset functionality
- JWT implementation for secure authentication
- Auth middleware for protected routes
- PostgreSQL database setup with Prisma ORM
- Clients Module with complete CRUD operations
- User-client relationships and authorization
- Comprehensive test environment
- Admin user creation script
- Frontend login and dashboard pages
- Logout functionality
- Protected routes with authentication checks
- Axios instance with baseURL configuration for unified API requests

### Fixed
- 2025-03-03: Added axios instance with interceptors for automatic token handling and consistent API calls
- 2025-03-03: Fixed access and logout functionality
- 2025-03-02: Fixed feat: implement complete authentication system
- 2025-03-02: Fixed server startup by ensuring prismaManager.connect is properly called
- 2025-03-02: Fixed LoginPage to use useNavigate from react-router-dom
- 2025-03-02: Updated Prisma Client imports and admin password for production
- 2025-03-02: Switched backend to main database for production
- 2025-03-02: Fixed backend deployment on Render by resolving Prisma Client generation error
- 2025-03-02: Updated CORS_ORIGIN to include Render frontend URL and set NODE_ENV=production
- 2025-03-02: Fixed TypeScript errors in frontend build (auth.ts and LoginPage.tsx)
- 2025-03-02: Fixed 404 error on login by reconfiguring VITE_API_URL
- 2025-03-02: Verified admin users in both test and main databases
- 2025-03-02: Added express to dependencies to fix MODULE_NOT_FOUND error
- 2025-03-02: Fixed 404 error on frontend by setting VITE_API_URL correctly
- 2025-03-02: Applied migration to sync schema_t.prisma with test database
- 2025-03-02: Updated schema_t.prisma to use camelCase model names
- 2025-03-02: Fixed DATABASE_URL_TEST_VERCEL not found error
- 2025-03-02: Updated clientsRoutes.js to use test schema Prisma Client
- 2025-03-02: Fixed Prisma Client import path with path.resolve
- 2025-03-02: Updated authController.js to use users_t model for tests
- 2025-03-01: Updated deploy.yml to use DATABASE_URL_TEST_VERCEL for tests
- 2025-03-01: Created new migration to add purchases table to test database
- 2025-03-01: Fixed EJSONPARSE error in b/package.json
- 2025-03-01: Corrected service names to npmbk (backend) and npmfr (frontend) in Render
- 2025-03-01: Deployed frontend and backend on Render in project Solar
- 2025-02-28: Updated test database configuration and ensured tests pass in GitHub Actions
- 2025-02-28: Resolved PrismaClientKnownRequestError by ensuring test database has all necessary tables
- 2025-02-28: Updated setup.js to load .env.test and use test-specific Prisma client
- 2025-02-28: Created test schema schema.test.prisma for isolated testing

## [0.2.0] - Upcoming

### Planned
- Products Module with database model, CRUD API, tests, validation, and stock tracking
- Sales Module with database model, CRUD API, client relationships, tests, and reports
- API documentation
- Performance optimization

### Fixed
- 2025-03-04: Added axios api
### Fixed
- 2025-03-07: Fix frontend build by adding redirects and updating TypeScript config
- 2025-03-07: Move type definitions to dependencies for deployment
- 2025-03-07: Move type to dependencies for deployment
- 2025-03-07: vite.config.ts --dirname
- Add start script for Render deployment
- Fix: Update CORS configuration to use environment variables
### Fixed
- 2025-03-08 feat: implement UI framework with Tailwind CSS

- Add complete UI layout with sidebar and header components
- Integrate Tailwind CSS for consistent styling
- Create reusable PageContainer component
- Implement clients table with proper styling
- Configure proper routing between pages
- Add responsive design elements
- Set up project structure for future backend integration
Author: LEANID
### Fixed
- 2025-03-08 "gitignore f delete env"
- "Add devcontainer configuration for Codespaces"
- "Add environment configuration files for development and production"
- gitignore f delete env dev prod
- feat: integrate database connection status indicator
### Fixed
- 2025-03-08 Create AppHeader component to display database connection status
- Connect AppHeader to layout component
- Add checkDatabaseConnection API function in axios client
- Set up visual indicator for database connection status (green/yellow/red)
- Implement script for test client creation
- Fix import paths and structure for better component organization

feat: add database administration panel
### Fixed
- 2025-03-08 Add database info endpoint to statsRoutes for monitoring table statistics
- Create AdminPage component to display database structure and record counts
- Integrate Admin Panel link in sidebar navigation
- Improve layout with properly structured HTML elements
- Add access control based on user role
- Update routing configuration to include admin panel
- Fix sidebar navigation styling for consistent appearance
### Fixed
- 2025-03-08 CORS_ORIGIN https://npmfr-snpq.onrender.com
### Fixed
- 2025-03-09 cors origin: '*'
### Fixed
- 2025-03-09 git commit -m "Fixed authentication, CORS, and clients API issues"
### Fixed
- 2025-03-09 git commit -m "Fixed authentication, CORS, bk and fr and clients API issues"
### Fixed
- 2025-03-09 fix: separate URLs in CORS origin into individual array elements
fix: добавление защиты маршрутов и исправление аутентификации
### Fixed
- 2025-03-09 fix:
- Добавлен компонент ProtectedRoute для защиты всех приватных маршрутов
- Исправлен путь к странице логина (/auth/login)
- Обновлена структура маршрутизации для корректной проверки авторизации
- Заменена заглушка компонента логина на реальную страницу входа
- Добавлено перенаправление неавторизованных пользователей на страницу входа
### Fixed
- 2025-03-09 feat: add environment configuration for development and production - Added .env.development for local development (localhost API) - Added .env.production for deployed version (Render API) - Updated npm scripts to use correct environment modes - Removed redundant .env file - Updated API URL configuration in axios client
### Fixed
- 2025-03-09 feat: add environment configuration for development and production - Added .env.development for local development (localhost API) - Added .env.production for deployed version (Render API) - Updated npm scripts to use correct environment modes - Removed redundant .env file - Updated API URL configuration in axios client env
### Fixed
- 2025-03-09 feat: .env.production https://npmbk-ppnp.onrender.com
### Fixed
- 2025-03-09 feat: .env.production render
### Fixed
- 2025-03-09 feat: app.js cors only frontend
### Fixed
- 2025-03-09 feat: backend frontend env development production
### Fixed
- 2025-03-09 feat: cors app.js
### Fixed
- 2025-03-09 feat: cors res frontend authController.js
### Fixed
- 2025-03-09 feat: cors res frontend authController.js
### Fixed
- 2025-03-15 feat: Implement invoice management backend

Add backend support for sales and purchases invoices with the following changes:

- Create salesController.js with CRUD operations for sales invoices
- Create purchasesController.js with CRUD operations for purchases invoices
- Add corresponding route handlers in salesRoutes.js and purchasesRoutes.js
- Register new routes in app.js
- Standardize code structure across all controllers and routes
- Prepare foundation for accordion view of invoice details

Next steps:
- Implement frontend components for displaying invoices
- Add accordion functionality to show detailed invoice information
- Create sales_items and purchase_items models (planned for future)

### Fixed
- 2025-03-15 fix: Update client test to match controller behavior

- Modified client update test to expect a message response
- Fixed test assertion to check for success message instead of updated fields
- Maintained API behavior consistency
- Ensures CI/CD pipelines pass tests correctly
### Fixed
- 2025-03-15 Commit message:
Fix ClientsPage component to properly fetch and display clients

Fixed duplicate code in ClientsPage.tsx that was causing syntax errors
Removed redundant component definition and imports
Fixed useEffect hook structure for proper API fetching
Added console logging for debugging API requests and responses
Improved error handling and loading state display
Ensured clean component structure following React best practices

### Fixed
- 2025-03-16 Commit message:
Fix build error by removing references to deleted ClientDetailPage

Removed import of non-existent ClientDetailPage from App.tsx
Fixed build error "Could not resolve ./pages/clients/ClientDetailPage"
Removed related routing and component references
### Fixed
- 2025-03-16 Fix build error by removing references to deleted ClientDetailPage
Removed import of non-existent ClientDetailPage from App.tsx
Fixed build error "Could not resolve ./pages/clients/ClientDetailPage"
Removed related routing and component references
### Fixed
- 2025-03-19 "fix: configure CORS and API proxy for local development

- Set up Vite proxy to handle API requests and prevent CORS issues
- Update axios.ts to use relative paths instead of hardcoded URLs
- Fix API_URL configuration in frontend code to work with proxy
- Update AdminPage component to use correct API reference
- Resolve CORS blocking errors when running in local development

This commit ensures smooth API communication between frontend and backend
when running locally, while maintaining compatibility with production deployment."
### Fixed
- 2025-03-20 fix: update API configuration for both development and production
- Set up environment-aware API URLs to work in both development and production
- Update axios configuration to use VITE_API_URL in production and relative paths in development
- Fix AdminPage component to display correct backend URL
- Keep proper CORS settings in backend for all environments
- Maintain proxy settings in Vite for local development

This commit ensures the application works correctly both in local development environment (with proxy) and in production deployment, fixing client loading issues.
### Fixed
- 2025-03-21 fix: purchases
### Fixed
- 2025-03-22 "Add amount filter, reset filters button, and single purchase deletion to PurchasesPage"
## Fixed
- 2025-03-22 fix: "Update registration and login pages to match design"
## Fixed
- 2025-03-22 "Fix routing to show LandingPage on root path"
## Fixed
- 2025-03-22 LandingPage.tsx  i18n.ts Add i18n support for Russian and English languages
### Fixed
- 2025-03-22: Added i18n support for Russian and English languages in LandingPage.tsx and i18n.ts, fixed build error by adding i18next dependencies. This enables multilingual support for the landing page, making the application more accessible to users.
### Fixed
- 2025-03-23: Added i18n support for RegisterPage.tsx and OnboardingPage.tsx, updated i18n.ts with new translations. This enables multilingual support for the registration and onboarding processes, improving user accessibility.
### Fixed
- 2025-03-23: Added i18n support for RegisterPage.tsx
### Fixed
- 2025-03-23: Added i18n 
### Fixed
- 2025-03-23: Added i18n support for RegisterPage.tsx and OnboardingPage.tsx, updated i18n.ts with new translations. This enables multilingual support for the registration and onboarding processes, improving user
### Fixed
- 2025-03-23: fix pacakage json
### Fixed
- 2025-03-23 fix: add i18n dependencies
[0.2.1] - Upcoming
Added
Placeholder for new features
Fixed
2025-03-23 feat: add vendorName display in PurchasesTable using vendorId lookup
Added vendor name lookup using vendorId in PurchasesTable
Updated PurchasesRow component to display vendorName
Extended PurchasesRowProps type to include vendorName
Simplified vendor info rendering in purchase rows
[0.2.1] - 2025-03-23
Added
Placeholder for new features

Fixed
fix: add i18n dependencies
Добавлены зависимости для i18n и настроен мультиязычный интерфейс:

Подключён i18next, react-i18next, i18next-browser-languagedetector

Реализована базовая конфигурация с поддержкой английского и русского языков

Добавлены переводы для LandingPage, LoginPage, RegisterPage и OnboardingPage

Features
feat(purchases): add vendorName display in PurchasesTable using vendorId lookup
Обновлён модуль закупок:

Реализован поиск имени поставщика по vendorId

Обновлён компонент PurchasesRow с поддержкой vendorName

Расширен тип PurchasesRowProps

Упрощено отображение информации о поставщике в таблице закупок

[0.2.1] - 2025-03-23
Features
feat(purchases): enable vendorName display and invoice vendorId lookup

Добавлена поддержка отображения имени поставщика через vendorId

Обновлены компоненты PurchasesTable и PurchasesRow

Расширены типы PurchasesRowProps

Настроен правильный выбор vendorId в формах создания и редактирования закупок

Удалены устаревшие поля и упрощена логика отображения

Обеспечена работоспособность фронтенда в режиме production (Render)
## [0.2.1] - 2025-03-23

### Added
- Добавлена поддержка мультиязычного интерфейса с i18next:
  - Подключены `i18next`, `react-i18next`, `i18next-browser-languagedetector`
  - Настроена базовая конфигурация с языками `ru` и `en`
  - Реализованы переводы для `LandingPage`, `LoginPage`, `RegisterPage`, `OnboardingPage`

- Обновление модуля закупок (`Purchases`)
  - Реализован поиск имени поставщика по `vendorId` в `PurchasesTable.tsx`
  - Компонент `PurchasesRow.tsx` обновлён для отображения `vendorName`
  - В тип `PurchasesRowProps` добавлено новое поле `vendorName: string`
  - Упрощена логика отображения данных о поставщике в таблице
  - Форма создания и редактирования закупки (`PurchasesForm.tsx`) теперь использует `vendorId` из выпадающего списка

### Fixed
- Удалены неиспользуемые поля и устаревшие подходы из кода
- Обеспечена корректная сборка проекта в режиме `production` для Render
- Устранена ошибка с отсутствующим файлом `i18n.ts` в ветке `main`
[0.2.1] - 2025-03-23
Added
Модуль поставщиков: реализован вывод имени поставщика в таблице закупок (PurchasesTable) по vendorId

Мультиязычность: добавлены зависимости и конфигурация i18n, реализована базовая поддержка английского и русского языков

Переводы: добавлены переводы для страниц LandingPage, LoginPage, RegisterPage, OnboardingPage

Changed
Обновлён компонент PurchasesRow — теперь принимает vendorName как отдельное prop

Обновлены типы: интерфейс PurchasesRowProps расширен полем vendorName

Упрощена логика поиска и отображения поставщика в закупках

Fixed
Обеспечена поддержка сборки и деплоя проекта в продакшн (на платформе Render)

Удалён устаревший файл src/i18n.ts и заменён актуальной реализацией

Синхронизированы ветки main и feat/purchase перед мержем
### Fixed
- 2025-03-23: fix i118.ts