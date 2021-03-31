from django.db import models
from rest_framework.authtoken.models import Token
#from phone_field import PhoneField

# Create your models here.
from django.contrib.auth.models import AbstractUser

class Media(models.Model):
    uploaded_file = models.ImageField(upload_to='profiles/', max_length=100 , null=True, blank=True)

class MyUser(AbstractUser): ### ?
    username = models.CharField(max_length=150,unique=True)
    password = models.CharField(max_length=150)
    email = models.EmailField(max_length=150,unique=True)
    role_choices=[('seller','seller'),('buyer','buyer'),]
    role= models.CharField(max_length=50, choices=role_choices, default='buyer')
    files = models.ManyToManyField(Media, blank=True, related_name='profile_p')
    FirstName = models.CharField(blank=True,max_length=150) #first anme
    LastName = models.CharField(blank=True,max_length=150) #last name
    address = models.TextField(blank=True)
    phone=models.CharField(blank=True,max_length=13)
