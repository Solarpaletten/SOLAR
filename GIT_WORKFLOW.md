# 🧠 GIT_WORKFLOW.md

## 🔧 Общие правила
- Всегда работаем в отдельных ветках от `main`
- Название ветки должно быть осмысленным: `feature/...`, `fix/...`, `docs/...`
- Изменения вносим по теме задачи: один коммит = одна логическая правка

---

## 🪜 Шаблон для Junior'а: добавление документации или changelog

```bash
# 1. Перейти в проект
cd /var/www/solar/s

# 2. Создать ветку от main
# Название может быть: feature/v2.1.0-deploy-docs

git checkout -b feature/v2.1.0-deploy-docs

# 3. Добавить нужные файлы
# Пример: changelog и readme

git add CHANGELOG.md b/README.md

# 4. Настроить git (если не настроен глобально)
git config user.email "leonid@solar.com"
git config user.name "Leonid"

# 5. Сделать коммит

git commit -m "docs: update changelog and deployment instructions"

# 6. Отправить ветку в репозиторий

git push origin feature/v2.1.0-deploy-docs
```

---

## ✅ Что дальше
- Открываем **Pull Request** в GitHub (PR → main)
- Назначаем ревью или сразу мержим, если задача простая и проверена

---

## 🔁 Используй для всех задач
- `feature/...` — новые фичи
- `fix/...` — багфиксы
- `docs/...` — документация
- `refactor/...` — рефакторинг

---

### 🚀 Команда работает по git-flow под управлением CTO (Leonid)