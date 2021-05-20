from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from .permission import *
from items.models import Item,ItemLike
from items.serializers import ItemSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import *
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