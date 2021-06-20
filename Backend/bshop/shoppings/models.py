from django.db import models
from django.apps import apps
from django_jalali.db import models as jmodels
from django.db.models import Sum

from users.models import MyUser
from shops.models import Shop
from items.models import Item
from users.models import Coins


class ShoppingList(models.Model):

    user = models.ForeignKey(
        MyUser, related_name='shopping_list_user', on_delete=models.CASCADE, blank=False)
    shop = models.ForeignKey(Shop, related_name='shopping_list_shop',
                             on_delete=models.CASCADE, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    sabt = models.BooleanField(default=False)
    address = models.CharField(max_length=500, blank=False, null=True)
    phone = models.CharField(max_length=100, blank=False, null=True)
    online = models.BooleanField(default=False, blank=False, null=True)
    max_cost = models.IntegerField(default=0, blank=True, null=True)
    delivery = models.DateTimeField(
        auto_now_add=False, blank=True, null=True, auto_now=False)
    wallet_boolean = models.BooleanField(default=False, blank=True, null=True)

    @property
    def sum_price(self):
        if(ShoppingItem.objects.filter(shopping_list=self.id).count() is 0):
            return 0
        shopping = ShoppingList.objects.get(id=self.id)
        if Coins.objects.filter(user=shopping.user).exists():
            coin = Coins.objects.get(user=shopping.user)
            if coin.rank == 'gold':
                return ShoppingItem.objects.filter(shopping_list=self.id).aggregate(Sum('sum_price'))['sum_price__sum']*0.7
            if coin.rank == 'silver':
                return ShoppingItem.objects.filter(shopping_list=self.id).aggregate(Sum('sum_price'))['sum_price__sum']*0.8
            if coin.rank == 'bronze':
                return ShoppingItem.objects.filter(shopping_list=self.id).aggregate(Sum('sum_price'))['sum_price__sum']*0.9
        return ShoppingItem.objects.filter(shopping_list=self.id).aggregate(Sum('sum_price'))['sum_price__sum']


class ShoppingItem(models.Model):

    item = models.ForeignKey(
        Item, related_name='shopping_item', on_delete=models.CASCADE, blank=True)
    number = models.IntegerField(blank=True, null=True)
    shopping_list = models.ForeignKey(
        ShoppingList, related_name='shopping_list_items', on_delete=models.CASCADE)
    price = models.IntegerField(default=0, blank=True, null=True)
    sum_price = models.IntegerField(default=0, blank=True, null=True)
