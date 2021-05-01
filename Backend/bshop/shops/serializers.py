from rest_framework import serializers

from .models import Shop
from .models import Rate
from .models import Comment
from users.models import MyUser
from users.serializers import Profileserializer

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
    
    class Meta: 
        model = Comment 
        fields = '__all__'

class ListCommentSerializer(serializers.ModelSerializer): 

    user = Profileserializer(read_only=True)
    comments_shop = serializers.RelatedField(read_only=True)
    
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