from django.conf import settings


class AbstractOauth2():
        
    HOST = 'https://achord.ru'
    RESPONSE_TYPE = 'token'
    EXTRA_PAYLOAD = {}

    def __init__(self):
        pass

    @property
    def OAUTH2_URL(self):
        raise NotImplementedError

    @property
    def CLIENT_ID(self):
        raise NotImplementedError


    @property
    def REDIRECT_URI(self):
        raise NotImplementedError

    @property
    def SCOPE(self):
        raise NotImplementedError
    
    @property
    def link(self):
        payload_list = [
            f'client_id={self.CLIENT_ID}',
            f'redirect_uri={self.HOST}{self.REDIRECT_URI}',
            f'response_type={self.RESPONSE_TYPE}',
            f'scope={self.SCOPE}',
            *self._get_extra_payload(),
        ]
        payload = '&'.join(payload_list)
        return f"{self.OAUTH2_URL}?{payload}"

    def _get_extra_payload(self):
        if isinstance(self.EXTRA_PAYLOAD, dict):
            return [f'{k}={v}' for k, v in self.EXTRA_PAYLOAD.items()]
        raise TypeError('attribute EXTRA_PAYLOAD must be type of dict')


class Oauth2Vk(AbstractOauth2):
    OAUTH2_URL = 'https://oauth.vk.com/authorize'
    CLIENT_ID = settings.SOCIAL_AUTH_VK_OAUTH2_KEY
    REDIRECT_URI = '/oauth/vk/'
    SCOPE = 'email&v=5.131'
    SECRET = settings.SOCIAL_AUTH_VK_OAUTH2_SECRET


class Oauth2Odnoklassniki(AbstractOauth2):
    OAUTH2_URL = 'https://connect.ok.ru/oauth/authorize'
    CLIENT_ID = settings.SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_KEY
    REDIRECT_URI = "/oauth/ok/"
    SCOPE = 'VALUABLE_ACCESS,GET_EMAIL'
    SECRET = settings.SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_SECRET
    PUBLIC = settings.SOCIAL_AUTH_ODNOKLASSNIKI_OAUTH2_PUBLIC_NAME
    EXTRA_PAYLOAD = {
        'layout':'w',
        'state': '1',
    }


class Oauth2Facebook(AbstractOauth2):
    OAUTH2_URL = 'https://www.facebook.com/v11.0/dialog/oauth'
    CLIENT_ID = settings.SOCIAL_AUTH_FACEBOOK_OAUTH2_KEY
    REDIRECT_URI = "/oauth/fb/"
    SCOPE = 'email'
    SECRET = settings.SOCIAL_AUTH_FACEBOOK_OAUTH2_SECRET


class Oauth2Google(AbstractOauth2):
    OAUTH2_URL = 'https://accounts.google.com/o/oauth2/auth'
    CLIENT_ID = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_ID
    SECRET = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
    REDIRECT_URI = '/oauth/google/'
    SCOPE = 'https://www.googleapis.com/auth/userinfo.email'