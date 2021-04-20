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
]