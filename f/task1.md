# TASK1.md - Company Dashboard Components Adaptation

## 🎯 **ЦЕЛЬ ЗАДАЧИ:**
Адаптировать существующие компоненты из backup для создания Company Level Dashboard в Solar ERP v1.7.0

---

## 📂 **ИСХОДНЫЕ ФАЙЛЫ:**
```
f/src/src_backup/components/layout/
├── Header.tsx          ← Оранжевый header с кнопками
├── Sidebar.tsx         ← Темный sidebar с навигацией  
├── Layout.tsx          ← Общая структура layout
└── AppHeader.tsx       ← Статус подключения БД
```

## 📂 **ЦЕЛЕВЫЕ ФАЙЛЫ:**
```
f/src/components/company/
├── CompanyHeader.tsx   ← Адаптированный header
├── CompanySidebar.tsx  ← Расширенный sidebar
└── CompanyLayout.tsx   ← Company-specific layout
```

---

## 🚀 **КОМАНДЫ ДЛЯ ВЫПОЛНЕНИЯ:**

### **Шаг 1: Создание структуры папок** (1 мин)
```bash
mkdir -p f/src/components/company
mkdir -p f/src/pages/company/dashboard
mkdir -p f/src/pages/company/clients
```

### **Шаг 2: Копирование базовых файлов** (2 мин)
```bash
cp f/src/src_backup/components/layout/Header.tsx f/src/components/company/CompanyHeader.tsx
cp f/src/src_backup/components/layout/Sidebar.tsx f/src/components/company/CompanySidebar.tsx
cp f/src/src_backup/components/layout/Layout.tsx f/src/components/company/CompanyLayout.tsx
```

### **Шаг 3: Проверка копирования** (1 мин)
```bash
ls -la f/src/components/company/
# Должны увидеть 3 скопированных файла
```

---

## 🔧 **АДАПТАЦИИ КОМПОНЕНТОВ:**

### **A. CompanyHeader.tsx** (15 мин)

#### **Текущий код (из Header.tsx):**
```tsx
const Header: React.FC<HeaderProps> = ({ user = { name: 'LEANID SOLAR' } }) => {
  return (
    <header className="flex justify-between items-center h-15 px-4 bg-[#f7931e] text-white">
      {/* Existing structure */}
    </header>
  );
};
```

#### **Нужные изменения:**
1. **Переименовать**: `Header` → `CompanyHeader`
2. **Добавить динамические данные**:
   ```tsx
   const [companyName, setCompanyName] = useState('');
   const [balance, setBalance] = useState(0);
   
   useEffect(() => {
     const name = localStorage.getItem('currentCompanyName') || 'Company';
     setCompanyName(name);
   }, []);
   ```
3. **Обновить отображение**: `{user.name}` → `{companyName}`

### **B. CompanySidebar.tsx** (25 мин)

#### **Текущий код (из Sidebar.tsx):**
```tsx
const Sidebar: React.FC = () => {
  // Только Dashboard и Clients
};
```

#### **Нужные изменения:**
1. **Переименовать**: `Sidebar` → `CompanySidebar`
2. **Расширить навигацию** - добавить все модули:
   ```tsx
   const sidebarItems = [
     { icon: "📊", title: "Dashboard", route: "/dashboard" },
     { icon: "👥", title: "Clients", route: "/clients" },
     { icon: "📦", title: "Warehouse", route: "/warehouse", expandable: true },
     { icon: "📋", title: "General ledger", route: "/ledger" },
     { icon: "💰", title: "Cashier", route: "/cashier", expandable: true },
     { icon: "📊", title: "Reports", route: "/reports" },
     { icon: "👨‍💼", title: "Personnel", route: "/personnel" },
     { icon: "🏭", title: "Production", route: "/production" },
     { icon: "💎", title: "Assets", route: "/assets" },
     { icon: "📄", title: "Documents", route: "/documents" },
     { icon: "💸", title: "Salary", route: "/salary" },
     { icon: "📋", title: "Declaration", route: "/declaration" },
     { icon: "⚙️", title: "Settings", route: "/settings" }
   ];
   ```

### **C. CompanyLayout.tsx** (10 мин)

#### **Нужные изменения:**
1. **Переименовать**: `Layout` → `CompanyLayout`
2. **Обновить импорты**:
   ```tsx
   import CompanySidebar from './CompanySidebar';
   import CompanyHeader from './CompanyHeader';
   ```
3. **Использовать новые компоненты**:
   ```tsx
   <CompanySidebar />
   <CompanyHeader user={{ name: companyName }} />
   ```

---

## 🧪 **ТЕСТИРОВАНИЕ** (15 мин)

### **Шаг 1: Создать тестовую страницу**
```tsx
// f/src/pages/company/dashboard/DashboardPage.tsx
import React from 'react';
import CompanyLayout from '../../../components/company/CompanyLayout';

const DashboardPage: React.FC = () => {
  return (
    <CompanyLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to Company Dashboard</h1>
        <p>This is the main content area where relevant information will be displayed based on your selections in the sidebar.</p>
      </div>
    </CompanyLayout>
  );
};

export default DashboardPage;
```

### **Шаг 2: Добавить роут**
```tsx
// f/src/app/AppRouter.tsx
import DashboardPage from '../pages/company/dashboard/DashboardPage';

// В routes добавить:
<Route path="/dashboard" element={<DashboardPage />} />
```

### **Шаг 3: Тестировать навигацию**
1. Перейти на `/dashboard`
2. Проверить отображение header
3. Проверить работу sidebar
4. Убедиться в отсутствии ошибок в консоли

---

## ✅ **КРИТЕРИИ УСПЕХА:**

### **Визуальные требования:**
- [ ] Оранжевый header отображается корректно
- [ ] Темный sidebar с полным списком модулей
- [ ] Layout responsive и не ломается
- [ ] Навигация между разделами работает

### **Технические требования:**
- [ ] Нет ошибок в консоли браузера  
- [ ] Компоненты корректно импортируются
- [ ] Routing работает без ошибок
- [ ] Company context отображается в header

### **Функциональные требования:**
- [ ] Клик по sidebar элементам переключает страницы
- [ ] Header показывает правильное название компании
- [ ] Accordion меню работают (если есть)
- [ ] Responsive дизайн на мобильных

---

## ⏰ **ВРЕМЕННОЙ ПЛАН:**

| Этап | Время | Описание |
|------|-------|----------|
| Подготовка папок | 1 мин | mkdir команды |
| Копирование файлов | 2 мин | cp команды |
| Адаптация Header | 15 мин | Динамические данные |
| Расширение Sidebar | 25 мин | Полный список модулей |
| Адаптация Layout | 10 мин | Импорты и интеграция |
| Тестирование | 15 мин | Создание тестовой страницы |
| **ИТОГО** | **68 мин** | **Готовый Company Dashboard** |

---

## 🎊 **ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:**

После выполнения TASK1 мы получим:

✅ **Professional Company Dashboard** - точно как в предыдущем проекте  
✅ **Полная навигация** - все 13 модулей в sidebar  
✅ **Company Context** - динамическое отображение названия компании  
✅ **Ready for Integration** - готов к подключению реальных данных  

**Это будет 80% от полного Company Level Dashboard для v1.7.0!** 🚀

---

## 💪 **ГОТОВЫ К ВЫПОЛНЕНИЮ?**

**TASK1 - это самый быстрый способ получить enterprise-grade dashboard, используя уже проверенные компоненты!**

**Время выполнения: ~1 час**  
**Сложность: Низкая (копирование + адаптация)**  
**Результат: Professional Company Dashboard** ✨