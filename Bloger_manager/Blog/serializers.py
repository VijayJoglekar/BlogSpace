from rest_framework import serializers
from Blog.models import BlogPost
from Users.models import Blog_user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog_user
        fields = ['id', 'username', 'profile_picture']

class serializeBlogpost(serializers.ModelSerializer):
    author = UserSerializer()
    class Meta:
        model =BlogPost
        fields = '__all__'
