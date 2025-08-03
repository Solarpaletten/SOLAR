#!/bin/bash
# 🐳 БЫСТРЫЙ ЗАПУСК DOCKER ДЛЯ LINUX

echo "🎊🔥🚀 БЫСТРЫЙ ПЕРЕХОД MAC → LINUX! 🚀🔥🎊"
echo ""

# ========================================
# ПРОВЕРКА DOCKER
# ========================================

echo "🔍 ПРОВЕРЯЕМ DOCKER:"

if command -v docker &> /dev/null; then
    echo "✅ Docker установлен"
    
    if docker info &> /dev/null 2>&1; then
        echo "✅ Docker запущен и готов"
        DOCKER_READY=true
    else
        echo "⚠️ Docker не запущен"
        echo "💡 Запусти Docker Desktop и попробуй снова"
        echo ""
        echo "🎯 КОМАНДЫ:"
        echo "   1. Открой Docker Desktop"
        echo "   2. Дождись запуска (зелёный значок)"
        echo "   3. Запусти этот скрипт снова"
        DOCKER_READY=false
    fi
else
    echo "❌ Docker не установлен"
    echo "💡 Установи Docker Desktop: https://www.docker.com/products/docker-desktop/"
    DOCKER_READY=false
fi

echo ""

# ========================================
# АЛЬТЕРНАТИВА: ПРЯМО НА MAC
# ========================================

if [ "$DOCKER_READY" != true ]; then
    echo "💻 АЛЬТЕРНАТИВА: ЗАПУСК НА MAC"
    echo ""
    echo "🎯 Можем запустить ракеты прямо на Mac:"
    echo ""
    
    # Проверяем что у нас есть всё необходимое
    if [ -d "f" ] && [ -d "b" ]; then
        echo "✅ Папки f/ и b/ найдены"
        
        if command -v node &> /dev/null && command -v npm &> /dev/null; then
            echo "✅ Node.js и npm готовы"
            echo ""
            echo "🚀 ГОТОВ К ЗАПУСКУ НА MAC:"
            echo "   ./scripts/launch_tabbook.sh"
            echo ""
            
            # Создаём ракеты если их нет
            if [ ! -d "scripts/rockets" ]; then
                echo "📁 Создаём scripts/rockets/..."
                mkdir -p scripts/rockets
                echo "✅ Папка создана"
            fi
            
            MAC_READY=true
        else
            echo "❌ Node.js или npm не найдены"
            MAC_READY=false
        fi
    else
        echo "❌ Папки f/ и b/ не найдены"
        MAC_READY=false
    fi
else
    MAC_READY=false
fi

echo ""

# ========================================
# ПРОСТОЙ DOCKER ЗАПУСК
# ========================================

if [ "$DOCKER_READY" = true ]; then
    echo "🐳 ЗАПУСКАЕМ LINUX В DOCKER:"
    echo ""
    
    echo "📋 Команда для запуска:"
    echo "docker run -it --rm \\"
    echo "  -v \$(pwd):/workspace \\"
    echo "  -w /workspace \\"
    echo "  -p 5173:5173 -p 4000:4000 \\"
    echo "  node:18-alpine \\"
    echo "  sh -c 'apk add --no-cache bash git && exec bash'"
    echo ""
    
    echo "🎯 Хочешь запустить? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🚀 Запускаем Linux контейнер..."
        
        docker run -it --rm \
          -v $(pwd):/workspace \
          -w /workspace \
          -p 5173:5173 -p 4000:4000 \
          node:18-alpine \
          sh -c "
            echo '🐧 Устанавливаем инструменты...'
            apk add --no-cache bash git
            echo '✅ Linux готов!'
            echo '📁 Текущая папка: '\$(pwd)
            echo '🐧 OS: '\$(cat /etc/os-release | head -1)
            echo '🎯 Для проверки запусти: ls -la'
            echo '🚀 Для запуска ракет: ./scripts/launch_tabbook.sh'
            exec bash
          "
    fi

elif [ "$MAC_READY" = true ]; then
    echo "💻 ЗАПУСКАЕМ НА MAC:"
    echo ""
    
    echo "🎯 Хочешь запустить ракеты на Mac? (y/n)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🚀 Запускаем на Mac..."
        
        # Проверяем есть ли launcher
        if [ -f "scripts/launch_tabbook.sh" ]; then
            echo "✅ Launcher найден"
            chmod +x scripts/launch_tabbook.sh
            ./scripts/launch_tabbook.sh
        else
            echo "⚠️ Launcher не найден"
            echo "💡 Создаём минимальный launcher..."
            
            mkdir -p scripts
            cat > scripts/launch_tabbook.sh << 'EOF'
#!/bin/bash
echo "🚀 TabBook Launcher на Mac"
echo "💡 Создаём базовый TabBook компонент..."

mkdir -p f/src/components/tabbook
cat > f/src/components/tabbook/TabBookDemo.tsx << 'COMPONENT_EOF'
import React from 'react';

const TabBookDemo = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🔥 TabBook MVP</h1>
      <p className="text-xl">TAB-Бухгалтерия работает на Mac!</p>
    </div>
  );
};

export default TabBookDemo;
COMPONENT_EOF

echo "✅ TabBookDemo.tsx создан!"
echo "🎯 Следующий шаг: добавить в роутинг"
EOF
            
            chmod +x scripts/launch_tabbook.sh
            ./scripts/launch_tabbook.sh
        fi
    fi

else
    echo "❌ Нужно настроить окружение"
    echo ""
    echo "🎯 ВАРИАНТЫ:"
    echo "1. Установить и запустить Docker Desktop"
    echo "2. Убедиться что папки f/ и b/ существуют"
    echo "3. Установить Node.js если нужно"
fi

echo ""
echo "🎊 ГОТОВ К СЛЕДУЮЩЕМУ ШАГУ!"