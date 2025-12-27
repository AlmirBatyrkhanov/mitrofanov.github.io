@echo off
echo ========================================
echo   Almir Mitrofanov - Portfolio Website
echo ========================================
echo.

REM Проверка наличия Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python не найден. Установите Python 3.8+ с https://python.org
    pause
    exit /b 1
)

echo [INFO] Python найден
echo.

REM Установка зависимостей
echo [INFO] Установка зависимостей...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Ошибка при установке зависимостей
    pause
    exit /b 1
)

echo [SUCCESS] Зависимости установлены
echo.

REM Проверка .env файла
if not exist .env (
    echo [WARNING] Файл .env не найден
    echo [INFO] Создайте файл .env с настройками email
    echo.
    echo Пример содержимого .env:
    echo SMTP_SERVER=smtp.gmail.com
    echo SMTP_PORT=587
    echo SMTP_USERNAME=your-email@gmail.com
    echo SMTP_PASSWORD=your-app-password
    echo RECIPIENT_EMAIL=almir@example.com
    echo.
)

echo [INFO] Запуск сервера...
echo [INFO] Сайт будет доступен по адресу: http://localhost:8000
echo [INFO] Для остановки нажмите Ctrl+C
echo.

REM Запуск сервера
python main.py

pause
