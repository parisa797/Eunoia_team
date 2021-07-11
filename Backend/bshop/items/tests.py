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
        sh1 = Shop.objects.create(title="shop 1", user=test_user, manager="zahra", logo=None, address="address 1",
                                  theme=1, shomare_sabt="1111", phone="111111")


        I1 = Item.objects.create(name="item 1", description="Test description", manufacture_Date="1400-12-01",
                                 Expiration_Date="1400-12-04", count="4", price="1",
                                 discount="10", category="Dairy")
        I2 = Item.objects.create(name="item 2", description="Test description", manufacture_Date="1400-12-02",
                                 Expiration_Date="1400-12-04", count="4", price="2",
                                 discount="20", category="Dairy")
        I3 = Item.objects.create(name="item 3", description="Test description", manufacture_Date="1400-12-03",
                                 Expiration_Date="1400-12-04", count="4", price="3",
                                 discount="30", category="Dairy")
        I4 = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                 Expiration_Date="1400-12-04", count="4", price="4",
                                 discount="40", category="Dairy")

        response = self.client.get("/items/expensive/")
        self.assertEqual(response.data[0]["price"], 1)  ###moshkel
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get("/items/cheap/")
        self.assertEqual(response.data[0]["price"], 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get("/items/new/")
        self.assertEqual(response.data[0]["manufacture_Date"], '1400-12-04')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get("/items/discount/")
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
              "discount":"20","category":"Dairy"}
        response=self.client.post("/shops/1/items/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) ###modela haye motefevet

        data7={"name":"testItem1","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
              "discount":"20","category":"Dairy"}
        response7=self.client.post("/shops/1/items/",data7)
        self.assertEqual(response7.status_code, status.HTTP_201_CREATED)

        data1={"name":"testItem2","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","price":"12000","category":"Dairy"}
        response2=self.client.post("/shops/1/items/",data1)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        data2={"name":"testItem3","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
              "discount":"20"}
        response6=self.client.post("/shops/1/items/",data2)
        self.assertEqual(response6.status_code, status.HTTP_201_CREATED)

        data3 = {"name": "testItem3", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-01", "count": "4", "price": "12000",
                "discount": "20"}
        response3 = self.client.post("/shops/1/items/", data3)
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)

        data4 = {"name": "testItem3", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-11-02", "count": "4", "price": "12000",
                "discount": "20"}
        response4 = self.client.post("/shops/1/items/", data4)
        self.assertEqual(response4.status_code, status.HTTP_400_BAD_REQUEST)

        data5 = {"name": "testItem3", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2019-12-01", "count": "4", "price": "12000",
                "discount": "20"}
        response5 = self.client.post("/shops/1/items/", data5)
        self.assertEqual(response5.status_code, status.HTTP_400_BAD_REQUEST)

