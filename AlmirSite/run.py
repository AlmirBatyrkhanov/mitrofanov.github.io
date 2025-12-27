#!/usr/bin/env python3
"""
Скрипт для запуска персонального сайта-визитки Almir Mitrofanov
"""

import os
import sys
import subprocess
import webbrowser
from pathlib import Path

def check_python_version():
    """Проверка версии Python"""
    if sys.version_info < (3, 8):
        print("❌ Требуется Python 3.8 или выше")
        print(f"Текущая версия: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} - OK")
    return True

def install_requirements():
    """Установка зависимостей"""
    print("📦 Установка зависимостей...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Зависимости установлены успешно")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка при установке зависимостей: {e}")
        return False

def check_env_file():
    """Проверка наличия .env файла"""
    env_file = Path(".env")
    if not env_file.exists():
        print("⚠️  Файл .env не найден")
        print("📝 Создайте файл .env с настройками email и Telegram (опционально)")
        print("Пример содержимого .env:")
        print("""
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=almir@example.com
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
        """)
        return False
    print("✅ Файл .env найден")
    return True

def start_server():
    """Запуск сервера"""
    print("🚀 Запуск сервера...")
    print("📍 Сайт будет доступен по адресу: http://localhost:8000")
    print("🛑 Для остановки нажмите Ctrl+C")
    print("-" * 50)
    
    try:
        # Открыть браузер через 2 секунды
        import threading
        def open_browser():
            import time
            time.sleep(2)
            webbrowser.open("http://localhost:8000")
        
        browser_thread = threading.Thread(target=open_browser)
        browser_thread.daemon = True
        browser_thread.start()
        
        # Запуск сервера
        subprocess.run([sys.executable, "main.py"])
        
    except KeyboardInterrupt:
        print("\n🛑 Сервер остановлен")
    except Exception as e:
        print(f"❌ Ошибка при запуске сервера: {e}")

def main():
    """Основная функция"""
    print("🌟 Almir Mitrofanov - Personal Portfolio Website")
    print("=" * 50)
    
    # Проверки
    if not check_python_version():
        return
    
    if not install_requirements():
        return
    
    check_env_file()
    
    print("\n🎯 Готово к запуску!")
    input("Нажмите Enter для запуска сервера...")
    
    start_server()

if __name__ == "__main__":
    main()
