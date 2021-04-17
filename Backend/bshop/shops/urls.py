from django.urls import path, re_path, include

from . import views


urlpatterns = [
    
    path('create/', views.ShopCreateAPIView.as_view(),name="create_shop"),
    path('', views.AllShopListAPIView.as_view()),
    path('<int:pk>', views.ShopRetrieveAPIView.as_view(),name='ShopRetrieveAPIView'),
    path('user/', views.ShopListAPIView.as_view()),
    path('search', views.ShopSearch.as_view()),##search roye hame shop ha
]