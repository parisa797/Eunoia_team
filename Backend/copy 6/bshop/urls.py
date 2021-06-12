from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^account/', include('allauth.urls')),
    path('', include('users.urls')),
    path('api/v1/shops/', include('shops.urls')),
    path('', include('items.urls')),
    path('api/v1/shoppings/', include('shoppings.urls')),
]+ static(settings.MEDIA_URL, document_root= settings.MEDIA_ROOT)
