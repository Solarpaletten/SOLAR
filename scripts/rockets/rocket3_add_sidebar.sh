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
