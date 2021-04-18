from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.exceptions import ParseError
from rest_framework import filters
from django.db.models import Q
from django.http import Http404

from django.db.models import Q
from django.http import Http404
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status


from .models import Shop
from .serializers import ShopSerializer
from users.models import MyUser
from .models import Comment
from .serializers import CommentSerializer
from .serializers import ListCommentSerializer
from .models import Rate
from .serializers import RateSerializer
from .serializers import ListRateSerializer

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
        searchedword = self.request.query_params.get('q', None)
        queryset = Shop.objects.all()
        if searchedword is None:
            return queryset
        if searchedword is not None:
            if searchedword == "":
                raise Http404
            queryset = queryset.filter(
                Q(mantaghe__icontains=searchedword)
            )
            if len(queryset) == 0:
                raise Http404
        return queryset
