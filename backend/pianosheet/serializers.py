from rest_framework import serializers
from .models import Author, Note


class AuthorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('id', 'name', 'alias')

class AuthorSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Author
        fields = ('id', 'name', 'info', 'preview', 'preview_s', 'preview_xs', 'alias', "rate", 'owner')


class NoteSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    class Meta:
        model = Note
        fields = ('id', 'name', 'filename', 'author', 'savedate', 'content_list', "rate", 'owner')
