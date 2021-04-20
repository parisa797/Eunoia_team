#from django.test import TestCase

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
from shops.models import Shop

from PIL import Image
import tempfile

# Create your tests here.

class FilterItem(APITestCase):
    def test_filter_item_expensive(self):
        test_user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")        
        sh1 = Shop.objects.create(title="shop 1", user=test_user, manager="zahra", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        

        I1 = Item.objects.create(name= "item 1", description= "Test description", manufacture_Date= "2020-12-01",
                Expiration_Date= "2020-12-04", count= "4", price= "1",
                discount= "10", onlineShop= "True", category= "Dairy")
        I2 = Item.objects.create(name= "item 2", description= "Test description", manufacture_Date= "2020-12-02",
                Expiration_Date= "2020-12-04", count= "4", price= "2",
                discount= "20", onlineShop= "True", category= "Dairy")
        I3 = Item.objects.create(name= "item 3", description= "Test description", manufacture_Date= "2020-12-03",
                Expiration_Date= "2020-12-04", count= "4", price= "3",
                discount= "30", onlineShop= "True", category= "Dairy")
        I4 = Item.objects.create(name= "item 4", description= "Test description", manufacture_Date= "2020-12-04",
                Expiration_Date= "2020-12-04", count= "4", price= "4",
                discount= "40", onlineShop= "True", category= "Dairy")
        
        response=self.client.get("/items/expensive/")
        self.assertEqual(response.data[0]["price"], 4)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response=self.client.get("/items/cheap/")
        self.assertEqual(response.data[0]["price"], 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response=self.client.get("/items/new/")
        self.assertEqual(response.data[0]["manufacture_Date"], '2020-12-04')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response=self.client.get("/items/discount/")
        self.assertEqual(response.data[0]["discount"], 40)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CreateItemTest(APITestCase):
    def test_create_item(self):
        self.user=MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token=Token.objects.create(user=self.user)
        h=Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                        address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token.key)

        data={"name":"testItem","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
              "discount":"20","onlineShop":"True","category":"Dairy"}
        response=self.client.post("/shops/1/items/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) ###modela haye motefevet

        data={"name":"testItem1","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
              "discount":"20","onlineShop":"True","category":"Dairy"}
        response1=self.client.post("/shops/1/items/",data)
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        data={"name":"testItem2","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","price":"12000",
              "onlineShop":"True","category":"Dairy"}
        response2=self.client.post("/shops/1/items/",data)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        data={"name":"testItem3","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
              "discount":"20","onlineShop":"False"}
        response3=self.client.post("/shops/1/items/",data)
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)

class CreateListItemTest(APITestCase):

    def test_Item_list(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop1", user=self.user, manager="Test",
                                            address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)


        data={"name":"testItem","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
                    "discount":"20","onlineShop":"True","category":"Dairy"}
        response=self.client.post("/shops/2/items/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) ###modela haye motefevet
        data={"name":"testItem1","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
                "discount":"20","onlineShop":"True","category":"Dairy"}
        response1=self.client.post("/shops/2/items/",data)
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        data={"name":"testItem2","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","price":"12000",
                "onlineShop":"True","category":"Dairy"}
        response2=self.client.post("/shops/2/items/",data)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        data={"name":"testItem3","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
                "discount":"20","onlineShop":"False"}
        response3=self.client.post("/shops/2/items/",data)
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)


        response4=self.client.get("/shops/2/items/")
        total=Item.objects.all()
        totalserializers=CreateListItemSerializer(total,many=True)
        self.assertEqual(totalserializers.data, response4.data)
        self.assertEqual(response4.status_code, status.HTTP_200_OK)

class DeleteItemTest(APITestCase):

    def test_Item_Delete(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h=Shop.objects.create(title="testShop", user=self.user, manager="Test",
                            address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/3/items/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response1 = self.client.delete("/shops/3/items/9")
        self.assertEqual(response1.status_code, status.HTTP_204_NO_CONTENT)

class EditItemTest(APITestCase):

    def test_Item_Edit(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/4/items/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data1 = {"name": "testItemforedit", "description": "Test description Edit", "manufacture_Date": "2020-11-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "10000",
                "discount": "0", "onlineShop": "False", "category": "others"}

        response1 = self.client.put("/shops/4/items/10",data1)
        editedOne=Item.objects.get(id=10)
        choosenSerializer=ItemSerializer(editedOne)
        self.assertEqual(response1.data,choosenSerializer.data)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        data2 = { "description": "Test description Edit", "manufacture_Date": "2020-11-01",
                 "Expiration_Date": "2020-12-04", "count": "4", "price": "10000",
                 "discount": "0", "onlineShop": "False", "category": "others"}

        response1 = self.client.put("/shops/4/items/10", data2)
        self.assertEqual(response1.status_code, status.HTTP_400_BAD_REQUEST)

class GetOneItemTest(APITestCase):

    def test_Item_Get(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/6/items/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get("/shops/6/items/15")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        editedOne = Item.objects.get(id=15)
        choosenSerializer = ItemSerializer(editedOne)
        self.assertEqual(response.data, choosenSerializer.data)

class SearchItem(APITestCase):
    def test_search_item(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/7/items/", data)
        data = {"name": "lifetest", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/7/items/", data)
        data = {"name": "life", "description": "description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/7/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response=self.client.get("/items/search?q=test")
        searcheOne=Item.objects.get(id=16)
        chooseSerializer=ItemSerializer(searcheOne)
        searcheOne1 = Item.objects.get(id=17)
        chooseSerializer1 = ItemSerializer(searcheOne1)
        self.assertEqual(response.data[0], chooseSerializer.data)
        self.assertEqual(response.data[1], chooseSerializer1.data)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class SearchItemOneShop(APITestCase):
    def test_search_item_in_One_shop(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")
        Shop.objects.create(title="testShop", user=self.user, manager="Test",
                            address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/8/items/", data)
        data = {"name": "lifetest", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/8/items/", data)
        data = {"name": "life", "description": "description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "onlineShop": "True", "category": "Dairy"}
        response = self.client.post("/shops/8/items/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response=self.client.get("/shops/8/items/search/?q=test")
        searcheOne=Item.objects.get(id=19)
        chooseSerializer=ItemSerializer(searcheOne)
        searcheOne1 = Item.objects.get(id=20)
        chooseSerializer1 = ItemSerializer(searcheOne1)
        self.assertEqual(response.data[0]["id"], chooseSerializer.data['id'])
        self.assertEqual(response.data[1]['id'], chooseSerializer1.data['id'])
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get("/shops/8/items/search/?q=life")
        searcheOne = Item.objects.get(id=20)
        chooseSerializer = ItemSerializer(searcheOne)
        self.assertEqual(response.data[0]['id'], chooseSerializer.data['id'])
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

