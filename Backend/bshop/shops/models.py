from django.db import models
from django.apps import apps

from users.models import MyUser

class Shop(models.Model):

	title = models.CharField(max_length = 100, blank=False)
	user = models.ForeignKey(MyUser,related_name='user_shop',on_delete=models.CASCADE)
	manager = models.CharField(max_length = 200, blank=False)
	logo = models.ImageField(blank=True , upload_to='image/')
	address = models.CharField(max_length = 500, blank=False)
	theme = models.IntegerField(default=1, blank=True, null=True)
	shomare_sabt = models.CharField(max_length = 100, blank=True, null=True)
	# rate = models.IntegerField(default=2.5, blank=True, null=True)
	phone = models.CharField(max_length = 100,blank=True, null=True)
	
	def str(self):
		return self.title
