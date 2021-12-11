from rest_framework import fields, serializers
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'is_superuser', 'first_name', 'last_name', 'avatar')