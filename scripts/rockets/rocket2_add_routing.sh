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
