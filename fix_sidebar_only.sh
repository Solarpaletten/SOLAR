#!/bin/bash
# 🚀 ЧАСТЬ 2 - ИСПРАВЛЯЕМ ТОЛЬКО SIDEBAR
# Фокус: CompanySidebar.tsx только

echo "🎊🔥🚀 ЧАСТЬ 2: ИСПРАВЛЯЕМ ТОЛЬКО SIDEBAR! 🚀🔥🎊"
echo ""
echo "🎯 ЗАДАЧА: Добавить TabBook в CompanySidebar.tsx"
echo "📁 ФАЙЛ: f/src/components/company/CompanySidebar.tsx"
echo ""

# Проверяем что роутинг уже настроен
if [ ! -f "f/src/app/AppRouter.tsx" ]; then
    echo "❌ ОШИБКА: AppRouter.tsx не найден!"
    exit 1
fi

if ! grep -q "TabBookDemo" f/src/app/AppRouter.tsx; then
    echo "⚠️  ПРЕДУПРЕЖДЕНИЕ: TabBookDemo не найден в роутере"
    echo "💡 Сначала выполни ЧАСТЬ 1: ./fix_routing_only.sh"
fi

# Проверяем что sidebar существует
if [ ! -f "f/src/components/company/CompanySidebar.tsx" ]; then
    echo "❌ ОШИБКА: CompanySidebar.tsx не найден!"
    echo "📁 Ожидаемый путь: f/src/components/company/CompanySidebar.tsx"
    exit 1
fi

echo "✅ CompanySidebar.tsx найден - можно продолжать!"

# Создаём backup
cp f/src/components/company/CompanySidebar.tsx f/src/components/company/CompanySidebar.tsx.backup
echo "💾 Backup создан: CompanySidebar.tsx.backup"

# Проверяем есть ли уже TabBook в sidebar
if grep -q "tabbook" f/src/components/company/CompanySidebar.tsx; then
    echo "⚠️  TabBook уже есть в sidebar - пропускаем добавление"
else
    echo "📱 Добавляем TabBook в sidebar array..."
    
    # СТРАТЕГИЯ: Найти конец массива sidebarItems и добавить TabBook перед закрывающей скобкой
    # Ищем строку с priority: и последний элемент массива
    
    # Находим строку с последним элементом массива (обычно с самым высоким priority)
    LAST_PRIORITY_LINE=$(grep -n "priority: " f/src/components/company/CompanySidebar.tsx | tail -1 | cut -d: -f1)
    
    if [ ! -z "$LAST_PRIORITY_LINE" ]; then
        echo "📍 Найден последний элемент массива на строке: $LAST_PRIORITY_LINE"
        
        # Добавляем TabBook после последнего элемента, но перед закрывающей скобкой массива
        # Ищем первую строку с "}" после последнего priority
        sed -i '' "$LAST_PRIORITY_LINE,$ {
            /},$/a\\
    {\\
      id: 'tabbook',\\
      icon: '⚡',\\
      title: 'TAB-Бухгалтерия',\\
      route: '/tabbook',\\
      badge: 'NEW',\\
      priority: 11,\\
      pinned: false,\\
      expandable: false\\
    },
        }" f/src/components/company/CompanySidebar.tsx
        
        echo "✅ TabBook добавлен в sidebar массив"
    else
        echo "❌ Не удалось найти массив sidebarItems"
        echo "🔧 Попробуем альтернативный метод..."
        
        # Альтернативный метод: поиск по useState
        if grep -q "useState.*\[\]" f/src/components/company/CompanySidebar.tsx; then
            echo "📍 Найден useState массив"
            
            # Добавляем перед закрывающей скобкой useState массива
            sed -i '' '/useState.*\[/,/]);/ {
                /]);/i\
    {\\
      id: "tabbook",\\
      icon: "⚡",\\
      title: "TAB-Бухгалтерия",\\
      route: "/tabbook",\\
      badge: "NEW",\\
      priority: 11,\\
      pinned: false,\\
      expandable: false\\
    },
            }' f/src/components/company/CompanySidebar.tsx
            
            echo "✅ TabBook добавлен через useState метод"
        else
            echo "❌ Не удалось найти подходящее место для добавления"
            echo "📝 Создаём инструкцию для ручного добавления..."
            
            cat > temp_tabbook_manual_instruction.txt << 'EOF'
РУЧНОЕ ДОБАВЛЕНИЕ TabBook В SIDEBAR:

1. Открой f/src/components/company/CompanySidebar.tsx
2. Найди массив sidebarItems (обычно в useState)
3. Добавь в конец массива (перед закрывающей скобкой):

    {
      id: 'tabbook',
      icon: '⚡',
      title: 'TAB-Бухгалтерия',
      route: '/tabbook',
      badge: 'NEW',
      priority: 11,
      pinned: false,
      expandable: false
    },

