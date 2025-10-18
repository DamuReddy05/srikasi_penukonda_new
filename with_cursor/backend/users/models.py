from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom User model for Temple Management System"""
    
    class UserType(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        DEVOTEE = 'devotee', _('Devotee')
    
    email = models.EmailField(_('email address'), unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    user_type = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.DEVOTEE
    )
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    google_id = models.CharField(max_length=100, blank=True, null=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    @property
    def is_admin(self):
        return self.user_type == self.UserType.ADMIN


class FamilyMember(models.Model):
    """Model for storing family members of devotees"""
    
    class Relationship(models.TextChoices):
        SPOUSE = 'spouse', _('Spouse')
        CHILD = 'child', _('Child')
        PARENT = 'parent', _('Parent')
        SIBLING = 'sibling', _('Sibling')
        OTHER = 'other', _('Other')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='family_members')
    name = models.CharField(max_length=100)
    relationship = models.CharField(
        max_length=10,
        choices=Relationship.choices,
        default=Relationship.OTHER
    )
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_relationship_display()}) - {self.user.email}"
