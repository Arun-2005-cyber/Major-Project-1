from django.apps import AppConfig
from django.contrib.auth import get_user_model
import logging

class MainAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = "app"

    # def ready(self):
    #     # Auto-create superuser on deploy
    #     User = get_user_model()
    #     username = "prakashsm940@gmail.com"
    #     email = "prakashsm940@gmail.com"
    #     password = "prakashsekar"   # 👉 change this to a strong password

    #     if not User.objects.filter(username=username).exists():
    #         try:
    #             User.objects.create_superuser(username=username, email=email, password=password)
    #             logging.info("Superuser created: %s", username)
    #         except Exception as e:
    #             logging.error("Could not create superuser: %s", e)
