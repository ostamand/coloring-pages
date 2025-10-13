import os
import smtplib
from email.mime.text import MIMEText
import json
from datetime import datetime, timezone

import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = os.environ.get("API_URL")
SENDER_EMAIL = os.environ.get("GMAIL_USER")
APP_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD")

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587  # TLS port
MIN_FEATURED_BACKLOG = 5
MAX_FEATURED_DELAY = 24


def send_email_to_myself(subject: str, message: str):
    if not SENDER_EMAIL or not APP_PASSWORD:
        return (
            "Error: GMAIL_USER or GMAIL_APP_PASSWORD environment variable not set.",
            500,
        )

    RECIPIENT_EMAIL = SENDER_EMAIL

    msg = MIMEText(message)
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECIPIENT_EMAIL

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo()  # Greet the server
        server.starttls()  # Secure the connection
        server.ehlo()  # Re-greet after starting TLS

        # Login using the App Password
        server.login(SENDER_EMAIL, APP_PASSWORD)

        # Send the email
        server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
        server.quit()

        return "Email sent successfully!", 200

    except Exception as e:
        print(f"SMTP Error: {e}")
        return f"Error: Failed to send email via SMTP: {e}", 500


def run_daily_checks():
    response = requests.get(f"{API_URL}/pages/count")
    subject = "Color It Daily: "

    if not response.ok:
        # TODO send email, API not responding
        subject += "API Not Running"
        message = f"API is responding with status {response.status_code}"
        send_email_to_myself(subject, message)
        return {"status": "failed", "subject": subject, "message": message}

    data = response.json()
    message = json.dumps(data)

    # check how many coloring pages are waiting to get published
    not_published = [v for v in data if v["status"] == "not published"]
    count = 0 if not not_published else not_published[0]["count"]
    if count < MIN_FEATURED_BACKLOG:
        subject += f"Only {count} Coloring Pages Left"
        send_email_to_myself(subject, message)
        return {"status": "error", "subject": subject, "message": message}

    published = [v for v in data if v["status"] == "published"]
    last_on = None if not published else published[0].get("last_on")

    current_time_utc = datetime.now(timezone.utc)
    past_time_utc = datetime.fromisoformat(last_on.replace("Z", "+00:00"))
    time_difference = current_time_utc - past_time_utc
    total_hours = time_difference.total_seconds() / 3600

    if total_hours >= MAX_FEATURED_DELAY:
        subject += f"Stale Featured Coloring Page, Last Updated {total_hours:.2f} ago"
        send_email_to_myself(subject, message)
        return {"status": "error", "subject": subject, "message": message}

    return {"status": "success"}


def daily_checks(request):
    try:
        return run_daily_checks()
    except Exception as ex:
        print(ex)
        send_email_to_myself("Color It Daily: Daily Checks Failed", str(ex))
        return {"status": "failed", "error": str(ex)}
