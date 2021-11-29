from django.urls import include, path
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'auth/users', views.UserViewset, basename='users')
urlpatterns = router.urls


urlpatterns += [
    path('auth/jwt/create/google/', views.LoginGoogle.as_view()),
    path('auth/social/links/', views.SocialLinks.as_view()),
]