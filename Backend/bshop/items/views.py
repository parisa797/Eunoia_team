from django.shortcuts import render
from rest_framework import mixins
from rest_framework import generics
from .serializers import *
from .models import Item
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

        serializer = self.get_serializer(data=request.data)
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
        return queryset.order_by('-price')

class CheapestAllItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        queryset = Item.objects.all()
        return queryset.order_by('price')

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
        return queryset.order_by('-price')

class CheapFilterItemListAPIView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        q = self.request.query_params.get('q', None)
        queryset = Item.objects.filter(category=q)
        return queryset.order_by('price')

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
