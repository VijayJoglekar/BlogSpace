from django.contrib import admin
from django.urls import path
from Users import views
from Blog import views as blogview
from comments import views as comview
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("signup/", views.signup),
    path('validate/', views.validate),
    path('editblog/', blogview.WriteYourBlog),
    path('update_pro/', views.update_profile_pic),
    path('docomments/', comview.doCommemt),
    path('forgotpass/', views.forgotPassword),
    path('resetPass/', views.resetPassword),
    path('get-user-details/', views.get_user_details),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dopost/',blogview.WriteYourBlog),
    path('showMyblog/', blogview.ShowOwnBlog),
    path('viewblog/<int:id>/', blogview.BlogDetail),
    path('explore/<str:catagory>/', blogview.explore),
    path('explore/', blogview.explore),
    path("exploreBlog/<int:id>/", blogview.BlogDetail),
    path("Getcomments/<int:id>/", comview.Getcomments ),
    path("doCommemt/", comview.doCommemt),
    path("changeUser/", blogview.updateuser),
    path("delete/", blogview.delte_blog),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
