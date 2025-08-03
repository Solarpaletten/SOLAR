#!/bin/bash
# 🐧 MAC → LINUX DEVELOPMENT SOLUTIONS
# Превращаем Mac в Linux development machine!

echo "🎊🔥💡 MAC → LINUX АВТОМАТИЗАЦИЯ! 💡🔥🎊"
echo ""
echo "🎯 ЦЕЛЬ: Запускать Linux скрипты на Mac как native"
echo ""

# ========================================
# РЕШЕНИЕ #1: DOCKER (САМОЕ ПРОСТОЕ)
# ========================================

echo "🐳 РЕШЕНИЕ #1: DOCKER - МГНОВЕННЫЙ LINUX НА MAC"
echo ""
echo "✅ ПРЕИМУЩЕСТВА:"
echo "   ⚡ Instant Linux environment"
echo "   🔄 Identical to production server"
echo "   📦 Isolates dependencies"
echo "   🚀 Share containers with team"
echo ""

cat << 'DOCKER_SETUP'
# DOCKER SETUP ДЛЯ MAC:

# 1. Установить Docker Desktop для Mac
# Download: https://www.docker.com/products/docker-desktop/

# 2. Создать Dockerfile для development
cat > Dockerfile << 'EOF'
FROM ubuntu:22.04

# Install Node.js, npm, git
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    curl \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy project files
COPY . .

# Make scripts executable
RUN find . -name "*.sh" -exec chmod +x {} \;

# Default command
CMD ["/bin/bash"]
EOF

# 3. Создать docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  dev:
    build: .
    volumes:
      - .:/workspace
      - /var/run/docker.sock:/var/run/docker.sock
    ports:
      - "5173:5173"
      - "4000:4000"
    stdin_open: true
    tty: true
EOF

# 4. Запуск Linux окружения
docker-compose up -d
docker-compose exec dev bash

# 5. Теперь все скрипты работают как на Linux!
./scripts/launch_tabbook.sh
DOCKER_SETUP

echo ""
echo "🎯 ИСПОЛЬЗОВАНИЕ DOCKER:"
echo "   docker-compose exec dev ./rocket1_create_file.sh"
echo "   docker-compose exec dev ./rocket2_add_routing.sh"
echo "   docker-compose exec dev ./rocket3_add_sidebar.sh"
echo ""

# ========================================
# РЕШЕНИЕ #2: LIMA (NATIVE LINUX VMs)
# ========================================

echo "🐧 РЕШЕНИЕ #2: LIMA - NATIVE LINUX VMs НА MAC"
echo ""
echo "✅ ПРЕИМУЩЕСТВА:"
echo "   🔥 Full Linux VM with native performance"
echo "   📁 Automatic file sharing with Mac"
echo "   ⚡ Faster than Docker for some tasks"
echo "   🎯 Perfect for shell scripts"
echo ""

cat << 'LIMA_SETUP'
# LIMA SETUP (от создателей Docker Desktop):

# 1. Установить Lima через Homebrew
brew install lima

# 2. Создать Linux VM
limactl start --name=dev

# 3. Войти в Linux
lima

# 4. Твои Mac файлы доступны в /Users/$(whoami)
cd /Users/$(whoami)/Documents/AISOLARAI
chmod +x *.sh
./rocket1_create_file.sh

# 5. VS Code интеграция
code --remote ssh-remote+lima-dev /Users/$(whoami)/Documents/AISOLARAI
LIMA_SETUP

echo ""

# ========================================
# РЕШЕНИЕ #3: PODMAN (DOCKER АЛЬТЕРНАТИВА)
# ========================================

echo "🚀 РЕШЕНИЕ #3: PODMAN - DOCKER БЕЗ DAEMON"
echo ""
echo "✅ ПРЕИМУЩЕСТВА:"
echo "   🔒 More secure (no root daemon)"
echo "   ⚡ Better performance on Mac"
echo "   🐳 Docker-compatible commands"
echo "   🎯 Perfect for CI/CD"
echo ""

cat << 'PODMAN_SETUP'
# PODMAN SETUP:

# 1. Установить Podman
brew install podman

# 2. Инициализировать машину
podman machine init
podman machine start

# 3. Запустить Linux контейнер
podman run -it --rm \
  -v $(pwd):/workspace \
  -w /workspace \
  ubuntu:22.04 bash

