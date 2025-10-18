from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models
from threading import local

from crum import get_current_user


# Create your models here.


class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        MANAGER = 'manager', 'Manager'
        VOLUNTEER = 'volunteer', 'Volunteer'
        DEVOTEE = 'devotee', 'Devotee'

    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.DEVOTEE)
    phone = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.FileField(upload_to='avatars/', blank=True, null=True)
    google_id = models.CharField(max_length=255, blank=True, null=True)


class AuditBaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_%(class)s_set")
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="updated_%(class)s_set")


    def save(self, *args, **kwargs):
        user = get_current_user()

        if user:
            if self._state.adding:
                self.created_by = user
            self.updated_by = user
        super(AuditBaseModel, self).save(*args, *kwargs)

    class Meta:
        abstract = True



class Profile(AuditBaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    birthday = models.DateField(blank=True, null=True)
    seva_history = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

