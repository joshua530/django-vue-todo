from django.contrib import admin
from django.urls import path, include
from todo.views import index
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', index),
    path('admin/', admin.site.urls),
    path('api/v1/', include('todo.api.urls')),
]

handler404 = 'todo.views.handler_404'

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
