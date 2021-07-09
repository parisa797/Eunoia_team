from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(MyUser)
admin.site.register(Media)
admin.site.register(Coins)
admin.site.register(ShoppingWithCoin)
admin.site.register(ElectricWallet)
