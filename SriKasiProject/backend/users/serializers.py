from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FamilyMember

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'address', 'user_type', 'profile_picture',
            'date_of_birth', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'confirm_password',
            'first_name', 'last_name', 'phone_number', 'address'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class FamilyMemberSerializer(serializers.ModelSerializer):
    """Serializer for FamilyMember model"""
    
    class Meta:
        model = FamilyMember
        fields = [
            'id', 'name', 'relationship', 'date_of_birth',
            'phone_number', 'email'
        ]
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile with family members"""
    family_members = FamilyMemberSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'address', 'user_type', 'profile_picture',
            'date_of_birth', 'date_joined', 'last_login', 'family_members'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'user_type']


class GoogleAuthSerializer(serializers.Serializer):
    """Serializer for Google OAuth authentication"""
    access_token = serializers.CharField()
    id_token = serializers.CharField()


class AdminLoginSerializer(serializers.Serializer):
    """Serializer for admin login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