class CreateListItemTest(APITestCase):

    def test_Item_list(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop1", user=self.user, manager="Test",
                                            address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)


        data={"name":"testItem","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
                    "discount":"20","category":"Dairy"}
        response=self.client.post("/shops/2/items/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) ###modela haye motefevet
        data={"name":"testItem1","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
                "discount":"20","category":"Dairy"}
        response1=self.client.post("/shops/2/items/",data)
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        data={"name":"testItem2","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","price":"12000","category":"Dairy"}
        response2=self.client.post("/shops/2/items/",data)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        data={"name":"testItem3","description":"Test description","manufacture_Date":"2020-12-01","Expiration_Date":"2020-12-04","count":"4","price":"12000",
                "discount":"20"}
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
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/3/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response1 = self.client.delete("/shops/3/items/10")
        self.assertEqual(response1.status_code, status.HTTP_204_NO_CONTENT)

class EditItemTest(APITestCase):

    def test_Item_Edit(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "1400-12-01",
                "Expiration_Date": "1400-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/4/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data1 = {"name": "testItemforedit", "description": "Test description Edit", "count": "4", "price": "10000",
                "discount": "0", "category": "others"}

        response1 = self.client.put("/shops/4/items/11",data1)
        editedOne=Item.objects.get(id=11)
        choosenSerializer=ItemSerializer(editedOne)
        self.assertEqual(response1.data,choosenSerializer.data)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        data2 = { "description": "Test description Edit", "manufacture_Date": "1400-11-01",
                 "Expiration_Date": "1400-12-04", "count": "4", "price": "10000",
                 "discount": "0", "category": "others"}

        response1 = self.client.put("/shops/4/items/11", data2)
        self.assertEqual(response1.status_code, status.HTTP_400_BAD_REQUEST)


        data = {"name": "testItem3", "description": "Test description", "manufacture_Date": "1400-12-01",
                "Expiration_Date": "1400-12-01", "count": "4", "price": "12000",
                "discount": "20"}
        response1 = self.client.put("/shops/4/items/11", data)
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        data = {"name": "testItem3", "description": "Test description", "manufacture_Date": "1400-12-01",
                "Expiration_Date": "1400-11-02", "count": "4", "price": "12000",
                "discount": "20"}
        response1 = self.client.put("/shops/4/items/11", data)
        self.assertEqual(response1.status_code, status.HTTP_400_BAD_REQUEST)

        data = {"description": "Test description", "manufacture_Date": "1400-12-01",
                "Expiration_Date": "1399-12-01", "count": "4", "price": "12000",
                "discount": "20"}
        response1 = self.client.put("/shops/4/items/11", data)
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
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/6/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get("/shops/6/items/16")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        editedOne = Item.objects.get(id=16)
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
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/7/items/", data)

        data = {"name": "lifetest", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/7/items/", data)
        data = {"name": "life", "description": "description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/7/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response=self.client.get("/items/search?q=test")
        searcheOne=Item.objects.get(id=17)
        chooseSerializer=ItemSerializer(searcheOne)
        searcheOne1 = Item.objects.get(id=18)
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
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/8/items/", data)
        data = {"name": "lifetest", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/8/items/", data)
        data = {"name": "life", "description": "description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/9/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response=self.client.get("/shops/8/items/search/?q=test")
        searcheOne=Item.objects.get(id=20)
        chooseSerializer=ItemSerializer(searcheOne)
        searcheOne1 = Item.objects.get(id=21)
        chooseSerializer1 = ItemSerializer(searcheOne1)
        self.assertEqual(response.data[0]["id"], chooseSerializer.data['id'])
        self.assertEqual(response.data[1]['id'], chooseSerializer1.data['id'])
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get("/shops/9/items/search/?q=life")
        searcheOne = Item.objects.get(id=22)
        chooseSerializer = ItemSerializer(searcheOne)
        self.assertEqual(response.data[0]['id'], chooseSerializer.data['id'])
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TestItemComment(APITestCase):
    def test_comment_of_item(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/10/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data={"text":"test comment"}
        response=self.client.post("/shops/10/items/23/comments/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "second try of test"}
        response = self.client.post("/shops/10/items/23/comments/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        #########################GET#################################
        response = self.client.get("/shops/10/items/23/comments/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment=CommentSerializer(Comment.objects.get(id=1))
        comment2 = CommentSerializer(Comment.objects.get(id=2))
        self.assertEqual(response.data[0], comment.data)
        self.assertEqual(response.data[1], comment2.data)
        self.assertEqual(len(response.data), 2)

class TestItemCommentInfo(APITestCase):
    def test_comment_of_item_info(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/11/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data={"text":"test comment"} ##3
        response=self.client.post("/shops/11/items/24/comments/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########PUT####################
        data = {"text": "Update of Test"}
        response = self.client.put("/shops/11/items/24/comments/3", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["text"], "Update of Test")
        #########################GET#################################
        response = self.client.get("/shops/11/items/24/comments/3")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment=CommentSerializer(Comment.objects.get(id=3))
        self.assertEqual(response.data, comment.data)
        #########################DELETE#################################
        response = self.client.delete("/shops/11/items/24/comments/3")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class TestItemCommentLike(APITestCase):
    def test_comment_of_item_like(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/12/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data={"text":"test comment"} ##4
        response=self.client.post("/shops/12/items/25/comments/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########POST####################
        response = self.client.post("/shops/12/items/25/comments/4/likes")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertEqual(response.data['Liked_By'][0]['username'], 'testcase')

        #########################GET#################################
        response = self.client.get("/shops/12/items/25/comments/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 1)
        self.assertEqual(response.data[0]['Liked_By'][0]['username'], 'testcase')

        ###########POST####################
        response = self.client.post("/shops/12/items/25/comments/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)
        self.assertEqual(len(response.data['Liked_By']), 0)

        #########################GET#################################
        response = self.client.get("/shops/12/items/25/comments/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(len(response.data[0]['Liked_By']), 0)

class TestItemReply(APITestCase):
    def test_reply_of_item(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        tokencopy= self.token.key

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/13/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.user = MyUser.objects.create_user(username='testcase2', email='email@tes2r.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data={"text":"test comment"}
        response=self.client.post("/shops/13/items/26/comments/",data) ##5
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "reply test"}
        response = self.client.post("/shops/13/items/26/comments/5/replies", data)  ###failed
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.credentials(HTTP_AUTHORIZATION="Token " + tokencopy)
        data = {"text": "reply"}
        response = self.client.post("/shops/13/items/26/comments/5/replies", data)###1
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "reply test"}
        response = self.client.post("/shops/13/items/26/comments/5/replies", data)  ###2
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #########################GET#################################
        response = self.client.get("/shops/13/items/26/comments/5/replies")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reply=ReplySerializer(Reply.objects.get(id=1))
        reply2 = ReplySerializer(Reply.objects.get(id=2))
        self.assertEqual(response.data[0], reply.data)
        self.assertEqual(response.data[1], reply2.data)
        self.assertEqual(len(response.data), 2)

class TestItemReplyInfo(APITestCase):
    def test_reply_of_item_info(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/14/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data={"text":"test comment"} ##3
        response=self.client.post("/shops/14/items/27/comments/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "reply test"}
        response = self.client.post("/shops/14/items/27/comments/6/replies", data)  ###3
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########PUT####################
        data = {"text": "Update of Test"}
        response = self.client.put("/shops/14/items/27/comments/6/replies/3", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["text"], "Update of Test")
        #########################GET#################################
        response = self.client.get("/shops/14/items/27/comments/6/replies/3")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reply=ReplySerializer(Reply.objects.get(id=3))
        self.assertEqual(response.data, reply.data)
        #########################DELETE#################################
        response = self.client.delete("/shops/14/items/27/comments/6/replies/3")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class TestItemReplyLike(APITestCase):
    def test_reply_of_item_like(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/15/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data={"text":"test comment"} ##7
        response=self.client.post("/shops/15/items/28/comments/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "reply test"}
        response = self.client.post("/shops/15/items/28/comments/7/replies", data)  ###4
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########POST####################
        response = self.client.post("/shops/15/items/28/comments/7/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertEqual(response.data['Liked_By'][0]['username'], 'testcase')

        #########################GET#################################
        response = self.client.get("/shops/15/items/28/comments/7/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 1)
        self.assertEqual(response.data[0]['Liked_By'][0]['username'], 'testcase')

        ###########POST####################
        response = self.client.post("/shops/15/items/28/comments/7/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)
        self.assertEqual(len(response.data['Liked_By']), 0)

        #########################GET#################################
        response = self.client.get("/shops/15/items/28/comments/7/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(len(response.data[0]['Liked_By']), 0)


class TestLikeItem(APITestCase):
    def test_like_item(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/16/items/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########POST####################
        response = self.client.post("/shops/16/items/29/likes", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertEqual(response.data['Liked_By'][0]['username'], 'testcase')

        #########################GET#################################
        response = self.client.get("/shops/16/items/29/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 1)
        self.assertEqual(response.data[0]['Liked_By'][0]['username'], 'testcase')

        response = self.client.get("/users/profile/likeditems")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], 29)
        self.assertEqual(len(response.data), 1)

        ###########POST####################
        response = self.client.post("/shops/16/items/29/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)
        self.assertEqual(len(response.data['Liked_By']), 0)

        response = self.client.get("/users/profile/likeditems")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        #########################GET#################################
        response = self.client.get("/shops/16/items/29/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(len(response.data[0]['Liked_By']), 0)


class TestRateItemCreate(APITestCase):

    def test_create_rate(self):
        self.user18 = MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token18 = Token.objects.create(user=self.user18)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token18.key)
        self.sh7 = Shop.objects.create(title="shop 18", user=self.user18, manager="manager 1", logo=None,
                                       address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.I4 = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                 Expiration_Date="1400-12-04", count="4", price="4",
                                 discount="40", category="Dairy")
        self.valid_rate = {
            'user': self.user18.id,
            'item': self.I4.id,
            'rate': 3,
        }
        self.invalid_rate = {
            'user': self.user18.id,
            'item': self.I4.id,
            'rate': 3.5,
        }
        response = self.client.post(
            reverse('RateCreate',kwargs={'pk': self.sh7.pk ,'id': self.I4.id}),
            data=json.dumps(self.valid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(
            reverse('RateCreate',kwargs={'pk': self.sh7.pk ,'id': self.I4.id}),
            data=json.dumps(self.invalid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestRateItemList(APITestCase):

    def test_list_all_rate(self):
        self.user15 = MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token15 = Token.objects.create(user=self.user15)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token15.key)
        self.sh5 = Shop.objects.create(title="shop 15", user=self.user15, manager="manager 1", logo=None,
                                       address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.I4 = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                      Expiration_Date="1400-12-04", count="4", price="4",
                                      discount="40", category="Dairy")

        r1 = Rate.objects.create(user=self.user15, item=self.I4, rate=4)
        r2 = Rate.objects.create(user=self.user15, item=self.I4, rate=1)
        r3 = Rate.objects.create(user=self.user15, item=self.I4, rate=5)

        response = self.client.get(reverse('RateCreate',kwargs={'pk': self.sh5.pk ,'id': self.I4.id}))
        rates = Rate.objects.all()
        serializer = ListRateSerializer(rates, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestRateRetrieveUpdateDestroyItem(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create(username="name 17", email="test17@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.sh = Shop.objects.create(title="shop", user=self.user, manager="manager 1", logo=None,
                                       address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.I4 = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                      Expiration_Date="1400-12-04", count="4", price="4",
                                      discount="40", category="Dairy")
        self.r4 = Rate.objects.create(user=self.user, item=self.I4, rate=1)
        self.r5 = Rate.objects.create(user=self.user, item=self.I4, rate=2)
        self.valid_rate = {
            'user': self.user.id,
            'item': self.I4.id,
            'rate': 3
        }

    def test_retrieve_single_rate(self):
        response = self.client.get(reverse('RateRetrieveUpdateDestroy',
                                           kwargs={'pk': self.sh.pk ,'id': self.I4.id,'rate_id':self.r4.id}))
        rate = Rate.objects.get(id=self.r4.id)
        serializer_rate = ListRateSerializer(rate)
        self.assertEqual(response.data['id'], serializer_rate.data['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_get_invalid_single_rate(self):
    #     response = self.client.get(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.sh.pk ,'id': 30,'rate_id':self.r4.id}))
    #     print(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.sh.pk ,'id': 50,'rate_id':self.r4.id}))
    #     self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_rate(self):
        response = self.client.delete(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.sh.pk ,'id': self.I4.id,'rate_id':self.r4.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_rate(self):
        response = self.client.put(
            reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.sh.pk ,'id': self.I4.id,'rate_id':self.r4.id}),
            data=json.dumps(self.valid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.sh.pk ,'id': self.I4.id,'rate_id':self.r5.id}))
        rate = Rate.objects.get(id=self.r5.id)
        serializer_rate = RateSerializer(rate)
        self.assertEqual(response.data['rate'], 2)

        # response = self.client.put(
        #     reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.sh.pk ,'id': self.I4.id,'rate_id': 1}),
        #     data=json.dumps(self.valid_rate),
        #     content_type='application/json'
        # )
        # self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class TestReplyCommentItem(APITestCase):
    def test_reply_comment_of_item(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        data = {"name": "testItem", "description": "Test description", "manufacture_Date": "2020-12-01",
                "Expiration_Date": "2020-12-04", "count": "4", "price": "12000",
                "discount": "20", "category": "Dairy"}
        response = self.client.post("/shops/22/items/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data={"text":"test comment"} ##7
        response=self.client.post("/shops/22/items/35/comments/",data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "reply test"}
        response = self.client.post("/shops/22/items/35/comments/8/replies", data)  ###4
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #########################GET#################################
        response = self.client.get("/shops/22/items/35/commentsreplis")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0], CommentReplySerializer(Comment.objects.get(id=8)).data)
        self.assertEqual(len(response.data), 1)

############Special_item test#######################
class TestSpecialItem(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create_superuser(username="test", email="test17@gmail.com", password="strong_Pass")
        self.user2 = MyUser.objects.create(username="test2", email="test1@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.token2 = Token.objects.create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)


    def test_create_special_item(self):
        response = self.client.post(reverse('specialitem_create'),{'name':'xbox','price':2000})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "xbox")
        self.assertEqual(response.data['price'], 2000)

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token2.key)
        response = self.client.post(reverse('specialitem_create'),{'name':'xbox','price':2000})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class TestSpecialItemRetreive(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create_superuser(username="test", email="test17@gmail.com",
                                                        password="strong_Pass")
        self.user2 = MyUser.objects.create(username="test2", email="test1@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.token2 = Token.objects.create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.specialItem=SpecialItem.objects.create(name="xbox",price=2000)



    def test_get_Special_item(self):
        response = self.client.get(reverse('specialitem_RUD',kwargs={'pk': self.specialItem.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, SepcialItemSerializer(self.specialItem).data)


    def test_update_special_item(self):
        response = self.client.put(reverse('specialitem_RUD',kwargs={'pk': self.specialItem.pk}),{'price':5001,'name':"test xbox",
                                                                                           'description':"try teeeeest"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        sp=SpecialItem.objects.get(id=self.specialItem.id)
        self.assertEqual(response.data, SepcialItemSerializer(sp).data)

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token2.key)
        response = self.client.put(reverse('specialitem_RUD',kwargs={'pk': self.specialItem.pk}),{'price':5031,'name':"test xbox",
                                                                                           'description':"try teeeeest"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_delete_special_item(self):
        response = self.client.delete(reverse('specialitem_RUD', kwargs={'pk': self.specialItem.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_special_item_list(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token2.key)
        response = self.client.get(reverse('specialitem_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'],self.specialItem.id )
        self.assertEqual(len(response.data),1 )

    def test_coin_shop_retrieve(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token2.key)
        response = self.client.get(reverse('specialitem_retrieve', kwargs={'pk': self.specialItem.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'],self.specialItem.id )

##################QR#####################
class TestTheQR(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create(username="test", email="test17@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.sh = Shop.objects.create(
            title="shop 10", user=self.user, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.I = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                      Expiration_Date="1400-12-04", count="4", price="4",
                                      discount="40", category="Dairy",shopID=self.sh)
        self.I2 = Item.objects.create(name="item 5", description="Test description", manufacture_Date="1400-12-04",
                                     Expiration_Date="1400-12-04", count="4", price="4",
                                     discount="40", category="Dairy", shopID=self.sh)


    def test_create_qr(self):
        response = self.client.post(reverse("QR", kwargs={'pk': self.I.pk}))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(response.data['qr_code'], None)

        response = self.client.post(reverse("QR", kwargs={'pk': self.I.pk}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, 'You made QR before')

    def test_Qr_list(self):
        qr=self.client.post(reverse("QR", kwargs={'pk': self.I2.pk}))
        response = self.client.get(reverse('QR', kwargs={'pk': self.I2.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'],qr.data["id"] )
        self.assertEqual(len(response.data),1 )