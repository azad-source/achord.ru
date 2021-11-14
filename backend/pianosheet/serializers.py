from django.db.models import fields
from django.http import request
from rest_framework import serializers
from .models import Author, Note, Genre
from django.contrib.auth import get_user_model
import json
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ErrorDetail, ValidationError
User = get_user_model()


class GenreListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        read_only_fields = ('id', 'alias')
        fields = (*read_only_fields,'name')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


class AuthorSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    genres = GenreListSerializer(many=True, required=False)

    class Meta:
        model = Author
        read_only_fields = ('id', 'preview_s', 'preview_xs', 'alias', 'rate', 'owner')
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


class NoteSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Note
        read_only_fields = ('id', 'savedate', 'rate', 'owner')
        fields = (*read_only_fields, 'name', 'filename', 'author', 'content_list')


class GenreDetailSerializer(serializers.ModelSerializer):
    authors = AuthorSerializer(many=True)
    class Meta:
        model = Genre
        read_only_fields = ('id', 'alias', 'authors')
        fields = ('name', *read_only_fields)