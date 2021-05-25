from rest_framework import serializers

from .models import *
from users.models import MyUser
from users.serializers import Profileserializer
from items.serializers import ItemShoppnigSerializer
from jalali_date import date2jalali,datetime2jalali
from persiantools.jdatetime import JalaliDate,JalaliDateTime

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
    # delivery_time_jalali = serializers.SerializerMethodField('get_miladi_date')

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)

    # def get_miladi_date(self, id):
    #     print(id.delivery_time.month,"delivery")
    #     temp = JalaliDate.to_gregorian(id.delivery_time)
    #     string=correct_date(temp)
    #     min=str(id.delivery_time.minute)
    #     hour=str(id.delivery_time.hour)
    #     if len(min)==1:
    #         min="0"+min
    #     if len(hour)==1:
    #         hour="0"+hour
    #     return string+"T"+hour+":"+min

    class Meta: 
        model = ShoppingList 
        fields = '__all__'

class AllShoppingListSerializer(serializers.ModelSerializer):

    shopping_list_shop = serializers.RelatedField(read_only=True)
    shopping_list_items = ShoppingItemSerializer(many=True)
    date_jalali=serializers.SerializerMethodField('get_jalali_date')
    sum_price = serializers.ReadOnlyField()
    delivery_time_jalali = serializers.SerializerMethodField('get_miladi_date')

    def get_jalali_date(self,id):
        serial=datetime2jalali(id.date)
        return str(serial)

    def get_miladi_date(self, id):
        return None
        temp = JalaliDate.to_gregorian(id.delivery_time)
        string=correct_date(temp)
        min=str(id.delivery_time.minute)
        hour=str(id.delivery_time.hour)
        if len(min)==1:
            min="0"+min
        if len(hour)==1:
            hour="0"+hour
        return string+"T"+hour+":"+min

    class Meta:
        model = ShoppingList
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
