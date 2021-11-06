from django.urls import re_path, path
from . import views


urlpatterns = [
    re_path(r'^robots.txt$', views.robots),
    re_path(r'^sitemap.xml$', views.sitemap),
]