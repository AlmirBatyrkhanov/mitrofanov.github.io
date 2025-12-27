#!/bin/bash

echo "========================================"
echo "  Almir Mitrofanov - Portfolio Website"
echo "========================================"
echo

# Проверка наличия Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 не найден. Установите Python 3.8+"
    exit 1
fi

echo "[INFO] Python найден: $(python3 --version)"
echo

# Установка зависимостей
echo "[INFO] Установка зависимостей..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Ошибка при установке зависимостей"
    exit 1
fi

echo "[SUCCESS] Зависимости установлены"
echo

# Проверка .env файла
if [ ! -f .env ]; then
    echo "[WARNING] Файл .env не найден"
    echo "[INFO] Создайте файл .env с настройками email"
    echo
    echo "Пример содержимого .env:"
    echo "SMTP_SERVER=smtp.gmail.com"
    echo "SMTP_PORT=587"
    echo "SMTP_USERNAME=your-email@gmail.com"
    echo "SMTP_PASSWORD=your-app-password"
    echo "RECIPIENT_EMAIL=almir@example.com"
    echo
fi

echo "[INFO] Запуск сервера..."
echo "[INFO] Сайт будет доступен по адресу: http://localhost:8000"
echo "[INFO] Для остановки нажмите Ctrl+C"
echo

# Запуск сервера
python3 main.py
