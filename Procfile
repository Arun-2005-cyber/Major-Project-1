web: cd backend/ecommerce && python manage.py migrate --noinput && python manage.py shell < create_superuser.py && gunicorn project.wsgi:application --timeout 90 --preload
