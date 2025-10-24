import os
import time
import sys
import django
from django.db.utils import OperationalError

print("🚀 Running create_superuser.py ...")

# Make sure Django can find the settings file
sys.path.append(os.path.join(os.path.dirname(__file__), 'project'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")

# Initialize Django
print("🚀 Setting up Django...")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Get credentials from Render environment variables
username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

print("🔍 Checking for superuser environment variables...")

if not username or not password:
    print("❌ Missing DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD.")
    exit(1)

# Try creating superuser (wait if database isn't ready yet)
for attempt in range(5):
    try:
        if not User.objects.filter(username=username).exists():
            print("✅ Creating Django superuser...")
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            print("🎉 Superuser created successfully.")
        else:
            print("ℹ️ Superuser already exists, skipping creation.")
        break
    except OperationalError as e:
        print(f"⚠️ Database not ready (attempt {attempt + 1}/5): {e}")
        time.sleep(3)
else:
    print("❌ Could not connect to the database after several attempts.")
