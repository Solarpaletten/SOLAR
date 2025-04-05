# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands

### Backend (b/)
- Start development: `npm run dev`
- Run tests: `npm test`
- Run single test: `jest tests/path/to/test.test.js`
- Lint code: `npm run lint`
- Format code: `npm run format`

### Frontend (f/)
- Start development: `npm run dev`
- Build for production: `npm run build`
- Lint code: `npm run lint`
- Format code: `npm run format`

## Code Style Guidelines

### General
- Use single quotes for strings
- Use semicolons at the end of statements
- 2-space indentation
- No trailing spaces
- No multiple empty lines

### Backend (JavaScript)
- Import modules using CommonJS (`require()`)
- Use async/await for asynchronous operations
- Error handling with try/catch blocks
- Use Prisma Client for database operations
- Use Jest for testing with supertest for API testing

### Frontend (TypeScript/React)
- Import React components and hooks at the top
- Use TypeScript types/interfaces for props and state
- Functional components with React hooks
- Use React Router for navigation
- Use i18next for internationalization
- Use Tailwind CSS for styling

### Naming Conventions
- CamelCase for variables and functions
- PascalCase for React components and classes
- Use descriptive names for variables and functions