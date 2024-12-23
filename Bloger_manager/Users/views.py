import random
from django.http import JsonResponse, QueryDict
from django.shortcuts import render
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from Users.models import Blog_user

# new imports regarding the session based validation 
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.middleware.csrf import get_token
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_protect

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

import jwt
from rest_framework.permissions import AllowAny

from datetime import datetime


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return JsonResponse({'message': 'This is a protected route!'}, status=200)




@api_view(['POST'])
def login(request):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return Response({'message': 'Username and password are required'}, status=400)

        # Authenticate user
        user = authenticate(username=username, password=password)

        if user is not None and user.is_active:
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,  # Include additional fields as needed
                },
                'message': 'Login successful'
            }, status=200)
        else:
            return Response({'message': 'Invalid username or password'}, status=401)

    except Exception as e:
        return Response({'message': f"Something went wrong: {str(e)}"}, status=500)



@api_view(['GET'])  # Use GET since you're fetching details
@permission_classes([IsAuthenticated])
def get_user_details(request):

    user = request.user
    profile_picture_url= (
        request.build_absolute_uri(user.profile_picture.url)
        if user.profile_picture
        else None
    )
    return JsonResponse({
        'username': user.username,
        'email': user.email,
        'profile_picture': profile_picture_url,
    })





from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


@api_view(['POST'])
@permission_classes([AllowAny])  
def logout(request):
    try:
        print("Request data:", request.data)  # Log incoming request data for debugging
        
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            print('No token provided')
            return Response({'error': 'Refresh token is required'}, status=400)

        print(f"Token being processed: {refresh_token}")

        # Try to blacklist the token
        token = RefreshToken(refresh_token)

        # Optionally verify token validity
        token.verify()

        token.blacklist()

        return Response({'message': 'Logged out successfully'}, status=200)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': f"Token invalid or already blacklisted: {str(e)}"}, status=400)




@csrf_exempt
def signup(request):
    try:
        if request.method == "POST":
            print(request.FILES)  
            username = request.POST.get('username')
            password = request.POST.get('password')
            email = request.POST.get('email')
            profile_pic = request.FILES['dp']
            if not username or not password or not email:
                return JsonResponse({'message': 'All fields are required'}, status=400)
                
            if Blog_user.objects.filter(Q(username=username) | Q(email=email)).exists():
                return JsonResponse({'message': 'Username or email already exists'}, status=400)
            otp = otp_generation()
            hashed_password = make_password(password)
            # Attempt to send OTP email
            try:
                send_mail(
                    'OTP Verification',
                    f'Your OTP is {otp}',
                    'vijayjoglekar07@gmail.com',  # Replace with your sender's email
                    [email],
                )
            except Exception as e:
                return JsonResponse({'message': f'Failed to send OTP email: {str(e)}'}, status=500)

            # Save the new user
            new_user = Blog_user(username=username, profile_picture=profile_pic, password=hashed_password, email=email, otp=otp)
            new_user.save()

            return JsonResponse({'message': 'User created successfully. Please validate your account via OTP.'}, status=201)

        else:
            return JsonResponse({'message': 'Invalid HTTP method'}, status=405)

    except Exception as e:
        return JsonResponse({'message': f'Something went wrong: {str(e)}'}, status=500)





@csrf_exempt
def validate(request):
    email = request.POST.get('email')
    Otp = int(request.POST.get('Otp'))

    try:
        data = Blog_user.objects.get(email=email)
        ooo = int(data.otp)
        print(type(ooo), type(Otp), ooo, Otp)
        if ooo == Otp:
            data.Varification = 1 
            data.save()
            return JsonResponse({'message': 'Validated successfully'}, status=200)
        else:
            return JsonResponse({'message': 'Re-enter OTP'}, status=400)
    except Blog_user.DoesNotExist:
        return JsonResponse({'message': 'Invalid Email'}, status=404)

def otp_generation():
    return ''.join([str(random.randint(0, 9)) for _ in range(4)])

def update_profile_pic(request):
    uid = request.session.get('user_id')
    pic = request.FILES.get('pic')

    if not uid:
        return JsonResponse({'message': 'User not logged in'}, status=401)

    user = Blog_user.objects.get(id=uid)
    user.profile_picture = pic
    user.save()
    return JsonResponse({'message': 'Profile picture updated successfully'}, status=200)

@csrf_exempt
def forgotPassword(request):
    try:
        user = Blog_user.objects.get(email=request.POST.get('Email'))
        forgot_otp = otp_generation()
        user.otp = forgot_otp
        print(request.POST.get('Email'),forgot_otp)
        send_mail(
                    'OTP Verification',
                    f'Your OTP is {forgot_otp}',
                    'vijayjoglekar07@gmail.com',  # Replace with your sender's email
                    [request.POST.get('Email')],
                )
        print('otp send')

        user.save()
        return JsonResponse({'message': 'OTP sent successfully'},status = 200)
    except Blog_user.DoesNotExist:
        print('user not founde')
        return JsonResponse({'message': 'No such user'}, status = 400)

@csrf_exempt
def resetPassword(request):
    email = request.POST.get('email')
    new_password = request.POST.get('new_password')
    otp = request.POST.get('otp')
    try:
        user = Blog_user.objects.get(email=email)
        print(type(otp),otp, type(user.otp) , email, new_password, otp)
        if str(otp)== user.otp:
            print('otp is correct')
            hashed_password = make_password(new_password)
            user.password = hashed_password
            user.save()
            return JsonResponse({'message': 'Password changed successfully'}, status=200)
        else:
            print('otp is not correct')
            return JsonResponse({'message': 'OTP is invalid'}, status=201)
    except Blog_user.DoesNotExist:
        return JsonResponse({'message': 'Invalid email'}, status=400)
