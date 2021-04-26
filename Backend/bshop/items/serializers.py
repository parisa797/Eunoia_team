from rest_framework import serializers
from .models import *
from users.models import MyUser
from shops.models import Shop


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['title','manager','logo','address','shomare_sabt','phone', 'id']


class ItemSerializer(serializers.ModelSerializer):
    #Liked_By = UsersInfoserializer(source='liked_by', read_only=True, many=True)
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)
    ItemShop = ShopSerializer(source='shopID', read_only=True)

    class Meta:
        model= Item
        fields=['ItemShop','photo','name','shop_id','description', 'manufacture_Date','Expiration_Date','count','category','id','discount','price']

class CreateListItemSerializer(serializers.ModelSerializer):
    #Liked_By = UsersInfoserializer(source='liked_by', read_only=True, many=True)
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)

    class Meta:
        model= Item
        fields=['photo','name','shop_id','description', 'manufacture_Date','Expiration_Date','count','category','discount','price','id']
