from django.db import models
from django.db.models import Avg
from django.db import models
from users.models import MyUser
from django_jalali.db import models as jmodels
from django.apps import apps



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
	longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
	latitude  = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
	

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

class CommentLike (models.Model):
    comment_liked_by = models.ManyToManyField(MyUser,  default=None, related_name='shop_comments_users_liked')
    shop_liked_comment=models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, related_name='shop_liked_comment', null=True)


class Reply(models.Model):
    user = models.ForeignKey(MyUser,related_name='shop_replies_user',on_delete=models.CASCADE,blank=True)
    text = models.TextField()
    date=models.DateTimeField(auto_now=False, auto_now_add=True,blank=True)
    commentID=models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, related_name='shop_comment_reply', null=True)

    def __str__(self):
        return self.text

class ReplyLike (models.Model):
    reply_liked_by = models.ManyToManyField(MyUser,  default=None, related_name='shop_replies_users_liked')
    liked_reply=models.ForeignKey(Reply, on_delete=models.CASCADE, blank=True, related_name='shop_liked_replies', null=True)

class ShopLike (models.Model):
    shop_liked_by = models.ManyToManyField(MyUser,  default=None, related_name='shop_users_liked')
    shop_liked_shop=models.ForeignKey(Shop, on_delete=models.CASCADE, blank=True, related_name='shop_liked_shop', null=True)


class Rate(models.Model):

    user = models.ForeignKey(MyUser,related_name='shop_rates_user',on_delete=models.CASCADE,blank=True)
    shop = models.ForeignKey(Shop,related_name='rates_shop',on_delete=models.CASCADE,blank=True)
    rate = models.IntegerField(default=2, blank=True, null=True)

    def str(self):
        return self.shop

class Board(models.Model):
	image = models.ImageField(blank=True , upload_to='image/', null=True)
	image_url = models.CharField(max_length = 500,blank=True, null=True)
	user = models.ForeignKey(MyUser,related_name='shop_board_user',on_delete=models.CASCADE,blank=True)
	shop = models.ForeignKey(Shop,related_name='shop_board_shop',on_delete=models.CASCADE,blank=True)

	def str(self):
		return self.image_url