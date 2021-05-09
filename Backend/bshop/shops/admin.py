from django.contrib import admin
from .models import Shop
from .models import Comment
from .models import Rate
from .models import Board


admin.site.register(Shop)
admin.site.register(Comment)
admin.site.register(Rate)
admin.site.register(Board)
