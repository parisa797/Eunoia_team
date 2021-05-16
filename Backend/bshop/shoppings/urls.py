from django.urls import path, re_path, include

from . import views


urlpatterns = [
    
    path('create/', views.ShoppingListCreateAPIView.as_view(),name="create_shopping_list"),
    path('', views.AllShoppingListAPIView.as_view()),
    path('<int:pk>', views.ShoppingListRetrieveAPIView.as_view(),name='retrieve_shopping_list'),
    path('update/<int:pk>', views.ShoppingListUpdateAPIView.as_view(),name='update_shopping_list'),
    path('delete/<int:pk>', views.ShoppingListDestroyAPIView.as_view(),name='delete_shopping_list'),
    path('user/', views.UserShoppingListAPIView.as_view(), name="user_shopping_list"),
    path('sabt/<int:pk>', views.SabtShoppingListUpdateAPIView.as_view(),name='sabt_shopping_list'),
    path('online/<int:pk>', views.OnlineShoppingListUpdateAPIView.as_view(),name='online_shopping_list'),
    path('maxcost/<int:pk>', views.MaxCostShoppingListUpdateAPIView.as_view(),name='max_cost_shopping_list'),    
]