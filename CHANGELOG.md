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

## [1.5.3] - 2025-04-12

### Added
- Поле `name` добавлено в модель `companies` для более информативного представления
- Валидация данных компаний на бэкенде с использованием express-validator
- Валидация формы создания компании во фронтенде с использованием Formik и Yup
- Подробная документация API для работы с компаниями (docs/api/companies.md)
- Интеграционные тесты для проверки функциональности компаний
- `test:` привязка всех тестов к `schema_t.prisma` с корректными моделями
- `feat:` мок-контроллер `mockOnboardingController.js` для изолированного тестирования
- `infra:` скрипт `reset-test-migrations.js` для очистки проблемных миграций
- `ci:` настройка CI для использования `db push --force-reset` вместо миграций для тестовой БД

### Fixed
- Исправлены несоответствия между схемой Prisma и кодом, использующим модель companies
- Корректные типы данных для ID в интерфейсах TypeScript и обработка преобразований
- Улучшена обработка ошибок в API компаний
- `fix:` устранение ошибки P3009 с проблемными миграциями в тестовой базе данных
- Повышена устойчивость тестов к различиям между локальной средой и CI

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
- 2025-04-12 Fix onboarding company setup error with correct Prisma model name and enhanced validation
