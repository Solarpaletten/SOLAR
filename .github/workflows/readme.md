name: SOLAR

on:
  push:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      # Backend (`b`)
      - name: b
        run: npm install
        working-directory: ./b

      - name: Run backend tests
        run: npm test
        working-directory: ./b

      # Frontend (`f`)
      - name: f
        run: npm install
        working-directory: ./f

      - name: Run frontend tests
        run: npm test
        working-directory: ./f

      - name: Build frontend
        run: npm run build
        working-directory: ./f

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      # Backend deployment
      - name: Deploy Backend to Render
        env:
          RENDER_API_KEY_BACKEND: ${{ secrets.RENDER_API_KEY_BACKEND }}
        run: |
          curl -X POST \
            -H "Authorization: Bearer $RENDER_API_KEY_BACKEND" \
            https://api.render.com/v1/services/{backend-service-id}/deploys

      # Frontend deployment
      - name: Deploy Frontend to Render
        env:
          RENDER_API_KEY_FRONTEND: ${{ secrets.RENDER_API_KEY_FRONTEND }}
        run: |
          curl -X POST \
            -H "Authorization: Bearer $RENDER_API_KEY_FRONTEND" \
            https://api.render.com/v1/services/{frontend-service-id}/deploys


[0.2.0] - Upcoming
Planned
Products Module with database model, CRUD API, tests, validation, and stock tracking
Sales Module with database model, CRUD API, client relationships, tests, and reports
API documentation
Performance optimization
Security enhancements
Recent Progress
2025-03-03: Successfully merged and synced test branch into main, ensuring all updates and fixes are reflected in production
2025-03-03: Verified that Prisma migrations and schema updates are applied correctly to both test and production databases
2025-03-03: Debugged and resolved issues with missing test database schema in Prisma Studio
2025-03-03: Updated GitHub Actions workflows to run tests using the correct test database configuration
2025-03-03: Verified database connections and fixed issues with Prisma Client initialization
2025-03-03: Completed test runs for authentication and clients module, ensuring full backend functionality before merging into main
2025-03-03: Manually triggered GitHub Actions to validate backend stability after merging into main
2025-03-03: Fixed potential Git conflicts by rebasing main branch and ensuring a clean merge from test
2025-03-03: Verified successful deployment of the latest backend updates on Render
Теперь main содержит все последние исправления, и тесты успешно проходят. 🚀