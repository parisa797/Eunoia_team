from django.urls import path, re_path, include

from . import views


urlpatterns = [
    
    path('create/', views.ShopCreateAPIView.as_view(),name="create_shop"),
    path('', views.AllShopListAPIView.as_view()),
    path('<int:pk>', views.ShopRetrieveAPIView.as_view(),name='ShopRetrieveAPIView'),
    path('update/<int:pk>', views.ShopUpdateAPIView.as_view(),name='ShopUpdateAPIView'),
    path('delete/<int:pk>', views.ShopDestroyAPIView.as_view(),name='ShopDestroyAPIView'),
    path('user/', views.ShopListAPIView.as_view()),
    path('comment/create/', views.CommentCreateAPIView.as_view()),
    path('comment/list/<int:pk>', views.CommentListAPIView.as_view()),
    path('comment/<int:pk>', views.CommentRetrieveUpdateDestroyAPIView.as_view()),
    path('rate/create/', views.RateCreateAPIView.as_view()),
    path('rate/list/<int:pk>', views.RateListAPIView.as_view()),
    path('rate/<int:pk>', views.RateRetrieveUpdateDestroyAPIView.as_view()),
]