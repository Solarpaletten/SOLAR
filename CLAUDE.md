# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SOLAR is a comprehensive accounting system for small to medium businesses with multilingual support. The application combines:

- Modern frontend: React + TypeScript + Vite + Tailwind CSS
- Backend API: Node.js + Express + Prisma ORM
- Database: PostgreSQL
- Assistant features: AI-powered voice recognition and translation (using Whisper API)

The system provides sales and purchases management, client management, accounting functionality, and an integrated multilingual voice assistant that supports English, Russian, German, and Polish.

## Repository Structure

The codebase is organized into these main directories:

- `solar/b/` - Backend API (Node.js/Express)
- `solar/f/` - Frontend (React/TypeScript)
- `solar/docs/` - Documentation

## Build/Test Commands

### Backend (b/)
- Development: `npm run dev`
- Production: `npm start` or `npm run start:prod` 
- Tests: `npm test` (all), `jest tests/path/to/test.test.js` (single)
- Watch tests: `npm run test:watch`
- Coverage: `npm run test:coverage`
- Lint: `npm run lint`, Fix lint: `npm run lint:fix`
- Format: `npm run format`, Check format: `npm run check-format`
- Prisma commands:
  - Generate client: `npm run prisma:generate`
  - DB studio: `npm run prisma:studio`
  - Migrate: `npm run prisma:migrate`

### Frontend (f/)
- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`, Check lint: `npm run check-lint`
- Format: `npm run format`, Check format: `npm run check-format`

## Architecture Overview

### Backend Architecture

- **Data Layer**: Prisma ORM with PostgreSQL 
- **API Layer**: Express routes (in `/routes`) and controllers (in `/controllers`)
- **Service Layer**: Business logic modules in `/services`
- **Utilities**: Helper functions in `/utils`

The backend follows a modular design with clear separation of concerns. Each domain (sales, purchases, assistant) has its own controller, service layer, and test suite.

Key database models include:
- Users and authentication
- Clients management
- Sales and purchases
- Translation and assistant features
- Companies and onboarding

### Frontend Architecture

- React functional components with hooks
- TypeScript with strict mode
- Tailwind CSS for styling
- i18n for internationalization (English, Russian)
- React Router for navigation
- Context API for state management

Key frontend features:
- Authentication system with email confirmation
- Client, sales, and purchases management
- Voice assistant with WebSocket communication
- Multilingual support
- Admin analytics

#### Assistant Component Structure
```
components/assistant/
├── AssistantPanel.tsx
├── AssistantContext.tsx
├── AssistantProvider.tsx
├── SpeechRecognition.tsx
├── TranslationView.tsx
├── VoiceControl.tsx
└── ...
```

## Code Style Guidelines

### General
- Single quotes for strings, semicolons required
- 2-space indentation, no trailing spaces
- Prettier for formatting

### Backend (JavaScript)
- CommonJS imports (`require()`)
- Async/await for async operations
- Error handling with try/catch
- Jest for testing with supertest for API tests

### Frontend (TypeScript/React)
- ES modules, TypeScript with strict mode
- React functional components with hooks
- Use TypeScript types/interfaces (defined in `/types`)
- Tailwind CSS for styling

### Naming Conventions
- camelCase for variables and functions
- PascalCase for React components and classes
- Descriptive names for all identifiers

## WebSocket Integration

The application uses WebSockets for real-time communication between the frontend and backend, particularly for the assistant features. This enables:

- Real-time voice recognition processing
- Instant translation responses
- Session-based conversation history

## Authentication Flow

The system uses JWT-based authentication with email confirmation:
1. User registers with email/password
2. Confirmation email is sent
3. User confirms email via link
4. User can then log in to access the system