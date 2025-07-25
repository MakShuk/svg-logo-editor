# Руководство по деплою на GitHub Pages

Это подробное руководство по настройке и деплою проекта SVG Logo Editor на GitHub Pages.

## Обзор

Проект настроен для автоматического деплоя на GitHub Pages с использованием GitHub Actions. При каждом пуше в ветку `main` запускается процесс сборки и деплоя.

## Предварительные требования

1. **Репозиторий на GitHub** с проектом
2. **Права на запись** в репозиторий
3. **Включенные GitHub Actions** в настройках репозитория

## Настройка GitHub Pages

### Шаг 1: Настройка в GitHub

**Автоматическая настройка** (рекомендуется):
GitHub Actions workflow автоматически включит и настроит GitHub Pages при первом запуске.

**Ручная настройка** (опционально):
1. Перейдите в ваш репозиторий на GitHub
2. Откройте **Settings** → **Pages**
3. В разделе **Source** выберите **GitHub Actions**
4. Сохраните настройки

### Шаг 2: Проверка workflow

Убедитесь, что файл `.github/workflows/deploy.yml` существует в вашем репозитории:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Lint code
      run: npm run lint

    - name: Check formatting
      run: npm run format:check

    - name: Build project
      run: npm run build:gh-pages

    - name: Setup Pages
      uses: actions/configure-pages@v4

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: './dist'

    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

## Конфигурация проекта

### Vite конфигурация

Файл `vite.config.ts` настроен для корректной работы с GitHub Pages:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/svg-logo-editor/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
}));
```

**Важно**: Замените `/svg-logo-editor/` на название вашего репозитория.

### Package.json скрипты

В `package.json` добавлен специальный скрипт для сборки:

```json
{
  "scripts": {
    "build:gh-pages": "npm run build"
  }
}
```

### Файл .nojekyll

В папке `public/` создан файл `.nojekyll` для корректной работы с GitHub Pages.

## Процесс деплоя

### Автоматический деплой

1. **Пуш в main ветку** запускает GitHub Action
2. **Установка зависимостей** (`npm ci`)
3. **Проверка кода** (`npm run lint`)
4. **Проверка форматирования** (`npm run format:check`)
5. **Сборка проекта** (`npm run build:gh-pages`)
6. **Загрузка артефактов** на GitHub Pages
7. **Деплой** на GitHub Pages

### Ручной деплой

Для локального тестирования сборки:

```bash
# Сборка проекта
npm run build:gh-pages

# Предварительный просмотр
npm run preview
```

## Доступ к приложению

После успешного деплоя приложение будет доступно по адресу:

```
https://[ваш-username].github.io/[название-репозитория]/
```

Например: `https://username.github.io/svg-logo-editor/`

## Мониторинг деплоя

### Проверка статуса

1. Перейдите в **Actions** в вашем репозитории
2. Найдите последний запуск workflow "Deploy to GitHub Pages"
3. Проверьте статус выполнения

### Логи деплоя

В случае ошибок:

1. Откройте неудачный workflow
2. Просмотрите логи каждого шага
3. Исправьте ошибки и сделайте новый пуш

## Устранение неполадок

### Распространенные проблемы

1. **404 ошибка при загрузке ресурсов**
   - Проверьте правильность `base` URL в `vite.config.ts`
   - Убедитесь, что название репозитория совпадает с указанным в конфигурации

2. **Workflow не запускается**
   - Проверьте, что GitHub Actions включены в настройках репозитория
   - Убедитесь, что файл workflow находится в `.github/workflows/`

3. **Ошибка "Get Pages site failed"**
   - Это нормально при первом запуске - workflow автоматически включит GitHub Pages
   - При повторных запусках эта ошибка исчезнет

3. **Ошибки сборки**
   - Проверьте, что все зависимости установлены
   - Убедитесь, что код проходит линтинг и проверку форматирования

4. **Права доступа**
   - Убедитесь, что у workflow есть права на запись в Pages
   - Проверьте настройки permissions в workflow файле

### Отладка

Для отладки локально:

```bash
# Проверка линтинга
npm run lint

# Проверка форматирования
npm run format:check

# Локальная сборка
npm run build:gh-pages

# Предварительный просмотр
npm run preview
```

## Обновление конфигурации

При изменении названия репозитория:

1. Обновите `base` URL в `vite.config.ts`
2. Пересоберите проект
3. Сделайте новый деплой

## Дополнительные возможности

### Кастомный домен

Для использования кастомного домена:

1. Создайте файл `CNAME` в папке `public/`
2. Укажите ваш домен в файле
3. Настройте DNS записи у вашего провайдера

### HTTPS

GitHub Pages автоматически предоставляет HTTPS для всех сайтов.

## Заключение

Настройка завершена! Теперь ваш проект автоматически деплоится на GitHub Pages при каждом обновлении кода в ветке main.
