from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from Blog.models import BlogPost
from Users.models import Blog_user
from Users.serializers import CommentManagementSerializer
from comments.models import comment_management

# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def doCommemt(request):
    user = request.user
    if not user:
        return JsonResponse({'message': 'User not logged in'}, status=401)

    blog_post_id = request.data.get('id')  # Use request.data for DRF compatibility
    comment_content = request.data.get('comment')

    if not blog_post_id or not comment_content:
        return JsonResponse({'message': 'Blog ID and comment content are required'}, status=400)

    try:
        blog_post = BlogPost.objects.get(id=blog_post_id)
        comment = comment_management(
            content=comment_content,
            user=user,
            blog=blog_post,
        )
        comment.save()
        return JsonResponse({'message': 'Comment created successfully!'}, status=201)
    except BlogPost.DoesNotExist:
        return JsonResponse({'message': 'Blog not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Getcomments(request, id):  # Receive 'id' as a parameter
    try:
        blog_id = id  # Use the 'id' parameter directly
        try:
            blog_post = BlogPost.objects.get(id=blog_id)
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post not found'}, status=404)

        # Retrieve comments related to the blog
        comments = comment_management.objects.filter(blog=blog_post)
        serialized_comments = CommentManagementSerializer(comments, many=True)
        return JsonResponse({'comments': serialized_comments.data}, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)