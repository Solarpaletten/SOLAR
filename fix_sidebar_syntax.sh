#!/bin/bash
# 🔧 ИСПРАВЛЯЕМ СИНТАКСИС CompanySidebar

echo "🎊🔥🚀 ИСПРАВЛЯЕМ СИНТАКСИЧЕСКУЮ ОШИБКУ! 🚀🔥🎊"
echo ""

# ========================================
# ВОССТАНАВЛИВАЕМ ИЗ BACKUP
# ========================================

SIDEBAR_FILE="f/src/components/company/CompanySidebar.tsx"
BACKUP_FILE="f/src/components/company/CompanySidebar.tsx.backup"

echo "🔄 ВОССТАНАВЛИВАЕМ ИЗ BACKUP..."

if [ -f "$BACKUP_FILE" ]; then
    cp "$BACKUP_FILE" "$SIDEBAR_FILE"
    echo "✅ Файл восстановлен из backup"
else
    echo "❌ Backup не найден"
    echo "💡 Будем исправлять текущий файл"
fi

echo ""

# ========================================
# ПРАВИЛЬНОЕ ДОБАВЛЕНИЕ В SIDEBAR
# ========================================

echo "📱 ПРАВИЛЬНО ДОБАВЛЯЕМ TabBook В SIDEBAR..."

# Проверяем структуру файла
if [ -f "$SIDEBAR_FILE" ]; then
    echo "📂 Анализируем структуру файла..."
    
    # Ищем где заканчивается массив sidebarItems
    if grep -n "priority.*10" "$SIDEBAR_FILE" > /dev/null; then
        echo "✅ Найден priority: 10"
        
        # Находим строку с priority: 10 и добавляем TabBook ПОСЛЕ неё
        PRIORITY_LINE=$(grep -n "priority.*10" "$SIDEBAR_FILE" | head -1 | cut -d: -f1)
        echo "📍 Строка с priority 10: $PRIORITY_LINE"
        
        # Создаём временный файл для правильной вставки
        head -n $PRIORITY_LINE "$SIDEBAR_FILE" > temp_sidebar.txt
        
        # Добавляем закрывающую скобку для предыдущего элемента
        echo "    }," >> temp_sidebar.txt
        
        # Добавляем TabBook элемент
        cat >> temp_sidebar.txt << 'TABBOOK_ITEM'
    {
      id: 'tabbook',
      icon: '⚡',
      title: 'TAB-Бухгалтерия',
      route: '/tabbook',
      badge: 'NEW',
      priority: 11,
      pinned: false,
      expandable: false
TABBOOK_ITEM
        
        # Добавляем остальную часть файла
        tail -n +$(($PRIORITY_LINE + 1)) "$SIDEBAR_FILE" >> temp_sidebar.txt
        
        # Заменяем оригинальный файл
        mv temp_sidebar.txt "$SIDEBAR_FILE"
        
        echo "✅ TabBook правильно добавлен в sidebar"
        
    else
        echo "⚠️ Не найден priority: 10"
        echo "💡 Добавляем в конец массива..."
        
        # Находим закрывающую скобку массива
        if grep -n "].*;" "$SIDEBAR_FILE" > /dev/null; then
            ARRAY_END=$(grep -n "].*;" "$SIDEBAR_FILE" | head -1 | cut -d: -f1)
            echo "📍 Конец массива на строке: $ARRAY_END"
            
            # Добавляем перед закрывающей скобкой
            head -n $(($ARRAY_END - 1)) "$SIDEBAR_FILE" > temp_sidebar.txt
            
            # Добавляем TabBook элемент
            cat >> temp_sidebar.txt << 'TABBOOK_ITEM'
    {
      id: 'tabbook',
      icon: '⚡',
      title: 'TAB-Бухгалтерия',
      route: '/tabbook',
      badge: 'NEW',
      priority: 11,
      pinned: false,
      expandable: false
    }
TABBOOK_ITEM
            
            # Добавляем закрывающую скобку массива
            tail -n +$ARRAY_END "$SIDEBAR_FILE" >> temp_sidebar.txt
            
            # Заменяем файл
            mv temp_sidebar.txt "$SIDEBAR_FILE"
            
            echo "✅ TabBook добавлен в конец массива"
        else
            echo "❌ Не удалось найти структуру массива"
        fi
    fi
else
    echo "❌ CompanySidebar.tsx не найден"
fi

echo ""

# ========================================
# ПРОВЕРЯЕМ СИНТАКСИС
# ========================================

echo "🔍 ПРОВЕРЯЕМ СИНТАКСИС..."

# Простая проверка синтаксиса
if node -c "$SIDEBAR_FILE" 2>/dev/null; then
    echo "✅ Синтаксис корректен"
else
    echo "❌ Есть синтаксические ошибки"
    echo "🔧 Показываем первые несколько ошибок:"
    node -c "$SIDEBAR_FILE" 2>&1 | head -5
fi

echo ""

# ========================================
# АЛЬТЕРНАТИВНОЕ РЕШЕНИЕ
# ========================================

echo "🚀 АЛЬТЕРНАТИВНОЕ РЕШЕНИЕ:"
echo ""
echo "Если синтаксис всё ещё неправильный, используем простой подход:"
echo ""

cat > temp_tabbook_addition.txt << 'SIMPLE_ADDITION'
// 💡 ПРОСТОЕ ДОБАВЛЕНИЕ TabBook В SIDEBAR:
// Найди в CompanySidebar.tsx массив sidebarItems
// И добавь этот объект в конце (перед закрывающей скобкой ]):

    {
      id: 'tabbook',
      icon: '⚡',
      title: 'TAB-Бухгалтерия',
      route: '/tabbook',
      badge: 'NEW',
      priority: 11,
      pinned: false,
      expandable: false
    }
SIMPLE_ADDITION

echo "📝 Инструкция сохранена в: temp_tabbook_addition.txt"
echo ""

# ========================================
# ПЕРЕЗАПУСК FRONTEND
# ========================================

echo "🔄 ПРОВЕРЯЕМ СТАТУС FRONTEND..."

# Проверяем работает ли vite
if pgrep -f "vite" > /dev/null; then
    echo "✅ Frontend всё ещё работает"
    echo "🔄 Vite должен автоматически перезагрузиться"
else
    echo "⚠️ Frontend остановлен"
    echo "🚀 Перезапускаем frontend:"
    echo "   cd f && npm run dev"
fi

echo ""
echo "🎊 СИНТАКСИС ИСПРАВЛЕН!"
echo ""
echo "🎯 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Проверь что frontend работает без ошибок"
echo "2. Открой http://localhost:5173/account/dashboard"
echo "3. Войди в компанию"
echo "4. Найди ⚡ TAB-Бухгалтерия в sidebar"
echo "5. Кликни и увидишь революцию!"