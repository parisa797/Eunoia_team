from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.exceptions import ParseError
from rest_framework import filters
from django.db.models import Q
from django.http import Http404
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework import status
from django.utils import timezone
from datetime import timedelta

from .models import ShoppingList
from .serializers import ShoppingListSerializer
from .serializers import AllShoppingListSerializer
from users.models import MyUser
from users.serializers import Profileserializer


class ShoppingListCreateAPIView(generics.CreateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def create(self, request, *args, **kwargs):
        serializer_data = request.data.copy()
        serializer_data.update({'user':request.user.id})
        serializer_data.update({'address':request.user.address})
        serializer_data.update({'phone':request.user.phone})
        serializer = self.get_serializer(data=serializer_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class AllShoppingListAPIView(generics.ListAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer


class OwnerFilterBackend(filters.BaseFilterBackend):

        def filter_queryset(self, request, queryset, view):
            return queryset.filter(user=request.user)


class UserShoppingListAPIView(generics.ListAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    filter_backends = (OwnerFilterBackend,)



class ShoppingListRetrieveAPIView(generics.RetrieveAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer
    
class SabtShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.sabt = request.data.get('sabt', instance.sabt)
        instance.date = request.data.get('date', timezone.now())
        instance.save()
        serializer = ShoppingListSerializer(instance)
        return Response(serializer.data)

class OnlineShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.online = request.data.get('online', instance.online)
        instance.save()
        serializer = ShoppingListSerializer(instance)
        return Response(serializer.data)

class MaxCostShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.max_cost = request.data.get('max_cost', instance.max_cost)
        instance.save()
        serializer = ShoppingListSerializer(instance)
        return Response(serializer.data)

class ShoppingListUpdateAPIView(generics.UpdateAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.address = request.data.get('address', instance.address)
        instance.phone = request.data.get('phone', instance.phone)
        # instance.delivery_times = request.data.get(timezone.now() + timedelta(days=1), instance.delivery_times)
        instance.save()
        serializer = ShoppingListSerializer(instance)
        return Response(serializer.data)


class ShoppingListDestroyAPIView(generics.DestroyAPIView):

    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer