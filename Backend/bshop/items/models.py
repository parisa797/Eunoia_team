from django.db import models
from users.models import MyUser
from shops.models import Shop
from django_jalali.db import models as jmodels
from django.apps import apps
from django.db.models import Avg
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image, ImageDraw


# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=50)
    shopID = models.ForeignKey(Shop,blank=True, null=True, on_delete=models.CASCADE, related_name='shopid')
    photo = models.ImageField(upload_to='items/' , max_length=100 , null=True, blank=True)
    description = models.TextField(blank=True)
    #manufacture_Date=models.DateField(auto_now=False, auto_now_add=False, blank=True)
    manufacture_Date=jmodels.jDateField(blank=True,auto_now=False, auto_now_add=False)
    #Expiration_Date=models.DateField(auto_now=False, auto_now_add=False, blank=True)
    Expiration_Date = jmodels.jDateField(blank=True,auto_now=False, auto_now_add=False)
    count=models.IntegerField(default=0,blank=True)
    price = models.IntegerField(default=0, blank=True)
    discount = models.IntegerField(default=0, blank=True)
    categories_choices=[('Spices and condiments and food side dishes','Spices and condiments and food side dishes'),
                  ('Cosmetics','Cosmetics'),
                  ('Makeup and trimming','Makeup and trimming'),
                  ('Protein','Protein'),
                  ('Junk Food','Junk Food'),
                  ('Nuts','Nuts'),
                  ('Sweets and desserts','Sweets and desserts'),
                  ('perfume','perfume'),
                  ('Fruits and vegetables','Fruits and vegetables'),
                  ('Dairy','Dairy'),
                  ('Drinks','Drinks'),
                  ('Washing and Cleaning Equipment','Washing and Cleaning Equipment'),
                  ('others','others'),]
    category= models.CharField(max_length=50, choices=categories_choices, default='others')
    brand = models.CharField(max_length=50,blank=True,null=True)
    price_with_discount = models.IntegerField(default=0, blank=True, null=True)

    @property
    def rate_count(self):
        return Rate.objects.filter(item_id=self.id).count()

    @property
    def rate_value(self):
        if Rate.objects.filter(item_id=self.id).count() == 0:
            return 0
        return Rate.objects.filter(item_id=self.id).aggregate(Avg('rate'))['rate__avg']

class Comment(models.Model):
    user = models.ForeignKey(MyUser,related_name='user_comment_item',on_delete=models.CASCADE,blank=True)
    text = models.TextField()
    date=models.DateTimeField(auto_now=False, auto_now_add=True,blank=True) ##date
    ItemID=models.ForeignKey(Item, on_delete=models.CASCADE, blank=True, related_name='comment', null=True)


    def __str__(self):
        return self.text

class CommentLike (models.Model):
    liked_by = models.ManyToManyField(MyUser,  default=None, related_name='comments_users_liked')
    liked_comment=models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, related_name='liked_comment', null=True)


class Reply(models.Model):
    user = models.ForeignKey(MyUser,related_name='Replies_user',on_delete=models.CASCADE,blank=True)
    text = models.TextField()
    date=models.DateTimeField(auto_now=False, auto_now_add=True,blank=True)
    commentID=models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, related_name='comment_reply', null=True)

    def __str__(self):
        return self.text

class ReplyLike (models.Model):
    liked_by = models.ManyToManyField(MyUser,  default=None, related_name='replies_users_liked')
    liked_reply=models.ForeignKey(Reply, on_delete=models.CASCADE, blank=True, related_name='liked_replies', null=True)

class ItemLike (models.Model):
    liked_by = models.ManyToManyField(MyUser,  default=None, related_name='users_liked')
    liked_item=models.ForeignKey(Item, on_delete=models.CASCADE, blank=True, related_name='liked_post', null=True)

class Rate(models.Model):
    user = models.ForeignKey(MyUser,related_name='rate_user',on_delete=models.CASCADE,blank=True)
    item = models.ForeignKey(Item,related_name='rate_item',on_delete=models.CASCADE,blank=True)
    rate = models.IntegerField(default=2, blank=True, null=True)

    def str(self):
        return self.item

class SpecialItem(models.Model):
    name = models.CharField(max_length=50)
    photo = models.ImageField(upload_to='specialitems/' , max_length=100 , null=True, blank=True)
    description = models.TextField(blank=True)
    price = models.IntegerField(default=200, blank=True)


class QR(models.Model):
    item = models.ForeignKey(Item,related_name='qr_item',on_delete=models.CASCADE,blank=True,null=True)
    qr_code = models.ImageField(upload_to='items/qr_codes/', blank=True,null=True)

    def save(self, *args, **kwargs):
        sh=str(self.item.shopID).split("(")[1].split(")")[0]
        #it=str(self.item.id).split("(")[1].split(")")[0]
        string='shops/'+sh+'/items/'+str(self.item.id)
        qrcode_img = qrcode.make(string)
        canvas = Image.new('RGB', (360, 360), 'white')
        canvas.paste(qrcode_img)
        fname = f'qr_code-{self.item.id}.png'
        buffer = BytesIO()
        canvas.save(buffer,'PNG')
        self.qr_code.save(fname, File(buffer), save=False)
        canvas.close()
        super().save(*args, **kwargs)