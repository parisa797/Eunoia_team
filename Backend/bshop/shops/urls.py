from django.urls import path, re_path, include

from . import views


urlpatterns = [

    path('create/', views.ShopCreateAPIView.as_view(), name="create_shop"),
    path('', views.AllShopListAPIView.as_view()),
    path('<int:pk>', views.ShopRetrieveAPIView.as_view(),
         name='ShopRetrieveAPIView'),
    path('update/<int:pk>', views.ShopUpdateAPIView.as_view(),
         name='ShopUpdateAPIView'),
    path('delete/<int:pk>', views.ShopDestroyAPIView.as_view(),
         name='ShopDestroyAPIView'),
    path('user/', views.ShopListAPIView.as_view(), name="ShopListUser"),
    path('comment/create/', views.CommentCreateAPIView.as_view(),
         name="CommentCreate"),
    path('comment/list/<int:pk>',
         views.CommentListAPIView.as_view(), name="CommentList"),
    path('comment/<int:pk>', views.CommentRetrieveUpdateDestroyAPIView.as_view(),
         name="CommentRetrieveUpdateDestroy"),
    path('rate/create/', views.RateCreateAPIView.as_view(), name="RateCreate"),
    path('rate/list/<int:pk>', views.RateListAPIView.as_view(), name="RateList"),
    path('rate/<int:pk>', views.RateRetrieveUpdateDestroyAPIView.as_view(),
         name="RateRetrieveUpdateDestroy"),
    path('top/', views.TopShopListAPIView.as_view(), name="TopShopList"),
    path('region/', views.MantagheShopListAPIView.as_view(),
         name="MantagheShopList"),
    path('search', views.ShopSearch.as_view()),  # search roye hame shop ha
    path('board/create/', views.BoardCreateAPIView.as_view(), name="BoardCreate"),
    path('board/list/<int:pk>', views.BoardListAPIView.as_view(), name="BoardList"),
    path('board/<int:pk>', views.BoardRetrieveAPIView.as_view(), name="BoardRetrieve"),
    path('board/update/<int:pk>',
         views.BoardUpdateAPIView.as_view(), name="BoardUpdate"),
    path('board/delete/<int:pk>',
         views.BoardDestroyAPIView.as_view(), name="BoardDestroy"),
    path('<id>/likes', views.LikeShop.as_view()),
    path('<id>/commentsreplis', views.CommentReply.as_view()),
    path('<id>/comments/<cm_id>/likes', views.LikeComment.as_view()),
    path('<id>/comments/<cm_id>/replies', views.Replies.as_view()),
    path('<id>/comments/<cm_id>/replies/<re_id>', views.ReplyInfo.as_view()),
    path('<id>/comments/<cm_id>/replies/<re_id>/likes', views.LikeReply.as_view()),
    path('map/<int:pk>', views.MapAPIView.as_view()),
]
