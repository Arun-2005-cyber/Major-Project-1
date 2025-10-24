release: python backend/ecommerce/manage.py migrate && python backend/ecommerce/create_superuser.py && python backend/ecommerce/manage.py collectstatic --noinput
web: gunicorn project.wsgi:application --chdir backend/ecommerce --timeout 90
