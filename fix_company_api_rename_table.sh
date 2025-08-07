#!/bin/bash
# 🔧 ДВОЙНОЕ ИСПРАВЛЕНИЕ: CompanyContext API + Rename Table

echo "🚨 ИСПРАВЛЯЕМ ДВОЙНУЮ ПРОБЛЕМУ!"

# ===============================================
# 🔧 1. ИСПРАВЛЕНИЕ CompanyContext API
# ===============================================

echo "1️⃣ ПРОБЛЕМА: CompanyContext запрашивает /api/companies/4"
echo "   НО правильный endpoint: /api/account/companies"
echo ""

# Патч для CompanyContext.tsx
cat > /tmp/CompanyContext_fix.tsx << 'EOF'
// 🔧 ИСПРАВЛЕНИЕ CompanyContext.tsx
// ЗАМЕНИТЬ строки API вызовов:

// ❌ НЕПРАВИЛЬНО (выдает 404):
// const response = await api.get(`/api/companies/${companyId}`);

// ✅ ПРАВИЛЬНО:
const response = await api.get(`/api/account/companies`);

// ИЛИ если нужна конкретная компания:
const response = await api.get(`/api/company/test`); // Тестовый endpoint

// ===============================================
// 📊 ПРАВИЛЬНЫЕ ENDPOINTS ИЗ БЭКЕНДА:
// ===============================================
// ✅ /api/account/companies     - Список компаний пользователя
// ✅ /api/company/test          - Тест компании контекста  
// ✅ /api/company/clients       - Клиенты компании
// ✅ /api/company/purchases     - Покупки компании
// ✅ /api/company/products      - Продукты компании

// ❌ НЕ СУЩЕСТВУЕТ:
// ❌ /api/companies/4           - Такого endpoint НЕТ!
EOF

echo "✅ Патч для CompanyContext готов"

# ===============================================
# 🔧 2. ПЕРЕИМЕНОВАНИЕ CompactPurchasesTable
# ===============================================

echo ""
echo "2️⃣ ПЕРЕИМЕНОВЫВАЕМ CompactPurchasesTable → PurchasesTable"
echo ""

# Создаем новый файл PurchasesTable
echo "📝 Создаем новый PurchasesTable.tsx..."
cat > /tmp/rename_commands.sh << 'EOF'
# 🔄 КОМАНДЫ ДЛЯ ПЕРЕИМЕНОВАНИЯ:

# 1. Переименовать файл
mv f/src/pages/company/purchases/components/CompactPurchasesTable.tsx \
   f/src/pages/company/purchases/components/PurchasesTable.tsx

# 2. В PurchasesTable.tsx заменить:
# interface CompactPurchasesTableProps → interface PurchasesTableProps  
# const CompactPurchasesTable → const PurchasesTable

# 3. В PurchasesPage.tsx заменить:
# import CompactPurchasesTable from './components/CompactPurchasesTable';
# ↓
# import PurchasesTable from './components/PurchasesTable';

# 4. Заменить использование:
# <CompactPurchasesTable ... />
# ↓  
# <PurchasesTable ... />
EOF

echo "✅ Команды переименования готовы"

# ===============================================
# 🔧 3. УДАЛЕНИЕ СТАРЫХ ФАЙЛОВ
# ===============================================

echo ""
echo "3️⃣ УДАЛЯЕМ СТАРЫЕ/ВРЕМЕННЫЕ ФАЙЛЫ:"
echo ""

cat > /tmp/cleanup_commands.sh << 'EOF'
# 🗑️ УДАЛЕНИЕ ВРЕМЕННЫХ ФАЙЛОВ:

# Удалить Simple версию (уже не нужна)
rm -f f/src/pages/company/purchases/PurchasesPageSimple.tsx
rm -f f/src/pages/company/purchases/PurchasesPageSimple.tsx.backup

# Оставить только основной PurchasesPage.tsx
# Оставить только основной PurchasesTable.tsx (переименованный)
EOF

echo "✅ Команды очистки готовы"

# ===============================================
# 🎯 ИНСТРУКЦИЯ ПО ПРИМЕНЕНИЮ
# ===============================================

echo ""
echo "🎯 ПОШАГОВАЯ ИНСТРУКЦИЯ:"
echo ""
echo "1. CompanyContext исправление:"
echo "   - Найти в CompanyContext.tsx строку с /api/companies/"
echo "   - Заменить на /api/account/companies"
echo ""
echo "2. Переименование таблицы:"
echo "   - Выполнить команды из /tmp/rename_commands.sh"
echo ""
echo "3. Очистка:"
echo "   - Выполнить команды из /tmp/cleanup_commands.sh"
echo ""
echo "4. Тест:"
echo "   - npm run dev"
echo "   - Проверить /purchases"
echo ""

echo "🚀 ПОСЛЕ ИСПРАВЛЕНИЙ:"
echo "✅ CompanyContext не будет выдавать 404"
echo "✅ PurchasesTable будет иметь правильное название"
echo "✅ Никаких конфликтов имен файлов"