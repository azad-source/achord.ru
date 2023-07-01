from django.urls import include, path
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'author/alias', views.AuthorViewSetAlias, basename='author/alias')
router.register(r'author', views.AuthorViewSet, basename='author')
router.register(r'note', views.NoteViewSet, basename='note')
router.register(r'genre', views.GenreViewSet, basename='genre')
router.register(r'search/author', views.SearchAuthorViewSet, basename='search-author')
router.register(r'search/note', views.SearchNoteViewSet, basename='search-note')
urlpatterns = router.urls
urlpatterns += []
