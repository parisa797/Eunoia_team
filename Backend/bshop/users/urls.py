from django.urls import path
from django.conf.urls import include, url
from .views import *

urlpatterns = [
    path('users/profile/upload-file', UploadFile.as_view()),
    path('users/profile/delete-file', DeleteImg.as_view()),
    path('users/profile', ProfileInfo.as_view(),name="profileList"),
    path('users/profile/likeditems', UserItem.as_view()),
    path('users/profile/likedshops', UserShop.as_view()),
    path('users/profile/coins/', CreateCoins.as_view()),
    path('users/profile/coins/<pk>', CoinInfo.as_view()),
    path('users/profile/coins/<pk>/update', CoinUpdate.as_view()),
    path('users/shopping-with-coins/special-item/<int:pk>', ShoppingWithCoinListCreate.as_view()),
    path('users/shopping-with-coins/shopping-list/list/', ShoppingWithCoinListList.as_view()),
    path('users/shopping-with-coins/shopping-list/<int:pk>', ShoppingWithCoinListRetrieve.as_view()),
]