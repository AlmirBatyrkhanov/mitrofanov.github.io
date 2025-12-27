# 🚀 Быстрый запуск

## Windows
1. Дважды кликните на `start.bat`
2. Дождитесь установки зависимостей
3. Откройте браузер: http://localhost:8000

## Linux/macOS
```bash
chmod +x start.sh
./start.sh
```

## Ручной запуск
```bash
pip install -r requirements.txt
python main.py
```

## 📧 Настройка email (опционально)
Создайте файл `.env`:
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
RECIPIENT_EMAIL=almir@example.com
```

## 🤖 Настройка Telegram (опционально)
Добавьте в `.env`:
```env
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

## 🌐 Доступные страницы
- **Главная**: http://localhost:8000
- **Демо**: http://localhost:8000/demo.html
- **API**: http://localhost:8000/api/health

## 🎯 Особенности
- ✅ Премиальный тёмный дизайн
- ✅ Эффекты glassmorphism
- ✅ Плавные анимации
- ✅ Адаптивная вёрстка
- ✅ FastAPI backend
- ✅ Контактная форма
- ✅ Email/Telegram уведомления

---
*Создано для Almir Mitrofanov - 15 y.o. Full-Stack Developer*
