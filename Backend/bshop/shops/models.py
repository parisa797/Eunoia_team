from django.db import models
from django.apps import apps
from django.db.models import Avg

from users.models import MyUser

class Shop(models.Model):

	title = models.CharField(max_length = 100, blank=False )#,primary_key=True)
	user = models.ForeignKey(MyUser,related_name='user_shop',on_delete=models.CASCADE)
	manager = models.CharField(max_length = 200, blank=False)
	logo = models.ImageField(blank=True , upload_to='image/')
	address = models.CharField(max_length = 500, blank=False)
	theme = models.IntegerField(default=1, blank=True, null=True)
	shomare_sabt = models.CharField(max_length = 100, blank=True, null=True)
	phone = models.CharField(max_length = 100,blank=True, null=True)
	online = models.BooleanField(default=False,blank=True, null=True)
	mantaghe = models.CharField(max_length = 200, blank=False)
	shop_phone = models.CharField(max_length = 100,blank=True, null=True)
	

	@property
	def comment_count(self):
		return Comment.objects.filter(shop_id=self.id).count()


	@property
	def rate_count(self):
		return Rate.objects.filter(shop_id=self.id).count()

	@property
	def rate_value(self):
		if Rate.objects.filter(shop_id=self.id).count() is 0:
			return 0
		return Rate.objects.filter(shop_id=self.id).aggregate(Avg('rate'))['rate__avg']

	def str(self):
		return self.title

class Comment(models.Model):

    user = models.ForeignKey(MyUser,related_name='comments_user',on_delete=models.CASCADE,blank=True)
    text = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True,blank=True)
    shop = models.ForeignKey(Shop,related_name='comments_shop',on_delete=models.CASCADE,blank=True)

    def str(self):
        return self.text

class Rate(models.Model):

    user = models.ForeignKey(MyUser,related_name='rates_user',on_delete=models.CASCADE,blank=True)
    shop = models.ForeignKey(Shop,related_name='rates_shop',on_delete=models.CASCADE,blank=True)
    rate = models.IntegerField(default=2, blank=True, null=True)

    def str(self):
        return self.shop
