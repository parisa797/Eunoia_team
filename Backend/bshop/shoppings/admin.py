from django.contrib import admin
from .models import ShoppingList
from .models import ShoppingItem

admin.site.register(ShoppingList)
admin.site.register(ShoppingItem)
