from rest_framework import serializers
from .models import *


class ProfilePicserializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['uploaded_file', 'id']

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['uploaded_file']

class Profileserializer(serializers.ModelSerializer):
    files = serializers.PrimaryKeyRelatedField(many=True, queryset=Media.objects.all())
    urls = MediaSerializer(source='files', many=True, read_only=True)
    #phone_number = serializers.CharField(source='phone', read_only=True)
    pass_word = serializers.CharField(source='password', read_only=True)
    user_name = serializers.CharField(source='username', read_only=True)
    class Meta:
        model = MyUser
        fields = ['files', 'urls','FirstName','LastName','user_name','role','phone','address', 'pass_word','email','id']

    def update(self, instance, validated_data): #baraye oon se ta field be inja nemirese
        #print(validated_data)
        file=validated_data['files']
        if len(file)==0:
            #print('in if')
            validated_data.pop('files', None)



        return super().update(instance, validated_data)

class RestProfileserializer(serializers.ModelSerializer):
    files = serializers.PrimaryKeyRelatedField(many=True, queryset=Media.objects.all())
    urls = MediaSerializer(source='files', many=True, read_only=True)
    #phone_number = serializers.CharField(source='phone', read_only=True)
    #pass_word = serializers.CharField(source='password', read_only=True)
    #user_name = serializers.CharField(source='username', read_only=True)
    class Meta:
        model = MyUser
        fields = ['files', 'urls','FirstName','LastName','username','role','phone','address', 'password','email','id']