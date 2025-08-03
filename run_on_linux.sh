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
