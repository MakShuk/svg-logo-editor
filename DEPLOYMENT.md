# 🚀 Быстрый деплой на GitHub Pages

## 🎯 Два варианта деплоя

### Вариант 1: Стандартный GitHub Pages (рекомендуется)

**Настройка:**
1. Перейдите в **Settings** → **Pages** вашего репозитория
2. В разделе **Source** выберите **GitHub Actions**
3. Нажмите **Save**

**Workflow:** `.github/workflows/deploy.yml`

### Вариант 2: Простой деплой (если первый не работает)

**Настройка:**
1. Перейдите в **Settings** → **Pages** вашего репозитория
2. В разделе **Source** выберите **Deploy from a branch**
3. Выберите ветку **gh-pages** и папку **/ (root)**
4. Нажмите **Save**

**Workflow:** `.github/workflows/deploy-simple.yml`

## ⚠️ Выбор варианта

Попробуйте **Вариант 1** первым. Если возникают ошибки с правами доступа, используйте **Вариант 2**.

## 🔄 Процесс деплоя

После настройки Pages:

```bash
git push origin main
```

GitHub Actions автоматически:
- ✅ Проверит код (линтинг)
- ✅ Проверит форматирование
- ✅ Соберет проект
- ✅ Задеплоит на GitHub Pages

## 🌐 Результат

Ваш сайт будет доступен по адресу:
```
https://[ваш-username].github.io/svg-logo-editor/
```

## ❌ Устранение проблем

### Ошибка "Resource not accessible by integration"
**Решение:** Используйте Вариант 2 (простой деплой)

### Ошибка "Get Pages site failed"
**Решение:**
1. Убедитесь, что Pages включен в настройках
2. Попробуйте Вариант 2

### Workflow не запускается
**Решение:**
1. Проверьте, что GitHub Actions включены
2. Убедитесь, что у вас есть права на репозиторий

## 🔧 Переключение между вариантами

### Автоматическое переключение (рекомендуется)

**Linux/Mac:**
```bash
./switch-deploy.sh
```

**Windows:**
```cmd
switch-deploy.bat
```

### Ручное переключение

Чтобы использовать простой деплой:
1. Переименуйте `.github/workflows/deploy.yml` в `deploy.yml.disabled`
2. Переименуйте `.github/workflows/deploy-simple.yml` в `deploy.yml`
3. Настройте Pages для ветки gh-pages

**Подробная документация:** [docs/github-pages-deployment.md](docs/github-pages-deployment.md)
