from django.test import TestCase,Client
from rest_framework.test import APIRequestFactory,APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from .models import *
from .serializers import *
from .views import *
from .urls import *
from shops.models import *
from shops.serializers import *
from users.models import MyUser
from users.serializers import Profileserializer

from PIL import Image
import tempfile

client = Client()


class CreateShoppingTest(APITestCase):

    def test_create(self):

        self.user1=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token1=Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token1.key)
        self.sh1 = Shop.objects.create(
            title="shop 10", user=self.user1, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.valid_shoppinglist = {
            'shop': self.sh1.id,
            'user': self.user1.id,
        }

        response = self.client.post(
            reverse('create_shopping_list'),
            data=json.dumps(self.valid_shoppinglist),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        # self.user2=MyUser.objects.create_user(username='test 2', email='test2@test.com', password="strong_Pass")
        # self.token2=Token.objects.create(user=self.user2)
        # self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token2.key)
        # self.invalid_shop_1 = {
        #     'title': '',
        #     'user': 13,
        #     'manager': 'manager 1',
        #     'address': 'address 1',
        #     'mantaghe':'1'
        # }
        # response = self.client.post(
        #     reverse('create_shop'),
        #     data=json.dumps(self.invalid_shop_1),
        #     content_type='application/json'
        # )
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


        # self.user3=MyUser.objects.create_user(username='test 3', email='test3@test.com', password="strong_Pass")
        # self.token3=Token.objects.create(user=self.user3)
        # self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token3.key)
        # self.invalid_shop_2 = {
        #     'user': '',
        #     'manager': 'manager 1',
        #     'address': 'address 1',
        #     'mantaghe':'1'
        # }
        # response = self.client.post(
        #     reverse('create_shop'),
        #     data=json.dumps(self.invalid_shop_2),
        #     content_type='application/json'
        # )
        # self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class AllShoppingListTest(APITestCase):

    def test_list_all_shopping_list(self):
        self.user2=MyUser.objects.create_user(username='test 2', email='test1@test.com', password="strong_Pass")
        self.token2=Token.objects.create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token2.key)
        self.sh2 = Shop.objects.create(
            title="shop 10", user=self.user2, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")

        sl1 = ShoppingList.objects.create(shop=self.sh2, user=self.user2, address="address 1", phone="111111")
        sl2 = ShoppingList.objects.create(shop=self.sh2, user=self.user2, address="address 2", phone="222222")
        sl3 = ShoppingList.objects.create(shop=self.sh2, user=self.user2, address="address 3", phone="333333")

        response = client.get('/api/v1/shoppings/')

        shoppinglists = ShoppingList.objects.all()
        serializer = ShoppingListSerializer(shoppinglists, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShoppingListRetrieveTest(TestCase):

    def setUp(self):
        self.user3 = MyUser.objects.create(username="name 1", email="zmahmoudzadeh78@gmail.com", password="password1234")
        self.token3=Token.objects.create(user=self.user3)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token3.key)
        self.sh1 = Shop.objects.create(
            title="shop 1", user=self.user3, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sl1 = ShoppingList.objects.create(shop=self.sh1, user=self.user3, address="address 1", phone="111111")

    def test_retrieve_single_shoppinglist(self):
        response = client.get(reverse('retrieve_shopping_list', kwargs={'pk': self.sl1.pk}))
        shoppinglist = ShoppingList.objects.get(pk=self.sl1.pk)
        serializer_shoppinglist = ShoppingListSerializer(shoppinglist)
        self.assertEqual(response.data, serializer_shoppinglist.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_get_invalid_single_shop(self):
    #     response = client.get(reverse('retrieve_shopping_list', kwargs={'pk': 50}))
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)    

# class ShopUpdateTest(APITestCase):

#     def test_update_shop(self):
#         self.user11=MyUser.objects.create_user(username='test 11', email='test11@test.com', password="strong_Pass")
#         self.token11=Token.objects.create(user=self.user11)
#         self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token11.key)
#         self.valid_shop = {
#             'title': 'فروشگاه',
#             'user': self.user11.id,
#             'manager': 'manager 1',
#             # 'logo': tmp_file.name,
#             'address': 'address 1',
#             'theme': 1,
#             'shomare_sabt': '11111',
#             'phone': '111111',
#             'mantaghe': '1',
#             'online': True,
#             'shop_phone': '111111111111'
#         }

#         self.sh4 = Shop.objects.create(
#             title="shop 10", user=self.user11, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
#         self.sh5 = Shop.objects.create(
#             title="shop 2", user=self.user11, manager="manager 2", logo=None, address="address 2", theme=1, shomare_sabt="2222", phone="222222")


#         response = self.client.put(
#             reverse('ShopUpdateAPIView', kwargs={'pk': self.sh4.pk}),
#             data=json.dumps(self.valid_shop),
#             content_type='application/json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
    

#         response = self.client.put(
#             reverse('ShopUpdateAPIView', kwargs={'pk': 50}),
#             data=json.dumps(self.valid_shop),
#             content_type='application/json'
#         )
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ShopDeleteTest(APITestCase):

    def test_delete(self):

        self.user12=MyUser.objects.create_user(username='test 12', email='test12@test.com', password="strong_Pass")
        self.token12=Token.objects.create(user=self.user12)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token12.key)
        self.sh12 = Shop.objects.create(
            title="shop 6", user=self.user12, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sl12 = ShoppingList.objects.create(shop=self.sh12, user=self.user12, address="address 1", phone="111111")
        response = self.client.delete(
            reverse('delete_shopping_list', kwargs={'pk': self.sl12.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.user13=MyUser.objects.create_user(username='test 13', email='test13@test.com', password="strong_Pass")
        self.token13=Token.objects.create(user=self.user13)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token13.key)
        response = self.client.delete(
            reverse('delete_shopping_list', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
