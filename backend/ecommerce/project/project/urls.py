# project/urls.py
from django.contrib import admin
from django.urls import path, include
from django.urls import path, include   # <-- path comes from here
from django.conf import settings        # <-- import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
  path('api/', include('project.app.urls')),  # routes to your app
]

if settings.DEBUG:

    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)