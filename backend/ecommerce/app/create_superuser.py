# from django.core.management.base import BaseCommand
# from django.contrib.auth import get_user_model
# import os

# class Command(BaseCommand):
#     help = "Create default superuser from environment variables (only if none exists)"

#     def handle(self, *args, **kwargs):
#         User = get_user_model()

#         if User.objects.filter(is_superuser=True).exists():
#             self.stdout.write(self.style.WARNING("⚠️ Superuser already exists. Skipping creation."))
#             return

#         username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
#         email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
#         password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin123")

#         User.objects.create_superuser(
#             username=username,
#             email=email,
#             password=password
#         )
#         self.stdout.write(self.style.SUCCESS(f"✅ Superuser '{username}' created"))
