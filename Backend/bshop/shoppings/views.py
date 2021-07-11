from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ParseError
from rest_framework import filters
from django.db.models import Q
from django.http import Http404
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
import requests
from datetime import datetime
from users.models import Coins
from users.models import ElectricWallet
from items.models import *


from .models import *
from .serializers import *
from users.models import MyUser
from users.serializers import Profileserializer


class ShoppingListCreateAPIView(generics.CreateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user': request.user.id})
        serializer_data.update({'address': request.user.address})
        serializer_data.update({'phone': request.user.phone})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AllShoppingListAPIView(generics.ListAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer


class OwnerFilterBackend(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        return queryset.filter(user=request.user)


class UserShoppingListAPIView(generics.ListAPIView):

    serializer_class = AllShoppingListSerializer
    filter_backends = (OwnerFilterBackend,)

    def get_queryset(self):
        queryset = ShoppingList.objects.filter(sabt=False)
        return queryset


class UserBuyAPIView(generics.ListAPIView):

    serializer_class = AllShoppingListSerializer
    filter_backends = (OwnerFilterBackend,)

    def get_queryset(self):
        queryset = ShoppingList.objects.filter(sabt=True)
        return queryset


class ShoppingListRetrieveAPIView(generics.RetrieveAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer


class SabtShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if (instance.address is None or instance.phone is None):
            return Response(data="address and phone should be defined", status=status.HTTP_400_BAD_REQUEST)

        if instance.wallet_boolean:
            wallet = ElectricWallet.objects.get(user=self.request.user)
            if wallet.money < instance.sum_price:
                return Response(data="you don't have enough money in your wallet", status=status.HTTP_400_BAD_REQUEST)
            money = wallet.money
            wallet.money = money - instance.sum_price
            wallet.save()
        # print(instance.id)
        if request.data['sabt']:
            i = 0
            for item in instance.shopping_list_items.all():
                for item in instance.shopping_list_items.all():
                    if ((instance.shopping_list_items.all()[i].number) > (Item.objects.get(id=instance.shopping_list_items.all()[i].item.id).count)):
                        # print("The number of itmes should be less than the total number")
                        return Response(data=str(instance.shopping_list_items.all()[i].id)+" : The number of itmes should be less than the total number", status=status.HTTP_400_BAD_REQUEST)
                Item.objects.filter(id=instance.shopping_list_items.all()[i].item.id).update(count = (Item.objects.get(id=instance.shopping_list_items.all()[i].item.id).count) - (instance.shopping_list_items.all()[i].number))
                i = i + 1

        instance.sabt = request.data.get('sabt', instance.sabt)
        instance.date = request.data.get('date', timezone.now())

        if Coins.objects.filter(user=self.request.user).exists():
            coin = Coins.objects.get(user=self.request.user)
            money = coin.money
            coin.money = int(instance.sum_price*(1/10000))+money
            coin.save()

        instance.save()
        serializer = AllShoppingListSerializer(instance)
        return Response(serializer.data)


class WalletShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.wallet_boolean = request.data.get(
            'wallet_boolean', instance.wallet_boolean)
        instance.save()
        serializer = AllShoppingListSerializer(instance)
        return Response(serializer.data)


class OnlineShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.online = request.data.get('online', instance.online)
        instance.save()
        serializer = AllShoppingListSerializer(instance)
        return Response(serializer.data)


class MaxCostShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if(int(request.data.get('max_cost')) == 0):
            instance.max_cost = request.data.get('max_cost', instance.max_cost)
            instance.save()
            serializer = AllShoppingListSerializer(instance)
            return Response(serializer.data)
        if((ShoppingList.objects.get(id=self.kwargs['pk']).sum_price) > int(request.data.get('max_cost'))):
            return Response(data="max_cost should be smaller than sum_price", status=status.HTTP_400_BAD_REQUEST)
        instance.max_cost = request.data.get('max_cost', instance.max_cost)
        instance.save()
        serializer = AllShoppingListSerializer(instance)
        return Response(serializer.data)


class ShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.address = request.data.get('address', instance.address)
        instance.phone = request.data.get('phone', instance.phone)
        instance.save()
        serializer = AllShoppingListSerializer(instance)
        return Response(serializer.data)


class DeliveryShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        # datetime.strptime(date_time_str, '%d/%m/%y %H:%M:%S')
        # print(type(request.data.get('delivery', instance.delivery)))
        instance.delivery = request.data.get('delivery', instance.delivery)
        instance.delivery = datetime.strptime(
            instance.delivery, '%Y-%m-%d %H:%M')
        instance.save()
        serializer = AllShoppingListSerializer(instance)
        return Response(serializer.data)


class ShoppingListDestroyAPIView(generics.DestroyAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = AllShoppingListSerializer


class ShoppingItemCreateAPIView(generics.CreateAPIView):

    serializer_class = CreateShoppingItemSerializer

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        if(int(request.data['number']) > Item.objects.get(id=request.data['item']).count):
            return Response (data="The number of itmes should be less than the total number", status=status.HTTP_400_BAD_REQUEST)
        if(ShoppingList.objects.get(id=request.data['shopping_list']).max_cost == 0):
            serializer_data.update({'user': request.user.id})
            num_price = (int(Item.objects.get(
                id=request.data['item']).price_with_discount)) * int(request.data['number'])
            serializer_data.update({'sum_price': num_price})
            serializer_data.update(
                {'price': Item.objects.get(id=request.data['item']).price})
            serializer = self.get_serializer(data=serializer_data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        if((ShoppingList.objects.get(id=request.data['shopping_list']).sum_price) + (int(Item.objects.get(id=request.data['item']).price_with_discount)) * int(request.data['number']) > ShoppingList.objects.get(id=request.data['shopping_list']).max_cost):
            return Response(data="sum_price should be smaller than max_cost", status=status.HTTP_400_BAD_REQUEST)
        serializer_data.update({'user': request.user.id})
        num_price = (int(Item.objects.get(
            id=request.data['item']).price_with_discount)) * int(request.data['number'])
        serializer_data.update({'sum_price': num_price})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ShoppingItemListAPIView(generics.ListAPIView):

    serializer_class = ShoppingItemSerializer

    def get_queryset(self):
        queryset = ShoppingItem.objects.filter(shopping_list=self.kwargs['pk'])
        return queryset


class ShoppingListRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = ShoppingItemSerializer

    def get_queryset(self):
        queryset = ShoppingItem.objects.all()
        return queryset

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.number = request.data.get('number', instance.number)
        if (int(instance.number) > (Item.objects.get(id=instance.item.id).count)):
            return Response(data="The number of itmes should be less than the total number", status=status.HTTP_400_BAD_REQUEST)
        num_price = (int(Item.objects.get(id=instance.item.id).price_with_discount)) * int(instance.number)
        instance.sum_price = request.data.get('sum_price', num_price)
        # serializer_data.update({'sum_price': num_price})
        instance.save()
        serializer = ShoppingItemSerializer(instance)
        return Response(serializer.data)
