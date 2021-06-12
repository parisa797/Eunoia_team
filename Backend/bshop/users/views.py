from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from .permission import *
from items.models import Item,ItemLike
from items.serializers import ItemSerializer
from shops.models import Shop,ShopLike
from shoppings.models import ShoppingList
from shops.serializers import ShopSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import *
import datetime
from datetime import timedelta
from django.http import Http404
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from items.models import SpecialItem
# Create your views here.

class UploadFile(generics.CreateAPIView):
    queryset = Media.objects.all()
    # serializer_class = MediaSerializer
    serializer_class = ProfilePicserializer
    parser_classes = (MultiPartParser, FormParser)


class ProfileInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = MyUser.objects.all()
    serializer_class = Profileserializer
    #permission_classes = [IsUser,IsAuthenticated] #felan bashe
    permission_classes = [IsAuthenticated] #felan bashe

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.request.user)
        return Response(serializer.data)

class DeleteImg(generics.UpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = Profileserializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user=self.get_object()
        user.files.remove(request.data['files'])
        Media.objects.get(id=request.data['files']).delete()
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class UserItem(generics.ListAPIView):
    queryset = MyUser.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
    #pagination_class = PageNumberPagination

    def get_object(self):
        likedones=ItemLike.objects.filter(liked_by=self.request.user)
        item=[]
        for like in likedones:
            item.append(like.liked_item)
        return item

    def list(self, request, *args, **kwargs):
        item = self.get_object()
        serializer = ItemSerializer(item, many=True)
        return Response(serializer.data)

class UserShop(generics.ListAPIView):
    queryset = MyUser.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        likedones=ShopLike.objects.filter(shop_liked_by=self.request.user)
        shop=[]
        for like in likedones:
            shop.append(like.shop_liked_shop)
        return shop

    def list(self, request, *args, **kwargs):
        shop = self.get_object()
        serializer = ShopSerializer(shop, many=True)
        return Response(serializer.data)

class MapUserAPIView(generics.UpdateAPIView):

    queryset = MyUser.objects.all()
    serializer_class = Profileserializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.longitude = request.data.get('longitude', instance.longitude)
        instance.latitude = request.data.get('latitude', instance.latitude)
        instance.save()
        serializer = Profileserializer(instance)
        return Response(serializer.data)

class CreateCoins(generics.ListCreateAPIView):
    queryset = Coins.objects.all()
    serializer_class = CoinSerializer
    permission_classes = [IsAuthenticated] ### baraye get male hamash

    def get_object(self):
        list = ShoppingList.objects.filter(user=self.request.user)
        if list.count()>0:
            max=list[0].date
            for i in list:
                #i.date-datetime.datetime.now()
                if i.date-max>0:
                    max=i.date
            return max
        return None

    def perform_create(self, serializer):
        max = self.get_object()
        serializer.save(user=self.request.user,last_buy=max)


    def create(self, request, *args, **kwargs):
        if Coins.objects.filter(user=self.request.user).exists():
            return Response(data="You made coins before", status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        coin=Coins.objects.all()
        serializer = CoinSerializer(coin, many=True)
        return Response(serializer.data)

class CoinInfo(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coins.objects.all()
    serializer_class = CoinSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        coin_id = self.kwargs.get('pk')
        coin=Coins.objects.get(id=coin_id)
        return coin

    def retrieve(self, request, *args, **kwargs):
        coin = self.get_object()
        if coin == None:
            return Response(data="item Not found", status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(coin)
        return Response(serializer.data)

class CoinUpdate(generics.UpdateAPIView):
    queryset = Coins.objects.all()
    serializer_class = CoinSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        coin_id = self.kwargs.get('pk')
        coin=Coins.objects.get(id=coin_id)
        return coin

    def update(self, request, *args, **kwargs):
        coin = self.get_object()
        list = ShoppingList.objects.filter(user=self.request.user)
        if len(list)>0:
            max=list[0].date
            for i in list:
                if i.date-max>timedelta(days=0):
                    max=i.date
            if timezone.now()-max>=timedelta(days=90):
                coin.money-=2
            if  coin.money<=0:
                coin.money=0
            coin.last_buy=max
        if coin.money>=500:
            coin.rank='bronze'
            print(coin.rank)
        if coin.money>=1000:
            coin.rank='silver'
        if coin.money>=1500:
            coin.rank='gold'
        coin.save()
        serializer = CoinSerializer(coin)
        return Response(serializer.data)


class ShoppingWithCoinListCreate(generics.CreateAPIView):
    queryset = ShoppingWithCoin.objects.all()
    serializer_class = ShoppingWithCoinSerializer
    permission_classes = [CoinsOwner,IsAuthenticated] ### baraye get male hamash

    def get_object(self):
        coin=Coins.objects.get(user=self.request.user)
        sitem=SpecialItem.objects.get(id=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, coin)
        return coin,sitem


    def perform_create(self, serializer):
        coin,sitem = self.get_object()
        serializer.save(coin=coin,special_item=sitem)


    def create(self, request, *args, **kwargs):
        coin,sitem = self.get_object()
        if coin is None:
            return Response(data="you don't have enough coins", status=status.HTTP_400_BAD_REQUEST)
        if sitem is None:
            return Response(data="this prize is not avaible", status=status.HTTP_400_BAD_REQUEST)
        money=coin.money-sitem.price
        if money<0:
            return Response(data="you don't have enough coin for this prize", status=status.HTTP_400_BAD_REQUEST)
        coin.money=money
        coin.save()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(data="You got this award. Please visit this address between 9 am and 4 pm with the national card to receive the award"
                       , status=status.HTTP_201_CREATED)

    # def list(self, request, *args, **kwargs):
    #     coin, sitem = self.get_object()
    #     sc=ShoppingWithCoin.objects.filter(coin=coin)
    #     serializer = ShoppingWithCoinSerializer(sc, many=True)
    #     return Response(serializer.data)

class ShoppingWithCoinListList(generics.ListAPIView):
    queryset = ShoppingWithCoin.objects.all()
    serializer_class = ShoppingWithCoinSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        coin=Coins.objects.get(user=self.request.user)
        self.check_object_permissions(self.request, coin)
        return coin
    def list(self, request, *args, **kwargs):
        coin = self.get_object()
        sc=ShoppingWithCoin.objects.filter(coin=coin)
        serializer = ShoppingWithCoinSerializer(sc, many=True)
        return Response(serializer.data)



class ShoppingWithCoinListRetrieve(generics.RetrieveAPIView):
    queryset = ShoppingWithCoin.objects.all()
    serializer_class = ShoppingWithCoinSerializer
    permission_classes = [IsAuthenticated]