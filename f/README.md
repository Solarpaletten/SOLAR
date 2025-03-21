# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
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

## Структура папки Components/Purchases

1. **PurchasesTable.tsx**
   - Основной компонент-контейнер для отображения данных о закупках
   - Интегрирует функциональность поиска, пагинации и сортировки
   - Обрабатывает фильтрацию и сортировку записей о закупках
   - Управляет отображением состояний загрузки и сообщений об ошибках
   - Содержит заголовки столбцов с индикаторами сортировки
   - Рендерит компоненты PurchasesRow для каждой записи

2. **PurchasesRow.tsx**
   - Отображает одну запись о закупке как строку таблицы
   - Показывает отформатированную дату, номер счета, поставщика, сумму и статус
   - Включает кнопки действий для просмотра, редактирования и удаления
   - Правильно форматирует денежные значения
   - Сокращает длинные описания для поддержания макета таблицы
   - Использует PurchasesStatusBadge для визуализации статуса

3. **PurchasesItemRow.tsx**
   - Отображает отдельные позиции в рамках закупки
   - Показывает детали продукта/услуги, количество, цену за единицу и общую сумму
   - Используется в представлениях деталей закупки и формах
   - Обрабатывает расчеты на уровне позиций
   - Может включать элементы управления для удаления позиций или изменения количества

4. **PurchasesForm.tsx**
   - Форма для создания новых закупок или редактирования существующих
   - Содержит поля для поставщика, номера счета, даты, позиций и т.д.
   - Обрабатывает валидацию формы и отправку данных
   - Управляет динамическим добавлением/удалением позиций закупки
   - Рассчитывает итоги, налоги и другие финансовые данные
   - Включает кнопки сохранения, отмены и другие действия формы

5. **PurchasesActions.tsx**
   - Предоставляет кнопки действий для таблицы закупок
   - Содержит основную кнопку "Новая закупка"
   - Включает выпадающее меню для дополнительных действий
   - Поддерживает функции экспорта и импорта данных в CSV
   - Предоставляет функциональность массового удаления
   - Интегрирует выбор файлов для импорта

6. **PurchasesSearch.tsx**
   - Обеспечивает функциональность поиска для таблицы закупок
   - Содержит поле ввода с иконкой поиска
   - Реализует дебаунсинг для оптимизации производительности
   - Включает кнопку очистки поискового запроса
   - Синхронизируется с родительским компонентом
   - Адаптивный дизайн для мобильных и десктопных устройств

7. **PurchasesPagination.tsx**
   - Управляет разбиением списка закупок на страницы
   - Отображает элементы навигации по страницам
   - Позволяет настраивать количество элементов на странице
   - Показывает текущую страницу и общее количество страниц
   - Обрабатывает переключение между страницами
   - Включает функции перехода к первой/последней странице

8. **PurchasesSummary.tsx**
   - Отображает сводную информацию о закупках
   - Показывает общую сумму всех отфильтрованных закупок
   - Отображает количество записей в текущем представлении
   - Может включать дополнительную статистику (например, среднюю сумму)
   - Используется в нижней части таблицы закупок
   - Обновляется при изменении фильтров или данных

9. **PurchasesStatusBadge.tsx**
   - Визуализирует статус закупки с помощью цветного значка
   - Отображает различные статусы (например, "Оплачено", "В обработке", "Отменено")
   - Использует цветовое кодирование для быстрой идентификации статуса
   - Поддерживает всплывающие подсказки для дополнительной информации
   - Компактный и удобный для использования в таблицах
   - Обеспечивает единообразное отображение статусов во всем приложении