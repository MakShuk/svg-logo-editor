@echo off
chcp 65001 >nul

echo 🚀 Переключение варианта деплоя GitHub Pages
echo.
echo Выберите вариант:
echo 1) Стандартный GitHub Pages (deploy.yml)
echo 2) Простой деплой через gh-pages (deploy-simple.yml)
echo.
set /p choice="Введите номер (1 или 2): "

if "%choice%"=="1" (
    echo Переключение на стандартный GitHub Pages...
    if exist ".github\workflows\deploy-simple.yml" (
        ren ".github\workflows\deploy-simple.yml" "deploy-simple.yml.disabled"
        echo ✅ deploy-simple.yml отключен
    )
    if exist ".github\workflows\deploy.yml.disabled" (
        ren ".github\workflows\deploy.yml.disabled" "deploy.yml"
        echo ✅ deploy.yml включен
    )
    echo.
    echo 📋 Настройте GitHub Pages:
    echo Settings → Pages → Source: GitHub Actions
) else if "%choice%"=="2" (
    echo Переключение на простой деплой...
    if exist ".github\workflows\deploy.yml" (
        ren ".github\workflows\deploy.yml" "deploy.yml.disabled"
        echo ✅ deploy.yml отключен
    )
    if exist ".github\workflows\deploy-simple.yml.disabled" (
        ren ".github\workflows\deploy-simple.yml.disabled" "deploy-simple.yml"
        echo ✅ deploy-simple.yml включен
    )
    echo.
    echo 📋 Настройте GitHub Pages:
    echo Settings → Pages → Source: Deploy from a branch → gh-pages
) else (
    echo ❌ Неверный выбор. Используйте 1 или 2.
    pause
    exit /b 1
)

echo.
echo ✅ Готово! Теперь сделайте git push origin main
pause
