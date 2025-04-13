src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Table.tsx
│   │   └── Card.tsx
│   └── pages/
│       ├── clients/
│       │   ├── ClientsList.tsx
│       │   ├── ClientForm.tsx
│       │   └── ClientDetails.tsx
│       ├── dashboard/
│       │   └── Dashboard.tsx
│       ├── warehouse/
│       │   └── Warehouse.tsx
│       ├── general-ledger/
│       │   └── GeneralLedger.tsx
│       └── settings/
│           └── Settings.tsx
├── api/
│   ├── client.ts
│   ├── auth.ts
│   └── index.ts
├── hooks/
│   ├── useAuth.ts
│   └── useClients.ts
├── types/
│   └── index.ts
├── utils/
│   └── formatters.ts
├── App.tsx
├── main.tsx
└── index.css

# SOLAR - Full Stack Accounting Solution

## 📋 Project Overview

SOLAR is a comprehensive accounting system designed for small to medium businesses. It combines modern frontend technologies with a robust backend to deliver a seamless accounting experience.

## 🚀 Deployment Guide

### Backend Deployment

#### Option 1: Deploy via Render
The backend is automatically deployed to Render via GitHub Actions when changes are pushed to the main branch.

#### Option 2: Deploy on your own server
1. Clone the repository
2. Set up environment variables
3. Install PM2 globally: `npm install -g pm2`
4. Navigate to the project root
5. Run the backend with PM2: `pm2 start s/ecosystem.config.js`
6. Save the PM2 configuration: `pm2 save`

### Frontend Deployment

#### Option 1: Deploy via Render
The frontend is automatically deployed to Render via GitHub Actions when changes are pushed to the main branch.

#### Option 2: Manual Build and Deploy
1. Navigate to the frontend directory: `cd s/f`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Deploy the contents of the `dist` folder to your web server

## 🔄 CI/CD Pipeline

Our deployment process is fully automated with GitHub Actions:

1. **Build & Test**: Runs tests for both frontend and backend
2. **Triple Deployment**:
   - Deploys backend to Render
   - Deploys frontend to Render
   - Deploys to our dedicated server via SSH

### GitHub Secrets Configuration
The following secrets must be configured in your GitHub repository:
- `DATABASE_URL`: Production database connection string
- `DATABASE_URL_TEST_VERCEL`: Test database connection string
- `JWT_SECRET`: Secret for JWT token generation
- `RENDER_API_KEY_B`: API key for backend service on Render
- `RENDER_API_KEY_F`: API key for frontend service on Render
- `HOST`: SSH host for server deployment
- `SSH_PRIVATE_KEY`: Private key for SSH authentication

## 🤖 Using Claude on the Server

Claude is available on the server for advanced AI-assisted operations:

1. SSH into the server
2. Navigate to the project directory: `cd /var/www/solar`
3. Use Claude directly: `claude -c "Your query here"`
4. For file operations: `claude -f path/to/file`

## 💻 Development Environment

### Backend (Node.js/Express)
```bash
cd s/b
npm install
npm run dev
```

### Frontend (React/TypeScript)
```bash
cd s/f
npm install
npm run dev
```

When developing locally, the frontend communicates with the backend through a Vite proxy configuration, so both need to be running for full functionality.

## ⚙️ Terraform Infrastructure

The project uses Terraform for infrastructure management. The main configuration files are:
- `main.tf`: Defines the main infrastructure resources
- `variables.tf`: Defines variables used in the configuration
- `terraform.tfvars`: Contains the actual values for the variables

To manage infrastructure:
1. Initialize Terraform: `terraform init`
2. Plan changes: `terraform plan`
3. Apply changes: `terraform apply`

## 📘 Documentation

More detailed documentation is available in the `docs/` directory.

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

## 💻 Development Environment

При локальной разработке рекомендуется использовать `zsh` для лучшей совместимости с скриптами проекта и улучшенного интерактивного опыта. В CI-окружении используется `bash`.

Основные отличия:
- В `zsh` некоторые конструкции экранирования путей и переменных работают иначе
- Некоторые shell-скрипты могут содержать `zsh`-специфичный синтаксис
- Автодополнение и подсветка синтаксиса более богатые в `zsh`

Для установки `zsh`:
```bash
# macOS (обычно уже установлен)
brew install zsh

# Linux (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install zsh

# После установки можно сделать zsh оболочкой по умолчанию
chsh -s $(which zsh)
```

## 🔬 Тестирование и CI

### Миграции и тестовая среда

В проекте используются две схемы Prisma:

1. **`schema.prisma`** — основная схема для продакшн-базы:
   - Обновляется через миграции: `npx prisma migrate dev --name my_migration`
   - Применяется в продакшене: `npx prisma migrate deploy`
   - История миграций отслеживается в Git

2. **`schema_t.prisma`** — тестовая схема с префиксом "T" в моделях:
   - **Не использует миграции**, а создаётся напрямую
   - Обновляется через `db push` для быстрой синхронизации моделей 
   - В CI используется `--force-reset` для чистого состояния при каждом запуске

```bash
# Локальная разработка: обновление тестовой схемы
npx dotenv -e .env.test -- npx prisma db push --schema=prisma/schema_t.prisma

# CI: полная пересоздание схемы (чистая среда для тестов)
npx dotenv -e .env.test -- npx prisma db push --schema=prisma/schema_t.prisma --force-reset
```

### Мок-приложение для тестов

Для изолированного тестирования API используется `mockApp.js`:

- Создаёт отдельное Express-приложение для тестов
- Подключает мок-контроллеры (например, `mockOnboardingController.js`)
- Гарантирует работу с тестовой базой данных (модели с префиксом "T")
- Обеспечивает изоляцию тестов от продакшн-кода

Использование в тестах:
```javascript
const app = require('../mockApp'); // Вместо require('../../src/app')
```

### Запуск тестов

```bash
# Запуск всех тестов
npm test

# Запуск конкретного теста
npm test -- -t "Companies API"

# Запуск с подробным выводом
npm test -- --verbose

# Запуск в режиме наблюдения
npm test -- --watch
```

При запуске `npm test` автоматически:
1. Загружаются переменные из `.env.test`
2. Проверяется корректность Prisma-клиента в тестах
3. Применяются необходимые миграции для тестовой базы

### Скрипт `reset-test-migrations.js`

Скрипт предназначен для очистки проблемных миграций в тестовой базе данных:

- Удаляет запись о проблемной миграции из таблицы `_prisma_migrations`
- Используется в CI перед созданием тестовой схемы
- Помогает устранить ошибку `P3009` с "failed migrations"

Запуск скрипта:
```bash
node scripts/reset-test-migrations.js
```

Применяйте скрипт, если получаете ошибку:
```
Error: P3009 migrate found failed migrations in the target database
```

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

### 🟥 CI / Deploy

- Автоматический деплой релиза `1.5.3` завершился ошибкой (P3009)
- Миграция `add_onboarding_completed_to_users_t` была удалена вручную
- CI был переписан для использования `db push --force-reset`
- Подготовлена финальная ветка `release/1.5.3-finish`, но потребуется ручное подтверждение

### 📘 Документация

- Добавлена секция о разработке в `zsh` в `README.md`
- Обновлён `CHANGELOG.md` с информацией о различиях `zsh` и `bash`
- Добавлена расширенная документация по работе с тестовой инфраструктурой

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
- `fix:` удалена проблемная миграция 20250412112641_add_onboarding_completed_to_users_t
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