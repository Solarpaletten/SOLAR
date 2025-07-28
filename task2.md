# 📋 TASK2 - Clients Page MVP Development

## 🎯 **ЦЕЛЬ: MVP-READY CLIENT MANAGEMENT**
Создать полноценную систему управления клиентами с multi-tenant изоляцией для релиза в App Store/Play Market.

---

## ⏰ **ВРЕМЯ ВЫПОЛНЕНИЯ: 90 минут**
**Deadline:** Сегодня до вечера = **ГОТОВЫЙ MVP!**

---

## 🔧 **АРХИТЕКТУРА CLIENTS MODULE**

### 📂 **Структура файлов:**
```
f/src/pages/company/clients/
├── ClientsPage.tsx          (25 мин) - основная страница
├── components/
│   ├── ClientsTable.tsx     (20 мин) - таблица с данными
│   ├── ClientsToolbar.tsx   (10 мин) - поиск + фильтры
│   ├── AddClientModal.tsx   (15 мин) - форма добавления
│   └── ClientActions.tsx    (10 мин) - кнопки действий
└── types/
    └── Client.types.ts      (5 мин) - TypeScript типы
```

---

## 🎯 **ДЕТАЛЬНЫЙ ПЛАН РАЗРАБОТКИ**

### **ЭТАП 1: Основа (30 мин)**
#### 1.1 Client Types & Interfaces (5 мин)
```typescript
interface Client {
  id: number;
  company_id: number; // Multi-tenant isolation!
  name: string;
  email: string;
  phone: string;
  address: string;
  tax_number?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
```

#### 1.2 ClientsPage.tsx (25 мин)
- CompanyLayout wrapper
- State management (clients, loading, error)
- API integration с multi-tenant endpoints
- Real-time data loading

### **ЭТАП 2: UI Components (40 мин)**
#### 2.1 ClientsTable.tsx (20 мин)
- Professional table design
- Sorting по колонкам
- Responsive design
- Multi-select functionality
- Actions column (Edit/Delete)

#### 2.2 ClientsToolbar.tsx (10 мин)
- Search input с live filtering
- Status filter (Active/Inactive/All)
- "Add Client" button
- Export functionality (future)

#### 2.3 AddClientModal.tsx (15 мин)
- Form validation
- Company_id автоматически из context
- Error handling
- Success notifications

### **ЭТАП 3: Business Logic (20 мин)**
#### 3.1 API Integration (10 мин)
- GET /api/company/clients (with company_id filter)
- POST /api/company/clients (create new)
- PUT /api/company/clients/:id (edit)
- DELETE /api/company/clients/:id (delete)

#### 3.2 Client Actions (10 мин)
- Edit client inline/modal
- Delete confirmation
- Status toggle (Active/Inactive)
- Bulk operations

---

## 🎨 **DESIGN SPECIFICATIONS**

### **Table Columns:**
| Column | Width | Type | Sortable |
|--------|-------|------|----------|
| Name | 25% | string | ✅ |
| Email | 20% | email | ✅ |
| Phone | 15% | string | ✅ |
| Address | 20% | string | ❌ |
| Status | 10% | badge | ✅ |
| Actions | 10% | buttons | ❌ |

### **Color Scheme:**
- **Active clients:** Green badge
- **Inactive clients:** Gray badge
- **Table header:** Dark blue (`#0f3c4c`)
- **Hover states:** Light blue (`#165468`)

---

## 🔐 **MULTI-TENANT SECURITY**

### **Critical Requirements:**
✅ **Company ID Isolation:** Каждый клиент привязан к company_id  
✅ **Context Validation:** Backend проверяет права доступа  
✅ **No Cross-Company Data:** Компания видит только своих клиентов  
✅ **Automatic Context:** company_id автоматически добавляется к запросам

---

## 📊 **SUCCESS CRITERIA**

### **Функциональность:**
- [ ] Загрузка клиентов с правильной изоляцией по company_id
- [ ] Добавление новых клиентов (автоматический company_id)
- [ ] Редактирование существующих клиентов
- [ ] Удаление клиентов с подтверждением
- [ ] Поиск и фильтрация в реальном времени
- [ ] Responsive design для мобильных устройств

### **Technical:**
- [ ] TypeScript типизация на 100%
- [ ] Error handling для всех API calls
- [ ] Loading states во время операций
- [ ] Success/Error notifications
- [ ] Clean code architecture

### **MVP Ready:**
- [ ] Профессиональный UI/UX
- [ ] Стабильная работа без багов
- [ ] Multi-tenant безопасность
- [ ] Mobile-friendly интерфейс

---

## 🚀 **EXECUTION PLAN**

### **Сейчас (30 мин):**
1. Создать Client.types.ts
2. Создать базовый ClientsPage.tsx
3. Подключить к routing (/clients)

### **Следующие 30 мин:**
4. Создать ClientsTable.tsx с данными
5. Добавить ClientsToolbar.tsx
6. Интегрировать с API

### **Финальные 30 мин:**
7. Создать AddClientModal.tsx
8. Добавить Edit/Delete функции
9. Тестирование и полировка

---

## 🎊 **РЕЗУЛЬТАТ TASK2**

**После завершения получаем:**
```
🏢 Полноценный Client Management модуль
👥 Multi-tenant изоляция клиентов
📱 Professional UI готовый для App Store
💎 MVP функциональность для первых пользователей
🚀 Foundation для будущих модулей (Invoice, Banking, etc.)
```

---

## 🎯 **MVP RELEASE READINESS**

✅ **v1.7.0 Components:**
- Multi-tenant Company Management ✅
- Company Context Switching ✅  
- Professional Dashboard ✅
- Client Management 🎯 (TASK2)

**= ГОТОВЫЙ ПРОДУКТ ДЛЯ МАРКЕТА!** 🌟

---

**КОМАНДА, ПОЕХАЛИ К ФИНИШУ!** 🚀✨