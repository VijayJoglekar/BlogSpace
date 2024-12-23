from django.utils import timezone
from django.db import models
from Users.models import Blog_user
from Catagory.models import Category

class BlogPost(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField()
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    published_date = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='blogs')
    author = models.ForeignKey(Blog_user, on_delete=models.CASCADE, related_name='posts')

    class Meta:
        ordering = ['-published_date']
        unique_together = ('author', 'title') 

    def __str__(self):
        return self.title
