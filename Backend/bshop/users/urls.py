from django.urls import path
from django.conf.urls import include, url
from .views import *

urlpatterns = [
    path('users/profile/upload-file', UploadFile.as_view()),
    path('users/profile/delete-file', DeleteImg.as_view()),
    path('users/profile', ProfileInfo.as_view(),name="profileList"),
    path('users/profile/likeditems', UserItem.as_view()),
]