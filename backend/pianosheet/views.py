from core.permissions import IsOwnerOrReadOnly
from django.contrib.postgres.search import SearchVector
from django.core.exceptions import FieldError
from django.contrib.auth import get_user_model
from django.db.models import Prefetch, Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.viewsets import ReadOnlyModelViewSet, ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from .models import Author, Genre, Note, AuthorStat, NoteStat
from .serializers import AuthorSerializer, NoteSerializer, GenreListSerializer, FavoriteNoteSerializer, FavoriteAuthorSerializer, LikeAuthorSerializer, LikeNoteSerializer
from .managers import complex_filter
from .pagination import GenrePagination, AuthorPagination, NotePagination
from . import filters
User = get_user_model()
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers


class StatMixin:
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


class CustomModelViewSet(StatMixin, ModelViewSet):
    permission_dict = {}
    def get_permissions(self):
        try:
            return [permission() for permission in self.permission_dict[self.action]]
        except KeyError:
            return [permission() for permission in self.permission_classes]
        
    def get_queryset(self):
        if self.action == 'random':
            return super().get_queryset().order_by('?')
        if self.action == 'favorite':
            return super().get_queryset().filter(stats=self.request.user, itemstat__favorite=True)
        if self.action == 'like':
            return super().get_queryset().filter(stats=self.request.user, itemstat__like=True)
        return super().get_queryset()


    @method_decorator(cache_page(60))
    @method_decorator(vary_on_headers("Authorization",))
    @action(detail=False, methods=['get'])
    def random(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_like_favorite(self, request, *args, **kwargs):
        if self.action in ('like', 'favorite'):
            field = self.action
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            self.stats_model.objects.update_or_create(
                user=self.request.user, 
                item=data.get('item'),
                defaults={field: data.get(field, False)})
        else: 
            raise Exception('Недопустимый action')

    @action(detail=False, methods=['get','post'])
    def favorite(self, request, *args, **kwargs):
        if self.request.method == 'GET':
            return super().list(request, *args, **kwargs)
        if self.request.method == 'POST':
            self.perform_like_favorite(self, request, *args, **kwargs)
            return Response({'result': 'OK'})

    @action(detail=False, methods=['get','post'])
    def like(self, request, *args, **kwargs):
        if request.method == 'GET':
            return super().list(request, *args, **kwargs)        
        if request.method == 'POST':
            self.perform_like_favorite(self, request, *args, **kwargs)
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
    filter_backends = [filters.SimpleFilter]
    filter_config = {
        'letter': 'name__istartswith',
        'alias': 'alias',
        'genre_alias': 'genres__alias',
    }

    stats_model = AuthorStat
    permission_dict = {
        'list': (AllowAny, ),
        'random': (AllowAny, ),
        'retrieve': (AllowAny, ),
        'update': (IsAdminUser, ),
        'create': (IsAdminUser, ),
        'destroy': (IsAdminUser, ),
        'like': (IsAuthenticated,),
        'favorite': (IsAuthenticated,),
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
            .prefetch_related(*self.all_prefetch).prefetch_related('genres')
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
        'like': (IsAuthenticated,),
        'favorite': (IsAuthenticated,),
    }
    filter_backends = [filters.SimpleFilter]
    filter_config = {
        'author_id': 'author__id',
        'author_alias': 'author__alias',
        'genre_alias': 'author__genres__alias',
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
        return self.make_ordering(queryset)



class SearchAuthorViewSet(StatMixin, ReadOnlyModelViewSet):
    stats_model = AuthorStat
    serializer_class = AuthorSerializer
    def get_queryset(self):
        query = self.request.GET.get("query")
        if query:
            return Author.objects\
            .prefetch_related(*self.all_prefetch)\
            .annotate(**self.like_count)\
            .annotate(search=SearchVector('name'))\
            .filter(complex_filter(query, 'name'))\
            .distinct()
        else:
            return Author.objects.none()


class SearchNoteViewSet(StatMixin, ReadOnlyModelViewSet):
    stats_model = NoteStat
    serializer_class = NoteSerializer
    def get_queryset(self):
        query = self.request.GET.get("query")
        if query:
            return Note.objects\
            .prefetch_related(*self.all_prefetch)\
            .annotate(**self.like_count)\
            .annotate(search=SearchVector('name'))\
            .filter(complex_filter(query, 'name'))\
            .select_related("author")\
            .distinct()
        else:
            return Note.objects.none()
