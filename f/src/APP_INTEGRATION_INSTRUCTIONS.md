# 🏗️ ИНТЕГРАЦИЯ CompanyContext В APP.tsx

## 📋 Шаг 1: Обновите импорты в App.tsx

```tsx
// Добавьте в начало App.tsx
import { CompanyProvider } from './contexts/CompanyContext';
```

## 📋 Шаг 2: Оберните приложение в CompanyProvider

```tsx
function App() {
  return (
    <CompanyProvider defaultCompanyId={1} fallbackToFirst={true}>
      <BrowserRouter>
        {/* Ваши существующие роуты */}
        <Routes>
          <Route path="/company/purchases" element={<PurchasesPage />} />
          {/* другие роуты */}
        </Routes>
      </BrowserRouter>
    </CompanyProvider>
  );
}
```

## 📋 Шаг 3: Добавьте CompanySelector в Header/Navbar

```tsx
import CompanySelector from './components/company/CompanySelector';

// В вашем Header компоненте:
<div className="flex items-center space-x-4">
  <CompanySelector className="w-64" />
  {/* другие элементы хедера */}
</div>
```

## 📋 Шаг 4: Проверьте API endpoints

Убедитесь что у вас есть:
- GET /api/companies - список компаний
- GET /api/companies/:id - данные компании
- PUT /api/companies/:id - обновление компании

## 🧪 Шаг 5: Тестирование

1. Откройте DevTools Console
2. Должны увидеть логи: "🏢 Loading company 1..."
3. Проверьте что PurchasesPage загружается без ошибок
4. Company selector должен показывать текущую компанию

## 🔧 Fallback режим

Если API не готов, CompanyContext автоматически использует mock данные в development режиме.
