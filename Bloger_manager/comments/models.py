from django.db import models
from Users.models import Blog_user
from Blog.models import BlogPost



class comment_management(models.Model):
    content = models.TextField()
    user = models.ForeignKey(Blog_user, on_delete=models.CASCADE)
    blog = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} on {self.blog.title}"
