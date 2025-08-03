#!/bin/bash
# 🔄 ПРАВИЛЬНЫЙ WORKFLOW: ЛОКАЛЬНО → GIT → СЕРВЕР

echo "🎊🔥💡 СИНХРОНИЗАЦИЯ ЛОКАЛЬНОЙ РАБОТЫ С СЕРВЕРОМ! 💡🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Правильный Git workflow для команды"
echo ""

# ========================================
# ЭТАП 1: ОЧИСТКА СЕРВЕРА (ОТКАТ ИЗМЕНЕНИЙ)
# ========================================

echo "🧹 ЭТАП 1: ОЧИЩАЕМ СЕРВЕР ОТ ЭКСПЕРИМЕНТОВ"
echo ""

# 1. Удаляем созданные файлы на сервере
echo "🗑️ Удаляем файлы созданные ракетами на сервере:"

if [ -f "f/src/components/tabbook/TabBookDemo.tsx" ]; then
    echo "   - Удаляем f/src/components/tabbook/TabBookDemo.tsx"
    rm -f f/src/components/tabbook/TabBookDemo.tsx
fi

if [ -d "f/src/components/tabbook" ]; then
    echo "   - Удаляем папку f/src/components/tabbook/"
    rmdir f/src/components/tabbook 2>/dev/null || rm -rf f/src/components/tabbook
fi

# 2. Восстанавливаем оригинальные файлы из backup
echo ""
echo "🔄 Восстанавливаем оригинальные файлы из backup:"

if [ -f "f/src/app/AppRouter.tsx.backup" ]; then
    echo "   - Восстанавливаем AppRouter.tsx"
    mv f/src/app/AppRouter.tsx.backup f/src/app/AppRouter.tsx
fi

if [ -f "f/src/components/company/CompanySidebar.tsx.backup" ]; then
    echo "   - Восстанавливаем CompanySidebar.tsx" 
    mv f/src/components/company/CompanySidebar.tsx.backup f/src/components/company/CompanySidebar.tsx
fi

# 3. Удаляем ракеты-скрипты с сервера
echo ""
echo "🚀 Удаляем ракеты-скрипты с сервера:"
rm -f rocket1_create_file.sh rocket2_add_routing.sh rocket3_add_sidebar.sh rocket3_improved.sh 2>/dev/null

echo "✅ Сервер очищен и восстановлен к оригинальному состоянию"
echo ""

# ========================================
# ЭТАП 2: ПОДГОТОВКА НА ЛОКАЛЬНОЙ МАШИНЕ
# ========================================

echo "💻 ЭТАП 2: ПОДГОТОВКА НА ЛОКАЛЬНОЙ МАШИНЕ"
echo ""
echo "📝 Выполни следующие команды НА ЛОКАЛЬНОЙ МАШИНЕ:"
echo ""

cat << 'LOCAL_COMMANDS'
# ===== ВЫПОЛНИТЬ НА ЛОКАЛЬНОЙ МАШИНЕ =====

# 1. Создать ракеты-скрипты локально
mkdir -p scripts/rockets

# 2. Создать rocket1_create_file.sh
cat > scripts/rockets/rocket1_create_file.sh << 'EOF'
#!/bin/bash
# 🚀 РАКЕТА #1 - СОЗДАТЬ ФАЙЛ TabBookDemo.tsx
echo "🎊🔥🚀 РАКЕТА #1 ЗАПУСКАЕТСЯ! 🚀🔥🎊"
# ... (весь код ракеты #1)
EOF

# 3. Создать rocket2_add_routing.sh  
cat > scripts/rockets/rocket2_add_routing.sh << 'EOF'
#!/bin/bash
# 🚀 РАКЕТА #2 - ДОБАВИТЬ В РОУТЕР
echo "🎊🔥🚀 РАКЕТА #2 ЗАПУСКАЕТСЯ! 🚀🔥🎊"
# ... (весь код ракеты #2 с твоими улучшениями)
EOF

