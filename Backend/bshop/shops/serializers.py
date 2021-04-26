from rest_framework import serializers

from .models import Shop
from .models import Rate
from .models import Comment
from users.models import MyUser
from users.serializers import Profileserializer
from jalali_date import date2jalali,datetime2jalali
#import json
#import datetime


class ShopSerializer(serializers.ModelSerializer): 

    comment_count = serializers.ReadOnlyField()
    rate_count = serializers.ReadOnlyField()
    rate_value = serializers.ReadOnlyField()

    class Meta: 
        model = Shop 
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer): 

    comments_user = serializers.RelatedField(read_only=True)
    comments_shop = serializers.RelatedField(read_only=True)
    date_jalali=serializers.SerializerMethodField('get_jalali_date')

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        # return json.dumps(serial, indent=4, sort_keys=True, default=str)
        return str(serial)

    
    class Meta: 
        model = Comment 
        fields = '__all__'

class ListCommentSerializer(serializers.ModelSerializer): 

    user = Profileserializer(read_only=True)
    comments_shop = serializers.RelatedField(read_only=True)
    date_jalali=serializers.SerializerMethodField('get_jalali_date')

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        # return json.dumps(serial, indent=4, sort_keys=True, default=str)
        return str(serial)
    
    class Meta: 
        model = Comment 
        fields = '__all__'

class RateSerializer(serializers.ModelSerializer): 

    rates_user = serializers.RelatedField(read_only=True)
    rates_shop = serializers.RelatedField(read_only=True)
    
    class Meta: 
        model = Rate 
        fields = '__all__'


class ListRateSerializer(serializers.ModelSerializer): 

    user = Profileserializer(read_only=True)
    rates_shop = serializers.RelatedField(read_only=True)
    
    class Meta: 
        model = Rate 
        fields = '__all__'