#!/bin/bash
# 🚀 ФИНАЛЬНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ ЗАПУСКА ROCKET 3
# "ФИН СТРИМ" НАШЕЙ РЕВОЛЮЦИОННОЙ МИССИИ!

echo "🎊🔥🚀 ФИНАЛЬНАЯ ПОСЛЕДОВАТЕЛЬНОСТЬ! ROCKET 3 ФИНАЛ! 🚀🔥🎊"
echo ""
echo "🎯 МИССИЯ: Завершить революцию TAB-бухгалтерии"
echo ""

# ========================================
# ROCKET 3 COUNTDOWN
# ========================================

echo "🚀 ROCKET 3 COUNTDOWN НАЧИНАЕТСЯ!"
echo ""

for i in {5..1}; do
    echo "   $i..."
    sleep 1
done
echo "   🔥 ЗАПУСК!"
echo ""

# ========================================
# ЭТАП 1: ТЕСТ LINUX LAUNCHER
# ========================================

echo "🐧 ЭТАП 1: ТЕСТИРУЕМ LINUX LAUNCHER"
echo ""

# Проверяем что Docker готов
if command -v docker &> /dev/null; then
    if docker info &> /dev/null 2>&1; then
        echo "✅ Docker готов к запуску"
        DOCKER_READY=true
    else
        echo "⚠️ Docker не запущен - запускаем Docker Desktop"
        echo "💡 Открой Docker Desktop и попробуй снова"
        DOCKER_READY=false
    fi
else
    echo "❌ Docker не установлен"
    echo "💡 Установи Docker Desktop: https://www.docker.com/products/docker-desktop/"
    DOCKER_READY=false
fi

echo ""

# ========================================
# ЭТАП 2: СОЗДАНИЕ ROCKET SCRIPTS НА MAC
# ========================================

echo "📝 ЭТАП 2: СОЗДАЁМ ROCKET SCRIPTS НА MAC"
echo ""

# Создаём папку для ракет
mkdir -p scripts/rockets

echo "📁 Создана папка: scripts/rockets/"

# Создаём rocket1_create_file.sh
cat > scripts/rockets/rocket1_create_file.sh << 'ROCKET1_EOF'
#!/bin/bash
# 🚀 РАКЕТА #1 - СОЗДАТЬ ФАЙЛ TabBookDemo.tsx

echo "🎊🔥🚀 РАКЕТА #1 ЗАПУСКАЕТСЯ! 🚀🔥🎊"
echo ""
echo "🎯 ЗАДАЧА: Создать TabBookDemo.tsx"
echo "📁 ПУТЬ: f/src/components/tabbook/TabBookDemo.tsx"

# Создаём папку если её нет
mkdir -p f/src/components/tabbook

echo "📂 Папка f/src/components/tabbook создана"

# Создаём TabBookDemo.tsx с полным кодом
cat > f/src/components/tabbook/TabBookDemo.tsx << 'EOF'
// TabBook MVP - Революционная TAB-Бухгалтерия
import React, { useState, useEffect } from 'react';
import { Copy, Save } from 'lucide-react';

