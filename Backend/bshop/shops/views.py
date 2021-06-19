from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny,IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ParseError
from rest_framework import filters
from django.db.models import Q
from django.http import Http404
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework import status

from .models import *
from .serializers import *
from users.models import MyUser
from .permission import *

class ShopCreateAPIView(generics.CreateAPIView):

    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user':request.user.id})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class AllShopListAPIView(generics.ListAPIView):

    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class OwnerFilterBackend(filters.BaseFilterBackend):
        def filter_queryset(self, request, queryset, view):
            return queryset.filter(user=request.user)


class ShopListAPIView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    filter_backends = (OwnerFilterBackend,)



class ShopRetrieveAPIView(generics.RetrieveAPIView):

    authentication_classes = []
    permission_classes = [AllowAny]
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

class ShopUpdateAPIView(generics.UpdateAPIView):

    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.title = request.data.get('title', instance.title)
        instance.manager = request.data.get('manager', instance.manager)
        instance.address = request.data.get('address', instance.address)
        instance.logo = request.data.get('logo', instance.logo)
        instance.theme = request.data.get('theme', instance.theme)
        instance.shomare_sabt = request.data.get('shomare_sabt', instance.shomare_sabt)
        instance.phone = request.data.get('phone', instance.phone)
        instance.online = request.data.get('online', instance.online)
        instance.mantaghe = request.data.get('mantaghe', instance.mantaghe)
        instance.shop_phone = request.data.get('shop_phone', instance.shop_phone)
        instance.save()
        serializer = ShopSerializer(instance)
        return Response(serializer.data)

class MapAPIView(generics.UpdateAPIView):

    queryset = Shop.objects.all()
    serializer_class = ShopSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.longitude = request.data.get('longitude', instance.longitude)
        instance.latitude = request.data.get('latitude', instance.latitude)
        instance.save()
        serializer = ShopSerializer(instance)
        return Response(serializer.data)
    

class ShopDestroyAPIView(generics.DestroyAPIView):

    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class RateCreateAPIView(generics.CreateAPIView):
    serializer_class = RateSerializer

    def get_queryset(self):
        queryset = Rate.objects.filter(shop=self.kwargs['pk'])
        return queryset

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user':request.user.id})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class RateListAPIView(generics.ListAPIView):
    serializer_class = ListRateSerializer

    def get_queryset(self):
        queryset = Rate.objects.filter(shop=self.kwargs['pk'])
        return queryset

class RateRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rate.objects.all()
    serializer_class = ListRateSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.rate = request.data.get('rate', instance.rate)
        instance.save()
        serializer = RateSerializer(instance)
        return Response(serializer.data)


