#!/bin/bash
# 🔗 ДОБАВЛЯЕМ РОУТИНГ НА MAC

echo "🎊🔥🚀 ДОБАВЛЯЕМ РОУТИНГ TabBook НА MAC! 🚀🔥🎊"
echo ""

# ========================================
# ПРОВЕРЯЕМ ЧТО КОМПОНЕНТ СОЗДАН
# ========================================

if [ -f "f/src/components/tabbook/TabBookDemo.tsx" ]; then
    echo "✅ TabBookDemo.tsx найден"
else
    echo "❌ TabBookDemo.tsx не найден"
    echo "💡 Сначала запусти ./quick_docker_launch.sh"
    exit 1
fi

# ========================================
# ДОБАВЛЯЕМ В AppRouter.tsx
# ========================================

echo "🔗 ДОБАВЛЯЕМ В AppRouter.tsx"
echo ""

ROUTER_FILE="f/src/app/AppRouter.tsx"

if [ ! -f "$ROUTER_FILE" ]; then
    echo "❌ AppRouter.tsx не найден в $ROUTER_FILE"
    echo "🔍 Ищем router файл..."
    
    # Ищем роутер в разных местах
    POSSIBLE_ROUTERS=$(find f/src -name "*Router*" -o -name "*App*" | grep -E '\.(tsx|ts)$')
    
    if [ -n "$POSSIBLE_ROUTERS" ]; then
        echo "📁 Найдены возможные router файлы:"
        echo "$POSSIBLE_ROUTERS"
        echo ""
        echo "💡 Выбери правильный файл и обновим скрипт"
    else
        echo "❌ Router файл не найден"
    fi
    exit 1
fi

# Создаём backup
cp "$ROUTER_FILE" "$ROUTER_FILE.backup"
echo "💾 Backup создан: $ROUTER_FILE.backup"

# Проверяем есть ли уже импорт
if grep -q "TabBookDemo" "$ROUTER_FILE"; then
    echo "⚠️ TabBookDemo уже импортирован"
else
    # Добавляем импорт перед function App
    if grep -q "^function App" "$ROUTER_FILE"; then
        sed -i '' '/^function App(/i\
import TabBookDemo from '\''../components/tabbook/TabBookDemo'\'';
' "$ROUTER_FILE"
        echo "✅ Импорт TabBookDemo добавлен"
    else
        echo "⚠️ Не найдена function App для добавления импорта"
    fi
fi

# Проверяем есть ли уже роут
if grep -q "path.*tabbook" "$ROUTER_FILE"; then
    echo "⚠️ Роут /tabbook уже существует"
else
    # Добавляем роут перед </Routes>
    if grep -q "</Routes>" "$ROUTER_FILE"; then
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
        echo "✅ Роут /tabbook добавлен"
    else
        echo "⚠️ Не найден </Routes> для добавления роута"
    fi
fi

echo ""

# ========================================
# ДОБАВЛЯЕМ В SIDEBAR
# ========================================

echo "📱 ДОБАВЛЯЕМ В SIDEBAR"
echo ""

SIDEBAR_FILE="f/src/components/company/CompanySidebar.tsx"

if [ ! -f "$SIDEBAR_FILE" ]; then
    echo "❌ CompanySidebar.tsx не найден в $SIDEBAR_FILE"
    echo "🔍 Ищем sidebar файл..."
    
    # Ищем sidebar в разных местах
    POSSIBLE_SIDEBARS=$(find f/src -name "*Sidebar*" | grep -E '\.(tsx|ts)$')
    
    if [ -n "$POSSIBLE_SIDEBARS" ]; then
        echo "📁 Найдены возможные sidebar файлы:"
        echo "$POSSIBLE_SIDEBARS"
        echo ""
        echo "💡 Продолжаем без sidebar (можно добавить позже)"
        SIDEBAR_AVAILABLE=false
    else
        echo "❌ Sidebar файл не найден"
        SIDEBAR_AVAILABLE=false
    fi
else
    SIDEBAR_AVAILABLE=true
fi

if [ "$SIDEBAR_AVAILABLE" = true ]; then
    # Создаём backup
    cp "$SIDEBAR_FILE" "$SIDEBAR_FILE.backup"
    echo "💾 Backup создан: $SIDEBAR_FILE.backup"
    
    # Проверяем есть ли уже TabBook в sidebar
    if grep -q "TAB-Бухгалтерия\|tabbook" "$SIDEBAR_FILE"; then
        echo "⚠️ TAB-Бухгалтерия уже добавлена в sidebar"
    else
        # Ищем место для добавления
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
            echo "✅ TAB-Бухгалтерия добавлена в sidebar"
        else
            echo "⚠️ Не удалось найти место для добавления в sidebar"
        fi
    fi
fi

echo ""

# ========================================
# ПРОВЕРЯЕМ РЕЗУЛЬТАТ
# ========================================

echo "🔍 ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"
echo ""

# Проверяем импорт
if grep -q "import TabBookDemo" "$ROUTER_FILE"; then
    echo "✅ Импорт TabBookDemo: OK"
else
    echo "❌ Импорт TabBookDemo: НЕ НАЙДЕН"
fi

# Проверяем роут
if grep -q "path.*tabbook" "$ROUTER_FILE"; then
    echo "✅ Роут /tabbook: OK"
else
    echo "❌ Роут /tabbook: НЕ НАЙДЕН"
fi

# Проверяем sidebar
if [ "$SIDEBAR_AVAILABLE" = true ]; then
    if grep -q "TAB-Бухгалтерия\|tabbook" "$SIDEBAR_FILE"; then
        echo "✅ TAB-Бухгалтерия в sidebar: OK"
    else
        echo "❌ TAB-Бухгалтерия в sidebar: НЕ НАЙДЕНА"
    fi
else
    echo "⚠️ Sidebar: Пропущен (файл не найден)"
fi

echo ""

# ========================================
# ЗАПУСК FRONTEND
# ========================================

echo "🚀 ГОТОВ К ЗАПУСКУ FRONTEND:"
echo ""

if [ -f "f/package.json" ]; then
    echo "📦 package.json найден"
    echo ""
    echo "🎯 КОМАНДЫ ДЛЯ ЗАПУСКА:"
    echo "   cd f"
    echo "   npm run dev"
    echo ""
    echo "🌐 После запуска открой:"
    echo "   http://localhost:5173/account/dashboard"
    echo "   Войди в компанию → найди ⚡ TAB-Бухгалтерия"
    echo ""
    
    echo "🎯 Хочешь запустить frontend сейчас? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🚀 Запускаем frontend..."
        echo ""
        cd f
        echo "📁 Папка: $(pwd)"
        echo "🔧 Команда: npm run dev"
        echo ""
        npm run dev
    else
        echo "💡 Запусти позже: cd f && npm run dev"
    fi
else
    echo "❌ package.json не найден в f/"
    echo "💡 Проверь структуру проекта"
fi

echo ""
echo "🎊 РОУТИНГ ДОБАВЛЕН! TABBOOK ГОТОВ!"