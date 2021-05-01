from django.db import models
from users.models import MyUser
from shops.models import Shop
# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=50)
    shopID = models.ForeignKey(Shop,blank=True, null=True, on_delete=models.CASCADE, related_name='shopid')
    photo = models.ImageField(upload_to='items/' , max_length=100 , null=True, blank=True)
    description = models.TextField(blank=True)
    manufacture_Date=models.DateField(auto_now=False, auto_now_add=False, blank=True)
    Expiration_Date=models.DateField(auto_now=False, auto_now_add=False, blank=True)
    count=models.IntegerField(default=0,blank=True)
    price = models.IntegerField(default=0, blank=True)
    discount = models.IntegerField(default=0, blank=True)
    onlineShop=models.BooleanField(default=True, blank=True) #####ino bayad ba shop bezanim
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
    def __str__(self):
        return self.name