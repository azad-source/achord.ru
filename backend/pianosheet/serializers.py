from rest_framework import serializers
from .models import Author, Note, Genre
from django.contrib.auth import get_user_model
User = get_user_model()


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name', 'alias')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)


class AuthorSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    genres = GenreSerializer(many=True, required=False)
    class Meta:
        model = Author
        read_only_fields = ('id', 'preview_s', 'preview_xs', 'alias', 'rate', 'owner', 'genres')
        fields = (*read_only_fields, 'name', 'info', 'preview',  )


class NoteSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Note
        read_only_fields = ('id', 'savedate', 'rate', 'owner')
        fields = (*read_only_fields, 'name', 'filename', 'author', 'content_list', )
