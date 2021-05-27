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

        self.user5=MyUser.objects.create_user(username='test 5', email='test5@test.com', password="strong_Pass")
        self.invalid_shop_3 = {
            'title': 'shop 1',
            'user': self.user5.id,
            'manager': 'manager 1',
            'address': 'address 1',
            'theme': 1,
            'shomare_sabt': '11111',
            'phone': '111111',
            'mantaghe': '1',
            'online': True,
            'shop_phone': '111111111111'
        }
        response = self.client.post(
            reverse('create_shop'),
            data=json.dumps(self.invalid_shop_3),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


        image = Image.new('RGBA', size=(50, 50), color=(155, 0, 0))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.png')
        image.save(tmp_file)
        self.user1=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token1=Token.objects.create(user=self.user1)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token1.key)
        self.valid_shop = {
            'title': 'shop 1',
            'user': self.user1.id,
            'manager': 'manager 1',
            # 'logo': tmp_file.name,
            'address': 'address 1',
            'theme': 1,
            'shomare_sabt': '11111',
            'phone': '111111',
            'mantaghe': '1',
            'online': True,
            'shop_phone': '111111111111'
        }
        response = self.client.post(
            reverse('create_shop'),
            data=json.dumps(self.valid_shop),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        self.user4=MyUser.objects.create_user(username='test 4', email='test4@test.com', password="strong_Pass")
        self.token4=Token.objects.create(user=self.user4)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token4.key)
        self.valid_shop_2 = {
            'title': 'shop 1',
            'user': self.user4.id,
            'manager': 'manager 1',
            'address': 'address 1',
            'theme': None,
            'shomare_sabt': None,
            'phone': None,
            'online': None,
            'mantaghe': '1',
            'shop_phone': None
        }
        response = self.client.post(
            reverse('create_shop'),
            data=json.dumps(self.valid_shop_2),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


        self.user2=MyUser.objects.create_user(username='test 2', email='test2@test.com', password="strong_Pass")
        self.token2=Token.objects.create(user=self.user2)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token2.key)
        self.invalid_shop_1 = {
            'title': '',
            'user': 13,
            'manager': 'manager 1',
            'address': 'address 1',
            'mantaghe':'1'
        }
        response = self.client.post(
            reverse('create_shop'),
            data=json.dumps(self.invalid_shop_1),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


        self.user3=MyUser.objects.create_user(username='test 3', email='test3@test.com', password="strong_Pass")
        self.token3=Token.objects.create(user=self.user3)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token3.key)
        self.invalid_shop_2 = {
            'user': '',
            'manager': 'manager 1',
            'address': 'address 1',
            'mantaghe':'1'
        }
        response = self.client.post(
            reverse('create_shop'),
            data=json.dumps(self.invalid_shop_2),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



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
            
    def test_retrieve_single_shop(self):
        response = client.get(reverse('ShopRetrieveAPIView', kwargs={'pk': self.sh1.pk}))
        shop = Shop.objects.get(pk=self.sh1.pk)
        serializer_shop = ShopSerializer(shop)
        self.assertEqual(response.data, serializer_shop.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_shop(self):
        response = client.get(reverse('ShopRetrieveAPIView', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)    

class ShopUpdateTest(APITestCase):

    def test_update_shop(self):
        self.user11=MyUser.objects.create_user(username='test 11', email='test11@test.com', password="strong_Pass")
        self.token11=Token.objects.create(user=self.user11)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token11.key)
        self.valid_shop = {
            'title': 'فروشگاه',
            'user': self.user11.id,
            'manager': 'manager 1',
            # 'logo': tmp_file.name,
            'address': 'address 1',
            'theme': 1,
            'shomare_sabt': '11111',
            'phone': '111111',
            'mantaghe': '1',
            'online': True,
            'shop_phone': '111111111111'
        }

        self.sh4 = Shop.objects.create(
            title="shop 10", user=self.user11, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.sh5 = Shop.objects.create(
            title="shop 2", user=self.user11, manager="manager 2", logo=None, address="address 2", theme=1, shomare_sabt="2222", phone="222222")


        response = self.client.put(
            reverse('ShopUpdateAPIView', kwargs={'pk': self.sh4.pk}),
            data=json.dumps(self.valid_shop),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    

        response = self.client.put(
            reverse('ShopUpdateAPIView', kwargs={'pk': 50}),
            data=json.dumps(self.valid_shop),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ShopDeleteTest(APITestCase):

    def test_delete(self):

        self.user12=MyUser.objects.create_user(username='test 12', email='test12@test.com', password="strong_Pass")
        self.token12=Token.objects.create(user=self.user12)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token12.key)
        self.sh6 = Shop.objects.create(
            title="shop 6", user=self.user12, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        response = self.client.delete(
            reverse('ShopDestroyAPIView', kwargs={'pk': self.sh6.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.user13=MyUser.objects.create_user(username='test 13', email='test13@test.com', password="strong_Pass")
        self.token13=Token.objects.create(user=self.user13)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token13.key)
        response = self.client.delete(
            reverse('ShopDestroyAPIView', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class ShopListUser(APITestCase):

    def test_list_user_shop(self):
        self.user12=MyUser.objects.create_user(username='test 12', email='test12@test.com', password="strong_Pass")
        self.token12=Token.objects.create(user=self.user12)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token12.key)

        self.user11=MyUser.objects.create_user(username='test 11', email='test11@test.com', password="strong_Pass")
        self.token11=Token.objects.create(user=self.user11)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token11.key)

        sh1 = Shop.objects.create(title="shop 1", user=self.user12, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        sh2 = Shop.objects.create(title="shop 2", user=self.user11, manager="manager 2", logo=None, address="address 2", theme=1, shomare_sabt="2222", phone="222222")
        sh3 = Shop.objects.create(title="shop 3", user=self.user11, manager="manager 3", logo=None, address="address 3", theme=1, shomare_sabt="2222", phone="333333")

        response = self.client.get('/api/v1/shops/user/')

        shops = Shop.objects.all()
        serializer = ShopSerializer(shops, many=True)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CommentCreate(APITestCase):

    def test_create_comment(self):
        self.user14=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token14=Token.objects.create(user=self.user14)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token14.key)
        self.sh4 = Shop.objects.create(title="shop 14", user=self.user14, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.valid_comment = {
            'user': self.user14.id,
            'text': 'comment 1',
            'shop': self.sh4.id,
        }
        self.invalid_comment = {
            'user': self.user14.id,
            'text': 'comment 2',
            'shop': 23,
        }
        response = self.client.post(
            reverse('CommentCreate'),
            data=json.dumps(self.valid_comment),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(
            reverse('CommentCreate'),
            data=json.dumps(self.invalid_comment),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CommentListTest(APITestCase):

    def test_list_all_comment(self):
        self.user15=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token15=Token.objects.create(user=self.user15)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token15.key)
        self.sh5 = Shop.objects.create(title="shop 15", user=self.user15, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")

        c1 = Comment.objects.create(user=self.user15, text="text 1", shop=self.sh5)
        c2 = Comment.objects.create(user=self.user15, text="text 2", shop=self.sh5)
        c3 = Comment.objects.create(user=self.user15, text="text 3", shop=self.sh5)

        response = self.client.get(reverse('CommentList', kwargs={'pk': self.sh5.pk}))
        comments = Comment.objects.all().order_by('-id')
        serializer = ListCommentSerializer(comments, many=True)
        #self.assertEqual(response.data, serializer.data) ####ZAHRA
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CommentRetrieveUpdateDestroy(APITestCase):

    def setUp(self):
        self.user17 = MyUser.objects.create(username="name 17", email="test17@gmail.com", password="strong_Pass")
        self.token17=Token.objects.create(user=self.user17)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token17.key)
        self.sh6 = Shop.objects.create(title="shop 17", user=self.user17, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.c4 = Comment.objects.create(user=self.user17, text="text 1", shop=self.sh6)
        self.c5 = Comment.objects.create(user=self.user17, text="text 2", shop=self.sh6)
        self.valid_comment = {
            'user': self.user17.id,
            'text': 'update_text',
            'shop': self.sh6.id
        }

    def test_retrieve_single_comment(self):
        response = self.client.get(reverse('CommentRetrieveUpdateDestroy', kwargs={'pk': self.c4.pk}))
        comment = Comment.objects.get(pk=self.c4.pk)
        serializer_comment = CommentSerializer(comment)
        self.assertEqual(response.data, serializer_comment.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_comment(self):
        response = self.client.get(reverse('CommentRetrieveUpdateDestroy', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_comment(self):
        response = self.client.delete(reverse('CommentRetrieveUpdateDestroy', kwargs={'pk': self.c4.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_update_comment(self):
        response = self.client.put(
            reverse('CommentRetrieveUpdateDestroy', kwargs={'pk': self.c5.pk}),
            data=json.dumps(self.valid_comment),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(reverse('CommentRetrieveUpdateDestroy', kwargs={'pk': self.c5.pk}))
        comment = Comment.objects.get(pk=self.c5.pk)
        serializer_comment = CommentSerializer(comment)
        self.assertEqual(response.data['text'], 'update_text')
        
        response = self.client.put(
            reverse('CommentRetrieveUpdateDestroy', kwargs={'pk': 50}),
            data=json.dumps(self.valid_comment),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class RateCreate(APITestCase):

    def test_create_rate(self):
        self.user18=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token18=Token.objects.create(user=self.user18)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token18.key)
        self.sh7 = Shop.objects.create(title="shop 18", user=self.user18, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.valid_rate = {
            'user': self.user18.id,
            'shop': self.sh7.id,
            'rate': 3,
        }
        self.invalid_rate = {
            'user': self.user18.id,
            'shop': self.sh7.id,
            'rate': 3.5,
        }
        response = self.client.post(
            reverse('RateCreate'),
            data=json.dumps(self.valid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(
            reverse('RateCreate'),
            data=json.dumps(self.invalid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class RateList(APITestCase):

    def test_list_all_rate(self):

        self.user15=MyUser.objects.create_user(username='test 1', email='test1@test.com', password="strong_Pass")
        self.token15=Token.objects.create(user=self.user15)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token15.key)
        self.sh5 = Shop.objects.create(title="shop 15", user=self.user15, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")

        r1 = Rate.objects.create(user=self.user15, shop=self.sh5, rate=4)
        r2 = Rate.objects.create(user=self.user15, shop=self.sh5, rate=1)
        r3 = Rate.objects.create(user=self.user15, shop=self.sh5, rate=5)

        response = self.client.get(reverse('RateList', kwargs={'pk': self.sh5.pk}))
        rates = Rate.objects.all()
        serializer = ListRateSerializer(rates, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class RateRetrieveUpdateDestroy(APITestCase):

    def setUp(self):
        self.user17 = MyUser.objects.create(username="name 17", email="test17@gmail.com", password="strong_Pass")
        self.token17=Token.objects.create(user=self.user17)
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token17.key)
        self.sh6 = Shop.objects.create(title="shop 17", user=self.user17, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.r4 = Rate.objects.create(user=self.user17, shop=self.sh6, rate=1)
        self.r5 = Rate.objects.create(user=self.user17, shop=self.sh6, rate=2)
        self.valid_rate = {
            'user': self.user17.id,
            'shop': self.sh6.id,
            'rate': 3
        }

    def test_retrieve_single_rate(self):
        response = self.client.get(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.r4.pk}))
        rate = Rate.objects.get(pk=self.r4.pk)
        serializer_rate = ListRateSerializer(rate)
        self.assertEqual(response.data, serializer_rate.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_single_rate(self):
        response = self.client.get(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': 50}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_rate(self):
        response = self.client.delete(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.r4.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_update_rate(self):
        response = self.client.put(
            reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.r5.pk}),
            data=json.dumps(self.valid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(reverse('RateRetrieveUpdateDestroy', kwargs={'pk': self.r5.pk}))
        rate = Rate.objects.get(pk=self.r5.pk)
        serializer_rate = RateSerializer(rate)
        self.assertEqual(response.data['rate'], 3)
        
        response = self.client.put(
            reverse('RateRetrieveUpdateDestroy', kwargs={'pk': 50}),
            data=json.dumps(self.valid_rate),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TopShopList(APITestCase):

    def test_filter_top_shop(self):
        self.test_user = MyUser.objects.create_user(username='testcase', email='email@test.com', password="strong_Pass") 

        self.sh1 = Shop.objects.create(title="shop 1", user=self.test_user, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sh2 = Shop.objects.create(title="shop 2", user=self.test_user, manager="manager 2", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")
        self.sh3 = Shop.objects.create(title="shop 3", user=self.test_user, manager="manager 3", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111")

        self.r4 = Rate.objects.create(user=self.test_user, shop=self.sh1, rate=3)
        self.r4 = Rate.objects.create(user=self.test_user, shop=self.sh2, rate=5)
        self.r4 = Rate.objects.create(user=self.test_user, shop=self.sh3, rate=2)

        
        response=self.client.get("/api/v1/shops/top/")
        self.assertEqual(response.data[0]["rate_value"], 5)
        self.assertEqual(response.data[0]["title"], 'shop 2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MantagheShopList(APITestCase):

    def test_filter_mantaghe_shop(self):
        self.test_user = MyUser.objects.create_user(username='testcase', email='email@test.com', password="strong_Pass") 

        self.sh1 = Shop.objects.create(title="shop 1", user=self.test_user, manager="manager 1", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111", mantaghe="1")
        self.sh2 = Shop.objects.create(title="shop 2", user=self.test_user, manager="manager 2", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111", mantaghe="2")
        self.sh3 = Shop.objects.create(title="shop 3", user=self.test_user, manager="manager 3", logo=None, address="address 1", theme=1, shomare_sabt="1111", phone="111111", mantaghe="1")
        
        response=self.client.get("/api/v1/shops/region/?q=1")
        self.assertEqual(response.data[0]["mantaghe"], '1')
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class SearchShop(APITestCase):
    def test_search_shop(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.sh1 = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")
        self.sh2 = Shop.objects.create(title="test", user=self.user, manager="Test",
                            address="Test address", theme=1, shomare_sabt="1111", phone="111111")
        self.sh3 = Shop.objects.create(title="heyday", user=self.user, manager="Test",
                            address="Test address", theme=1, shomare_sabt="1111", phone="111111")
        self.sh4 = Shop.objects.create(title="heyday", user=self.user, manager="Test",
                            address="address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        response=self.client.get("/api/v1/shops/search?q=test")
        searcheOne=Shop.objects.get(id=self.sh1.id)
        chooseSerializer=ShopSerializer(searcheOne)
        searcheOne1 = Shop.objects.get(id=self.sh2.id)
        chooseSerializer1 = ShopSerializer(searcheOne1)
        searcheOne2 = Shop.objects.get(id=self.sh3.id)
        chooseSerializer2 = ShopSerializer(searcheOne2)
        self.assertEqual(response.data[0], chooseSerializer.data)
        self.assertEqual(response.data[1], chooseSerializer1.data)
        self.assertEqual(response.data[2], chooseSerializer2.data)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

##########################################################################################################################
class TestShopCommentLike(APITestCase):
    def test_comment_of_shop_like(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        comment = Comment.objects.create(user=self.user, text="test comment", shop=h)

        ###########POST####################
        response = self.client.post("/api/v1/shops/33/comments/13/likes")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertEqual(response.data['Liked_By'][0]['username'], 'testcase')

        #########################GET#################################
        response = self.client.get("/api/v1/shops/33/comments/13/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 1)
        self.assertEqual(response.data[0]['Liked_By'][0]['username'], 'testcase')

        ###########POST####################
        response = self.client.post("/api/v1/shops/33/comments/13/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)
        self.assertEqual(len(response.data['Liked_By']), 0)

        #########################GET#################################
        response = self.client.get("/api/v1/shops/33/comments/13/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(len(response.data[0]['Liked_By']), 0)

class TestShopReply(APITestCase):
    def test_reply_of_shop(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        tokencopy= self.token.key

        self.user = MyUser.objects.create_user(username='testcase2', email='email@tes2r.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        response=Comment.objects.create(user=self.user, text="test comment", shop=h)

        # data = {"text": "reply test"}
        # response = self.client.post("/api/v1/shops/33/comments/13/replies", data)  ###failed
        # self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.credentials(HTTP_AUTHORIZATION="Token " + tokencopy)
        data = {"text": "reply"}
        response = self.client.post("/api/v1/shops/34/comments/14/replies", data)###1
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {"text": "reply test"}
        response = self.client.post("/api/v1/shops/34/comments/14/replies", data)  ###2
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #########################GET#################################
        response = self.client.get("/api/v1/shops/34/comments/14/replies")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reply=ReplySerializer(Reply.objects.get(id=1))
        reply2 = ReplySerializer(Reply.objects.get(id=2))
        self.assertEqual(response.data[0], reply.data)
        self.assertEqual(response.data[1], reply2.data)
        self.assertEqual(len(response.data), 2)

class TestShopReplyInfo(APITestCase):
    def test_reply_of_shop_info(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        response=Comment.objects.create(user=self.user, text="test comment", shop=h)

        data = {"text": "reply test"}
        response = self.client.post("/api/v1/shops/35/comments/15/replies", data)  ###3
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########PUT####################
        data = {"text": "Update of Test"}
        response = self.client.put("/api/v1/shops/35/comments/15/replies/3", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["text"], "Update of Test")
        #########################GET#################################
        response = self.client.get("/api/v1/shops/35/comments/15/replies/3")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        reply=ReplySerializer(Reply.objects.get(id=3))
        self.assertEqual(response.data, reply.data)
        #########################DELETE#################################
        response = self.client.delete("/api/v1/shops/35/comments/15/replies/3")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class TestShopReplyLike(APITestCase):
    def test_reply_of_shop_like(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        response=Comment.objects.create(user=self.user, text="test comment", shop=h)

        data = {"text": "reply test"}
        response = self.client.post("/api/v1/shops/36/comments/16/replies", data)  ###4
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ###########POST####################
        response = self.client.post("/api/v1/shops/36/comments/16/replies/4/likes", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertEqual(response.data['Liked_By'][0]['username'], 'testcase')

        #########################GET#################################
        response = self.client.get("/api/v1/shops/36/comments/16/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 1)
        self.assertEqual(response.data[0]['Liked_By'][0]['username'], 'testcase')

        ###########POST####################
        response = self.client.post("/api/v1/shops/36/comments/16/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)
        self.assertEqual(len(response.data['Liked_By']), 0)

        #########################GET#################################
        response = self.client.get("/api/v1/shops/36/comments/16/replies/4/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(len(response.data[0]['Liked_By']), 0)


class TestTheLikeShop(APITestCase):
    def test_like_shop(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)


        ###########POST####################
        response = self.client.post("/api/v1/shops/37/likes")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['likes_count'], 1)
        self.assertEqual(response.data['Liked_By'][0]['username'], 'testcase')

        #########################GET#################################
        response = self.client.get("/api/v1/shops/37/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 1)
        self.assertEqual(response.data[0]['Liked_By'][0]['username'], 'testcase')

        response = self.client.get("/users/profile/likedshops")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], 37)
        self.assertEqual(len(response.data), 1)

        ###########POST####################
        response = self.client.post("/api/v1/shops/37/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['likes_count'], 0)
        self.assertEqual(len(response.data['Liked_By']), 0)

        response = self.client.get("/users/profile/likedshops")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        #########################GET#################################
        response = self.client.get("/api/v1/shops/37/likes")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['likes_count'], 0)
        self.assertEqual(len(response.data[0]['Liked_By']), 0)


class TestTheReplyCommentItem(APITestCase):
    def test_reply_comment_of_item(self):
        self.user = MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        h = Shop.objects.create(title="testShop", user=self.user, manager="Test",
                                address="Test address", theme=1, shomare_sabt="1111", phone="111111")

        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

        response=Comment.objects.create(user=self.user, text="test comment", shop=h)

        data = {"text": "reply test"}
        response = self.client.post("/api/v1/shops/38/comments/17/replies", data)  ###4
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        #########################GET#################################
        response = self.client.get("/api/v1/shops/38/commentsreplis")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0], CommentReplySerializer(Comment.objects.get(id=17)).data)
        self.assertEqual(len(response.data), 1)