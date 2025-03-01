# Business Management System API

## Overview

Backend API for business management system with features for client management, inventory, sales, purchases, and financial operations.

## Version

Current Version: v1.4.0

## Features

- User Authentication & Authorization
- Client Management
- Product Management
- Sales & Purchases
- Warehouse Management
- Bank Operations
- Chart of Accounts
- Email Notifications
- Version Control

## Tech Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Email Integration

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Start the server: `npm start`

## Version Control

- `npm run version-major`: Increment major version
- `npm run version-minor`: Increment minor version
- `npm run version-patch`: Increment patch version
- `npm run version:custom`: Custom version update

git clone https://github.com/Solarpaletten/b.git
cd b
npm install
npm start

npm run version-major
npm run version-minor
npm run version-patch
npm run version:custom

## License

MIT

## Author

[Solarpaletten](https://github.com/Solarpaletten)

npm install
npm start

npm run version-major
npm run version-minor
npm run version-patch
npm run version:custom

cp .env.example .env

f and b

VITE_API_URL=https://npmbk.onrender.com

VITE_API_URL=https://npmfr.onrender.com

VITE_API_URL=http://localhost:4000

VITE_API_URL=http://localhost:5173

new

DATABASE_URL postgresql://solar_user:PWO1lclgDswIAhL7OV1zBKGglUeTPmuf@dpg-cs4khfrtq21c73fve2j0-a.oregon-postgres.render.com/solar_eat1


JWT_SECRET bAw7>k3sUz&=a]g%rPECtc

RENDER_API_KEY_B
https://api.render.com/deploy/srv-cse013jv2p9s73b2i760?key=fu2FSU16Elo

RENDER_API_KEY_F
https://api.render.com/deploy/srv-cu234ldds78s738eh6ug?key=Lyg7CmKEFw4

test clients auth.test.js

delete test product

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

### Added
- 2025-02-28: Created test schema `schema.test.prisma` for isolated testing, configured tests to use `.env.test` with test database `solartest`.
- 2025-02-28: Restored cleanup of `clients` table in tests after syncing test database with all required tables (`users`, `clients`, `sales`, `purchases`, `doc_settlement`, etc.).
- 2025-03-01: Deployed frontend npmfr-frontend on Render in project Solar.
- 2025-03-01: Deployed backend on Vercel with integration to Render databases.
- 2025-03-01: Corrected service names to npmbk (backend) and npmfr (frontend) in Render.

### Changed
- 2025-02-28: Updated `setup.js` to load `.env.test` and use test-specific Prisma client from `prisma/generated/test`.
- 2025-02-28: Updated test database to solar_eat1_test_tdjt with new credentials, applied migrations, and ensured tests pass in GitHub Actions.
- 2025-02-28: Replaced test database with solar_eat1_test_tdjt, updated GitHub Secrets with new DATABASE_URL, and removed .env.test from local tracking.

### Fixed
- 2025-02-28: Resolved `PrismaClientKnownRequestError` by ensuring test database has all necessary tables.
- 2025-03-01: Fixed EJSONPARSE error in `b/package.json` by adding missing closing brace and removing extra comma.
### Fixed
- 2025-03-01: Fixed failing auth.test.js by updating expected API response format (message instead of error).

