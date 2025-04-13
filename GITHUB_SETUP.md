# 🔒 Настройка GitHub для проекта SOLAR

## 🔑 Настройка аутентификации GitHub

### Вариант 1: Настройка SSH (рекомендуется)

1. **Генерация SSH-ключа** (если у вас его ещё нет):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Добавление ключа в SSH-агент**:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Копирование публичного ключа**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Скопируйте вывод этой команды
   ```

4. **Добавление ключа в GitHub**:
   - Перейдите на GitHub → Settings → SSH and GPG keys
   - Нажмите "New SSH key"
   - Вставьте скопированный ключ и дайте ему понятное имя (например, "SOLAR Development")

5. **Проверка соединения**:
   ```bash
   ssh -T git@github.com
   # Должно появиться сообщение: "Hi username! You've successfully authenticated..."
   ```

6. **Настройка репозитория для использования SSH**:
   ```bash
   cd /var/www/solar/s
   git remote set-url origin git@github.com:Solarpaletten/SOLAR.git
   ```

### Вариант 2: Настройка HTTPS с токеном (альтернатива)

1. **Создание персонального токена доступа**:
   - Перейдите на GitHub → Settings → Developer settings → Personal access tokens
   - Нажмите "Generate new token"
   - Выберите необходимые разрешения (обычно repo, workflow)
   - Скопируйте созданный токен (он будет показан только один раз!)

2. **Настройка локального кэширования учетных данных**:
   ```bash
   git config --global credential.helper cache
   # Кэшировать учетные данные на 15 минут
   git config --global credential.helper 'cache --timeout=900'
   ```

3. **Настройка репозитория для использования HTTPS**:
   ```bash
   cd /var/www/solar/s
   git remote set-url origin https://github.com/Solarpaletten/SOLAR.git
   ```

4. **При первом push будет запрошено имя пользователя и пароль**:
   - Для имени пользователя введите ваш логин GitHub
   - Для пароля введите ваш персональный токен доступа (НЕ пароль от аккаунта)

## 🚀 Создание Pull Request

После успешной отправки ветки на GitHub:

1. Перейдите на [страницу репозитория](https://github.com/Solarpaletten/SOLAR)
2. Вы увидите уведомление о недавно отправленной ветке - нажмите "Compare & pull request"
3. **Заполните информацию о Pull Request**:
   - **Название**: `feat: deploy via Render & PM2 + Git Workflow doc`
   - **Описание**: 
     ```
     Добавлены инструкции по Git-воркфлоу, ecosystem.config.js, настроен тройной деплой: Render + SSH.
     ```
4. Нажмите "Create pull request"
5. Если у вас есть права, вы можете сразу мерджить PR в main

## 📋 Дополнительные рекомендации

- **Всегда сохраняйте токены и ключи в безопасном месте**
- Для командной работы рекомендуется настроить двухфакторную аутентификацию на GitHub
- Периодически обновляйте свои ключи и токены для повышения безопасности
- При работе на разных машинах используйте разные ключи для каждой из них