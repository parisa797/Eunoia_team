from django.db import models
from django.apps import apps

class Shop(models.Model):

	title = models.CharField(max_length = 100, blank=False)
    # user = models.ForeignKey(User,related_name='users',on_delete=models.CASCADE) 
	logo = models.ImageField(blank=True , upload_to='image/')
	address = models.CharField(max_length = 500, blank=False)
    theme = models.IntegerField()
    shomare_sabt = models.IntegerField()

	def str(self):
		return self.title
