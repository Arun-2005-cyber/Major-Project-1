print("🚀 Running create_superuser.py ...")

import os
import time
import django
from django.db import OperationalError


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

print("🚀 Checking for superuser environment variables...")

if not username or not password:
    print("❌ Missing DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD.")
    exit(1)

for attempt in range(5):
    try:
        if not User.objects.filter(username=username).exists():
            print("✅ Creating Django superuser...")
            User.objects.create_superuser(username=username, email=email, password=password)
            print("🎉 Superuser created successfully.")
        else:
            print("ℹ️ Superuser already exists, skipping creation.")
        break
    except OperationalError as e:
        print(f"⚠️ Database not ready yet (attempt {attempt + 1}/5): {e}")
        time.sleep(3)
else:
    print("❌ Failed to connect to the database after multiple attempts.")
