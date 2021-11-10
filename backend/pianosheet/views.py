

from rest_framework import viewsets
from .models import Author, Genre, Note
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from .serializers import AuthorSerializer, NoteSerializer, GenreSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from core.permissions import IsOwnerOrReadOnly
from django.core.exceptions import FieldError
from django.contrib.auth import get_user_model
User = get_user_model()


class CustomModelViewSet(ModelViewSet):
    permission_dict = {}
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_dict[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def make_ordering(self, queryset):
        order = self.request.GET.get("order_by")
        if order:
            try:
                return queryset.order_by(order)
            except FieldError:
                pass
        return queryset
    
    def get_object(self):
        return self.up_rate(super().get_object())
    
    def up_rate(self, instance):
        instance.rate = instance.rate + 1
        instance.save()
        return instance

    def up_rate_list(self, queryset):
        for instance in queryset:
            self.up_rate(instance)


class GenreViewSet(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    queryset = Genre.objects.all()
    permission_classes = (IsAdminUser,)
    permission_dict = {
        'list': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsAdminUser, ),
        'create': (IsAdminUser, ),
        'destroy': (IsAdminUser, ),
    }

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_dict[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class AuthorViewSet(CustomModelViewSet):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    permission_classes = (IsAdminUser,)
    permission_dict = {
        'list': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsAdminUser, ),
        'create': (IsAdminUser, ),
        'destroy': (IsAdminUser, ),
    }

    def get_queryset(self):
        queryset = super().get_queryset()
        letter = self.request.GET.get("letter")
        alias = self.request.GET.get("alias")
        if letter:
            queryset = queryset.filter(name__istartswith=letter)
        elif alias:
            queryset = queryset.filter(alias=alias)
            self.up_rate_list(queryset)
        return self.make_ordering(queryset)


class NoteViewSet(CustomModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = (IsAdminUser,)
    permission_dict = {
        'list': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsOwnerOrReadOnly, ),
        'create': (IsAuthenticated, ),
        'destroy': (IsOwnerOrReadOnly, ),
    }
    

    def get_queryset(self):
        queryset = Note.objects.select_related("author")
        author_id = self.request.GET.get("author_id")
        author_alias = self.request.GET.get("author_alias")
        if author_id:
            queryset = queryset.filter(author__id=author_id)
        elif author_alias:
            queryset = queryset.filter(author__alias=author_alias)
        return self.make_ordering(queryset)


class SearchAuthorViewSet(ReadOnlyModelViewSet):
    serializer_class = AuthorSerializer
    def get_queryset(self):
        query = self.request.GET.get("query")
        if query:
            return Author.objects.complex_search(query, 'name')
        else:
            return Author.objects.none()


class SearchNoteViewSet(ReadOnlyModelViewSet):
    serializer_class = NoteSerializer
    def get_queryset(self):
        query = self.request.GET.get("query")
        if query:
            return Note.objects.complex_search(query, 'name')
        else:
            return Note.objects.none()
