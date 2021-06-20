from rest_framework import serializers

from .models import *
from users.models import MyUser
from users.serializers import Profileserializer
from jalali_date import date2jalali, datetime2jalali
from persiantools.jdatetime import JalaliDate
# import json
# import datetime


class UsersInfoserializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'email']


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
    date_jalali = serializers.SerializerMethodField('get_jalali_date')

    def get_jalali_date(self, id):
        serial = datetime2jalali(id.date)
        return str(serial)

    class Meta:
        model = Comment
        fields = '__all__'


class ListCommentSerializer(serializers.ModelSerializer):

    user = Profileserializer(read_only=True)
    comments_shop = serializers.RelatedField(read_only=True)
    date_jalali = serializers.SerializerMethodField('get_jalali_date')

    def get_jalali_date(self, id):
        serial = datetime2jalali(id.date)
        return str(serial)

    class Meta:
        model = Comment
        fields = '__all__'


class CommentReplySerializer(serializers.ModelSerializer):
    AllPeopleLiked = serializers.SerializerMethodField('get_likes')
    Replies = serializers.SerializerMethodField('get_replies')
    date_jalali = serializers.SerializerMethodField('get_jalali_date')
    user = Profileserializer(read_only=True)

    def get_jalali_date(self, id):
        serial = datetime2jalali(id.date)
        return str(serial)

    def get_likes(self, id):
        qs = CommentLike.objects.filter(shop_liked_comment=id)
        serializer = CommentLikeSerializer(instance=qs, many=True)
        return serializer.data

    def get_replies(self, id):
        qs = Reply.objects.filter(commentID=id)
        serializer = ReplySerializer(instance=qs, many=True)
        return serializer.data

    class Meta:
        model = Comment
        fields = ['text', 'date', 'date_jalali',
                  'user', 'id', 'AllPeopleLiked', 'Replies']


class CommentLikeSerializer(serializers.ModelSerializer):
    Liked_By = UsersInfoserializer(
        source='comment_liked_by', read_only=True, many=True)
    likes_count = serializers.IntegerField(
        source='comment_liked_by.count', read_only=True)

    class Meta:
        model = CommentLike
        fields = ['likes_count', 'Liked_By']


class ReplySerializer(serializers.ModelSerializer):
    AllPeopleLiked = serializers.SerializerMethodField('get_likes')
    date_jalali = serializers.SerializerMethodField('get_jalali_date')
    user = Profileserializer(read_only=True)

    def get_jalali_date(self, id):
        serial = datetime2jalali(id.date)
        return str(serial)

    def get_likes(self, id):
        qs = ReplyLike.objects.filter(liked_reply=id)
        serializer = ReplyLikeSerializer(instance=qs, many=True)
        return serializer.data

    class Meta:
        model = Reply
        fields = ['text', 'date', 'date_jalali',
                  'user', 'id', 'AllPeopleLiked']


class ReplyLikeSerializer(serializers.ModelSerializer):
    Liked_By = UsersInfoserializer(
        source='reply_liked_by', read_only=True, many=True)
    likes_count = serializers.IntegerField(
        source='reply_liked_by.count', read_only=True)

    class Meta:
        model = ReplyLike
        fields = ['likes_count', 'Liked_By']


class LikeSerializer(serializers.ModelSerializer):
    Liked_By = UsersInfoserializer(
        source='shop_liked_by', read_only=True, many=True)
    likes_count = serializers.IntegerField(
        source='shop_liked_by.count', read_only=True)

    class Meta:
        model = ShopLike
        fields = ['likes_count', 'Liked_By']


class RateSerializer(serializers.ModelSerializer):

    shop_rates_user = serializers.RelatedField(read_only=True)
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


class BoardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Board
        fields = '__all__'
