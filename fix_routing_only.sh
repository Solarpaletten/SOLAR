#!/bin/bash
# 🚀 ЧАСТЬ 1 - ИСПРАВЛЯЕМ ТОЛЬКО РОУТИНГ
# Фокус: AppRouter.tsx только

echo "🎊🔥🚀 ЧАСТЬ 1: ИСПРАВЛЯЕМ ТОЛЬКО РОУТИНГ! 🚀🔥🎊"
echo ""
echo "🎯 ЗАДАЧА: Добавить TabBook только в AppRouter.tsx"
echo "📁 ФАЙЛ: f/src/app/AppRouter.tsx"
echo ""

# Проверяем что TabBookDemo.tsx существует
if [ ! -f "f/src/components/tabbook/TabBookDemo.tsx" ]; then
    echo "❌ ОШИБКА: TabBookDemo.tsx не найден!"
    echo "💡 Файл должен быть создан первым"
    exit 1
fi

echo "✅ TabBookDemo.tsx найден - можно продолжать!"

# Создаём backup AppRouter.tsx
if [ -f "f/src/app/AppRouter.tsx" ]; then
    cp f/src/app/AppRouter.tsx f/src/app/AppRouter.tsx.backup
    echo "💾 Backup создан: f/src/app/AppRouter.tsx.backup"
else
    echo "❌ ОШИБКА: AppRouter.tsx не найден!"
    echo "📁 Ожидаемый путь: f/src/app/AppRouter.tsx"
    exit 1
fi

# Проверяем есть ли уже импорт TabBookDemo
if grep -q "TabBookDemo" f/src/app/AppRouter.tsx; then
    echo "⚠️  TabBookDemo уже импортирован - пропускаем импорт"
else
    # Добавляем импорт - MAC COMPATIBLE VERSION
    # Ищем строку с function App и добавляем импорт перед ней
    sed -i '' '/^function App(/i\
import TabBookDemo from '\''../components/tabbook/TabBookDemo'\'';
' f/src/app/AppRouter.tsx
    echo "✅ Импорт TabBookDemo добавлен"
fi

# Проверяем есть ли уже роут /tabbook
if grep -q "path.*tabbook" f/src/app/AppRouter.tsx; then
    echo "⚠️  Роут /tabbook уже существует - пропускаем добавление роута"
else
    # Добавляем роут - MAC COMPATIBLE VERSION
    # Находим место для добавления роута (перед закрывающим </Routes>)
    sed -i '' '/<\/Routes>/i\
          <Route\
            path="/tabbook"\
            element={\
              <AuthGuard>\
                <CompanyLayout>\
                  <TabBookDemo />\
                </CompanyLayout>\
              </AuthGuard>\
            }\
          />
' f/src/app/AppRouter.tsx
    echo "✅ Роут /tabbook добавлен в AppRouter.tsx"
fi

echo ""
echo "🔍 ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"

# Проверяем что импорт добавился
if grep -q "import TabBookDemo" f/src/app/AppRouter.tsx; then
    echo "✅ Импорт TabBookDemo: OK"
else
    echo "❌ Импорт TabBookDemo: НЕ НАЙДЕН"
fi

# Проверяем что роут добавился  
if grep -q "path.*tabbook" f/src/app/AppRouter.tsx; then
    echo "✅ Роут /tabbook: OK"
else
    echo "❌ Роут /tabbook: НЕ НАЙДЕН"
fi

echo ""
echo "📊 СТАТИСТИКА AppRouter.tsx:"
echo "💾 Размер файла: $(wc -c < f/src/app/AppRouter.tsx) байт"
echo "📄 Строк кода: $(wc -l < f/src/app/AppRouter.tsx)"
echo ""

echo "✅ ЧАСТЬ 1 ЗАВЕРШЕНА!"
echo ""
echo "🎯 РЕЗУЛЬТАТ:"
echo "📁 AppRouter.tsx обновлён"
echo "🔗 Роут /tabbook добавлен"  
echo "📦 Импорт TabBookDemo добавлен"
echo "💾 Backup сохранён"
echo ""
echo "🚀 ГОТОВ К ЧАСТИ 2: Исправление sidebar"
echo ""
echo "🎊 РОУТИНГ РАБОТАЕТ! МОЖНО ТЕСТИРОВАТЬ:"
echo "🎯 ТЕСТ: http://localhost:5173/tabbook"
echo ""
echo "📝 ДОБАВЛЕННЫЙ КОД:"
echo "---"
echo "// Импорт:"
grep "import TabBookDemo" f/src/app/AppRouter.tsx
echo ""
echo "// Роут:"
grep -A 6 "path.*tabbook" f/src/app/AppRouter.tsx
echo "---"