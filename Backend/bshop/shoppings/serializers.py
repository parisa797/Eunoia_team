from rest_framework import serializers

from .models import *
from users.models import MyUser
from users.serializers import Profileserializer
from items.serializers import ItemShoppnigSerializer
from jalali_date import date2jalali,datetime2jalali

class CreateShoppingItemSerializer(serializers.ModelSerializer):
    
    class Meta: 
        model = ShoppingItem 
        fields = '__all__'

class ShoppingItemSerializer(serializers.ModelSerializer):

    item = ItemShoppnigSerializer(read_only=True)
    
    class Meta: 
        model = ShoppingItem 
        fields = '__all__'


class ShoppingListSerializer(serializers.ModelSerializer): 

    shopping_list_user = serializers.RelatedField(read_only=True)
    shopping_list_shop = serializers.RelatedField(read_only=True)
    date_jalali = serializers.SerializerMethodField('get_jalali_date')

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)

    
    class Meta: 
        model = ShoppingList 
        fields = '__all__'

class AllShoppingListSerializer(serializers.ModelSerializer): 

    shopping_list_shop = serializers.RelatedField(read_only=True)
    shopping_list_items = ShoppingItemSerializer(many=True)
    date_jalali=serializers.SerializerMethodField('get_jalali_date')

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)
    
    class Meta: 
        model = ShoppingList 
        fields = '__all__'
