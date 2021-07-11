from django.urls import path
from django.conf.urls import include, url
from .views import *

urlpatterns = [
    path('users/profile/upload-file', UploadFile.as_view()),
    path('users/profile/delete-file', DeleteImg.as_view()),
    path('users/profile', ProfileInfo.as_view(),name="profileList"),
    path('users/profile/likeditems', UserItem.as_view()),
    path('users/profile/likedshops', UserShop.as_view()),
    path('users/profile/map/<int:pk>', MapUserAPIView.as_view()),
    path('users/profile/coins/', CreateCoins.as_view(),name="createcoin"),
    path('users/profile/coins/<pk>', CoinInfo.as_view(),name="coinInfo"),
    path('users/profile/coins/<pk>/update', CoinUpdate.as_view(),name="coin_update"),
    path('users/shopping-with-coins/special-item/<int:pk>', ShoppingWithCoinListCreate.as_view(),name="coin_shop"),
    path('users/shopping-with-coins/shopping-list/list/', ShoppingWithCoinListList.as_view(),name="list_coin_shop"),
    path('users/shopping-with-coins/shopping-list/<int:pk>', ShoppingWithCoinListRetrieve.as_view(),name="retrieve_coin_shop"),

    path('users/profile/EWallet/', CreateWallet.as_view(),name="create_wallet"),
    path('users/profile/EWallet/<pk>', WalletInfo.as_view(),name="walletInfo"),
]