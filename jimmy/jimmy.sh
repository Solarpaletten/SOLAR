#!/bin/bash

INBOX="/var/www/solar/s/jimmy/inbox"
ARCHIVE="/var/www/solar/s/jimmy/archive"
RESULTS="/var/www/solar/s/jimmy/results"

for task in "$INBOX"/*.task; do
  [ -f "$task" ] || continue

  TASK_NAME=$(basename "$task" .task)
  RESULT_FILE="$RESULTS/$TASK_NAME.result"

  echo "🔍 Выполняется задача: $TASK_NAME" > "$RESULT_FILE"

  while IFS= read -r line; do
    case $line in
      --description=*) echo "Описание: ${line#*=}" >> "$RESULT_FILE" ;;
      --user=*) USER="${line#*=}" ;;
      --host=*) HOST="${line#*=}" ;;
      --port=*) PORT="${line#*=}" ;;
      --check=*) CHECK_ITEMS="${line#*=}" ;;
    esac
  done < "$task"

  echo "📡 Проверка SSH-доступа к $HOST:$PORT как $USER..." >> "$RESULT_FILE"
  ssh -p "$PORT" -o BatchMode=yes -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$USER@$HOST" 'echo "✅ Доступ разрешён"' >> "$RESULT_FILE" 2>&1

  echo "📦 Перемещение задачи в архив..." >> "$RESULT_FILE"
  mv "$task" "$ARCHIVE/"

  echo "✅ Завершено. Отчёт: $RESULT_FILE"
done