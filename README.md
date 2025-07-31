
WAREHOUSE MODULE
SALE MODULE

# 🌟 Solar ERP - Multi-Tenant Business Management System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%3E%3D18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D4.9.0-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D14.0-blue.svg)](https://www.postgresql.org/)

> A modern, scalable ERP system built with React, Node.js, and PostgreSQL featuring **two-level multi-tenant architecture**.

## 🚀 What We Built

**Solar ERP** is a complete business management system featuring a sophisticated two-level architecture:

- **🏢 Account Level** - System administration and company management
- **🏭 Company Level** - Day-to-day business operations within selected company

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Secure user sessions with token validation
- Protected routes with AuthGuard middleware
- Multi-company access control

### 🏗️ Two-Level Multi-Tenant Architecture
```
┌─── ACCOUNT LEVEL ──────────────────────────────────┐
│  🏢 System Management                               │
│  • Manage multiple companies                       │
│  • User administration                             │
│  • System-wide settings                           │
│  • Company creation and setup                     │
└────────────────────────────────────────────────────┘
                           ↓
┌─── COMPANY LEVEL ──────────────────────────────────┐
│  🏭 Business Operations                            │
│  • Company dashboard with real-time stats         │
│  • Client management                              │
│  • Product catalog                                │
│  • Sales and purchase tracking                    │
│  • Financial reporting                            │
└────────────────────────────────────────────────────┘
```

### 🎯 Smart Navigation System
- **Transit Pages** - Smooth context switching between companies
- **Dynamic Routing** - Context-aware URL structure
- **Breadcrumb Navigation** - Always know where you are
- **Fallback Handling** - Graceful error recovery

### 📊 Company Dashboard
- **Real-time Statistics** - Live data from PostgreSQL
- **Quick Actions** - One-click access to common tasks
- **Recent Activity** - Track latest sales and purchases
- **Financial Overview** - Revenue, expenses, and profit tracking

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - Robust server framework
- **Prisma ORM** - Type-safe database access
- **PostgreSQL** - Enterprise-grade database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** + **TypeScript** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Axios** - HTTP client for API calls

### Database
- **PostgreSQL 14+** - Main database
- **Prisma Schema** - Database modeling
- **Migrations** - Version-controlled schema changes

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14.0
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/solar-erp.git
cd solar-erp
```

### 2. Backend Setup
```bash
cd b
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start backend server
npm start
```

### 3. Frontend Setup
```bash
cd f
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- Default login: `solar@solar.com` (any password)

## 📁 Project Structure

```
solar-erp/
├── b/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── account/        # Account-level controllers
│   │   │   └── company/        # Company-level controllers
│   │   ├── routes/
│   │   │   ├── account/        # Account-level routes
│   │   │   └── company/        # Company-level routes
│   │   ├── middleware/
│   │   │   ├── account/        # Auth middleware
│   │   │   └── company/        # Company context middleware
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   └── scripts/                # Database seeding scripts
│
├── f/                          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── app/
│   │   │   └── AppRouter.tsx   # Main application router
│   │   ├── pages/
│   │   │   ├── account/        # Account-level pages
│   │   │   │   └── dashboard/  # Companies management
│   │   │   └── company/        # Company-level pages
│   │   │       ├── navigation/ # Transit and selection pages
│   │   │       └── dashboard/  # Company operations
│   │   ├── components/
│   │   │   └── account/        # Shared components
│   │   ├── services/
│   │   │   ├── account/        # Account-level API services
│   │   │   └── company/        # Company-level API services
│   │   └── hooks/              # Custom React hooks
│   └── public/                 # Static assets
└── scripts/                    # Deployment and utility scripts
```

## 🔄 Navigation Flow

```mermaid
graph TD
    A[Login Page] --> B[Account Dashboard]
    B --> C[Select Company]
    C --> D[Company Transit Page]
    D --> E[Company Dashboard]
    E --> F[Business Operations]
    
    B --> G[Create New Company]
    G --> B
    
    E --> H[Back to Companies]
    H --> B
```

## 🎯 API Endpoints

### Account Level APIs
```
GET  /api/account/companies     # List user's companies
POST /api/account/companies     # Create new company
POST /api/account/switch-to-company  # Switch company context
GET  /api/account/analytics     # System analytics
```

### Company Level APIs
```
GET  /api/company/dashboard     # Company dashboard data
GET  /api/company/dashboard/stats  # Quick statistics
GET  /api/company/clients       # Company clients
POST /api/company/clients       # Create client
```

### Authentication APIs
```
POST /api/auth/login           # User login
POST /api/auth/validate-token  # Token validation
POST /api/auth/logout          # User logout
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/solar_erp"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME="Solar ERP"
```

## 🗄️ Database Schema

### Account Level Tables
- `users` - System users
- `companies` - Company entities
- `company_users` - User-company relationships

### Company Level Tables
- `clients` - Company clients
- `products` - Product catalog
- `sales` - Sales transactions
- `purchases` - Purchase transactions
- `bank_accounts` - Financial accounts

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
```bash
# Backend
cd b
npm run build
npm start

# Frontend
cd f
npm run build
# Serve dist/ folder with your web server
```

## 🧪 Testing

### Backend Tests
```bash
cd b
npm test
```

### Frontend Tests
```bash
cd f
npm test
```

## 📝 Development Roadmap

### Version 1.1 (Next Release)
- [ ] Advanced user permissions system
- [ ] Real-time notifications
- [ ] Advanced reporting dashboard
- [ ] Mobile-responsive design improvements

### Version 1.2 (Future)
- [ ] REST API documentation with Swagger
- [ ] GraphQL endpoint
- [ ] Audit logging system
- [ ] Advanced search and filtering

### Version 2.0 (Long-term)
- [ ] Multi-language support (i18n)
- [ ] Advanced workflow automation
- [ ] Third-party integrations
- [ ] Mobile app (React Native)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Process

This project was built over **2 intensive days** using modern development practices:

### Day 1: Backend Foundation
- ✅ PostgreSQL database setup with Prisma ORM
- ✅ Express.js API with JWT authentication
- ✅ Multi-tenant architecture implementation
- ✅ Database migrations and seeding

### Day 2: Frontend Integration
- ✅ React + TypeScript frontend
- ✅ Complete API integration
- ✅ Multi-level navigation system
- ✅ Company dashboard with real-time data

## 🏆 Achievement Highlights

- **🔥 287 files changed** in final commit
- **📈 1,225+ lines of new code** written
- **🧹 24,000+ lines of legacy code** removed
- **🎯 100% working navigation** flow
- **⚡ Real-time API integration** implemented
- **🏗️ Enterprise-grade architecture** established

## 🐛 Known Issues & Solutions

### Common Issues
1. **Database connection errors**: Ensure PostgreSQL is running and credentials are correct
2. **API CORS issues**: Backend includes CORS middleware for localhost development
3. **Token expiration**: Frontend handles token refresh automatically

### Performance Notes
- Database queries are optimized with Prisma
- Frontend uses React Query for efficient data fetching
- API responses include proper caching headers

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join discussions on GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Built with ❤️ by an amazing development team
- Special thanks to the open-source community
- Inspired by modern ERP solutions like SAP Business One

---

**⭐ Star this repository if you found it helpful!**

**🚀 Ready to transform your business management? Get started with Solar ERP today!**
Terrafoorm