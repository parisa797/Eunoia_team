from django.urls import path
from django.conf.urls import include, url
from .views import *

urlpatterns = [
    path('items/search', Search.as_view()), ##search roye hame kalaha
    path('shops/<pk>/items/', CreateItem.as_view()),##ezafe kardane item va get oon hame ye item ha ro barmigardone
    path('shops/<pk>/items/<id>', ItemInfo.as_view()),##edit and delete va get yek item
    path('shops/<pk>/items/search/', ItemInShopSearch.as_view()),##search roye hame kalaha ye yek froshghah
]