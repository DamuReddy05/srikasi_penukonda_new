from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class Puja(models.Model):
    """Model for temple pujas and events"""
    
    class PujaType(models.TextChoices):
        FREE = 'free', _('Free Puja')
        PAID = 'paid', _('Paid Puja')
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    puja_type = models.CharField(
        max_length=10,
        choices=PujaType.choices,
        default=PujaType.FREE
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)]
    )
    max_participants = models.PositiveIntegerField(blank=True, null=True)
    current_participants = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_pujas'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'start_time']
        verbose_name = _('Puja')
        verbose_name_plural = _('Pujas')
    
    def __str__(self):
        return f"{self.name} - {self.date}"
    
    @property
    def is_full(self):
        """Check if puja has reached maximum participants"""
        if self.max_participants is None:
            return False
        return self.current_participants >= self.max_participants
    
    @property
    def available_slots(self):
        """Get number of available slots"""
        if self.max_participants is None:
            return None
        return max(0, self.max_participants - self.current_participants)


class PujaBooking(models.Model):
    """Model for puja bookings by devotees"""
    
    class BookingStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        CANCELLED = 'cancelled', _('Cancelled')
        COMPLETED = 'completed', _('Completed')
    
    puja = models.ForeignKey(
        Puja,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='puja_bookings'
    )
    family_members = models.ManyToManyField(
        'users.FamilyMember',
        blank=True,
        related_name='puja_bookings'
    )
    number_of_people = models.PositiveIntegerField(default=1)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING
    )
    payment_status = models.BooleanField(default=False)
    special_requests = models.TextField(blank=True, null=True)
    booked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-booked_at']
        verbose_name = _('Puja Booking')
        verbose_name_plural = _('Puja Bookings')
    
    def __str__(self):
        return f"{self.user.email} - {self.puja.name} ({self.date})"
    
    @property
    def date(self):
        return self.puja.date
    
    def save(self, *args, **kwargs):
        # Update puja participant count
        if self.pk:
            old_instance = PujaBooking.objects.get(pk=self.pk)
            if old_instance.status == self.BookingStatus.CONFIRMED and self.status != self.BookingStatus.CONFIRMED:
                # Booking was cancelled or changed
                self.puja.current_participants = max(0, self.puja.current_participants - old_instance.number_of_people)
            elif old_instance.status != self.BookingStatus.CONFIRMED and self.status == self.BookingStatus.CONFIRMED:
                # Booking was confirmed
                self.puja.current_participants += self.number_of_people
        else:
            # New booking
            if self.status == self.BookingStatus.CONFIRMED:
                self.puja.current_participants += self.number_of_people
        
        if self.puja:
            self.puja.save()
        
        super().save(*args, **kwargs)