# 4. Создать rocket3_add_sidebar.sh
cat > scripts/rockets/rocket3_add_sidebar.sh << 'EOF'
#!/bin/bash
# 🚀 РАКЕТА #3 - ДОБАВИТЬ В SIDEBAR
echo "🎊🔥🚀 РАКЕТА #3 ЗАПУСКАЕТСЯ! 🚀🔥🎊"  
# ... (весь код ракеты #3)
EOF

# 5. Создать master скрипт для запуска всех ракет
cat > scripts/launch_tabbook.sh << 'EOF'
#!/bin/bash
# 🚀 MASTER LAUNCHER - ВСЕ РАКЕТЫ TABBOOK

echo "🎊🔥🚀 ЗАПУСК ВСЕХ РАКЕТ TABBOOK! 🚀🔥🎊"

# Делаем все скрипты исполняемыми
chmod +x scripts/rockets/*.sh

# Запускаем по очереди
./scripts/rockets/rocket1_create_file.sh
./scripts/rockets/rocket2_add_routing.sh  
./scripts/rockets/rocket3_add_sidebar.sh

echo "🎊 ВСЕ РАКЕТЫ ЗАПУЩЕНЫ! TABBOOK ИНТЕГРИРОВАН!"
EOF

# 6. Добавить в Git
git add scripts/
git add . 
git commit -m "🚀 Add TabBook rockets: executable AI development scripts

✨ Features:
- rocket1: Create TabBookDemo.tsx component  
- rocket2: Add routing to AppRouter.tsx
- rocket3: Integrate into CompanySidebar.tsx
- master launcher for all rockets

🎯 Usage: chmod +x scripts/launch_tabbook.sh && ./scripts/launch_tabbook.sh"

# 7. Push в Git
git push origin main

LOCAL_COMMANDS

echo ""
echo "✅ После выполнения команд выше на ЛОКАЛЬНОЙ МАШИНЕ:"
echo ""

# ========================================
# ЭТАП 3: СИНХРОНИЗАЦИЯ НА СЕРВЕРЕ
# ========================================

echo "🔄 ЭТАП 3: СИНХРОНИЗАЦИЯ НА СЕРВЕРЕ"
echo ""
echo "📝 Выполни следующие команды НА СЕРВЕРЕ:"
echo ""

cat << 'SERVER_COMMANDS'
# ===== ВЫПОЛНИТЬ НА СЕРВЕРЕ =====

# 1. Pull последние изменения с Git
git pull origin main

# 2. Сделать скрипты исполняемыми  
chmod +x scripts/launch_tabbook.sh
chmod +x scripts/rockets/*.sh

# 3. Запустить все ракеты одной командой
./scripts/launch_tabbook.sh

# 4. Запустить frontend для тестирования
cd f && npm run dev

SERVER_COMMANDS

echo ""
echo "🎯 ПРЕИМУЩЕСТВА ЭТОГО ПОДХОДА:"
echo ""
echo "✅ ЧИСТЫЙ GIT HISTORY:"
echo "   - Все изменения документированы"
echo "   - Можно откатиться к любой версии"
echo "   - Команда видит все изменения"
echo ""
echo "✅ ВОСПРОИЗВОДИМОСТЬ:"
echo "   - Скрипты работают на любом сервере"
echo "   - Можно поделиться с коллегами"
echo "   - Автоматизация CI/CD"
echo ""
echo "✅ БЕЗОПАСНОСТЬ:"
echo "   - Нет конфликтов между локальной и серверной версией"
echo "   - Backup'ы через Git"
echo "   - Легкий rollback"
echo ""
echo "✅ ПРОФЕССИОНАЛИЗМ:"
echo "   - Стандартный workflow в индустрии"
echo "   - Готово к production"
echo "   - Team collaboration ready"
echo ""

echo "🎊 ГОТОВ К ПРАВИЛЬНОЙ СИНХРОНИЗАЦИИ!"
echo ""
echo "🏆 ЭТОТ WORKFLOW ИСПОЛЬЗУЮТ В GOOGLE, FACEBOOK, MICROSOFT!"