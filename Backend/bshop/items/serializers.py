from rest_framework import serializers
from .models import *
from users.models import MyUser
from shops.models import Shop
from users.serializers import Profileserializer
from jalali_date import date2jalali,datetime2jalali
from persiantools.jdatetime import JalaliDate
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw

class UsersInfoserializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username','email']

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['title','manager','logo','address','shomare_sabt','phone','online', 'id']


class ItemSerializer(serializers.ModelSerializer):
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)
    ItemShop = ShopSerializer(source='shopID', read_only=True)
    manufacture_jalali = serializers.SerializerMethodField('get_miladi_date')
    Expiration_jalali = serializers.SerializerMethodField('get_miladi_Expiration_Date')
    def get_miladi_date(self, id):
        temp = JalaliDate.to_gregorian(id.manufacture_Date)
        str=correct_date(temp)
        return str
    def get_miladi_Expiration_Date(self, id):
        temp = JalaliDate.to_gregorian(id.Expiration_Date)
        str=correct_date(temp)
        return str

    class Meta:
        model= Item
        fields=['ItemShop','photo','name','shop_id','description', 'manufacture_Date','Expiration_Date',
                'manufacture_jalali','Expiration_jalali','count','category','id','discount',
                'price','rate_count','rate_value','price_with_discount','brand']

class CreateListItemSerializer(serializers.ModelSerializer):
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)
    manufacture_jalali = serializers.SerializerMethodField('get_miladi_date')
    Expiration_jalali = serializers.SerializerMethodField('get_miladi_Expiration_Date')

    def get_miladi_date(self, id):
        temp = JalaliDate.to_gregorian(id.manufacture_Date)
        str=correct_date(temp)
        return str
    def get_miladi_Expiration_Date(self, id):
        temp = JalaliDate.to_gregorian(id.Expiration_Date)
        str=correct_date(temp)
        return str

    class Meta:
        model= Item
        fields=['photo','name','shop_id','description',
                'manufacture_Date','Expiration_Date','manufacture_jalali','Expiration_jalali','count',
                'category','discount','price','rate_count','rate_value','price_with_discount','brand','id']

class CommentSerializer(serializers.ModelSerializer):
    AllPeopleLiked = serializers.SerializerMethodField('get_likes')
    date_jalali=serializers.SerializerMethodField('get_jalali_date')
    user = Profileserializer(read_only=True)

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)

    def get_likes(self, id):
        qs = CommentLike.objects.filter(liked_comment=id)
        serializer = CommentLikeSerializer(instance=qs, many=True)
        return serializer.data
    class Meta:
        model= Comment
        fields=['text','date','date_jalali','user','id','AllPeopleLiked' ]

class CommentReplySerializer(serializers.ModelSerializer):
    AllPeopleLiked = serializers.SerializerMethodField('get_likes')
    Replies = serializers.SerializerMethodField('get_replies')
    date_jalali=serializers.SerializerMethodField('get_jalali_date')
    user = Profileserializer(read_only=True)

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)

    def get_likes(self, id):
        qs = CommentLike.objects.filter(liked_comment=id)
        serializer = CommentLikeSerializer(instance=qs, many=True)
        return serializer.data

    def get_replies(self, id):
        qs = Reply.objects.filter(commentID=id)
        serializer = ReplySerializer(instance=qs, many=True)
        return serializer.data

    class Meta:
        model= Comment
        fields=['text','date','date_jalali','user','id','AllPeopleLiked','Replies']


class CommentLikeSerializer(serializers.ModelSerializer):
    Liked_By = UsersInfoserializer(source='liked_by', read_only=True, many=True)
    likes_count = serializers.IntegerField(source='liked_by.count', read_only=True)
    class Meta:
        model= CommentLike
        fields=['likes_count','Liked_By' ]

class ReplySerializer(serializers.ModelSerializer):
    AllPeopleLiked = serializers.SerializerMethodField('get_likes')
    date_jalali=serializers.SerializerMethodField('get_jalali_date')
    user = Profileserializer(read_only=True)

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)

    def get_likes(self, id):
        qs = ReplyLike.objects.filter(liked_reply=id)
        serializer = ReplyLikeSerializer(instance=qs, many=True)
        return serializer.data
    class Meta:
        model= Reply
        fields=['text','date','date_jalali','user','id','AllPeopleLiked' ]

