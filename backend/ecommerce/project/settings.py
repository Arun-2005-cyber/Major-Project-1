
from pathlib import Path
from datetime import timedelta
import os
import django
from django.utils.encoding import force_str
from dotenv import load_dotenv
import cloudinary


# Fix for force_text removal in Django 4+
django.utils.encoding.force_text = force_str

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-dev-key")  # use env var in production

# In settings.py
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
from corsheaders.defaults import default_headers, default_methods
# Set BASE_URL dynamically based on the DEBUG setting
if DEBUG:
    BASE_URL = 'http://127.0.0.1:8000'  # Local development URL
else:
    BASE_URL = 'https://majorproject1-ecommerce-cart.onrender.com'  # Production URL

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS")
if ALLOWED_HOSTS:
    ALLOWED_HOSTS = [h.strip() for h in ALLOWED_HOSTS.split(",") if h.strip()]
else:
    ALLOWED_HOSTS = ["majorproject1-ecommerce-cart.onrender.com"]  # production host



# Installed apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "corsheaders",
    'rest_framework',
    'rest_framework_simplejwt',
    "cloudinary", 
    "cloudinary_storage",
    'app',  # ✅ just 'app'
]

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'di7pfw5m1',
    'API_KEY': '336555818416535',
    'API_SECRET': 'YE1tEexrzJahslciwjNggNoog4A'
}

import cloudinary

cloudinary.config( 
  cloud_name = "di7pfw5m1", 
  api_key = "336555818416535", 
  api_secret = "YE1tEexrzJahslciwjNggNoog4A",
  secure = True   # 🔒 Force HTTPS always
)

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# REST Framework + JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
CSRF_TRUSTED_ORIGINS = [
    "https://ecommerce-c.netlify.app",
    "https://majorproject1-ecommerce-cart.onrender.com",
]


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # custom templates folder if you need
        "APP_DIRS": True,  # ✅ required for Django to find admin templates
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ✅ FIXED: removed the extra "project."
ROOT_URLCONF = "project.urls"
WSGI_APPLICATION = "project.wsgi.application"
ASGI_APPLICATION = "project.asgi.application"

# Database config
# DATABASES configuration for SQLite
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# In settings.py
 # Local dev environment URL

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")


# 📧 Email Configuration (Brevo / Sendinblue)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = 'smtp-relay.brevo.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'prakashsm940@gmail.com'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
BREVO_API_KEY = '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'




# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS / CSRF
CORS_ALLOWED_ORIGINS = [
    "https://ecommerce-c.netlify.app"         # if no port
]

CORS_ALLOW_CREDENTIALS = True

# Use default headers + ensure content-type present
CORS_ALLOW_HEADERS = list(default_headers)

# If you need to allow specific methods (default is usually OK)
CORS_ALLOW_METHODS = list(default_methods)

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