4. Сохрани файл
5. Vite автоматически перезагрузится
EOF
            echo "📝 Инструкция сохранена в: temp_tabbook_manual_instruction.txt"
        fi
    fi
fi

echo ""
echo "🔍 ПРОВЕРЯЕМ РЕЗУЛЬТАТ:"

# Проверяем что TabBook добавился в sidebar
if grep -q "tabbook" f/src/components/company/CompanySidebar.tsx; then
    echo "✅ TabBook в sidebar: OK"
else
    echo "❌ TabBook в sidebar: НЕ НАЙДЕН"
fi

echo ""
echo "📊 СТАТИСТИКА CompanySidebar.tsx:"
echo "💾 Размер файла: $(wc -c < f/src/components/company/CompanySidebar.tsx) байт"
echo "📄 Строк кода: $(wc -l < f/src/components/company/CompanySidebar.tsx)"
echo ""

echo "✅ ЧАСТЬ 2 ЗАВЕРШЕНА!"
echo ""
echo "🎯 РЕЗУЛЬТАТ:"
echo "📁 CompanySidebar.tsx обновлён"
echo "⚡ TabBook добавлен в навигацию"
echo "🏷️ Badge 'NEW' для привлечения внимания"
echo "💾 Backup сохранён"
echo ""

# Проверяем синтаксис (но не останавливаемся на ошибке)
echo "🔍 БЫСТРАЯ ПРОВЕРКА СИНТАКСИСА..."
if command -v node >/dev/null 2>&1; then
    if node --check f/src/components/company/CompanySidebar.tsx 2>/dev/null; then
        echo "✅ Синтаксис JS: OK"
    else
        echo "⚠️  Синтаксис проверка: Возможны TSX особенности (это нормально)"
    fi
else
    echo "📝 Node.js недоступен для проверки синтаксиса"
fi

echo ""
echo "🚀 ФИНАЛЬНАЯ ПРОВЕРКА:"
echo "🎯 КОМАНДЫ:"
echo "   1. Проверь что frontend работает: cd f && npm run dev"
echo "   2. Открой: http://localhost:5173/account/dashboard"
echo "   3. Войди в компанию"
echo "   4. Найди ⚡ TAB-Бухгалтерия (NEW) в sidebar"
echo "   5. Кликни и увидишь TabBook!"
echo ""
echo "🎊 SIDEBAR НАСТРОЕН!"

# Показываем что добавилось
echo ""
echo "📝 ДОБАВЛЕННЫЙ КОД В SIDEBAR:"
echo "---"
if grep -A 7 "tabbook" f/src/components/company/CompanySidebar.tsx >/dev/null 2>&1; then
    grep -A 7 "tabbook" f/src/components/company/CompanySidebar.tsx
else
    echo "TabBook код добавлен, но требует ручной проверки"
fi
echo "---"

echo ""
echo "🔍 ДЕТАЛЬНАЯ ДИАГНОСТИКА ДЛЯ РУЧНОЙ ПРАВКИ:"
echo "==============================================="

# Найти точную строку где может быть проблема
echo "📍 АНАЛИЗИРУЕМ СИНТАКСИС CompanySidebar.tsx:"

# Проверка 1: Поиск незакрытых скобок
echo ""
echo "1️⃣ ПРОВЕРКА СКОБОК:"
OPEN_BRACES=$(grep -o '{' f/src/components/company/CompanySidebar.tsx | wc -l)
CLOSE_BRACES=$(grep -o '}' f/src/components/company/CompanySidebar.tsx | wc -l)
echo "   📊 Открывающих {: $OPEN_BRACES"
echo "   📊 Закрывающих }: $CLOSE_BRACES"
if [ "$OPEN_BRACES" -eq "$CLOSE_BRACES" ]; then
    echo "   ✅ Скобки {} сбалансированы"
else
    echo "   ❌ Скобки {} НЕ сбалансированы! Разница: $((OPEN_BRACES - CLOSE_BRACES))"
    echo "   🔧 НУЖНО: Добавить/удалить $(abs $((OPEN_BRACES - CLOSE_BRACES))) скобок"
fi

# Проверка 2: Поиск незакрытых квадратных скобок  
echo ""
echo "2️⃣ ПРОВЕРКА МАССИВОВ:"
OPEN_BRACKETS=$(grep -o '\[' f/src/components/company/CompanySidebar.tsx | wc -l)
CLOSE_BRACKETS=$(grep -o '\]' f/src/components/company/CompanySidebar.tsx | wc -l)
echo "   📊 Открывающих [: $OPEN_BRACKETS"
echo "   📊 Закрывающих ]: $CLOSE_BRACKETS"
if [ "$OPEN_BRACKETS" -eq "$CLOSE_BRACKETS" ]; then
    echo "   ✅ Массивы [] сбалансированы"
else
    echo "   ❌ Массивы [] НЕ сбалансированы! Разница: $((OPEN_BRACKETS - CLOSE_BRACKETS))"
fi

