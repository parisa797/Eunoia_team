from django.test import TestCase,Client
from rest_framework.test import APIRequestFactory,APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from .models import *
from .serializers import ShopSerializer
from .views import *
from .urls import *
from users.models import MyUser
from users.serializers import Profileserializer

from PIL import Image
import tempfile

client = Client()


class CreateShopTest(APITestCase):
    def test_create(self):
        image = Image.new('RGBA', size=(50, 50), color=(155, 0, 0))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.png')
        image.save(tmp_file)
        test_user = MyUser.objects.create(username="name 1", email="zmahmoudzadeh78@gmail.com", password="password1234")
        sh = Shop.objects.create(title="shop 1", user=test_user, manager="zahra", logo=tmp_file.name, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.assertEqual(Shop.objects.count(), 1)
        self.assertEqual(Shop.objects.get().title, 'shop 1')


class AllShopListTest(APITestCase):

    def test_list_all_shop(self):
        test_user = MyUser.objects.create(username="name 1", email="zmahmoudzadeh78@gmail.com", password="password1234")

        sh1 = Shop.objects.create(title="shop 1", user=test_user, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        sh2 = Shop.objects.create(title="shop 2", user=test_user, manager="manager 2", logo=None, address="address 2", theme=1, shomare_sabt="2222", phone="222222")
        sh3 = Shop.objects.create(title="shop 3", user=test_user, manager="manager 3", logo=None, address="address 3", theme=1, shomare_sabt="2222", phone="333333")

        response = client.get('/api/v1/shops/')

        shops = Shop.objects.all()
        serializer = ShopSerializer(shops, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShopRetrieveTest(TestCase):

    def setUp(self):
        test_user = MyUser.objects.create(username="name 1", email="zmahmoudzadeh78@gmail.com", password="password1234")

        self.sh1 = Shop.objects.create(
            title="shop 1", user=test_user, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sh2 = Shop.objects.create(
            title="shop 2", user=test_user, manager="manager 2", logo=None, address="address 2", theme=1, shomare_sabt="2222", phone="222222")
        self.sh3 = Shop.objects.create(
            title="shop 3", user=test_user, manager="manager 3", logo=None, address="address 3", theme=1, shomare_sabt="2222", phone="333333")
    
    def test_retrieve_single_shop(self):
    
        response = client.get(reverse('ShopRetrieveAPIView', kwargs={'pk': self.sh1.pk}))
        shop = Shop.objects.get(pk=self.sh1.pk)
        serializer_shop = ShopSerializer(shop)
        self.assertEqual(response.data, serializer_shop.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
