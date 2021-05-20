from django.urls import path
from django.conf.urls import include, url
from .views import *

urlpatterns = [
    path('items/search', Search.as_view(),name="totalSearch"), ##search roye hame kalaha
    path('shops/<pk>/items/', CreateItem.as_view(), name="createItem"),##ezafe kardane item va get oon hame ye item ha ro barmigardone
    path('shops/<pk>/items/<id>', ItemInfo.as_view(),name="infoOfItem"),##edit and delete va get yek item
    path('shops/<pk>/items/search/', ItemInShopSearch.as_view(),name="searchInOneShop"),##search roye hame kalaha ye yek froshghah
    path('items/expensive/', MostExpensiveAllItemListAPIView.as_view(),name="mostExpensiveAllItem"),
    path('items/cheap/', CheapestAllItemListAPIView.as_view(),name="cheapestAllItem"),
    path('items/new/', NewestAllItemListAPIView.as_view(),name="newestAllItem"),
    path('items/discount/', MostDiscountsAllItemListAPIView.as_view(),name="mostDiscountsAllItem"),
    path('items/category/', FilterCategoryItemListAPIView.as_view(),name="filterCategoryItem"),
    path('items/category/expensive/', ExpensiveFilterItemListAPIView.as_view(),name="expensiveFilterItem"),
    path('items/category/cheap/', CheapFilterItemListAPIView.as_view(),name="cheapFilterItem"),
    path('items/category/new/', NewFilterItemListAPIView.as_view(),name="newFilterItem"),
    path('items/category/discount/', DiscountsFilterItemListAPIView.as_view(),name="discountsFilterItem"),
    path('items/expensive/<int:pk>', MostExpensiveAllItemOneShopListAPIView.as_view()),
    path('items/cheap/<int:pk>', CheapestAllItemOneShopListAPIView.as_view()),
    path('items/new/<int:pk>', NewestAllItemOneShopListAPIView.as_view()),
    path('items/discount/<int:pk>', MostDiscountsOneShopAllItemListAPIView.as_view()),
    path('items/category/<int:pk>', FilterCategoryItemOneShopListAPIView.as_view()),
    path('items/category/expensive/<int:pk>', ExpensiveFilterItemOneShopListAPIView.as_view()),
    path('items/category/cheap/<int:pk>', CheapFilterItemOneShopListAPIView.as_view()),
    path('items/category/new/<int:pk>', NewFilterItemOneShopListAPIView.as_view()),
    path('items/category/discount/<int:pk>', DiscountsFilterItemOneShopListAPIView.as_view()),
]