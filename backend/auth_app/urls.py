from django.urls import include, path
from . import views
from rest_framework import routers


urlpatterns = [
    path('auth/jwt/create/google/', views.LoginGoogle.as_view()),
    path('auth/social/links/', views.SocialLinks.as_view()),
]