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

    
    def setUp(self):
        self.user1=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass", address="address 1", phone="phone 1")
        self.token1=Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token1.key)
        self.sh1 = Shop.objects.create(
            title="shop 10", user=self.user1, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.valid_shoppinglist = {
            'shop': self.sh1.id,
            'user': self.user1.id,
        }

    def test_create(self):
        response = self.client.post(
            reverse('create_shopping_list'),
            data=json.dumps(self.valid_shoppinglist),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_create_bad_request(self):
        self.user2=MyUser.objects.create_user(username='test 2', email='test2@test.com', password="strong_Pass")
        self.token2=Token.objects.create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token2.key)
        self.invalid_shoppinglist = {
            'shop': self.sh1.id,
            'user': self.user2.id,
        }

        response = self.client.post(
            reverse('create_shopping_list'),
            data=json.dumps(self.invalid_shoppinglist),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class AllShoppingListTest(APITestCase):

    def test_list_all_shopping_list(self):
        self.user3=MyUser.objects.create_user(username='test 2', email='test1@test.com', password="strong_Pass",address="address 3", phone="phone 3")
        self.token3=Token.objects.create(user=self.user3)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token3.key)
        self.sh2 = Shop.objects.create(
            title="shop 10", user=self.user3, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")

        sl1 = ShoppingList.objects.create(shop=self.sh2, user=self.user3)
        sl2 = ShoppingList.objects.create(shop=self.sh2, user=self.user3)
        sl3 = ShoppingList.objects.create(shop=self.sh2, user=self.user3)
        response = self.client.get(reverse('list_shopping_list'))
        shoppinglists = ShoppingList.objects.all()
        serializer = ShoppingListSerializer(shoppinglists, many=True)

        self.assertEqual(response.data[0]['address'], serializer.data[0]['address'])
        self.assertEqual(len(response.data), len(serializer.data))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShoppingListRetrieveTest(APITestCase):

    def setUp(self):
        self.user4 = MyUser.objects.create(username="name 4", email="zmahmoudzadeh78@gmail.com", password="password1234",address="address 1", phone="111111")
        self.token4=Token.objects.create(user=self.user4)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token4.key)
        self.sh4 = Shop.objects.create(
            title="shop 1", user=self.user4, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sl4 = ShoppingList.objects.create(shop=self.sh4, user=self.user4)

    def test_retrieve_single_shoppinglist(self):
        response = self.client.get(reverse('retrieve_shopping_list', kwargs={'pk': self.sl4.pk}))
        shoppinglist = ShoppingList.objects.get(pk=self.sl4.pk)
        serializer_shoppinglist = ShoppingListSerializer(shoppinglist)
        self.assertEqual(response.data['address'], serializer_shoppinglist.data['address'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_shopping_list(self):
        response = self.client.get(reverse('retrieve_shopping_list', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)    

class ShoppingListUpdateTest(APITestCase):

    def setUp(self):
        self.user5=MyUser.objects.create_user(username='test 5', email='test5@test.com', password="strong_Pass",address="address5",phone="11111111")
        self.token5=Token.objects.create(user=self.user5)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token5.key)
        self.valid_shopping_list = {
            'address': 'address 1',
            'phone': '55555555',
        }
        self.sh5 = Shop.objects.create(
            title="shop 10", user=self.user5, manager="manager 10", logo=None, address="address 5", theme=10, shomare_sabt="10101010", phone="10101010")
        self.sl5 = ShoppingList.objects.create(shop=self.sh5, user=self.user5)    
    
    def test_update_shopping_list(self):
        response = self.client.put(
            reverse('update_shopping_list', kwargs={'pk': self.sl5.pk}),
            data=json.dumps(self.valid_shopping_list),
            content_type='application/json'
        )
        self.assertEqual(response.data['address'], 'address 1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_update_shopping_list_not_found(self):
        response = self.client.put(
            reverse('update_shopping_list', kwargs={'pk': 50}),
            data=json.dumps(self.valid_shopping_list),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ShopDeleteTest(APITestCase):

    
    def setUp(self):
        self.user12=MyUser.objects.create_user(username='test 12', email='test12@test.com', password="strong_Pass")
        self.token12=Token.objects.create(user=self.user12)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token12.key)
        self.sh12 = Shop.objects.create(
            title="shop 6", user=self.user12, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sl12 = ShoppingList.objects.create(shop=self.sh12, user=self.user12, address="address 1", phone="111111")
    
    def test_delete(self):   
        response = self.client.delete(
            reverse('delete_shopping_list', kwargs={'pk': self.sl12.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_not_found(self):
        response = self.client.delete(
            reverse('delete_shopping_list', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ShoppingListSabtTest(APITestCase):

    def setUp(self):
        self.user6=MyUser.objects.create_user(username='test 6', email='test6@test.com', password="strong_Pass",address="address6",phone="66666666")
        self.token6=Token.objects.create(user=self.user6)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token6.key)
        self.valid_shopping_list = {
            'sabt': True,
        }
        self.sh6 = Shop.objects.create(
            title="shop 10", user=self.user6, manager="manager 10", logo=None, address="address 5", theme=10, shomare_sabt="10101010", phone="10101010")
        self.sl6 = ShoppingList.objects.create(shop=self.sh6, user=self.user6,address="address6", phone="66666666")    
    
    def test_sabt_shopping_list(self):
        response = self.client.put(
            reverse('sabt_shopping_list', kwargs={'pk': self.sl6.pk}),
            data=json.dumps(self.valid_shopping_list),
            content_type='application/json'
        )
        self.assertEqual(response.data['sabt'], True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_sabt_shopping_list_not_found(self):
        response = self.client.put(
            reverse('sabt_shopping_list', kwargs={'pk': 50}),
            data=json.dumps(self.valid_shopping_list),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ShoppingListOnlineTest(APITestCase):
    
    def setUp(self):

        self.user7=MyUser.objects.create_user(username='test 7', email='test7@test.com', password="strong_Pass",address="address7",phone="66666666")
        self.token7=Token.objects.create(user=self.user7)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token7.key)
        self.valid_shopping_list = {
            'online': True,
        }
        self.sh7 = Shop.objects.create(
            title="shop 10", user=self.user7, manager="manager 10", logo=None, address="address 7", theme=10, shomare_sabt="10101010", phone="10101010")
        self.sl7 = ShoppingList.objects.create(shop=self.sh7, user=self.user7,address="address7", phone="66666666")    
    
    def test_online_shopping_list(self):
        response = self.client.put(
            reverse('online_shopping_list', kwargs={'pk': self.sl7.pk}),
            data=json.dumps(self.valid_shopping_list),
            content_type='application/json'
        )
        self.assertEqual(response.data['online'], True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShoppingListMaxCostTest(APITestCase):
    
    def setUp(self):

        self.user14=MyUser.objects.create_user(username='test 14', email='test14@test.com', password="strong_Pass",address="address14",phone="66666666")
        self.token14=Token.objects.create(user=self.user14)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token14.key)
        self.valid_shopping_list = {
            'max_cost': 500,
        }
        self.sh14 = Shop.objects.create(
            title="shop 14", user=self.user14, manager="manager 14", logo=None, address="address 14", theme=14, shomare_sabt="10101010", phone="10101010")
        self.sl14 = ShoppingList.objects.create(shop=self.sh14, user=self.user14,address="address14", phone="66666666")    
    
    def test_online_shopping_list(self):
        response = self.client.put(
            reverse('max_cost_shopping_list', kwargs={'pk': self.sl14.pk}),
            data=json.dumps(self.valid_shopping_list),
            content_type='application/json'
        )
        self.assertEqual(response.data['max_cost'], 500)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CreateShoppingItemTest(APITestCase):

    
    def setUp(self):
        self.user8=MyUser.objects.create_user(username='test 8', email='test8@test.com', password="strong_Pass", address="address 1", phone="phone 1")
        self.token8=Token.objects.create(user=self.user8)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token8.key)
        self.sh8 = Shop.objects.create(
            title="shop 8", user=self.user8, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.sl8 = ShoppingList.objects.create(shop=self.sh8, user=self.user8,address="address7", phone="66666666")
        self.i8 = Item.objects.create(name="item 1", description="Test description", manufacture_Date="1400-12-01",Expiration_Date="1400-12-04", count="4", price="1",discount="10", category="Dairy")
        self.valid_shopping_item = {
            'item': self.i8.id,
            'shopping_list': self.sl8.id,
            'number': 2
        }

    def test_create(self):
        response = self.client.post(
            reverse('create_shopping_item'),
            data=json.dumps(self.valid_shopping_item),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

class AllShoppingItemTest(APITestCase):

    def test_list_all_shopping_item(self):
        self.user9=MyUser.objects.create_user(username='test 9', email='test9@test.com', password="strong_Pass",address="address 9", phone="phone 3")
        self.token9=Token.objects.create(user=self.user9)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token9.key)
        self.sh9 = Shop.objects.create(
            title="shop 9", user=self.user9, manager="manager 10", logo=None, address="address 9", theme=9, shomare_sabt="10101010", phone="10101010")
        self.sl9 = ShoppingList.objects.create(shop=self.sh9, user=self.user9,address="address7", phone="66666666")
        self.i9 = Item.objects.create(name="item 9", description="Test description", manufacture_Date="1400-12-01",Expiration_Date="1400-12-04", count="4", price="1",discount="10", category="Dairy")
        self.i10 = Item.objects.create(name="item 10", description="Test description", manufacture_Date="1400-12-01",Expiration_Date="1400-12-04", count="4", price="1",discount="10", category="Dairy")
        self.i11 = Item.objects.create(name="item 11", description="Test description", manufacture_Date="1400-12-01",Expiration_Date="1400-12-04", count="4", price="1",discount="10", category="Dairy")
        self.si9 = ShoppingItem.objects.create(item=self.i9, shopping_list=self.sl9, number=1)
        self.si10 = ShoppingItem.objects.create(item=self.i10, shopping_list=self.sl9, number=2)
        self.si11 = ShoppingItem.objects.create(item=self.i11, shopping_list=self.sl9, number=3)
        
        response = self.client.get(reverse('list_shopping_item', kwargs={'pk': self.sl9.pk}))
        shoppingitems = ShoppingItem.objects.filter(shopping_list=self.sl9.pk)
        serializer = ShoppingItemSerializer(shoppingitems, many=True)

        self.assertEqual(response.data[0]['number'], serializer.data[0]['number'])
        self.assertEqual(len(response.data), len(serializer.data))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShoppingItemUpdateTest(APITestCase):

    def setUp(self):
        self.user13=MyUser.objects.create_user(username='test 13', email='test13@test.com', password="strong_Pass",address="address13",phone="11111111")
        self.token13=Token.objects.create(user=self.user13)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token13.key)
        self.sh13 = Shop.objects.create(
            title="shop 9", user=self.user13, manager="manager 13", logo=None, address="address 13", theme=9, shomare_sabt="10101010", phone="10101010")
        self.sl13 = ShoppingList.objects.create(shop=self.sh13, user=self.user13,address="address13", phone="66666666")
        self.i13 = Item.objects.create(name="item 13", description="Test description", manufacture_Date="1400-12-01",Expiration_Date="1400-12-04", count="4", price="1",discount="10", category="Dairy")
        self.si13 = ShoppingItem.objects.create(item=self.i13, shopping_list=self.sl13, number=1)
        self.valid_shopping_item = {
            'number': 13,
        }

    def test_retrieve_single_shoppingitem(self):
        response = self.client.get(reverse('retrieve_update_delete_shopping_item', kwargs={'pk': self.si13.pk}))
        shoppingitem = ShoppingItem.objects.get(pk=self.si13.pk)
        serializer_shoppingitem = ShoppingItemSerializer(shoppingitem)
        self.assertEqual(response.data['number'], serializer_shoppingitem.data['number'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_shopping_item(self):
        response = self.client.put(
            reverse('retrieve_update_delete_shopping_item', kwargs={'pk': self.si13.pk}),
            data=json.dumps(self.valid_shopping_item),
            content_type='application/json'
        )
        self.assertEqual(response.data['number'], 13)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_update_shopping_item_not_found(self):
        response = self.client.put(
            reverse('retrieve_update_delete_shopping_item', kwargs={'pk': 50}),
            data=json.dumps(self.valid_shopping_item),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete(self):   
        response = self.client.delete(
            reverse('retrieve_update_delete_shopping_item', kwargs={'pk': self.si13.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_not_found(self):
        response = self.client.delete(
            reverse('retrieve_update_delete_shopping_item', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)