from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views import View
from hashlib import md5
from rest_framework_simplejwt.tokens import RefreshToken
import requests
from .oauth import Oauth2Google, Oauth2Vk, Oauth2Odnoklassniki, Oauth2Facebook
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
        links = {
            'google': Oauth2Google().link,
            'facebook':     Oauth2Facebook().link,
            'vk':     Oauth2Vk().link,
            'odnoklassniki':     Oauth2Odnoklassniki().link,
        }
        return JsonResponse(links)


class LoginBaseView(View):
    """
    Абстрактный класс авторизации через соцсети.
    Не должен использоваться напрямую.
    """
    raw_data = {}
    email = None
    first_name = None
    last_name = None
    avatar = None
    social_id = None

    def post(self, request):
        access_token = self.request.POST.get('access_token')
        self.email = self.request.POST.get('email')
        self.social_id = self.request.POST.get('user_id')
        self.get_credentials(access_token)
        return self.create_user()

    def create_user(self):
        if self.email:
            user = User.objects.get_or_create(email=self.email)[0]
            self.update_user(user)
            return create_jwt_token(user, self.raw_data)
        else:
            response = JsonResponse({
                'detail': f'Не удалось получить данные для авторизации',
                'raw_data': self.raw_data,
            })
            response.status_code = 403
            return response

    def update_user(self, user):
        user.first_name = self.first_name
        user.last_name = self.last_name
        user.avatar = self.avatar
        user.save()

    def get_credentials(self, data):
        """метод получения данных пользователя"""
        pass

    def parse_user_data(self, data):
        """метод расшифровки из первоначального объекта данных"""
        pass


class LoginVK(LoginBaseView):
    """
    Авторизация через вконтакте (Обработка redirect_uri)
    """

    ID = settings.SOCIAL_AUTH_VK_OAUTH2_KEY
    SECRET = settings.SOCIAL_AUTH_VK_OAUTH2_SECRET

    def get_credentials(self, access_token):
        user_id = self.social_id
        print('user_id')
        print(user_id)
        path = f"https://api.vk.com/method/users.get?user_id={user_id}&access_token={access_token}&fields=domain,email,uid,first_name,bdate,last_name,photo_big&v=5.131"
        data = requests.get(path).json()
        print('data')
        print(data)
        credentials = data.get("response")[0]
        self.parse_user_data(credentials)
        return credentials

    def parse_user_data(self, data):
        self.email = self.email
        self.social_id = self.social_id or data.get('domain')
        self.first_name = data.get("first_name")
        self.last_name = data.get("last_name")
        self.avatar = data.get("photo_big")


class LoginFB(LoginBaseView):
    """
    Авторизация через Facebook (Обработка redirect_uri)
    """
    ID = settings.SOCIAL_AUTH_FACEBOOK_OAUTH2_KEY
    SECRET = settings.SOCIAL_AUTH_FACEBOOK_OAUTH2_SECRET

    def get_credentials(self, access_token):
        path = f"https://graph.facebook.com/v11.0/me?client_id={self.ID}&client_secret={self.SECRET}&access_token={access_token}&fields=id,email,first_name,last_name"
        credentials = requests.get(path).json()
        self.parse_user_data(credentials)
        return credentials

    def parse_user_data(self, data):
        self.social_id = data.get("id")
        self.first_name = data.get("first_name")
        self.last_name = data.get("last_name")
        self.avatar = data.get("photo_big")
        self.email = data.get("email")


class LoginOK(LoginBaseView):
    """
    Авторизация через одноклассники (Обработка redirect_uri)
    """

    ID = settings.SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_KEY
    SECRET = settings.SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_SECRET
    PUBLIC = settings.SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_PUBLIC_NAME

    def get_credentials(self, access_token):
        sig = self.create_md5_sig(access_token)
        path = f"https://api.ok.ru/fb.do?application_key={self.PUBLIC}&format=json&method=users.getCurrentUser&sig={sig}&access_token={access_token}"
        credentials = requests.get(path).json()
        self.parse_user_data(credentials)
        return credentials

    def create_md5_sig(self, access_token):
        secret_key = md5(f"{access_token}{self.SECRET}".encode("utf-8")).hexdigest()
        application_key_md5 = f"application_key={self.PUBLIC}format=jsonmethod=users.getCurrentUser{secret_key}"
        return md5(f"{application_key_md5}".encode("utf-8")).hexdigest()

    def parse_user_data(self, data):
        self.social_id = data.get("uid")
        self.first_name = data.get("first_name")
        self.last_name = data.get("last_name")
        self.avatar = data.get("pic_3")
        self.email = data.get("email")


class LoginFB(LoginBaseView):
    """
    Авторизация через Facebook (Обработка redirect_uri)
    """
    ID = settings.SOCIAL_AUTH_FACEBOOK_OAUTH2_KEY
    SECRET = settings.SOCIAL_AUTH_FACEBOOK_OAUTH2_SECRET

    def get_credentials(self, access_token):
        path = f"https://graph.facebook.com/v11.0/me?client_id={self.ID}&client_secret={self.SECRET}&access_token={access_token}&fields=id,email,first_name,last_name"
        credentials = requests.get(path).json()
        self.parse_user_data(credentials)
        return credentials

    def parse_user_data(self, data):
        self.social_id = data.get("id")
        self.first_name = data.get("first_name")
        self.last_name = data.get("last_name")
        self.avatar = data.get("photo_big")
        self.email = data.get("email")


class LoginGoogle(LoginBaseView):
    '''
        Авторизация через одноклассники (Обработка redirect_uri)
    '''
    ID = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_ID
    SECRET = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
    raw_data = {}
    email = None

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
        # user.save()
        return user

    def get_credentials(self, access_token):
        path = f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}"
        credentials = requests.get(path).json()
        self.parse_user_data(credentials)
        return credentials

    def parse_user_data(self, data):
        # JSON EXAMPLE
        # {
        #     "issued_to": "",
        #     "audience": "",
        #     "user_id": "",
        #     "scope": "https://www.googleapis.com/auth/userinfo.email openid",
        #     "expires_in": 3445,
        #     "email": "email@gmail.com",
        #     "verified_email": true,
        #     "access_type": "online"
        # }
        self.raw_data = data
        self.email = data.get("email")

