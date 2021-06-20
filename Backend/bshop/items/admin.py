from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Item)
admin.site.register(Comment)
admin.site.register(CommentLike)
admin.site.register(Reply)
admin.site.register(ReplyLike)
admin.site.register(ItemLike)
admin.site.register(Rate)
admin.site.register(SpecialItem)
admin.site.register(QR)
