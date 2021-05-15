from django.db import models
from django.apps import apps
from django_jalali.db import models as jmodels

from users.models import MyUser
from shops.models import Shop
from items.models import Item

class ShoppingItem(models.Model):

    item = models.ForeignKey(Item,related_name='shopping_item',on_delete=models.CASCADE,blank=True)
    number = models.IntegerField(blank=True, null=True)

class ShoppingList(models.Model):

    user = models.ForeignKey(MyUser,related_name='shopping_list_user',on_delete=models.CASCADE,blank=True)
    shop = models.ForeignKey(Shop,related_name='shopping_list_shop',on_delete=models.CASCADE,blank=True)
    items = models.ForeignKey(ShoppingItem,related_name='shopping_list_items',on_delete=models.CASCADE,blank=True,null=True)
    date = models.DateTimeField(auto_now_add=True,blank=True)
    sabt = models.BooleanField(default=False,blank=True, null=True)
    address = models.CharField(max_length = 500, blank=False)
    phone = models.CharField(max_length = 100,blank=True, null=True)
    online = models.BooleanField(default=False,blank=True, null=True)
    max_cost = models.IntegerField(blank=True, null=True)
    delivery_time = jmodels.jDateField(blank=True,auto_now=False, auto_now_add=False)
