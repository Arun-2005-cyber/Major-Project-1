web: python manage.py migrate --noinput && python create_superuser.py && gunicorn project.wsgi:application --chdir backend/ecommerce --timeout 90 --preload
