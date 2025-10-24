web: cd backend/ecommerce && \
    python3 manage.py migrate --noinput && \
    python3 manage.py collectstatic --noinput && \
    python3 -u create_superuser.py && \
    gunicorn project.wsgi:application --timeout 90 --preload
