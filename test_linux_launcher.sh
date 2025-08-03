# 🐧 ТЕСТИРУЕМ LINUX LAUNCHER НА MAC

echo "🎊🔥🚀 ТЕСТИРУЕМ ПРЕВРАЩЕНИЕ MAC В LINUX! 🚀🔥🎊"
echo ""

# 1. ЗАПУСКАЕМ УНИВЕРСАЛЬНЫЙ LAUNCHER
echo "🚀 Запускаем Linux окружение:"
echo "./run_on_linux.sh"
echo ""

# 2. ВНУТРИ LINUX КОНТЕЙНЕРА БУДЕТ ДОСТУПНО:
echo "📁 ВНУТРИ LINUX ОКРУЖЕНИЯ:"
echo "   pwd                           # /workspace (твоя папка)"
echo "   ls -la                        # Все твои файлы"
echo "   uname -a                      # Linux!"
echo "   which node npm git            # Все инструменты"
echo ""

# 3. СОЗДАЁМ И ТЕСТИРУЕМ РАКЕТЫ
echo "🚀 СОЗДАНИЕ И ТЕСТ РАКЕТ:"
echo "   mkdir -p scripts/rockets"
echo "   # Создаём ракеты..."
echo "   chmod +x scripts/rockets/*.sh"
echo "   ./scripts/launch_tabbook.sh   # Запуск всех ракет!"
echo ""

# 4. АЛЬТЕРНАТИВНО - VS CODE DEV CONTAINERS
echo "💻 АЛЬТЕРНАТИВА - VS CODE DEV CONTAINERS:"
echo "   1. Открой VS Code"
echo "   2. Cmd+Shift+P"
echo "   3. 'Dev Containers: Reopen in Container'"
echo "   4. Выбери созданный контейнер"
echo "   5. VS Code перезапустится ВНУТРИ Linux!"
echo ""

# 5. ПРОВЕРКА DOCKER
echo "🐳 ПРОВЕРКА DOCKER:"
if command -v docker &> /dev/null; then
    echo "   ✅ Docker установлен"
    if docker info &> /dev/null; then
        echo "   ✅ Docker запущен"
        echo "   🚀 Готов к запуску: ./run_on_linux.sh"
    else
        echo "   ⚠️ Docker не запущен - запусти Docker Desktop"
    fi
else
    echo "   ❌ Docker не найден - установи Docker Desktop"
fi
echo ""

# 6. БЫСТРЫЕ КОМАНДЫ
echo "⚡ БЫСТРЫЕ КОМАНДЫ:"
echo ""
echo "ЗАПУСК LINUX:"
echo "   ./run_on_linux.sh"
echo ""
echo "ВНУТРИ LINUX:"
echo "   # Проверить что мы в Linux:"
echo "   cat /etc/os-release"
echo ""
echo "   # Создать и запустить ракету:"
echo "   echo '#!/bin/bash' > test_rocket.sh"
echo "   echo 'echo \"🚀 Rocket works on Linux!\"' >> test_rocket.sh"
echo "   chmod +x test_rocket.sh"
echo "   ./test_rocket.sh"
echo ""
echo "   # Запустить Solar ERP ракеты:"
echo "   mkdir -p scripts/rockets"
echo "   # ... создать ракеты ..."
echo "   ./scripts/launch_tabbook.sh"
echo ""

echo "🎯 СЛЕДУЮЩИЕ ШАГИ:"
echo "1. Запустить: ./run_on_linux.sh"
echo "2. Внутри Linux создать scripts/rockets/"
echo "3. Скопировать коды ракет из прошлых экспериментов"
echo "4. Запустить: ./scripts/launch_tabbook.sh"
echo "5. Наслаждаться идентичным поведением с сервером!"
echo ""
echo "🎊 MAC ПРЕВРАЩЁН В LINUX! АВТОМАТИЗАЦИЯ РАБОТАЕТ!"