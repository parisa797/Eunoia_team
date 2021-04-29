from rest_framework import serializers
from .models import *
from users.models import MyUser
from shops.models import Shop
from jalali_date import date2jalali,datetime2jalali
from persiantools.jdatetime import JalaliDate

class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ['title','manager','logo','address','shomare_sabt','phone', 'id']


class ItemSerializer(serializers.ModelSerializer):
    #Liked_By = UsersInfoserializer(source='liked_by', read_only=True, many=True)
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)
    ItemShop = ShopSerializer(source='shopID', read_only=True)
    # manufacture_jalali = serializers.SerializerMethodField('get_jalali_date')
    # Expiration_jalali = serializers.SerializerMethodField('get_jalali_Expiration_Date')
    #
    # def get_jalali_date(self, id):
    #     temp = JalaliDate.to_jalali(id.manufacture_Date)
    #     return str(temp)
    # def get_jalali_Expiration_Date(self, id):
    #     temp = JalaliDate.to_jalali(id.Expiration_Date)
    #     return str(temp)
    manufacture_jalali = serializers.SerializerMethodField('get_miladi_date')
    Expiration_jalali = serializers.SerializerMethodField('get_miladi_Expiration_Date')
    def get_miladi_date(self, id):
        temp = JalaliDate.to_gregorian(id.manufacture_Date)
        # return str(temp)
        str=correct_date(temp)
        return str
    def get_miladi_Expiration_Date(self, id):
        temp = JalaliDate.to_gregorian(id.Expiration_Date)
        #return str(temp)
        str=correct_date(temp)
        print('str',str)
        return str


    class Meta:
        model= Item
        fields=['ItemShop','photo','name','shop_id','description', 'manufacture_Date','Expiration_Date','manufacture_jalali','Expiration_jalali','count','category','id','discount','price']

class CreateListItemSerializer(serializers.ModelSerializer):
    shop_id = serializers.IntegerField(source='shopID.id', read_only=True)
    manufacture_jalali = serializers.SerializerMethodField('get_miladi_date')
    Expiration_jalali = serializers.SerializerMethodField('get_miladi_Expiration_Date')

    def get_miladi_date(self, id):
        temp = JalaliDate.to_gregorian(id.manufacture_Date)
        #print(temp.strftime('%Y'))
        str=correct_date(temp)
        return str
    def get_miladi_Expiration_Date(self, id):
        temp = JalaliDate.to_gregorian(id.Expiration_Date)
        str=correct_date(temp)
        return str

    class Meta:
        model= Item
        fields=['photo','name','shop_id','description', 'manufacture_Date','Expiration_Date','manufacture_jalali','Expiration_jalali','count','category','discount','price','id']

def correct_date(date):
    year=date.strftime('%Y')
    month=date.strftime('%m')
    day=date.strftime('%d')

    if year=='1401' and int(month)>3:
        if int(day)==1 :
            if int(month)<=7 and int(mont)>1:
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
        print("aaaaaaaaaa")
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
            if int(month)<=6 and int(mont)>=1 and int(day)==31:
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
            if int(month)<=7 and int(mont)>1:
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