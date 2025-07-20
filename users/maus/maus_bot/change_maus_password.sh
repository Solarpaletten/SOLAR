#!/bin/bash

# Проверка наличия пользователя
if id "maus" &>/dev/null; then
  echo "✅ Пользователь maus найден."
else
  echo "❌ Пользователь maus не найден. Скрипт завершён."
  exit 1
fi

# Смена пароля (запрос нового пароля дважды)
echo "Введите новый пароль для пользователя maus:"
sudo passwd maus

# Проверка/создание .xsession
XSESSION_PATH="/home/maus/.xsession"
if [ ! -f "$XSESSION_PATH" ]; then
  echo "Создаю .xsession для maus..."
  echo "xfce4-terminal" | sudo tee "$XSESSION_PATH" > /dev/null
  sudo chown maus:maus "$XSESSION_PATH"
  sudo chmod +x "$XSESSION_PATH"
else
  echo "Файл .xsession уже существует."
fi

echo "✅ Пароль обновлён и .xsession подготовлен."
