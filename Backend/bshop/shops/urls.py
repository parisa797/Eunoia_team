from django.urls import path, re_path, include

from . import views


urlpatterns = [
    
    path('shops/', views.ShopListCreateAPIView.as_view()),
    path('shops/<int:pk>', views.ShopRetrieveUpdateDestroyAPIView.as_view()),
    path('user/', views.ShopListAPIView.as_view()),
]