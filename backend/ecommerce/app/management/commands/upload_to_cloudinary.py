from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from app.models import Product  # adjust if your model is elsewhere
import os

class Command(BaseCommand):
    help = "Upload existing media files to Cloudinary"

    def handle(self, *args, **kwargs):
        for product in Product.objects.all():
            if product.image and not str(product.image).startswith("http"):
                local_path = os.path.join(settings.MEDIA_ROOT, str(product.image))
                if os.path.exists(local_path):
                    with open(local_path, "rb") as f:
                        product.image.save(os.path.basename(local_path), File(f), save=True)
                        self.stdout.write(self.style.SUCCESS(f"Uploaded {product.image}"))