class ReplyLikeSerializer(serializers.ModelSerializer):
    Liked_By = UsersInfoserializer(source='liked_by', read_only=True, many=True)
    likes_count = serializers.IntegerField(source='liked_by.count', read_only=True)
    class Meta:
        model= ReplyLike
        fields=['likes_count','Liked_By' ]

class LikeSerializer(serializers.ModelSerializer):
    Liked_By = UsersInfoserializer(source='liked_by', read_only=True, many=True)
    likes_count = serializers.IntegerField(source='liked_by.count', read_only=True)
    class Meta:
        model = ItemLike
        fields = ['likes_count','Liked_By']


class RateSerializer(serializers.ModelSerializer):
    rates_user = serializers.RelatedField(read_only=True)
    rates_item = serializers.RelatedField(read_only=True)

    class Meta:
        model = Rate
        fields = '__all__'


class ListRateSerializer(serializers.ModelSerializer):
    user = Profileserializer(read_only=True)
    rates_item = serializers.RelatedField(read_only=True)

    class Meta:
        model = Rate
        fields = '__all__'


class ItemShoppnigSerializer(serializers.ModelSerializer):
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)
    manufacture_jalali = serializers.SerializerMethodField('get_miladi_date')
    Expiration_jalali = serializers.SerializerMethodField('get_miladi_Expiration_Date')

    def get_miladi_date(self, id):
        temp = JalaliDate.to_gregorian(id.manufacture_Date)
        str = correct_date(temp)
        return str

    def get_miladi_Expiration_Date(self, id):
        temp = JalaliDate.to_gregorian(id.Expiration_Date)
        str = correct_date(temp)
        return str

    class Meta:
        model = Item
        fields = ['photo', 'name', 'shop_id', 'description', 'manufacture_Date', 'Expiration_Date',
                  'manufacture_jalali', 'Expiration_jalali', 'count', 'category', 'id',
                  'discount', 'price','brand','rate_count','rate_value','price_with_discount']

class SepcialItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecialItem
        fields = '__all__'

class QRSerializer(serializers.ModelSerializer):
    class Meta:
        model = QR
        fields = '__all__'

def correct_date(date):
    year=date.strftime('%Y')
    month=date.strftime('%m')
    day=date.strftime('%d')

    if year=='1401' and int(month)>3:
        if int(day)==1 :
            if int(month)<=7 and int(month)>1:
                month=str(int(month)-1)
                day='31'
            elif month=="01":
                day="30"
                month="12"
                year=str(int(year)-1)
            else:
                month = str(int(month) - 1)
                day = '30'
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day
        else:
            day=str(int(day)-1)
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day

    elif year=='1403'and int(month)>3:
        if int(day)==31 or int(day)==30  :
            if int(month)<=6 and int(month)>=1 and int(day)==31:
                month=str(int(month)+1)
                day='01'
            elif month=="12":
                day="01"
                month="01"
                year=str(int(year)+1)
            else:
                month = str(int(month) + 1)
                day = '01'
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day
        else:
            day=str(int(day)+1)
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day

    elif year=='1404':
        if int(day)==31 or int(day)==30  :
            if int(month)<=6 and int(month)>=1 and int(day)==31:
                month=str(int(month)+1)
                day='01'
            elif month=="12":
                day="01"
                month="01"
                year=str(int(year)+1)
            else:
                month = str(int(month) + 1)
                day = '01'
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day
        else:
            day=str(int(day)+1)
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day

    elif year=='1405'and int(month)>3 or (int(month==3)and int(day)>21):
        if int(day)==1 :
            if int(month)<=7 and int(month)>1:
                month=str(int(month)-1)
                day='31'
            elif month=="01":
                day="30"
                month="12"
                year=str(int(year)-1)
            else:
                month = str(int(month) - 1)
                day = '30'
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day
        else:
            day=str(int(day)-1)
            if len(day)==1:
                day='0'+day
            if len(month)==1:
                month='0'+month
            return year+'-'+month+'-'+day

    return year+'-'+month+'-'+day