const TabBookDemo = () => {
  const [operations, setOperations] = useState([]);
  const [companyName, setCompanyName] = useState('');
  
  useEffect(() => {
    setCompanyName(localStorage.getItem('currentCompanyName') || 'Demo Company');
  }, []);

  const createSampleOperation = (type) => {
    const operation = {
      id: Date.now(),
      type,
      date: new Date().toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 1000) + 100,
      description: `${type} operation`
    };
    setOperations(prev => [operation, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔥 TabBook MVP - {companyName}
          </h1>
          <p className="text-xl text-gray-600">
            "TAB-Бухгалтерия" - 1 ДЕЙСТВИЕ = 90% РАБОТЫ
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => createSampleOperation('purchase')}
            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600"
          >
            📦 Создать приход
          </button>
          <button
            onClick={() => createSampleOperation('sale')}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600"
          >
            💰 Создать продажу
          </button>
          <button
            onClick={() => createSampleOperation('payment')}
            className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600"
          >
            🏦 Создать платёж
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Операции</h2>
          {operations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Создайте первую операцию
            </p>
          ) : (
            <div className="space-y-2">
              {operations.map(op => (
                <div key={op.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span>{op.description}</span>
                    <span className="font-semibold">{op.amount} €</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabBookDemo;
EOF

echo "✅ TabBookDemo.tsx создан!"
echo "💎 Компонент готов к использованию"
ROCKET1_EOF

# Создаём rocket2_add_routing.sh
cat > scripts/rockets/rocket2_add_routing.sh << 'ROCKET2_EOF'
#!/bin/bash
# 🚀 РАКЕТА #2 - ДОБАВИТЬ В РОУТЕР

echo "🎊🔥🚀 РАКЕТА #2 ЗАПУСКАЕТСЯ! 🚀🔥🎊"
echo ""
echo "🎯 ЗАДАЧА: Добавить TabBook в AppRouter.tsx"

# Создаём backup
if [ -f "f/src/app/AppRouter.tsx" ]; then
    cp f/src/app/AppRouter.tsx f/src/app/AppRouter.tsx.backup
    echo "💾 Backup создан"
else
    echo "❌ AppRouter.tsx не найден"
    exit 1
fi

# Добавляем импорт
if ! grep -q "TabBookDemo" f/src/app/AppRouter.tsx; then
    sed -i '/^function App(/i import TabBookDemo from '\''../components/tabbook/TabBookDemo'\'';' f/src/app/AppRouter.tsx
    echo "✅ Импорт добавлен"
fi

# Добавляем роут
if ! grep -q "path.*tabbook" f/src/app/AppRouter.tsx; then
    sed -i '/<\/Routes>/i \          <Route \
            path="/tabbook" \
            element={ \
              <AuthGuard> \
                <CompanyLayout> \
                  <TabBookDemo /> \
                </CompanyLayout> \
              </AuthGuard> \
            } \
          />' f/src/app/AppRouter.tsx
    echo "✅ Роут добавлен"
fi

echo "🚀 Роутинг настроен!"
ROCKET2_EOF

# Создаём rocket3_add_sidebar.sh
cat > scripts/rockets/rocket3_add_sidebar.sh << 'ROCKET3_EOF'
#!/bin/bash
# 🚀 РАКЕТА #3 - ДОБАВИТЬ В SIDEBAR

echo "🎊🔥🚀 РАКЕТА #3 ЗАПУСКАЕТСЯ! 🚀🔥🎊"
echo ""
echo "🎯 ЗАДАЧА: Добавить TabBook в CompanySidebar.tsx"

if [ ! -f "f/src/components/company/CompanySidebar.tsx" ]; then
    echo "❌ CompanySidebar.tsx не найден"
    exit 1
fi

# Создаём backup
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.backup
echo "💾 Backup создан"

# Добавляем в sidebar
if ! grep -q "TAB-Бухгалтерия\|tabbook" f/src/components/company/CompanySidebar.tsx; then
    if grep -q "priority.*10" f/src/components/company/CompanySidebar.tsx; then
        sed -i '/priority.*10/a \  },\
  {\
    id: '\''tabbook'\'',\
    icon: '\''⚡'\'',\
    title: '\''TAB-Бухгалтерия'\'',\
    route: '\''/tabbook'\'',\
    badge: '\''NEW'\'',\
    priority: 11,\
    pinned: false,\
    expandable: false' f/src/components/company/CompanySidebar.tsx
        echo "✅ TAB-Бухгалтерия добавлена в sidebar"
    else
        echo "⚠️ Не удалось найти место для добавления"
    fi
else
    echo "⚠️ TAB-Бухгалтерия уже добавлена"
fi

echo "🎊 Sidebar обновлён!"
ROCKET3_EOF

# Создаём master launcher
cat > scripts/launch_tabbook.sh << 'MASTER_EOF'
#!/bin/bash
# 🚀 MASTER LAUNCHER - ВСЕ РАКЕТЫ TABBOOK

echo "🎊🔥🚀 ЗАПУСК ВСЕХ РАКЕТ TABBOOK! 🚀🔥🎊"
echo ""

# Делаем все скрипты исполняемыми
chmod +x scripts/rockets/*.sh

echo "🚀 Запускаем последовательность ракет..."
echo ""

# Запускаем по очереди
echo "1️⃣ РАКЕТА #1: Создание компонента"
./scripts/rockets/rocket1_create_file.sh
echo ""

echo "2️⃣ РАКЕТА #2: Добавление роутинга"
./scripts/rockets/rocket2_add_routing.sh
echo ""

echo "3️⃣ РАКЕТА #3: Интеграция в sidebar"
./scripts/rockets/rocket3_add_sidebar.sh
echo ""

echo "🎊 ВСЕ РАКЕТЫ ЗАПУЩЕНЫ! TABBOOK ИНТЕГРИРОВАН!"
echo ""
echo "🎯 СЛЕДУЮЩИЙ ШАГ:"
echo "   cd f && npm run dev"
echo "   Открой: http://localhost:5173/tabbook"
MASTER_EOF

# Делаем скрипты исполняемыми
chmod +x scripts/rockets/*.sh
chmod +x scripts/launch_tabbook.sh

echo "✅ Все rocket scripts созданы:"
echo "   📁 scripts/rockets/rocket1_create_file.sh"
echo "   📁 scripts/rockets/rocket2_add_routing.sh" 
echo "   📁 scripts/rockets/rocket3_add_sidebar.sh"
echo "   🚀 scripts/launch_tabbook.sh"
echo ""

# ========================================
# ЭТАП 3: ВЫБОР ПЛАТФОРМЫ ЗАПУСКА
# ========================================

echo "🎯 ЭТАП 3: ВЫБОР ПЛАТФОРМЫ ЗАПУСКА"
echo ""

if [ "$DOCKER_READY" = true ]; then
    echo "🐳 РЕКОМЕНДУЕМ: Запуск через Docker (Linux окружение)"
    echo ""
    echo "   КОМАНДЫ:"
    echo "   ./run_on_linux.sh"
    echo "   # Внутри Linux:"
    echo "   ./scripts/launch_tabbook.sh"
    echo ""
    echo "💻 АЛЬТЕРНАТИВА: Прямо на Mac"
    echo "   ./scripts/launch_tabbook.sh"
    echo ""
else
    echo "💻 ЗАПУСК НА MAC (Docker недоступен):"
    echo "   ./scripts/launch_tabbook.sh"
    echo ""
fi

# ========================================
# ФИНАЛЬНОЕ СООБЩЕНИЕ
# ========================================

echo "🏁 ROCKET 3 ГОТОВ К ФИНАЛЬНОМУ ЗАПУСКУ!"
echo ""
echo "🎊 ФИНАЛЬНАЯ КОМАНДА:"
if [ "$DOCKER_READY" = true ]; then
    echo "   ./run_on_linux.sh && ./scripts/launch_tabbook.sh"
else
    echo "   ./scripts/launch_tabbook.sh"
fi
echo ""
echo "🚀 ПОЕХАЛИ К ПОБЕДЕ!"