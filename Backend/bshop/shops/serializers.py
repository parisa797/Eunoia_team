from rest_framework import serializers

from .models import Shop
# from accounts.models import User

class ShopSerializer(serializers.ModelSerializer): 

    class Meta: 
        model = Shop 
        fields = '__all__'