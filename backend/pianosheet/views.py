from core.permissions import IsOwnerOrReadOnly
from django.core.exceptions import FieldError
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .models import Author, Genre, Note, AuthorStat, NoteStat
from .serializers import AuthorSerializer, NoteSerializer, GenreListSerializer, FavoriteNoteSerializer, FavoriteAuthorSerializer, LikeAuthorSerializer, LikeNoteSerializer
from django.db.models import Prefetch, Count, Q
from .pagination import GenrePagination, AuthorPagination, NotePagination
User = get_user_model()


class CustomModelViewSet(ModelViewSet):
    permission_dict = {}
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_dict[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]
    
    @property
    def like_count(self):
        like_count = Count('itemstat__like', filter=Q(itemstat__like=True))
        return {'like_count': like_count}

    @property
    def all_prefetch(self):
        user = self.request.user
        if user and user.is_authenticated:
            stats = self.stats_model.objects.filter(user=self.request.user)
        else:
            stats = self.stats_model.objects.none()
        itemstat = Prefetch('itemstat', stats)
        return (itemstat,)
    
    def list_response(self, queryset):
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def random(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset().order_by('?'))
        return self.list_response(queryset)

    @action(detail=False, methods=['get','post'])
    def favorite(self, request, *args, **kwargs):
        if request.method == 'GET':
            queryset = self.get_queryset().filter(stats=self.request.user, itemstat__favorite=True)
            return self.list_response(queryset)
        
        if request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            self.stats_model.objects.update_or_create(user=self.request.user, item=data.get('item'),
                defaults={'favorite': data.get('favorite', False)},
            )
            return Response({'result': 'OK'})

    @action(detail=False, methods=['get','post'])
    def like(self, request, *args, **kwargs):
        if request.method == 'GET':
            queryset = self.get_queryset().filter(stats=self.request.user, itemstat__like=True)
            return self.list_response(queryset)
        
        if request.method == 'POST':
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            self.stats_model.objects.update_or_create(user=self.request.user, item=data.get('item'),
                defaults={'like': data.get('like', False)},
            )
            return Response({'result': 'OK'})

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        pk = self.kwargs['pk']
        try:
            filter_kwargs = {'pk': int(pk)}
        except ValueError:
            filter_kwargs = {'alias': pk}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

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
    serializer_class = GenreListSerializer
    queryset = Genre.objects.all()
    pagination_class = GenrePagination
    permission_classes = (IsAdminUser,)
    lookup_fields = ('pk', 'alias',)
    permission_dict = {
        'list': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsAdminUser, ), 
        'create': (IsAdminUser, ),
        'destroy': (IsAdminUser, ),
    }

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        pk = self.kwargs['pk']
        try:
            filter_kwargs = {'pk': int(pk)}
        except ValueError:
            filter_kwargs = {'alias': pk}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_dict[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]


class AuthorViewSet(CustomModelViewSet):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    permission_classes = (IsAdminUser,)
    pagination_class = AuthorPagination
    stats_model = AuthorStat
    permission_dict = {
        'list': (AllowAny, ),
        'random': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsAdminUser, ),
        'create': (IsAdminUser, ),
        'destroy': (IsAdminUser, ),
    }

    def get_serializer_class(self):
        if self.action == 'favorite' and self.request.method == 'POST':
            return FavoriteAuthorSerializer
        if self.action == 'like' and self.request.method == 'POST':
            return LikeAuthorSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()\
            .annotate(**self.like_count)\
            .prefetch_related(*self.all_prefetch)
        letter = self.request.GET.get("letter")
        alias = self.request.GET.get("alias")
        genre_alias = self.request.GET.get("genre_alias")

        if letter:
            queryset = queryset.filter(name__istartswith=letter)
        elif alias:
            queryset = queryset.filter(alias=alias)
        elif genre_alias:
            queryset = queryset.filter(genres__alias=genre_alias).prefetch_related('genres')
            # self.up_rate_list(queryset)
        return self.make_ordering(queryset)


class NoteViewSet(CustomModelViewSet):
    serializer_class = NoteSerializer
    stats_model = NoteStat
    permission_classes = (IsAdminUser,)
    pagination_class = NotePagination
    permission_dict = {
        'list': (AllowAny, ),
        'random': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsOwnerOrReadOnly, ),
        'create': (IsAuthenticated, ),
        'destroy': (IsOwnerOrReadOnly, ),
    }

    def get_serializer_class(self):
        if self.action == 'favorite' and self.request.method == 'POST':
            return FavoriteNoteSerializer
        if self.action == 'like' and self.request.method == 'POST':
            return LikeNoteSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = Note.objects\
            .select_related("author")\
            .annotate(**self.like_count)\
            .prefetch_related(*self.all_prefetch)
        author_id = self.request.GET.get("author_id")
        author_alias = self.request.GET.get("author_alias")
        genre_alias = self.request.GET.get("genre_alias")
        if author_id:
            queryset = queryset.filter(author__id=author_id)
        elif author_alias:
            queryset = queryset.filter(author__alias=author_alias)
        elif genre_alias:
            queryset = queryset.filter(author__genres__alias=genre_alias)
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