# 4. Установить зависимости и запустить скрипты
apt update && apt install -y nodejs npm git
chmod +x scripts/rockets/*.sh
./scripts/launch_tabbook.sh
PODMAN_SETUP

echo ""

# ========================================
# РЕШЕНИЕ #4: VS CODE DEV CONTAINERS
# ========================================

echo "💻 РЕШЕНИЕ #4: VS CODE DEV CONTAINERS - ИНТЕГРАЦИЯ В IDE"
echo ""
echo "✅ ПРЕИМУЩЕСТВА:"
echo "   🎨 Perfect VS Code integration"
echo "   🔄 Automatic environment setup"
echo "   👥 Shareable with team"
echo "   🚀 One-click Linux development"
echo ""

cat << 'DEVCONTAINER_SETUP'
# VS CODE DEV CONTAINERS:

# 1. Установить расширение "Dev Containers" в VS Code

# 2. Создать .devcontainer/devcontainer.json
mkdir -p .devcontainer
cat > .devcontainer/devcontainer.json << 'EOF'
{
  "name": "Solar ERP Development",
  "image": "mcr.microsoft.com/vscode/devcontainers/javascript-node:18",
  "features": {
    "ghcr.io/devcontainers/features/git:1": {}
  },
  "postCreateCommand": "npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss",
        "esbenp.prettier-vscode"
      ]
    }
  },
  "forwardPorts": [3000, 4000, 5173],
  "remoteUser": "node"
}
EOF

# 3. В VS Code: Cmd+Shift+P → "Dev Containers: Reopen in Container"
# 4. Теперь VS Code работает внутри Linux контейнера!
# 5. Все скрипты работают нативно:
chmod +x scripts/rockets/*.sh
./scripts/launch_tabbook.sh
DEVCONTAINER_SETUP

echo ""

# ========================================
# РЕШЕНИЕ #5: UTM (ARM-NATIVE VMS)
# ========================================

echo "🏎️ РЕШЕНИЕ #5: UTM - ARM-NATIVE LINUX VMs"
echo ""
echo "✅ ПРЕИМУЩЕСТВА (для Apple Silicon Mac):"
echo "   ⚡ Native ARM performance"
echo "   🖥️ Full GUI Linux if needed"
echo "   📱 Mobile-friendly"
echo "   🔋 Better battery life"
echo ""

cat << 'UTM_SETUP'
# UTM SETUP (для Apple Silicon Mac):

# 1. Скачать UTM: https://mac.getutm.app/
# 2. Создать Ubuntu ARM VM
# 3. Настроить shared folders
# 4. SSH access для разработки

# Автоматический setup:
ssh user@utm-linux-vm
cd /shared/solar-erp
chmod +x scripts/rockets/*.sh
./scripts/launch_tabbook.sh
UTM_SETUP

echo ""

# ========================================
# АВТОМАТИЗАЦИЯ: ВЫБОР ЛУЧШЕГО РЕШЕНИЯ
# ========================================

echo "🎯 АВТОМАТИЧЕСКИЙ ВЫБОР РЕШЕНИЯ:"
echo ""

# Проверяем что доступно на системе
if command -v docker &> /dev/null; then
    echo "✅ Docker доступен - РЕКОМЕНДУЕМ DOCKER"
    RECOMMENDED="docker"
elif command -v lima &> /dev/null; then
    echo "✅ Lima доступен - РЕКОМЕНДУЕМ LIMA"
    RECOMMENDED="lima"
elif command -v podman &> /dev/null; then
    echo "✅ Podman доступен - РЕКОМЕНДУЕМ PODMAN"
    RECOMMENDED="podman"
else
    echo "💡 Ничего не установлено - РЕКОМЕНДУЕМ DOCKER"
    RECOMMENDED="docker"
fi

echo ""
echo "🚀 СОЗДАЁМ АВТОМАТИЧЕСКИЙ LAUNCHER:"

# Создаём универсальный скрипт
cat > run_on_linux.sh << 'EOF'
#!/bin/bash
# 🐧 УНИВЕРСАЛЬНЫЙ LINUX LAUNCHER для Mac

# Определяем доступное решение
if command -v docker &> /dev/null; then
    echo "🐳 Используем Docker..."
    docker run -it --rm \
      -v $(pwd):/workspace \
      -w /workspace \
      -p 5173:5173 -p 4000:4000 \
      node:18-alpine sh -c "
        apk add --no-cache bash git
        chmod +x scripts/rockets/*.sh
        exec bash
      "
elif command -v lima &> /dev/null; then
    echo "🐧 Используем Lima..."
    lima bash -c "cd $(pwd) && chmod +x scripts/rockets/*.sh && bash"
elif command -v podman &> /dev/null; then
    echo "🚀 Используем Podman..."
    podman run -it --rm \
      -v $(pwd):/workspace \
      -w /workspace \
      node:18-alpine sh -c "
        apk add --no-cache bash git
        chmod +x scripts/rockets/*.sh
        exec bash
      "
else
    echo "❌ Нужно установить Docker, Lima или Podman"
    echo "💡 Рекомендуем: brew install docker"
fi
EOF

chmod +x run_on_linux.sh

echo ""
echo "✅ ГОТОВО! Теперь используй:"
echo ""
echo "   ./run_on_linux.sh"
echo "   # Внутри Linux окружения:"
echo "   ./scripts/launch_tabbook.sh"
echo ""
echo "🎊 MAC ПРЕВРАЩЁН В LINUX DEVELOPMENT MACHINE!"
echo ""
echo "🏆 РЕКОМЕНДАЦИЯ ДЛЯ SOLAR ERP:"
echo "   1. VS Code Dev Containers - для ежедневной разработки"
echo "   2. Docker - для тестирования скриптов"
echo "   3. Lima - для быстрых экспериментов"