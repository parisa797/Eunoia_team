#from django.test import TestCase

from rest_framework.test import APIRequestFactory, APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from .models import *
from .serializers import *
from .views import *
from shops.models import Shop
from shoppings.models import ShoppingList, ShoppingItem
# from shoppings.urls import wallet_shopping_list, update_shopping_list
from items.models import Item, SpecialItem
from items.serializers import SepcialItemSerializer
from PIL import Image
import tempfile

# Create your tests here.


class Registration(APITestCase):
    def test_registration(self):
        data = {"username": "testcase", "email": "test@gmail.com", "password1": "Strong_Password",
                "password2": "Strong_Password"}
        response = self.client.post("/rest-auth/registration/", data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class LoginTest(APITestCase):
    def test_login_not_varify_email(self):
        self.user = MyUser.objects.create_user(
            username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        data = {"username": "testcase", "password": "strong_Pass"}
        response = self.client.post("/rest-auth/login/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogoutTest(APITestCase):
    def test_logout(self):
        self.user = MyUser.objects.create_user(
            username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        data = {"username": "testcase", "password": "strong_Pass"}
        self.client.post("/rest-auth/login/", data)
        response2 = self.client.post("/rest-auth/logout/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)


class ProfileTest(APITestCase):
    url = reverse("profileList")

    def setUp(self):
        self.user = MyUser.objects.create_user(
            username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.api_authontication()

    def api_authontication(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_profile_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_Un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_detials(self):
        response = self.client.get(self.url)
        self.assertEqual(response.data["user_name"], self.user.username)
        self.assertEqual(response.data["FirstName"], self.user.FirstName)
        self.assertEqual(response.data["LastName"], self.user.LastName)
        self.assertEqual(response.data["role"], self.user.role)
        self.assertEqual(response.data["phone"], self.user.phone)
        self.assertEqual(response.data["address"], self.user.address)
        self.assertEqual(response.data["email"], self.user.email)

    def test_profileEdit(self):
        data = {"email": "myemail@gmail.com", "FirstName": "test", "LastName": "case",
                "role": "seller", "phone": "09123654575", "address": "test addres"}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)
        newData = {'FirstName': 'test', 'LastName': 'case', 'user_name': 'testcase', 'role': 'seller',
                   'phone': '09123654575', 'address': 'test addres', 'email': 'myemail@gmail.com'}
        responseData = {'FirstName': response.data["FirstName"], 'LastName': response.data["LastName"], 'user_name': response.data["user_name"], 'role': response.data["role"],
                        'phone': response.data["phone"], 'address': response.data["address"], 'email': response.data["email"]}
        self.assertEqual(responseData, newData)

    def test_profilePic(self):
        pass  # gozashtam ke hey file nasaze chon delete nemishe
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg', delete=False)
        # moshkel permission bedon delete
        # C:\\Users\\Snowy\\AppData\\Local\\Temp\\tmpe9snuj3e.jpg dasti bayad pak kard
        image.save(tmp_file)

        with open(tmp_file.name, 'rb') as data:
            response = self.client.post('/users/profile/upload-file',
                                        {"image": data, "item": 1}, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # check on edit file
            response2 = self.client.put(
                self.url, {"files": "1", "email": 'myemail@gmail.com'})
            self.assertEqual(response2.status_code, status.HTTP_200_OK)
            self.assertNotEqual(response2.data['files'], None)

            # delete image
            response3 = self.client.put(
                '/users/profile/delete-file', {'files': "1"})
            self.assertEqual(response3.status_code, status.HTTP_200_OK)


class CoinTest(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create(
            username="test", email="test17@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_create_coin(self):
        response = self.client.post(reverse('createcoin'))
        coin = Coins.objects.get(user=self.user)
        serializer_coin = CoinSerializer(coin)
        self.assertEqual(response.data, serializer_coin.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(reverse('createcoin'))
        self.assertEqual(response.data, 'You made coins before')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CoinRetriveTest(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create_superuser(
            username="test", email="test17@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.coin = Coins.objects.create(user=self.user, money=100)
        self.sh = Shop.objects.create(
            title="shop 10", user=self.user, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.I = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                     Expiration_Date="1400-12-04", count="4", price="4",
                                     discount="40", category="Dairy")

        self.sl = ShoppingList.objects.create(
            shop=self.sh, user=self.user, address="address 1", phone="111111", date="2021-04-12 12:30")
        self.il = ShoppingItem.objects.create(
            item=self.I, number=4, shopping_list=self.sl, price=200000, sum_price=800000)

        self.specialItem = SpecialItem.objects.create(name="xbox", price=50)
        self.specialItem2 = SpecialItem.objects.create(name="xbox2", price=250)

    def test_get_create_all_coin(self):
        response = self.client.get(reverse('createcoin'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0], CoinSerializer(self.coin).data)
        self.assertEqual(len(response.data), 1)

    def test_get_coin(self):
        response = self.client.get(
            reverse('coinInfo', kwargs={'pk': self.coin.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, CoinSerializer(self.coin).data)

    def test_update_coin(self):
        response = self.client.put(
            reverse('coinInfo', kwargs={'pk': self.coin.pk}), {'money': 500})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        coin = Coins.objects.get(user=self.user)
        self.assertEqual(response.data, CoinSerializer(coin).data)
        self.assertEqual(response.data['money'], 500)

        response = self.client.put(
            reverse('coin_update', kwargs={'pk': self.coin.pk}))
        self.assertEqual(response.data['rank'], "bronze")
        tmp = str(response.data['last_buy']).split("T")[0]
        temp = str(response.data['last_buy']).split("T")[1].split(":")
        javab = tmp+" "+temp[0]+":"+temp[1]
        self.assertEqual(javab, str(self.sl.date))

    def test_delete_coin(self):
        response = self.client.delete(
            reverse('coinInfo', kwargs={'pk': self.coin.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_sabt_update_coin(self):
        response = self.client.put(
            reverse('sabt_shopping_list', kwargs={'pk': self.sl.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        coin = Coins.objects.get(user=self.user)
        self.assertEqual(coin.money, 180)

    def test_coin_shop(self):
        response = self.client.post(
            reverse('coin_shop', kwargs={'pk': self.specialItem.pk}))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data, "You got this award. Please visit this address between 9 am and 4 pm with the national card to receive the award")
        coin = Coins.objects.get(user=self.user)
        self.assertEqual(coin.money, 50)

        response = self.client.post(
            reverse('coin_shop', kwargs={'pk': self.specialItem2.pk}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,
                         "you don't have enough coin for this prize")
        coin = Coins.objects.get(user=self.user)
        self.assertEqual(coin.money, 50)

    def test_coin_shop_list(self):
        self.client.post(reverse('coin_shop', kwargs={
                         'pk': self.specialItem.pk}))
        response = self.client.get(reverse('list_coin_shop'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['coinInfo']['id'], self.coin.id)
        self.assertEqual(response.data[0]['special_item'], self.specialItem.id)

    def test_coin_shop_retrieve(self):
        self.client.post(reverse('coin_shop', kwargs={
                         'pk': self.specialItem.pk}))
        response = self.client.get(
            reverse('retrieve_coin_shop', kwargs={'pk': self.sl.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['coinInfo']['id'], self.coin.id)
        self.assertEqual(response.data['special_item'], self.specialItem.id)


class EllectricWalletTest(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create(
            username="test", email="test17@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)

    def test_create_EWallet(self):
        response = self.client.post(reverse('create_wallet'))
        wallet = ElectricWallet.objects.get(user=self.user)
        serializer_wallet = ElectricWalletSerializer(wallet)
        self.assertEqual(response.data, serializer_wallet.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(reverse('create_wallet'))
        self.assertEqual(response.data, "You made Electric Wallet before")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EllectricWalletRetriveTest(APITestCase):

    def setUp(self):
        self.user = MyUser.objects.create_superuser(
            username="test", email="test17@gmail.com", password="strong_Pass")
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token.key)
        self.wallet = ElectricWallet.objects.create(user=self.user, money=1000)
        self.sh = Shop.objects.create(
            title="shop 10", user=self.user, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.sh2 = Shop.objects.create(
            title="shop 10", user=self.user, manager="manager 10", logo=None, address="address 10", theme=10, shomare_sabt="10101010", phone="10101010")
        self.I = Item.objects.create(name="item 4", description="Test description", manufacture_Date="1400-12-04",
                                     Expiration_Date="1400-12-04", count="4", price="4",
                                     discount="40", category="Dairy")

        self.sl = ShoppingList.objects.create(
            shop=self.sh, user=self.user, address="address 1", phone="111111", date="2021-04-12 12:30",wallet_boolean=False)

        self.sl2= ShoppingList.objects.create(
            shop=self.sh2, user=self.user, address="address 1", phone="111111", date="2021-04-12 12:30",wallet_boolean=False)

        self.il = ShoppingItem.objects.create(
            item=self.I, number=4, shopping_list=self.sl, price=200, sum_price=800)
        
        self.il3 = ShoppingItem.objects.create(
            item=self.I, number=5, shopping_list=self.sl2, price=200, sum_price=1000)

        self.il2 = ShoppingItem.objects.create(
            item=self.I, number=4, shopping_list=self.sl, price=300, sum_price=1200)

    def test_get_wallet(self):
        response = self.client.get(
            reverse('walletInfo', kwargs={'pk': self.wallet.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ElectricWalletSerializer(self.wallet).data)

    def test_update_wallet(self):
        response = self.client.put(
            reverse('walletInfo', kwargs={'pk': self.wallet.pk}), {'money': 3000})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        wallet = ElectricWallet.objects.get(user=self.user)
        self.assertEqual(response.data, ElectricWalletSerializer(wallet).data)
        self.assertEqual(response.data['money'], 3000)


    def test_delete_wallet(self):
        response = self.client.delete(
            reverse('walletInfo', kwargs={'pk': self.wallet.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_shopping_list_update_wallet(self):
        response = self.client.put(
            reverse('wallet_shopping_list', kwargs={'pk': self.wallet.pk}),{"wallet_boolean":True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["wallet_boolean"], True)

    def test_shopping_list_update_online_shop_with_wallet(self):

        response = self.client.put(
            reverse('wallet_shopping_list', kwargs={'pk': self.sl2.pk}),{"wallet_boolean":True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["wallet_boolean"], True)

        shoppinglist = self.client.put(
            reverse('sabt_shopping_list', kwargs={'pk': self.sl2.pk}),{"sabt":True})
        self.assertEqual(shoppinglist.status_code, status.HTTP_200_OK)
        wallet=ElectricWallet.objects.get(user=self.user)
        self.assertEqual(wallet.money, 0) 

    def test_shopping_list_update_online_shop_with_wallet_fialed(self):

        response = self.client.put(
            reverse('wallet_shopping_list', kwargs={'pk': self.sl.pk}),{"wallet_boolean":True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["wallet_boolean"], True)

        shoppinglist = self.client.put(
            reverse('sabt_shopping_list', kwargs={'pk': self.sl.pk}),{"sabt":True})
        self.assertEqual(shoppinglist.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(shoppinglist.data, "you don't have enough money in your wallet") 