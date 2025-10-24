import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and password:
    if not User.objects.filter(username=username).exists():
        print("✅ Creating superuser...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("✅ Superuser created successfully.")
    else:
        print("ℹ️ Superuser already exists.")
else:
    print("❌ Missing superuser environment variables.")
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

if username and password:
    if not User.objects.filter(username=username).exists():
        print("✅ Creating superuser...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("✅ Superuser created successfully.")
    else:
        print("ℹ️ Superuser already exists.")
else:
    print("❌ Missing superuser environment variables.")
