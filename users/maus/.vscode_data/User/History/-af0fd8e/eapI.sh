#!/bin/bash

USER=$(basename "$(dirname "$PWD")")
BOT=$(basename "$PWD")

# Назначаем порт для каждого пользователя
case "$USER" in
  codex) PORT=8081 ;;
  mikky) PORT=8082 ;;
  jenny) PORT=8083 ;;
  maus)  PORT=8084 ;;
  *)     PORT=8090 ;;  # fallback
esac

echo "[$USER] Запускается Code-Server на порту $PORT..."

exec /usr/bin/code-server /var/www/SOLAR/$USER/$BOT \
  --auth=none \
  --bind-addr=0.0.0.0:$PORT \
  --user-data-dir=/var/www/SOLAR/$USER/.vscode_data \
  --extensions-dir=/var/www/SOLAR/$USER/.vscode_extensions
