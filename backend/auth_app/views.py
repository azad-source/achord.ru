from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views import View
from hashlib import md5
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from .oauth import Oauth2Google
User = get_user_model()


def create_jwt_token(user, raw_data=""):
    refresh = RefreshToken.for_user(user)
    return JsonResponse({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'raw_data': raw_data,
    })


class SocialLinks(View):
    def get(self, request):
        links = {'google': Oauth2Google().link}
        return JsonResponse(links)


class LoginGoogle(View):
    '''
        Авторизация через одноклассники (Обработка redirect_uri)
    '''
    raw_data = {}
    email = None
    ID = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_ID
    SECRET = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET

    def post(self, request):
        access_token = self.request.POST.get('access_token')
        if access_token:
            self.get_credentials(access_token)
            return self.create_user()
        return JsonResponse({'detail': 'error'})

    def create_user(self):
        if self.email:
            user = User.objects.get_or_create(email=self.email)[0]
            user = self.update_user(user)
            return create_jwt_token(user, self.raw_data)
        else:
            response = JsonResponse({
                'detail': f'Не удалось получить данные для авторизации',
                'raw_data': self.raw_data,
            })
            response.status_code = 401
            return response

    def update_user(self, user):
        return user

    def get_credentials(self, access_token):
        path = f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
        credentials = requests.get(path).json()
        self.parse_user_data(credentials)
        return credentials

    def parse_user_data(self, data):
        self.raw_data = data
        self.email = data.get("email")

