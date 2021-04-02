#from django.test import TestCase

from rest_framework.test import APIRequestFactory,APITestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
import json
from .models import MyUser
from .serializers import Profileserializer
from .views import ProfileInfo

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
    def test_login(self):
        self.user=MyUser.objects.create_user(username='testcase',email='email@tesr.com',password="strong_Pass")
        self.token=Token.objects.create(user=self.user)
        data = {"username": "testcase", "password": "strong_Pass"}
        response=self.client.post("/rest-auth/login/",data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class LogoutTest(APITestCase):
    def test_logout(self):
        self.user=MyUser.objects.create_user(username='testcase',email='email@tesr.com',password="strong_Pass")
        #credential=self.client.credentials(username="testcase",password="strong_Pass")
        self.token=Token.objects.create(user=self.user)
        data = {"username": "testcase", "password": "strong_Pass"}
        self.client.post("/rest-auth/login/",data)
        response2 = self.client.post("/rest-auth/logout/")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

class ProfileTest(APITestCase):
    url=reverse("profileList")
    def setUp(self):
        self.user=MyUser.objects.create_user(username='testcase', email='email@tesr.com', password="strong_Pass")
        self.token=Token.objects.create(user=self.user)
        self.api_authontication()

    def api_authontication(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token "+ self.token.key)

    def test_profile_authenticated(self):
        response=self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_profile_Un_authenticated(self):
        self.client.force_authenticate(user=None)
        response=self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_detials(self):
        response=self.client.get(self.url)
        #print(ProfileInfo.as_view()(response))
        self.assertEqual(response.data["user_name"],self.user.username)
        self.assertEqual(response.data["FirstName"], self.user.FirstName)
        self.assertEqual(response.data["LastName"], self.user.LastName)
        self.assertEqual(response.data["role"], self.user.role)
        self.assertEqual(response.data["phone"], self.user.phone)
        self.assertEqual(response.data["address"], self.user.address)
        self.assertEqual(response.data["email"], self.user.email)

    def test_profileEdit(self):
        data={"email":"myemail@gmail.com","FirstName":"test","LastName":"case","role":"seller","phone":"09123654575","address":"test addres"}
        response=self.client.put(self.url,data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.data)
        newData={'FirstName': 'test', 'LastName': 'case', 'user_name': 'testcase', 'role': 'seller', 'phone': '09123654575', 'address': 'test addres', 'email': 'myemail@gmail.com'}
        responseData = {'FirstName': response.data["FirstName"], 'LastName': response.data["LastName"], 'user_name': response.data["user_name"], 'role': response.data["role"],
                   'phone': response.data["phone"], 'address': response.data["address"], 'email': response.data["email"]}
        self.assertEqual(responseData,newData)

    def test_profilePic(self):
        pass ###gozashtam ke hey file nasaze chon delete nemishe
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg',delete=False)
        ###moshkel permission bedon delete
        ##C:\\Users\\Snowy\\AppData\\Local\\Temp\\tmpe9snuj3e.jpg dasti bayad pak kard
        image.save(tmp_file)

        with open(tmp_file.name, 'rb') as data:
            response = self.client.post('/users/profile/upload-file',
                                        {"image": data, "item": 1}, format='multipart')
            print(response.data,'data')
            print(tmp_file.name,"temp name")
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            ##check on edit file
            response2 = self.client.put(self.url, {"files":"1","email":'myemail@gmail.com'})
            self.assertEqual(response2.status_code, status.HTTP_200_OK)
            self.assertNotEqual(response2.data['files'], None)

            ###delete image
            response3=self.client.put('/users/profile/delete-file',{'files':"1"})
            self.assertEqual(response3.status_code, status.HTTP_200_OK)



