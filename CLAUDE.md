# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands

### Backend (b/)
- Development: `npm run dev`
- Tests: `npm test` (all), `jest tests/path/to/test.test.js` (single)
- Watch tests: `npm run test:watch`
- Coverage: `npm run test:coverage`
- Lint: `npm run lint`, Fix lint: `npm run lint:fix`
- Format: `npm run format`, Check format: `npm run check-format`
- Prisma: `npm run prisma:generate`, `npm run prisma:studio`

### Frontend (f/)
- Development: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`, Check lint: `npm run check-lint`
- Format: `npm run format`, Check format: `npm run check-format`

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
- Use TypeScript types/interfaces
- Tailwind CSS for styling

### Naming Conventions
- camelCase for variables and functions
- PascalCase for React components and classes
- Descriptive names for all identifiers