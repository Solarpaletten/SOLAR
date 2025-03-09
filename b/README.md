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

### Fixed
- 2025-03-09 feat: .env.production render
### Fixed
- 2025-03-09 feat: app.js cors only frontend