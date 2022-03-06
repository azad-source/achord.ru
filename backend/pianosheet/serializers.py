import json
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Author, Note, Genre
User = get_user_model()
from .functions import safe_list_get


class GenreListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        read_only_fields = ('id', 'alias', 'preview')
        fields = (*read_only_fields, 'name')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


class LikeFavoriteSerializer(serializers.ModelSerializer):
    like = serializers.SerializerMethodField(read_only=True)
    favorite = serializers.SerializerMethodField(read_only=True)
    like_count = serializers.SerializerMethodField(read_only=True)

    def get_like(self, obj):
        stats = obj.itemstat.all()
        return safe_list_get([s.like for s in stats], 0, False)

    def get_favorite(self, obj):
        stats = obj.itemstat.all()
        return safe_list_get([s.favorite for s in stats], 0, False)

    def get_like_count(self, obj):
        return getattr(obj, 'like_count', 0)


class AuthorSerializer(LikeFavoriteSerializer):
    owner = UserSerializer(read_only=True)
    genres = GenreListSerializer(many=True, required=False)

    class Meta:
        model = Author
        annotated_fields = ('like', 'favorite', 'like_count')
        read_only_fields = (*annotated_fields, 'id', 'preview_s', 'preview_xs', 'alias', 'rate', 'owner')
        fields = (*read_only_fields, 'name', 'info', 'preview', 'genres')
    
    def create(self, validated_data):
        validated_data.pop('genres', None)
        instance = Author.objects.create(**validated_data)
        self.set_genres(instance)
        return instance

    def update(self, instance, validated_data):
        self.set_genres(instance) #
        validated_data.pop('genres', None)
        for item in validated_data:
            if Author._meta.get_field(item):
                setattr(instance, item, validated_data[item])
        instance.save()
        return instance
    
    def set_genres(self, instance):
        ids = self.context['request'].POST.get('genres')
        if not ids:
            return
        ids = '[]' if ids == '' else ids
        try:
            id__in = json.loads(ids)
        except json.decoder.JSONDecodeError:
            raise ValidationError({'detail':'Field genres must be like [1,2,3]'})
        try:
            genres_all = Genre.objects.filter(id__in=id__in)
        except ValueError as e:
            raise ValidationError({'detail':f'{str(e)} Field genres must be like [1,2,3]'})
        instance.genres.set(genres_all)


class NoteSerializer(LikeFavoriteSerializer):
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Note
        annotated_fields = ('like', 'favorite', 'like_count')
        read_only_fields = ('id', 'rate', 'owner')
        fields = (*annotated_fields, *read_only_fields, 'name', 'filename', 'author', 'content_list')


class FavoriteNoteSerializer(serializers.Serializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Note.objects.all())
    favorite = serializers.BooleanField()


class FavoriteAuthorSerializer(serializers.Serializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    favorite = serializers.BooleanField()


class LikeNoteSerializer(serializers.Serializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Note.objects.all())
    like = serializers.BooleanField()


class LikeAuthorSerializer(serializers.Serializer):
    item = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    like = serializers.BooleanField()
