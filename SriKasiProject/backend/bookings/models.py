from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class DarshanSlot(models.Model):
    """Model for darshan time slots"""
    
    class SlotType(models.TextChoices):
        MORNING = 'morning', _('Morning')
        AFTERNOON = 'afternoon', _('Afternoon')
        EVENING = 'evening', _('Evening')
        NIGHT = 'night', _('Night')
    
    date = models.DateField()
    slot_type = models.CharField(
        max_length=20,
        choices=SlotType.choices
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)]
    )
    current_bookings = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_darshan_slots'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['date', 'start_time']
        unique_together = ['date', 'slot_type']
        verbose_name = _('Darshan Slot')
        verbose_name_plural = _('Darshan Slots')
    
    def __str__(self):
        return f"{self.date} - {self.get_slot_type_display()} ({self.start_time} - {self.end_time})"
    
    @property
    def is_full(self):
        """Check if slot has reached capacity"""
        return self.current_bookings >= self.capacity
    
    @property
    def available_capacity(self):
        """Get number of available spots"""
        return max(0, self.capacity - self.current_bookings)


class DarshanBooking(models.Model):
    """Model for darshan bookings by devotees"""
    
    class BookingStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        CONFIRMED = 'confirmed', _('Confirmed')
        CANCELLED = 'cancelled', _('Cancelled')
        COMPLETED = 'completed', _('Completed')
    
    slot = models.ForeignKey(
        DarshanSlot,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='darshan_bookings'
    )
    family_members = models.ManyToManyField(
        'users.FamilyMember',
        blank=True,
        related_name='darshan_bookings'
    )
    number_of_people = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING
    )
    special_requests = models.TextField(blank=True, null=True)
    booked_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-booked_at']
        verbose_name = _('Darshan Booking')
        verbose_name_plural = _('Darshan Bookings')
    
    def __str__(self):
        return f"{self.user.email} - {self.slot} ({self.number_of_people} people)"
    
    @property
    def date(self):
        return self.slot.date
    
    def save(self, *args, **kwargs):
        # Update slot booking count
        if self.pk:
            old_instance = DarshanBooking.objects.get(pk=self.pk)
            if old_instance.status == self.BookingStatus.CONFIRMED and self.status != self.BookingStatus.CONFIRMED:
                # Booking was cancelled or changed
                self.slot.current_bookings = max(0, self.slot.current_bookings - old_instance.number_of_people)
            elif old_instance.status != self.BookingStatus.CONFIRMED and self.status == self.BookingStatus.CONFIRMED:
                # Booking was confirmed
                self.slot.current_bookings += self.number_of_people
        else:
            # New booking
            if self.status == self.BookingStatus.CONFIRMED:
                self.slot.current_bookings += self.number_of_people
        
        if self.slot:
            self.slot.save()
        
        super().save(*args, **kwargs)
