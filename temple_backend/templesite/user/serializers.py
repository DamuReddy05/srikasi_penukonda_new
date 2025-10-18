# users/serializers.py

from rest_framework import serializers
from .models import User, Profile
from dj_rest_auth.registration.serializers import RegisterSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'avatar')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'



class CustomRegisterSerializer(RegisterSerializer):
    role = serializers.ChoiceField(choices=User.Roles.choices)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['role'] = self.validated_data.get('role', 'devotee')
        return data
