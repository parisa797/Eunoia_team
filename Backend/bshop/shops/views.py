from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.exceptions import ParseError
from rest_framework import filters

from django.db.models import Q
from django.http import Http404
from rest_framework.authentication import TokenAuthentication
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status


from .models import Shop
from .serializers import ShopSerializer
from users.models import MyUser

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