class CommentCreateAPIView(generics.CreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.filter(shop=self.kwargs['pk'])
        return queryset

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user':request.user.id})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CommentListAPIView(generics.ListAPIView):
    serializer_class = ListCommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.filter(shop=self.kwargs['pk'])
        return queryset.order_by('-date')

class CommentRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.text = request.data.get('text', instance.text)
        instance.save()
        serializer = CommentSerializer(instance)
        return Response(serializer.data)

#####search
class ShopSearch(generics.ListAPIView):
    serializer_class = ShopSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        searchedword = self.request.query_params.get('q', None)
        queryset = Shop.objects.all()
        if searchedword is None:
            return queryset
        if searchedword is not None:
            if searchedword == "":
                raise Http404
            queryset = queryset.filter(
                Q(title__icontains=searchedword) |
                Q(address__icontains=searchedword)
            )
            if len(queryset) == 0:
                raise Http404
        return queryset

class TopShopListAPIView(generics.ListAPIView):
    serializer_class = ShopSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = sorted(Shop.objects.all(), key=lambda a: a.rate_value, reverse=True)
        return queryset

class MantagheShopListAPIView(generics.ListAPIView):
    serializer_class = ShopSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Shop.objects.filter(mantaghe=q)
        return queryset

class BoardCreateAPIView(generics.CreateAPIView):

    serializer_class = BoardSerializer

    def get_queryset(self):
        queryset = Board.objects.filter(shop=self.kwargs['pk'])
        return queryset

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user':request.user.id})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class BoardListAPIView(generics.ListAPIView):

    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = BoardSerializer

    def get_queryset(self):
        queryset = Board.objects.filter(shop=self.kwargs['pk'])
        return queryset


class BoardRetrieveAPIView(generics.RetrieveAPIView):

    queryset = Board.objects.all()
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = BoardSerializer


class BoardUpdateAPIView(generics.UpdateAPIView):

    queryset = Board.objects.all()
    serializer_class = BoardSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.image = request.data.get('image', instance.image)
        instance.image_url = request.data.get('image_url', instance.image_url)
        instance.save()
        serializer = BoardSerializer(instance)
        return Response(serializer.data)


class BoardDestroyAPIView(generics.DestroyAPIView):

    queryset = Board.objects.all()
    serializer_class = BoardSerializer

class LikeShop(generics.ListCreateAPIView):
    queryset = ShopLike.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        shop_id = self.kwargs.get('id')
        shop = Shop.objects.get(id=shop_id)

        # if item.shopID != shop:
        #     shop = None
        return shop

    def perform_create(self, serializer):
        shop = self.get_object()
        mem = []
        mem.append(self.request.user)
        serializer.save(shop_liked_shop=shop, shop_liked_by=mem)

    def create(self, request, *args, **kwargs):
        shop = self.get_object()
        if shop == None:
            return Response(data="shop Not found", status=status.HTTP_404_NOT_FOUND)
        if ShopLike.objects.filter(shop_liked_shop=shop).exists():
            shoplikeObj = ShopLike.objects.get(shop_liked_shop=shop)
            if shoplikeObj.shop_liked_by.filter(username=self.request.user.username).exists():
                shoplikeObj.shop_liked_by.remove(self.request.user)
            else:
                shoplikeObj.shop_liked_by.add(self.request.user)
            return Response(data=LikeSerializer(shoplikeObj).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        shop = self.get_object()
        if shop == None:
            return Response(data="shop Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = ShopLike.objects.filter(shop_liked_shop=shop)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class LikeComment(generics.ListCreateAPIView):
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        shop_id = self.kwargs.get('id')
        comment_id = self.kwargs.get('cm_id')
        shop = Shop.objects.get(id=shop_id)
        comment = Comment.objects.get(id=comment_id)
        #self.check_object_permissions(self.request, com)

        # if item.shopID != shop:
        #     item = None
        # check whether the comment belongs to the community
        # if comment.ShopID != shop:
        #     comment = None
        return (shop, comment)

    def perform_create(self, serializer):
        shop, comment = self.get_object()
        mem = []
        mem.append(self.request.user)
        serializer.save(shop_liked_comment=comment, comment_liked_by=mem)

    def create(self, request, *args, **kwargs):
        shop, comment = self.get_object()
        if shop == None:
            return Response(data="Shop Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        if CommentLike.objects.filter(shop_liked_comment=comment).exists():
            commentlikeObj = CommentLike.objects.get(shop_liked_comment=comment)
            if commentlikeObj.comment_liked_by.filter(username=self.request.user.username).exists():
                commentlikeObj.comment_liked_by.remove(self.request.user)
            else:
                commentlikeObj.comment_liked_by.add(self.request.user)
            return Response(data=CommentLikeSerializer(commentlikeObj).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        shop, comment = self.get_object()
        if shop == None:
            return Response(data="Shop Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = CommentLike.objects.filter(shop_liked_comment=comment)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


########################################Reply

class Replies(generics.ListCreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthor,IsAuthenticatedOrReadOnly] ##fagat owner

    def get_object(self):
        shop_id = self.kwargs.get('id')
        comment_id = self.kwargs.get('cm_id')
        shop = Shop.objects.get(id=shop_id)
        comment = Comment.objects.get(id=comment_id)
        # if comment.ShopID != shop:
        #     comment = None

        return (comment, shop)

    def perform_create(self, serializer):
        comment, shop = self.get_object()
        serializer.save(commentID=comment, user=self.request.user)

    def create(self, request, *args, **kwargs):
        comment, shop = self.get_object()
        if shop == None or comment == None:
            return Response(data="your request Not found", status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        comment, shop = self.get_object()
        if shop == None or comment == None:
            return Response(data="your request Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = Reply.objects.filter(commentID=comment)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ReplyInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthor, IsAuthenticatedOrReadOnly]  # permission bayad dorost she

    def get_object(self):
        cm_id = self.kwargs.get('cm_id')
        rp_id = self.kwargs.get('re_id')
        reply = Reply.objects.get(id=rp_id)
        comment = Comment.objects.get(id=cm_id)
        if reply.commentID != comment:
            reply = None
        return reply

    def retrieve(self, request, *args, **kwargs):
        reply = self.get_object()
        if reply == None:
            return Response(data="reply Not found", status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(reply)
        return Response(serializer.data)


class LikeReply(generics.ListCreateAPIView):
    queryset = ReplyLike.objects.all()
    serializer_class = ReplyLikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        shop_id = self.kwargs.get('id')
        comment_id = self.kwargs.get('cm_id')
        rp_id = self.kwargs.get('re_id')
        shop = Shop.objects.get(id=shop_id)
        comment = Comment.objects.get(id=comment_id)
        reply = Reply.objects.get(id=rp_id)

        # check whether the post belongs to the community
        # if item.shopID != shop:
        #     item = None
        # check whether the comment belongs to the community
        # if comment.ShopID != shop:
        #     comment = None
        if reply.commentID != comment:
            reply = None
        return (reply, comment, shop)

    def perform_create(self, serializer):
        reply, comment, shop = self.get_object()
        mem = []
        mem.append(self.request.user)
        serializer.save(liked_reply=reply, reply_liked_by=mem)

    def create(self, request, *args, **kwargs):
        reply, comment, shop = self.get_object()
        if shop == None:
            return Response(data="Shop Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        if reply == None:
            return Response(data="Reply Not found", status=status.HTTP_404_NOT_FOUND)

        if ReplyLike.objects.filter(liked_reply=reply).exists():
            replylikeObj = ReplyLike.objects.get(liked_reply=reply)
            if replylikeObj.reply_liked_by.filter(username=self.request.user.username).exists():
                replylikeObj.reply_liked_by.remove(self.request.user)
            else:
                replylikeObj.reply_liked_by.add(self.request.user)
            return Response(data=ReplyLikeSerializer(replylikeObj).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        reply, comment, shop = self.get_object()
        if shop == None:
            return Response(data="Shop Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        if reply == None:
            return Response(data="Reply Not found", status=status.HTTP_404_NOT_FOUND)

        queryset = ReplyLike.objects.filter(liked_reply=reply)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CommentReply(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentReplySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        comment = Comment.objects.filter(shop=self.kwargs.get('id'))
        return comment

    def list(self, request, *args, **kwargs):
        comment = self.get_object()
        serializer = CommentReplySerializer(comment, many=True)
        return Response(serializer.data)

