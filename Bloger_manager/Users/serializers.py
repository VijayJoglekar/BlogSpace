from rest_framework import serializers

from comments.models import comment_management
from .models import Blog_user



class SeriUser( serializers.Serializer):
   
    UserName = serializers.CharField(max_length=30)
    Password = serializers.CharField(max_length=30)
    Email = serializers.EmailField()
    Varification = serializers.IntegerField(default=0)
    otp = serializers.IntegerField(default=0)

    class Meta:
        model = Blog_user
        fields = '__all__'


class CommentManagementSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username')  # Serialize the username
    blog = serializers.CharField(source='blog.title')     # Serialize the blog title

    class Meta:
        model = comment_management
        fields = ['content', 'user', 'blog', 'created_at', 'updated_at']