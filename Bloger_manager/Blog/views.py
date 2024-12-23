from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from Blog.serializers import serializeBlogpost



from .models import BlogPost
from Users.models import Blog_user
from .models import Category
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def WriteYourBlog(request):
    title = request.POST.get('title')
    content = request.POST.get('content')
    category =  request.POST.get('category')
    img = request.FILES.get('image')
    if not title or not content or not category or not img:
        return JsonResponse({"error": "Title, Content, and Category are required."}, status=400)
    try:
        catagory_object = Category.objects.get(name = category)
        new_blog = BlogPost(title = title, content= content, image= img, category= catagory_object,
                            author= request.user)
        new_blog.save()
        return JsonResponse({'message':'Blog Published'}, status= 201)
    except Category.DoesNotExist:
        return JsonResponse({'error':'no such catagory'}, status=400)
    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ShowOwnBlog(request):
    user = request.user
    try:

        Blogs_of_user = BlogPost.objects.filter(author=user)
        print(Blogs_of_user)
        serializer = serializeBlogpost(Blogs_of_user, many=True)
        print(serializer)
        print(serializer.data) 
        
        return JsonResponse({'message': 'success', 'blogs': serializer.data}, status=200)

    except BlogPost.DoesNotExist:
        return JsonResponse({'message': 'You don\'t have any blogs'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def BlogDetail(request, id):
    try:
        blog = BlogPost.objects.get(id=id)
        # userData = Blog_user.objects.get()
        serialized_data = serializeBlogpost(blog)
        return JsonResponse({'data': serialized_data.data}, status=200)
    except BlogPost.DoesNotExist:
        return JsonResponse({'message': 'Blog not found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def explore(request):
    catagory = request.GET.get('catagory', '')  # Default to empty string if not provided
    
    if catagory == '':
        blogs = BlogPost.objects.all()
    else:
        blogs = BlogPost.objects.filter(category__name__icontains=catagory)
    
    # Serialize the blog posts
    serialized_blogs = serializeBlogpost(blogs, many=True)
    
    # Return the serialized data
    return Response({'data': serialized_blogs.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Explore_blog(request):
    blog_id = request.GET.get('id')
    print(blog_id)
    try:
        blogid = BlogPost.objects.get(id = blog_id)
        seri = serializeBlogpost(blogid)
        return JsonResponse({"data":seri.data}, status = 200)
    except BlogPost.DoesNotExist:
        return JsonResponse({'message': 'no such blog'}, status= 400)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateuser(request):
    user = request.user
    username = request.POST.get('username')
    user.username= username
    user.save()
    return JsonResponse({'message':'Delted sucessfully'}, status = 200)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delte_blog(request, bid):
    delete_blog = request.POST.get('del')
    if int(delete_blog) == 1:
        try:
            blog = BlogPost.objects.get(id = bid)
            blog.delete()
            return JsonResponse({'message':'Blog deleted sucessfully '}, status= 200)
        except blog.DoesNotExist:
            return JsonResponse({'message':'Blog does not exists '}, status= 400)
    else:
        return JsonResponse({'message':'No any blog to delete'}, status = 400)