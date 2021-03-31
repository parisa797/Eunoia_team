from django.db import models
from django.apps import apps

class Shop(models.Model):

	title = models.CharField(max_length = 100, blank=False)
    # user = models.ForeignKey(User,related_name='users',on_delete=models.CASCADE) 
	manager = models.CharField(max_length = 200, blank=False)
	logo = models.ImageField(blank=True , upload_to='image/')
	address = models.CharField(max_length = 500, blank=False)
	theme = models.IntegerField(default=1, blank=True, null=True)
	shomare_sabt = models.IntegerField(default=1, blank=True, null=True)
	# rate = models.IntegerField(default=2.5, blank=True, null=True)
	phone = models.IntegerField(blank=True, null=True)
	
	def str(self):
		return self.title
