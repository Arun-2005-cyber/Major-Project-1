web: cd backend/ecommerce && python manage.py migrate --noinput && python create_superuser.py && gunicorn project.wsgi:application --chdir backend/ecommerce/project --timeout 90 --preload
