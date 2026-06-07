from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_reset_email(email: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL")
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    message = MessageSchema(
        subject="KokanMart — Reset Your Password 🥭",
        recipients=[email],
        body=f"""
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="{reset_link}">Reset Password</a>
        <p>This link expires in 30 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
        """,
        subtype="html"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)
    print("Sending to:", email)
    print("Email sent successfully")