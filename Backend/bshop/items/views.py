from django.shortcuts import render
from rest_framework import mixins
from rest_framework import generics
from .serializers import *
from .models import *
from users.models import MyUser
from shops.models import Shop
from django.db.models import Q
from django.http import Http404
from rest_framework.permissions import IsAuthenticated, AllowAny , IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from .permission import *
from rest_framework.pagination import PageNumberPagination
import datetime
from django.db.models import Count
from django.utils.dateparse import parse_date
from datetime import datetime, timedelta
from jalali_date import date2jalali
from persiantools.jdatetime import JalaliDate
from rest_framework.permissions import  IsAdminUser


# from django.http import HttpResponse
# Create your views here.

class Search(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        searchedword = self.request.query_params.get('q', None)
        queryset = Item.objects.all()
        if searchedword is None:
            return queryset
        if searchedword is not None:
            if searchedword == "":
                raise Http404
            queryset = queryset.filter(
                Q(name__icontains=searchedword) |
                Q(description__icontains=searchedword)
            )
            if len(queryset) == 0:
                raise Http404
        return queryset

class ItemInShopSearch(generics.ListAPIView):
    serializer_class = CreateListItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        searchedword = self.request.query_params.get('q', None)
        shop_id = self.kwargs.get('pk')
        queryset = Item.objects.filter(shopID=shop_id)
        if searchedword is None:
            return queryset
        if searchedword is not None:
            if searchedword == "":
                raise Http404
            queryset = queryset.filter(
                Q(name__icontains=searchedword) |
                Q(description__icontains=searchedword)
            )
            if len(queryset) == 0:
                raise Http404
        return queryset


class CreateItem(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = CreateListItemSerializer
    permission_classes = [IsOwner,IsAuthenticatedOrReadOnly] ### baraye get male hamash

    def get_object(self):
        shop_id = self.kwargs.get('pk')
        try:
            shops = Shop.objects.get(id=shop_id)
        except shops.DoesNotExist:
            return None
        self.check_object_permissions(self.request, shops)
        return shops

    def perform_create(self, serializer):
        shops = self.get_object()
        serializer.save(shopID=shops) ###### in bayad onlineshop ham biad
        #serializer.save()

    def create(self, request, *args, **kwargs):
        shop = self.get_object()
        if shop == None:
            return Response(data="Shop Not found", status=status.HTTP_404_NOT_FOUND)
        if 'manufacture_Date' in request.data.keys()  and 'Expiration_Date' in request.data.keys():
            temp=request.data['manufacture_Date'].split("-")
            Ma=JalaliDate(int(temp[0]), int(temp[1]), int(temp[2])).to_gregorian()
            temp=request.data['Expiration_Date'].split("-")
            Ex = JalaliDate(int(temp[0]), int(temp[1]), int(temp[2])).to_gregorian()

            delta = (Ex) - (Ma)
            if delta< timedelta(days=0): ##darbareye
                return Response(data="Expiration_Date is " +str(delta).split("-")[1].split(",")[0]  +"  before manufacture_Date", status=status.HTTP_400_BAD_REQUEST)
       # elif delta == timedelta(days=0): ##darbareye
           # return Response(data="Expiration_Date is the same day as manufacture_Date", status=status.HTTP_400_BAD_REQUEST)
        serializer_data = request.data.copy()
        if "discount" in request.data.keys() :
            serializer_data.update({'price_with_discount':(int(request.data['price']) * (100 - int(request.data['discount'])) / 100)})
        else :
            serializer_data.update({'price_with_discount': (int(request.data['price']))})
        # serializer = self.get_serializer(data=request.data)
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        shop_id = self.get_object()
        shopItems=Item.objects.filter(shopID=shop_id)
        serializer = CreateListItemSerializer(shopItems, many=True)
        return Response(serializer.data)

class ItemInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsOwner,IsAuthenticatedOrReadOnly]

    def get_object(self):
        shop_id = self.kwargs.get('pk')
        item_id = self.kwargs.get('id')
        shops = Shop.objects.get(id=shop_id)
        items = Item.objects.get(id=item_id)
        self.check_object_permissions(self.request,items)
        # check whether the post belongs to the community
        if items.shopID != shops:
            items = None
        return items
    def update(self, request, *args, **kwargs):
        if 'manufacture_Date' in request.data.keys()  and 'Expiration_Date' in request.data.keys():
            temp = request.data['manufacture_Date'].split("-")
            Ma = JalaliDate(int(temp[0]), int(temp[1]), int(temp[2])).to_gregorian()
            temp = request.data['Expiration_Date'].split("-")
            Ex = JalaliDate(int(temp[0]), int(temp[1]), int(temp[2])).to_gregorian()
            delta = (Ex) - (Ma)

            if delta < timedelta(days=0):
                return Response(data="Expiration_Date is " + str(delta).split("-")[1].split(",")[0] + "  before manufacture_Date",
                    status=status.HTTP_400_BAD_REQUEST)

        return super().update(request)

    def retrieve(self, request, *args, **kwargs):
        items = self.get_object()
        if items == None:
            return Response(data="item Not found", status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(items)
        return Response(serializer.data)

class MostExpensiveAllItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.all()
        return queryset.order_by('-price_with_discount')


class CheapestAllItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.all()
        # return queryset.order_by('price')
        return queryset.order_by('price_with_discount')

class NewestAllItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.all()
        return queryset.order_by('-manufacture_Date')

class MostDiscountsAllItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.all()
        return queryset.order_by('-discount')

class FilterCategoryItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(category=q)
        return queryset

class ExpensiveFilterItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(category=q)
        return queryset.order_by('-price_with_discount')

class CheapFilterItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(category=q)
        return queryset.order_by('price_with_discount')

class NewFilterItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(category=q)
        return queryset.order_by('-manufacture_Date')

class DiscountsFilterItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(category=q)
        return queryset.order_by('-discount')

class MostExpensiveAllItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.filter(shopID=self.kwargs['pk'])
        return queryset.order_by('-price_with_discount')

class CheapestAllItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.filter(shopID=self.kwargs['pk'])
        return queryset.order_by('price_with_discount')

class NewestAllItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.filter(shopID=self.kwargs['pk'])
        return queryset.order_by('-manufacture_Date')

class MostDiscountsOneShopAllItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.filter(shopID=self.kwargs['pk'])
        return queryset.order_by('-discount')

class FilterCategoryItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(shopID=self.kwargs['pk']).filter(category=q)
        return queryset

class ExpensiveFilterItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(shopID=self.kwargs['pk']).filter(category=q)
        return queryset.order_by('-price_with_discount')

class CheapFilterItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(shopID=self.kwargs['pk']).filter(category=q)
        return queryset.order_by('price_with_discount')

class NewFilterItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(shopID=self.kwargs['pk']).filter(category=q)
        return queryset.order_by('-manufacture_Date')

class DiscountsFilterItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(shopID=self.kwargs['pk']).filter(category=q)
        return queryset.order_by('-discount')

class FilterBrandItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(brand=q)
        return queryset

class FilterBrandItemOneShopListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(shopID=self.kwargs['pk']).filter(brand=q)
        return queryset

########################################like
class LikeItem(generics.ListCreateAPIView):
    queryset = ItemLike.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        shop_id = self.kwargs.get('pk')
        item_id = self.kwargs.get('id')
        shop = Shop.objects.get(id=shop_id)
        item = Item.objects.get(id=item_id)

        # check whether the post belongs to the community
        if item.shopID != shop:
            shop = None
        return item

    def perform_create(self, serializer):
        item = self.get_object()
        mem = []
        mem.append(self.request.user)
        serializer.save(liked_item=item, liked_by=mem)

    def create(self, request, *args, **kwargs):
        item = self.get_object()
        if item == None:
            return Response(data="post Not found", status=status.HTTP_404_NOT_FOUND)
        if ItemLike.objects.filter(liked_item=item).exists():
            itemlikeObj = ItemLike.objects.get(liked_item=item)
            if itemlikeObj.liked_by.filter(username=self.request.user.username).exists():
                itemlikeObj.liked_by.remove(self.request.user)
            else:
                itemlikeObj.liked_by.add(self.request.user)
            return Response(data=LikeSerializer(itemlikeObj).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        item = self.get_object()
        if item == None:
            return Response(data="item Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = ItemLike.objects.filter(liked_item=item)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

########################################comment
class Comments(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    #pagination_class = PageNumberPagination

    def get_object(self):
        item_id = self.kwargs.get('id')
        shop_id = self.kwargs.get('pk')
        item = Item.objects.get(id=item_id)
        shop = Shop.objects.get(id=shop_id)

        # check whether the post belongs to the community
        if item.shopID != shop:
            item = None
        #self.check_object_permissions(self.request, shop)

        return (shop, item)

    def perform_create(self, serializer):
        shop, item = self.get_object()
        serializer.save(ItemID=item, user=self.request.user)

    def create(self, request, *args, **kwargs):
        shop, item = self.get_object()
        if item == None:
            return Response(data="Item Not found", status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        shop, item = self.get_object()
        if item == None:
            return Response(data="Item Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = Comment.objects.filter(ItemID=item)

        # if q is None, return all data
        # q = self.request.query_params.get('page', None)
        # if not q:
        #     serializer = self.get_serializer(queryset, many=True)
        #     return Response(serializer.data)
        #
        # page = self.paginate_queryset(queryset)
        # if page is not None:
        #     serializer = self.get_serializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CommentInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthor, IsAuthenticatedOrReadOnly]  # permission bayad dorost she

    def get_object(self):
        item_id = self.kwargs.get('id')
        # com_id = self.kwargs.get('pk')
        cm_id = self.kwargs.get('cm_id')
        item = Item.objects.get(id=item_id)
        # com = community.objects.get(communityID=com_id)
        comment = Comment.objects.get(id=cm_id)
        if comment.ItemID != item:
            comment = None
        self.check_object_permissions(self.request, comment)
        return comment

    def retrieve(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment == None:
            return Response(data="comment Not found", status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(comment)
        return Response(serializer.data)


class LikeComment(generics.ListCreateAPIView):
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        shop_id = self.kwargs.get('pk')
        item_id = self.kwargs.get('id')
        comment_id = self.kwargs.get('cm_id')
        shop = Shop.objects.get(id=shop_id)
        item = Item.objects.get(id=item_id)
        comment = Comment.objects.get(id=comment_id)
        #self.check_object_permissions(self.request, com)

        # check whether the post belongs to the community
        if item.shopID != shop:
            item = None
        # check whether the comment belongs to the community
        if comment.ItemID != item:
            comment = None
        return (item, comment)

    def perform_create(self, serializer):
        item, comment = self.get_object()
        mem = []
        mem.append(self.request.user)
        serializer.save(liked_comment=comment, liked_by=mem)

    def create(self, request, *args, **kwargs):
        item, comment = self.get_object()
        if item == None:
            return Response(data="Item Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        if CommentLike.objects.filter(liked_comment=comment).exists():
            commentlikeObj = CommentLike.objects.get(liked_comment=comment)
            if commentlikeObj.liked_by.filter(username=self.request.user.username).exists():
                commentlikeObj.liked_by.remove(self.request.user)
            else:
                commentlikeObj.liked_by.add(self.request.user)
            return Response(data=CommentLikeSerializer(commentlikeObj).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        item, comment = self.get_object()
        if item == None:
            return Response(data="Item Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = CommentLike.objects.filter(liked_comment=comment)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


########################################Reply

class Replies(generics.ListCreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthor,IsAuthenticatedOrReadOnly] ##fagat owner

    def get_object(self):
        item_id = self.kwargs.get('id')
        shop_id = self.kwargs.get('pk')
        comment_id = self.kwargs.get('cm_id')
        item = Item.objects.get(id=item_id)
        shop = Shop.objects.get(id=shop_id)
        comment = Comment.objects.get(id=comment_id)
        # check whether the post belongs to the community
        if item.shopID != shop:
            item = None
        if comment.ItemID != item:
            comment = None
        self.check_object_permissions(self.request, shop)

        return (comment, item)

    def perform_create(self, serializer):
        comment, item = self.get_object()
        serializer.save(commentID=comment, user=self.request.user)

    def create(self, request, *args, **kwargs):
        comment, item = self.get_object()
        if item == None or comment == None:
            return Response(data="your request Not found", status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        comment, item = self.get_object()
        if item == None or comment == None:
            return Response(data="your request Not found", status=status.HTTP_404_NOT_FOUND)
        queryset = Reply.objects.filter(commentID=comment)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ReplyInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthor, IsAuthenticatedOrReadOnly]  # permission bayad dorost she

    def get_object(self):
        # post_id = self.kwargs.get('id')
        shop_id = self.kwargs.get('pk')
        cm_id = self.kwargs.get('cm_id')
        rp_id = self.kwargs.get('re_id')
        # post = CommunityPost.objects.get(id=post_id)
        reply = Reply.objects.get(id=rp_id)
        shop = Shop.objects.get(id=shop_id)
        comment = Comment.objects.get(id=cm_id)
        if reply.commentID != comment:
            reply = None
        self.check_object_permissions(self.request, shop)
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
        shop_id = self.kwargs.get('pk')
        item_id = self.kwargs.get('id')
        comment_id = self.kwargs.get('cm_id')
        rp_id = self.kwargs.get('re_id')
        shop = Shop.objects.get(id=shop_id)
        item = Item.objects.get(id=item_id)
        comment = Comment.objects.get(id=comment_id)
        reply = Reply.objects.get(id=rp_id)
        self.check_object_permissions(self.request, shop)

        # check whether the post belongs to the community
        if item.shopID != shop:
            item = None
        # check whether the comment belongs to the community
        if comment.ItemID != item:
            comment = None
        if reply.commentID != comment:
            reply = None
        return (reply, comment, item)

    def perform_create(self, serializer):
        reply, comment, item = self.get_object()
        mem = []
        mem.append(self.request.user)
        serializer.save(liked_reply=reply, liked_by=mem)

    def create(self, request, *args, **kwargs):
        reply, comment, item = self.get_object()
        if item == None:
            return Response(data="Item Not found", status=status.HTTP_404_NOT_FOUND)
        if comment == None:
            return Response(data="Comment Not found", status=status.HTTP_404_NOT_FOUND)
        if reply == None:
            return Response(data="Reply Not found", status=status.HTTP_404_NOT_FOUND)

        if ReplyLike.objects.filter(liked_reply=reply).exists():
            replylikeObj = ReplyLike.objects.get(liked_reply=reply)
            if replylikeObj.liked_by.filter(username=self.request.user.username).exists():
                replylikeObj.liked_by.remove(self.request.user)
            else:
                replylikeObj.liked_by.add(self.request.user)
            return Response(data=ReplyLikeSerializer(replylikeObj).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        reply, comment, item = self.get_object()
        if item == None:
            return Response(data="Item Not found", status=status.HTTP_404_NOT_FOUND)
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
    #pagination_class = PageNumberPagination

    def get_object(self):
        comment = Comment.objects.filter(ItemID=self.kwargs.get('id'))
        return comment

    def list(self, request, *args, **kwargs):
        comment = self.get_object()
        serializer = CommentReplySerializer(comment, many=True)
        return Response(serializer.data)

########################rate
class RateCreateAPIView(generics.ListCreateAPIView):
    serializer_class = RateSerializer

    def get_object(self):
        queryset = Rate.objects.filter(item=self.kwargs['id'])
        return queryset

    def perform_create(self, serializer):
        item=Item.objects.get(id=self.kwargs['id'])
        serializer.save(item=item)

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user':request.user.id})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.get_object()
        serializer = ListRateSerializer(queryset, many=True)
        return Response(serializer.data)


class RateRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rate.objects.all()
    serializer_class = ListRateSerializer
    serializer_class = RateSerializer

    def get_object(self):
        rate_id = self.kwargs.get('rate_id')
        rate = Rate.objects.get(id=rate_id)
        self.check_object_permissions(self.request, rate)
        return rate

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.rate = request.data.get('rate', instance.rate)
        instance.save()
        serializer = RateSerializer(instance)
        return Response(serializer.data)

#######################SpecialItem####################
class SpecialItemCreate(generics.CreateAPIView):
    queryset = SpecialItem.objects.all()
    serializer_class = SepcialItemSerializer
    permission_classes = [IsAdminUser,IsAuthenticated] ### baraye get male hamash

class SpecialItemList(generics.ListAPIView):
    queryset = SpecialItem.objects.all()
    serializer_class = SepcialItemSerializer
    permission_classes = [AllowAny]

class SpecialItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpecialItem.objects.all()
    serializer_class = SepcialItemSerializer
    permission_classes = [IsAdminUser, IsAuthenticated]

class SpecialItemRetrieveAPIView(generics.RetrieveAPIView):
    queryset = SpecialItem.objects.all()
    serializer_class = SepcialItemSerializer
    permission_classes = [AllowAny]

#######################QR for Item####################
class QRCreateAPIView(generics.ListCreateAPIView):
    queryset = QR.objects.all()
    serializer_class = QRSerializer
    permission_classes = [QRIsOwner]

    def get_object(self):
        item = Item.objects.get(id=self.kwargs['pk'])
        self.check_object_permissions(self.request, item)
        return item

    def perform_create(self, serializer):
        item=self.get_object()
        serializer.save(item=item)

    def create(self, request, *args, **kwargs):
        item=self.get_object()
        if QR.objects.filter(item=item).exists():
            return Response(data="You made QR before", status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        item=self.get_object()
        qr=QR.objects.filter(item=item)
        serializer = QRSerializer(qr, many=True)
        return Response(serializer.data)
