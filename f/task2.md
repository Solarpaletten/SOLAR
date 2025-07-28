# TASK2.md - Clients Page Development

## 🎯 **ЦЕЛЬ ЗАДАЧИ:**
Создать полноценную страницу управления клиентами для Company Level в Solar ERP v1.7.0, используя готовые компоненты из предыдущего проекта.

---

## 📂 **ИСХОДНЫЕ ФАЙЛЫ (из backup):**
```
f/src/src_backup/pages/clients/
├── ClientsPage.tsx         ← Основная страница клиентов
├── ClientDetailsPage.tsx   ← Подробности клиента
├── AddClientModal.tsx      ← Модальное окно добавления
└── components/
    ├── ClientsTable.tsx    ← Таблица клиентов
    └── ClientsToolbar.tsx  ← Панель инструментов
```

## 📂 **ЦЕЛЕВЫЕ ФАЙЛЫ:**
```
f/src/pages/company/clients/
├── ClientsPage.tsx         ← Адаптированная страница
├── ClientDetailsPage.tsx   ← Страница деталей клиента
└── components/
    ├── ClientsTable.tsx    ← Таблица с данными
    ├── AddClientModal.tsx  ← Форма добавления
    └── ClientsToolbar.tsx  ← Action toolbar
```

---

## 🚀 **КОМАНДЫ ДЛЯ ВЫПОЛНЕНИЯ:**

### **Шаг 1: Создание структуры папок** (1 мин)
```bash
mkdir -p f/src/pages/company/clients
mkdir -p f/src/pages/company/clients/components
```

### **Шаг 2: Копирование файлов из backup** (2 мин)
```bash
# Найти и скопировать существующие компоненты клиентов
find f/src/src_backup -name "*Client*" -type f
cp f/src/src_backup/pages/clients/* f/src/pages/company/clients/ 2>/dev/null || echo "Files not found, will create new"
```

### **Шаг 3: Проверка существующих файлов** (1 мин)
```bash
ls -la f/src/pages/company/clients/
# Посмотрим что у нас уже есть
```

---

## 🎨 **ТРЕБОВАНИЯ К UI (из предыдущих скриншотов):**

### **1. Header Section:**
- 📋 **Title**: "Customers" 
- 🔗 **Support button**: "Support (FAQ: 23)"
- 🎨 **Design**: Blue header bar

### **2. Action Toolbar:**
```tsx
interface ActionToolbar {
  buttons: [
    { icon: "➕", text: "Add new client", action: "openAddModal" },
    { icon: "✏️", text: "Edit", action: "editSelected" },
    { icon: "🗑️", text: "Delete", action: "deleteSelected" },
    { icon: "📋", text: "List view", active: true },
    { icon: "📊", text: "Grid view" },
    { icon: "🖨️", text: "Print" },
    { icon: "📥", text: "Import" }
  ];
  pagination: {
    current: 1,
    total: 4,
    navigation: ["◀", "▶", "⏭"]
  };
}
```

### **3. Data Table:**
```tsx
interface ClientsTable {
  columns: [
    { key: "select", type: "checkbox" },
    { key: "registrationDate", title: "Registration date", sortable: true },
    { key: "name", title: "Name", sortable: true },
    { key: "abbreviation", title: "Abbreviation" },
    { key: "code", title: "Code" },
    { key: "vatCode", title: "VAT code" },
    { key: "phoneNumber", title: "Phone number" },
    { key: "fax", title: "Fax" },
    { key: "email", title: "Email" }
  ];
  
  features: {
    sorting: true,
    filtering: true,
    multiSelect: true,
    pagination: true,
    rowHighlight: true
  };
}
```

---

## 🔧 **АДАПТАЦИИ КОМПОНЕНТОВ:**

### **A. ClientsPage.tsx** (25 мин)

#### **Базовая структура:**
```tsx
import React, { useState, useEffect } from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';
import ClientsTable from './components/ClientsTable';
import ClientsToolbar from './components/ClientsToolbar';
import AddClientModal from './components/AddClientModal';
import { api } from '../../../api/axios';

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/company/clients');
      setClients(response.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <CompanyLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Customers</h1>
          <button className="bg-blue-600 px-3 py-1 rounded text-sm">
            Support (FAQ: 23)
          </button>
        </div>

        {/* Toolbar */}
        <ClientsToolbar 
          onAddClient={() => setShowAddModal(true)}
          selectedCount={0}
        />

        {/* Table */}
        <ClientsTable 
          clients={clients}
          loading={loading}
          onRefresh={fetchClients}
        />

        {/* Add Modal */}
        {showAddModal && (
          <AddClientModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchClients();
            }}
          />
        )}
      </div>
    </CompanyLayout>
  );
};

export default ClientsPage;
```

### **B. ClientsTable.tsx** (20 мин)

#### **Основные функции:**
- 📊 **Sortable columns** - сортировка по колонкам
- 🔍 **Search/Filter** - поиск и фильтрация
- ✅ **Multi-select** - множественный выбор
- 📄 **Pagination** - разбивка на страницы
- 🎨 **Row highlighting** - подсветка строк

