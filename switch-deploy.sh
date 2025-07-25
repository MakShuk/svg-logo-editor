#!/bin/bash

# Скрипт для переключения между вариантами деплоя

echo "🚀 Переключение варианта деплоя GitHub Pages"
echo ""
echo "Выберите вариант:"
echo "1) Стандартный GitHub Pages (deploy.yml)"
echo "2) Простой деплой через gh-pages (deploy-simple.yml)"
echo ""
read -p "Введите номер (1 или 2): " choice

case $choice in
  1)
    echo "Переключение на стандартный GitHub Pages..."
    if [ -f ".github/workflows/deploy-simple.yml" ]; then
      mv ".github/workflows/deploy-simple.yml" ".github/workflows/deploy-simple.yml.disabled"
      echo "✅ deploy-simple.yml отключен"
    fi
    if [ -f ".github/workflows/deploy.yml.disabled" ]; then
      mv ".github/workflows/deploy.yml.disabled" ".github/workflows/deploy.yml"
      echo "✅ deploy.yml включен"
    fi
    echo ""
    echo "📋 Настройте GitHub Pages:"
    echo "Settings → Pages → Source: GitHub Actions"
    ;;
  2)
    echo "Переключение на простой деплой..."
    if [ -f ".github/workflows/deploy.yml" ]; then
      mv ".github/workflows/deploy.yml" ".github/workflows/deploy.yml.disabled"
      echo "✅ deploy.yml отключен"
    fi
    if [ -f ".github/workflows/deploy-simple.yml.disabled" ]; then
      mv ".github/workflows/deploy-simple.yml.disabled" ".github/workflows/deploy-simple.yml"
      echo "✅ deploy-simple.yml включен"
    fi
    echo ""
    echo "📋 Настройте GitHub Pages:"
    echo "Settings → Pages → Source: Deploy from a branch → gh-pages"
    ;;
  *)
    echo "❌ Неверный выбор. Используйте 1 или 2."
    exit 1
    ;;
esac

echo ""
echo "✅ Готово! Теперь сделайте git push origin main"
