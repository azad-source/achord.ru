from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views import View
from hashlib import md5
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from .oauth import Oauth2Google
User = get_user_model()
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from . import serializers
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import action


class SocialLinks(View):
    def get(self, request):
        links = {'google': Oauth2Google().link}
        return JsonResponse(links)


class LoginGoogle(View):
    '''
        Авторизация через одноклассники (Обработка redirect_uri)
    '''
    raw_data = {}
    user_kwargs = {}
    email = None
    ID = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_ID
    SECRET = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
    
    def create_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'raw_data': self.raw_data,
        })

    def post(self, request):
        self.user_kwargs = {}
        self.raw_data = {}
        access_token = self.request.POST.get('access_token')
        if access_token:
            self.get_credentials(access_token)
            return self.create_user()
        return JsonResponse({'detail': 'error'})

    def create_user(self):
        if self.email:
            user = User.objects.update_or_create(
                email=self.email,
                defaults=self.user_kwargs)[0]
            return self.create_jwt_token(user)
        else:
            response = JsonResponse({
                'detail': f'Не удалось получить данные для авторизации',
                'raw_data': self.raw_data,
            })
            response.status_code = 401
            return response

    def get_credentials(self, access_token):
        path = f"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token={access_token}"
        credentials = requests.get(path).json()
        self.raw_data = credentials
        self.parse_user_data()
        
    def parse_user_data(self):
        self.email = self.raw_data.get("email")
        self.user_kwargs = {
            'first_name': self.raw_data.get("given_name"),
            'last_name': self.raw_data.get("family_name"),
            'avatar': self.raw_data.get("picture"),
        }


class UserViewset(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        instance = get_object_or_404(
            self.get_queryset(), 
            id=self.request.user.id
        )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)