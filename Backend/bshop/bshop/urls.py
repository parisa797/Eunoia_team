from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/shops/', include('shops.urls')),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