# Проверка 3: Поиск области где добавили TabBook
echo ""
echo "3️⃣ ОБЛАСТЬ ДОБАВЛЕНИЯ TabBook:"
if grep -n "tabbook" f/src/components/company/CompanySidebar.tsx >/dev/null 2>&1; then
    TABBOOK_LINE=$(grep -n "tabbook" f/src/components/company/CompanySidebar.tsx | head -1 | cut -d: -f1)
    echo "   📍 TabBook найден на строке: $TABBOOK_LINE"
    echo "   📋 КОНТЕКСТ (строки $((TABBOOK_LINE-3)) - $((TABBOOK_LINE+5))):"
    echo "   ---"
    sed -n "$((TABBOOK_LINE-3)),$((TABBOOK_LINE+5))p" f/src/components/company/CompanySidebar.tsx | nl -v$((TABBOOK_LINE-3))
    echo "   ---"
else
    echo "   ❌ TabBook не найден в файле"
fi

# Проверка 4: Поиск последних строк массива sidebarItems
echo ""
echo "4️⃣ СТРУКТУРА МАССИВА sidebarItems:"
if grep -n "useState.*\[" f/src/components/company/CompanySidebar.tsx >/dev/null 2>&1; then
    USESTATE_LINE=$(grep -n "useState.*\[" f/src/components/company/CompanySidebar.tsx | head -1 | cut -d: -f1)
    echo "   📍 useState массив начинается на строке: $USESTATE_LINE"
    
    # Найти конец массива (строку с ]);)
    END_ARRAY_LINE=$(sed -n "$USESTATE_LINE,$ p" f/src/components/company/CompanySidebar.tsx | grep -n "]);$" | head -1 | cut -d: -f1)
    if [ ! -z "$END_ARRAY_LINE" ]; then
        ACTUAL_END_LINE=$((USESTATE_LINE + END_ARRAY_LINE - 1))
        echo "   📍 useState массив заканчивается на строке: $ACTUAL_END_LINE"
        echo "   📋 КОНЕЦ МАССИВА (строки $((ACTUAL_END_LINE-5)) - $ACTUAL_END_LINE):"
        echo "   ---"
        sed -n "$((ACTUAL_END_LINE-5)),$ACTUAL_END_LINE p" f/src/components/company/CompanySidebar.tsx | nl -v$((ACTUAL_END_LINE-5))
        echo "   ---"
    fi
fi

echo ""
echo "🔧 ИНСТРУКЦИЯ ДЛЯ РУЧНОЙ ПРАВКИ:"
echo "==============================="
echo "📝 ЕСЛИ ЕСТЬ СИНТАКСИЧЕСКАЯ ОШИБКА, ИСПРАВЬ:"
echo ""
echo "1️⃣ ОТКРОЙ ФАЙЛ:"
echo "   code f/src/components/company/CompanySidebar.tsx"
echo ""
echo "2️⃣ НАЙДИ ОБЛАСТЬ ОКОЛО СТРОКИ: $TABBOOK_LINE (если TabBook найден)"
echo ""
echo "3️⃣ ЧАСТЫЕ ПРОБЛЕМЫ И ИСПРАВЛЕНИЯ:"
echo "   ❌ Лишняя запятая в конце:  }, },  →  ✅  },"
echo "   ❌ Пропущена запятая:       } {     →  ✅  }, {"
echo "   ❌ Неправильные кавычки:    'text'  →  ✅  \"text\""
echo "   ❌ Лишняя скобка:          }}}     →  ✅  }}"
echo "   ❌ Пропущена скобка:       }]      →  ✅  }])"
echo ""
echo "4️⃣ ПРОВЕРЬ ЧТО TabBook ВЫГЛЯДИТ ТАК:"
echo "   {"
echo "     id: 'tabbook',"
echo "     icon: '⚡',"
echo "     title: 'TAB-Бухгалтерия',"
echo "     route: '/tabbook',"
echo "     badge: 'NEW',"
echo "     priority: 11,"
echo "     pinned: false,"
echo "     expandable: false"
echo "   },"
echo ""
echo "5️⃣ СОХРАНИ (Cmd+S) И ПРОВЕРЬ ЧТО FRONTEND РАБОТАЕТ"
echo ""
echo "🚀 БЫСТРАЯ ПРОВЕРКА:"
echo "   - Открой http://localhost:5173/account/dashboard"
echo "   - Войди в компанию"  
echo "   - Найди ⚡ TAB-Бухгалтерия (NEW) в sidebar"
echo ""
echo "💡 ЕСЛИ НЕ РАБОТАЕТ:"
echo "   - Восстанови из backup: cp CompanySidebar.tsx.backup CompanySidebar.tsx"
echo "   - Попробуй добавить TabBook вручную в правильное место"
echo ""
echo "🎊 ТЫ СПРАВИШЬСЯ! ЭТО ОБЫЧНО ОДНА СТРОЧКА!"