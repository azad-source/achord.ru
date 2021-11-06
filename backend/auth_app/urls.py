from django.urls import include, path
from . import views
from rest_framework import routers


urlpatterns = [
    path('auth/jwt/create/ok/', views.LoginOK.as_view()),
    path('auth/jwt/create/vk/', views.LoginVK.as_view()),
    path('auth/jwt/create/fb/', views.LoginFB.as_view()),
    path('auth/social/links/', views.SocialLinks.as_view()),
]