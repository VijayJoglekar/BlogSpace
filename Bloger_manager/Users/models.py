from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from django.contrib.auth import get_user_model


class Blog_user(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='userdp/', blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_validated = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        Group,
        related_name="blog_user_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="blog_user_permissions",
        blank=True,
    )

    # Set a default password for programmatically created users
    password = models.CharField(max_length=128)


class CustomOutstandingToken(OutstandingToken):
    custom_user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="custom_outstanding_tokens",
        null=True,  # Allow null to avoid breaking existing rows
        blank=True  # Allow blank for new rows
    )

    class Meta:
        proxy = False