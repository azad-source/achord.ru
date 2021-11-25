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
        return {
            'clientId': self.CLIENT_ID,
            'redirectUri': f'{self.HOST}{self.REDIRECT_URI}',
            'scope': f'{self.SCOPE}',
            'responseType': self.RESPONSE_TYPE,
        }


class Oauth2Google(AbstractOauth2):
    OAUTH2_URL = 'https://accounts.google.com/o/oauth2/auth'
    CLIENT_ID = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_ID
    SECRET = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
    REDIRECT_URI = '/oauth/google/'
    SCOPE = 'https://www.googleapis.com/auth/userinfo.email'