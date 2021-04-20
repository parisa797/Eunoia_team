from rest_framework import serializers

from .models import Shop
from users.models import MyUser

class ShopSerializer(serializers.ModelSerializer): 

    class Meta: 
        model = Shop 
        fields = '__all__'