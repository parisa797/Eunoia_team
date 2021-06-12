from django.db import models
from rest_framework.authtoken.models import Token
#from items.models import SpecialItem
#from phone_field import PhoneField

# Create your models here.
from django.contrib.auth.models import AbstractUser

class Media(models.Model):
    uploaded_file = models.ImageField(upload_to='profiles/', max_length=100 , null=True, blank=True)

class MyUser(AbstractUser): ### ?
    username = models.CharField(max_length=150,unique=True)
    password = models.CharField(max_length=150)
    email = models.EmailField(max_length=150,unique=True)
    role_choices=[('seller','seller'),('buyer','buyer'),]
    role= models.CharField(max_length=50, choices=role_choices, default='buyer')
    files = models.ManyToManyField(Media, blank=True, related_name='profile_p')
    FirstName = models.CharField(blank=True,max_length=150) #first anme
    LastName = models.CharField(blank=True,max_length=150) #last name
    address = models.TextField(blank=True)
    phone=models.CharField(blank=True,max_length=13)


class Coins(models.Model):
    rank_choices = [('gold', 'gold'),
                    ('silver', 'silver'),
                    ('bronze', 'bronze'),
                    ('none', 'none'), ]
    rank = models.CharField(max_length=50, choices=rank_choices, default='none')
    money=models.IntegerField(default=0,blank=True,null=True)
    user=models.ForeignKey(MyUser,blank=True, null=True, on_delete=models.CASCADE, related_name='usercoins')
    last_buy=models.DateTimeField(auto_now_add=False,blank=True, null=True)

class ShoppingWithCoin(models.Model):
    coin = models.ForeignKey(Coins, blank=True, null=True, on_delete=models.CASCADE, related_name='coinshop')
    special_item = models.ForeignKey("items.SpecialItem", blank=True, null=True, on_delete=models.CASCADE, related_name='Specialitemforbuy')
