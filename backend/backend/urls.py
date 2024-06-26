"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    # path('silk/', include('silk.urls', namespace='silk')),
    path('google0ca94841f746284e.html', TemplateView.as_view(template_name="google0ca94841f746284e.html")), # для верификации google oauth2
    path('api/pianosheet/', include('pianosheet.urls')),
    path('', include('seo.urls')),
    path('auth/', include('auth_app.urls')),
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
] + static('media/', document_root=settings.MEDIA_ROOT
) + static('backstatic/', document_root=settings.STATIC_ROOT
) 