### **C. ClientsToolbar.tsx** (10 мин)

#### **Action buttons:**
- ➕ **Add new client** - открывает модальное окно
- ✏️ **Edit selected** - редактирование выбранных
- 🗑️ **Delete selected** - удаление выбранных
- 📋 **List/Grid view** - переключение видов
- 🖨️ **Print** - печать списка
- 📥 **Import** - импорт клиентов

### **D. AddClientModal.tsx** (15 мин)

#### **Form fields:**
```tsx
interface ClientFormData {
  name: string;           // Название клиента
  abbreviation?: string;  // Сокращение
  code?: string;         // Код клиента
  vatCode?: string;      // НДС код
  phoneNumber?: string;  // Телефон
  fax?: string;         // Факс
  email?: string;       // Email
  registrationDate: string; // Дата регистрации
}
```

---

## 🔗 **ИНТЕГРАЦИЯ С ROUTING:**

### **AppRouter.tsx updates:**
```tsx
// Добавить в company routes:
<Route path="/clients" element={<ClientsPage />} />
<Route path="/clients/:id" element={<ClientDetailsPage />} />
```

### **Sidebar integration:**
```tsx
// В CompanySidebar.tsx уже есть:
{ icon: "👥", title: "Clients", route: "/clients" }
```

---

## 🔧 **API INTEGRATION:**

### **Backend endpoints (уже готовы):**
```typescript
GET    /api/company/clients       // Получить список клиентов
POST   /api/company/clients       // Создать нового клиента  
PUT    /api/company/clients/:id   // Обновить клиента
DELETE /api/company/clients/:id   // Удалить клиента
GET    /api/company/clients/:id   // Получить детали клиента
```

### **Multi-tenant isolation:**
```tsx
// Автоматически через X-Company-Id header в api.tsx
const response = await api.get('/api/company/clients');
// Каждая компания видит только своих клиентов
```

---

## 🧪 **ТЕСТИРОВАНИЕ** (10 мин)

### **Тестовые сценарии:**
1. **Открыть /clients** - проверить загрузку страницы
2. **Клик "Add new client"** - проверить модальное окно
3. **Заполнить форму** - создать тестового клиента
4. **Проверить таблицу** - новый клиент должен появиться
5. **Сортировка** - проверить работу сортировки колонок
6. **Поиск** - проверить фильтрацию данных

---

## ✅ **КРИТЕРИИ УСПЕХА:**

### **Функциональные требования:**
- [ ] Страница открывается без ошибок
- [ ] Таблица отображает клиентов текущей компании
- [ ] Форма добавления работает корректно
- [ ] Сортировка и фильтрация функционируют
- [ ] Pagination работает с большим количеством записей
- [ ] Multi-select и bulk операции работают

### **UI/UX требования:**
- [ ] Дизайн соответствует предыдущему проекту
- [ ] Responsive design на мобильных устройствах
- [ ] Loading states во время API вызовов
- [ ] Error handling для неудачных запросов
- [ ] Smooth animations и transitions

### **Технические требования:**
- [ ] Нет ошибок в консоли браузера
- [ ] TypeScript типы корректны
- [ ] Multi-tenant изоляция работает
- [ ] API интеграция функционирует
- [ ] Компоненты переиспользуемы

---

## ⏰ **ВРЕМЕННОЙ ПЛАН:**

| Этап | Время | Описание |
|------|-------|----------|
| Подготовка структуры | 4 мин | Папки и копирование |
| ClientsPage.tsx | 25 мин | Основная страница |
| ClientsTable.tsx | 20 мин | Таблица с данными |
| ClientsToolbar.tsx | 10 мин | Панель инструментов |
| AddClientModal.tsx | 15 мин | Форма добавления |
| Routing integration | 5 мин | Подключение маршрутов |
| Тестирование | 10 мин | Проверка функций |
| **ИТОГО** | **89 мин** | **Готовая Clients Page** |

---

## 🎊 **ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:**

После выполнения TASK2 мы получим:

✅ **Professional Clients Management** - как в крупных ERP системах  
✅ **Full CRUD Operations** - создание, чтение, обновление, удаление  
✅ **Advanced Table Features** - сортировка, фильтрация, pagination  
✅ **Multi-tenant Isolation** - каждая компания видит только своих клиентов  
✅ **Responsive Design** - работает на всех устройствах  
✅ **Ready for Production** - готов к реальному использованию  

**Это будет полноценный CRM модуль уровня enterprise!** 🚀

---

## 🎯 **INTEGRATION С v1.7.0:**

**TASK2 Clients Page** интегрируется с:
- ✅ **TASK1 Company Dashboard** - навигация через sidebar
- 🔄 **Company Context Switching** - изоляция данных между компаниями
- 📊 **Multi-tenant Architecture** - безопасность и производительность

## 💪 **ГОТОВЫ К ВЫПОЛНЕНИЮ?**

**TASK2 - превратит наш Solar ERP в полноценную CRM систему с professional клиентской базой!**

**Время выполнения: ~1.5 часа**  
**Сложность: Средняя (адаптация + интеграция)**  
**Результат: Enterprise Clients Management System** ✨