from django.urls import path, re_path, include

from . import views


urlpatterns = [
    
    path('create/', views.ShoppingListCreateAPIView.as_view(),name="create_shopping_list"),
    path('', views.AllShoppingListAPIView.as_view()),
    path('<int:pk>', views.ShoppingListRetrieveAPIView.as_view(),name='retrieve_shopping_list'),
    path('update/<int:pk>', views.ShoppingListUpdateAPIView.as_view(),name='update_shopping_list'),
    path('delete/<int:pk>', views.ShoppingListDestroyAPIView.as_view(),name='delete_shopping_list'),
    path('user/', views.UserShoppingListAPIView.as_view(), name="user_shopping_list"),
]