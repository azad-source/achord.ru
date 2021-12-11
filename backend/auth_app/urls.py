from django.urls import include, path
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'users', views.UserViewset, basename='users')
urlpatterns = router.urls


urlpatterns += [
    path('jwt/create/google/', views.LoginGoogle.as_view()),
    path('social/links/', views.SocialLinks.as_view()),
]