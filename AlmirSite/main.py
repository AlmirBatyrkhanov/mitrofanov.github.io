from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, Response
from pydantic import BaseModel, EmailStr
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Almir Mitrofanov Portfolio API",
    description="API для персонального сайта-визитки",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="."), name="static")

# Serve CSS and JS files directly
@app.get("/styles.css")
async def get_styles():
    try:
        with open("styles.css", "r", encoding="utf-8") as f:
            return Response(content=f.read(), media_type="text/css")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSS file not found")

@app.get("/animations.css")
async def get_animations():
    try:
        with open("animations.css", "r", encoding="utf-8") as f:
            return Response(content=f.read(), media_type="text/css")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="CSS file not found")

@app.get("/script.js")
async def get_script():
    try:
        with open("script.js", "r", encoding="utf-8") as f:
            return Response(content=f.read(), media_type="application/javascript")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="JS file not found")

@app.get("/demo.html")
async def get_demo():
    try:
        with open("demo.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Demo page not found")

# Pydantic models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
RECIPIENT_EMAIL = os.getenv("RECIPIENT_EMAIL", "almir@example.com")

# Telegram Bot configuration (optional)
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

async def send_email(contact_data: ContactMessage) -> bool:
    """Отправка email с сообщением из контактной формы"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"Новое сообщение от {contact_data.name}"
        
        # Email body
        body = f"""
        Новое сообщение с сайта-визитки:
        
        Имя: {contact_data.name}
        Email: {contact_data.email}
        
        Сообщение:
        {contact_data.message}
        
        ---
        Отправлено с сайта Almir Mitrofanov Portfolio
        """
        
        msg.attach(MIMEText(body, 'plain', 'utf-8'))
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, RECIPIENT_EMAIL, text)
        server.quit()
        
        logger.info(f"Email sent successfully from {contact_data.email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

async def send_telegram_message(contact_data: ContactMessage) -> bool:
    """Отправка сообщения в Telegram (если настроен бот)"""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        return False
        
    try:
        import aiohttp
        
        message = f"""
🆕 *Новое сообщение с сайта*

👤 *Имя:* {contact_data.name}
📧 *Email:* {contact_data.email}

💬 *Сообщение:*
{contact_data.message}

---
Отправлено с сайта Almir Mitrofanov Portfolio
        """
        
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "Markdown"
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, json=data) as response:
                if response.status == 200:
                    logger.info(f"Telegram message sent successfully from {contact_data.email}")
                    return True
                else:
                    logger.error(f"Telegram API error: {response.status}")
                    return False
                    
    except Exception as e:
        logger.error(f"Failed to send Telegram message: {str(e)}")
        return False


@app.get("/favicon.ico")
async def favicon():
    from fastapi.responses import FileResponse
    return FileResponse("static/favicon.ico")

# Routes
@app.get("/", response_class=HTMLResponse)
async def read_root():
    """Главная страница"""
    try:
        with open("index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Сайт временно недоступен</h1>", status_code=404)

@app.get("/akezhan", response_class=HTMLResponse)
async def akezhan_page():
    """Страница о друге Акежане"""
    try:
        with open("akezhan.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="<h1>Страница временно недоступна</h1>", status_code=404)

@app.post("/api/contact", response_model=ContactResponse)
async def contact_form(contact_data: ContactMessage):
    """Обработка контактной формы"""
    try:
        # Validate input
        if not contact_data.name.strip():
            raise HTTPException(status_code=400, detail="Имя не может быть пустым")
        
        if not contact_data.message.strip():
            raise HTTPException(status_code=400, detail="Сообщение не может быть пустым")
        
        # Send email
        email_sent = await send_email(contact_data)
        
        # Send Telegram message (optional)
        telegram_sent = await send_telegram_message(contact_data)
        
        if email_sent or telegram_sent:
            return ContactResponse(
                success=True,
                message="Сообщение отправлено успешно!"
            )
        else:
            raise HTTPException(
                status_code=500, 
                detail="Не удалось отправить сообщение. Попробуйте позже."
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Внутренняя ошибка сервера"
        )

@app.get("/api/health")
async def health_check():
    """Проверка состояния API"""
    return {
        "status": "healthy",
        "message": "API работает корректно",
        "version": "1.0.0"
    }

@app.get("/api/info")
async def get_info():
    """Информация о разработчике"""
    return {
        "name": "Almir Mitrofanov",
        "age": 15,
        "title": "Full-Stack Web Developer",
        "specialties": [
            "Web Development",
            "Bot Development", 
            "Parser Development",
            "Scripting"
        ],
        "technologies": [
            "Python",
            "FastAPI",
            "JavaScript",
            "Node.js",
            "HTML/CSS",
            "Docker",
            "SQL",
            "Git"
        ],
        "contact": {
            "email": "almir@example.com",
            "telegram": "https://t.me/almir_dev",
            "github": "https://github.com/almir-dev"
        }
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    return HTMLResponse(
        content="<h1>Страница не найдена</h1><p>Вернуться на <a href='/'>главную</a></p>",
        status_code=404
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: HTTPException):
    return HTMLResponse(
        content="<h1>Внутренняя ошибка сервера</h1><p>Попробуйте позже</p>",
        status_code=500
    )

if __name__ == "__main__":
    import uvicorn
    
    # Check if required environment variables are set
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.warning("SMTP credentials not set. Email functionality will be disabled.")
        logger.warning("Set SMTP_USERNAME and SMTP_PASSWORD environment variables to enable email.")
    
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.info("Telegram bot not configured. Telegram notifications will be disabled.")
        logger.info("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables to enable Telegram.")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
