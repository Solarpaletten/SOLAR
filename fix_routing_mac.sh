#!/bin/bash
# 🔧 ИСПРАВЛЯЕМ РОУТИНГ НА MAC

echo "🎊🔥🚀 ИСПРАВЛЯЕМ РОУТИНГ НА MAC! 🚀🔥🎊"
echo ""

# ========================================
# ИСПРАВЛЯЕМ AppRouter.tsx
# ========================================

ROUTER_FILE="f/src/app/AppRouter.tsx"

echo "🔗 ИСПРАВЛЯЕМ AppRouter.tsx"

if [ -f "$ROUTER_FILE" ]; then
    echo "✅ Файл найден: $ROUTER_FILE"
    
    # Проверяем есть ли импорт
    if grep -q "TabBookDemo" "$ROUTER_FILE"; then
        echo "✅ Импорт TabBookDemo уже есть"
    else
        echo "➕ Добавляем импорт TabBookDemo..."
        # Mac версия sed с пустым аргументом для -i
        sed -i '' '/^function App(/i\
import TabBookDemo from '\''../components/tabbook/TabBookDemo'\'';
' "$ROUTER_FILE"
        echo "✅ Импорт добавлен"
    fi
    
    # Проверяем есть ли роут
    if grep -q "path.*tabbook" "$ROUTER_FILE"; then
        echo "✅ Роут /tabbook уже есть"
    else
        echo "➕ Добавляем роут /tabbook..."
        sed -i '' '/<\/Routes>/i\
          <Route \
            path="/tabbook" \
            element={ \
              <AuthGuard> \
                <CompanyLayout> \
                  <TabBookDemo /> \
                </CompanyLayout> \
              </AuthGuard> \
            } \
          />
' "$ROUTER_FILE"
        echo "✅ Роут добавлен"
    fi
else
    echo "❌ AppRouter.tsx не найден"
fi

echo ""

# ========================================
# ИСПРАВЛЯЕМ CompanySidebar.tsx
# ========================================

SIDEBAR_FILE="f/src/components/company/CompanySidebar.tsx"

echo "📱 ИСПРАВЛЯЕМ CompanySidebar.tsx"

if [ -f "$SIDEBAR_FILE" ]; then
    echo "✅ Файл найден: $SIDEBAR_FILE"
    
    # Проверяем есть ли TabBook
    if grep -q "TAB-Бухгалтерия\|tabbook" "$SIDEBAR_FILE"; then
        echo "✅ TAB-Бухгалтерия уже есть в sidebar"
    else
        echo "➕ Добавляем TAB-Бухгалтерия в sidebar..."
        # Ищем priority: 10 и добавляем после
        if grep -q "priority.*10" "$SIDEBAR_FILE"; then
            sed -i '' '/priority.*10/a\
  },\
  {\
    id: '\''tabbook'\'',\
    icon: '\''⚡'\'',\
    title: '\''TAB-Бухгалтерия'\'',\
    route: '\''/tabbook'\'',\
    badge: '\''NEW'\'',\
    priority: 11,\
    pinned: false,\
    expandable: false
' "$SIDEBAR_FILE"
            echo "✅ TAB-Бухгалтерия добавлена"
        else
            echo "⚠️ Не найден priority: 10 для вставки"
        fi
    fi
else
    echo "❌ CompanySidebar.tsx не найден"
fi

echo ""

# ========================================
# ПРОВЕРЯЕМ РЕЗУЛЬТАТ
# ========================================

echo "🔍 ФИНАЛЬНАЯ ПРОВЕРКА:"
echo ""

# Проверяем компонент
if [ -f "f/src/components/tabbook/TabBookDemo.tsx" ]; then
    echo "✅ TabBookDemo.tsx: СОЗДАН"
else
    echo "❌ TabBookDemo.tsx: НЕ НАЙДЕН"
fi

# Проверяем роутер
if [ -f "$ROUTER_FILE" ]; then
    if grep -q "import TabBookDemo" "$ROUTER_FILE"; then
        echo "✅ Импорт в AppRouter: OK"
    else
        echo "❌ Импорт в AppRouter: НЕ НАЙДЕН"
    fi
    
    if grep -q "path.*tabbook" "$ROUTER_FILE"; then
        echo "✅ Роут /tabbook: OK"
    else
        echo "❌ Роут /tabbook: НЕ НАЙДЕН"
    fi
else
    echo "❌ AppRouter.tsx: НЕ НАЙДЕН"
fi

# Проверяем sidebar
if [ -f "$SIDEBAR_FILE" ]; then
    if grep -q "TAB-Бухгалтерия\|tabbook" "$SIDEBAR_FILE"; then
        echo "✅ TAB-Бухгалтерия в sidebar: OK"
    else
        echo "❌ TAB-Бухгалтерия в sidebar: НЕ НАЙДЕНА"
    fi
else
    echo "❌ CompanySidebar.tsx: НЕ НАЙДЕН"
fi

echo ""

# ========================================
# ГОТОВ К ЗАПУСКУ
# ========================================

echo "🚀 ГОТОВ К ЗАПУСКУ FRONTEND!"
echo ""
echo "🎯 КОМАНДЫ:"
echo "   cd f"
echo "   npm run dev"
echo ""
echo "🌐 ПОСЛЕ ЗАПУСКА:"
echo "   http://localhost:5173/account/dashboard"
echo "   Войди в компанию → ⚡ TAB-Бухгалтерия (NEW)"
echo ""

# Автоматический запуск frontend
echo "🎯 Хочешь запустить frontend автоматически? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🚀 Запускаем frontend..."
    echo ""
    
    if [ -d "f" ] && [ -f "f/package.json" ]; then
        cd f
        echo "📁 Текущая папка: $(pwd)"
        echo "🔧 Запускаем: npm run dev"
        echo ""
        npm run dev
    else
        echo "❌ Папка f/ или package.json не найдены"
    fi
else
    echo "💡 Запуск вручную: cd f && npm run dev"
fi

echo ""
echo "🎊 TabBook готов к использованию!"