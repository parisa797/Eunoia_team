from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError


from .models import Shop
from .serializers import ShopSerializer
# from accounts.models import User

class ShopListCreateAPIView(generics.ListCreateAPIView):
    
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class ShopRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
