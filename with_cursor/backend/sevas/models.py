from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone

User = get_user_model()


class SevaCategory(models.Model):
    """Model for categorizing sevas"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Seva Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Seva(models.Model):
    """Base model for all types of sevas"""
    SEVA_TYPES = [
        ('pratyaksha', 'Pratyaksha Seva'),
        ('paroksha', 'Paroksha Seva'),
    ]

    name = models.CharField(max_length=200)
    seva_type = models.CharField(max_length=20, choices=SEVA_TYPES)
    category = models.ForeignKey(SevaCategory, on_delete=models.CASCADE, related_name='sevas')
    
    # Basic Information
    description = models.TextField()
    how_performed = models.TextField(help_text="How the seva is performed")
    duration = models.CharField(max_length=50, help_text="Duration of the seva (e.g., 2 hours)")
    
    # Timing Information
    start_time = models.TimeField(help_text="When the seva starts")
    end_time = models.TimeField(help_text="When the seva ends")
    
    # Cost Information
    base_cost = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        help_text="Base cost of the seva"
    )
    currency = models.CharField(max_length=3, default='INR')
    
    # Ingredients and Requirements
    temple_provides = models.TextField(help_text="Ingredients/items provided by the temple")
    devotee_brings = models.TextField(help_text="Items that devotees need to bring")
    
    # Benefits
    benefits = models.TextField(help_text="Benefits of performing this seva")
    
    # Images
    images = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    
    # Status
    is_active = models.BooleanField(default=True)
    max_participants = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        help_text="Maximum number of participants (null for unlimited)"
    )
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_sevas')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Sevas"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_seva_type_display()})"

    @property
    def is_pratyaksha(self):
        return self.seva_type == 'pratyaksha'

    @property
    def is_paroksha(self):
        return self.seva_type == 'paroksha'


class SevaSchedule(models.Model):
    """Model for scheduling sevas on specific dates"""
    seva = models.ForeignKey(Seva, on_delete=models.CASCADE, related_name='schedules')
    date = models.DateField()
    
    # Override fields (optional - if not set, use base seva values)
    cost_override = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Override cost for this specific date"
    )
    temple_provides_override = models.TextField(
        blank=True, 
        help_text="Override temple provides for this specific date"
    )
    devotee_brings_override = models.TextField(
        blank=True, 
        help_text="Override devotee brings for this specific date"
    )
    benefits_override = models.TextField(
        blank=True, 
        help_text="Override benefits for this specific date"
    )
    
    # Schedule specific fields
    start_time = models.TimeField(help_text="Start time for this specific date")
    end_time = models.TimeField(help_text="End time for this specific date")
    max_participants = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Maximum participants for this specific date"
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    is_booked = models.BooleanField(default=False, help_text="Whether this schedule is already booked")
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_schedules')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Seva Schedules"
        ordering = ['date', 'start_time']
        unique_together = ['seva', 'date', 'start_time']

    def __str__(self):
        return f"{self.seva.name} on {self.date} at {self.start_time}"

    @property
    def effective_cost(self):
        """Get the effective cost (override or base)"""
        return self.cost_override if self.cost_override is not None else self.seva.base_cost

    @property
    def effective_temple_provides(self):
        """Get the effective temple provides (override or base)"""
        return self.temple_provides_override if self.temple_provides_override else self.seva.temple_provides

    @property
    def effective_devotee_brings(self):
        """Get the effective devotee brings (override or base)"""
        return self.devotee_brings_override if self.devotee_brings_override else self.seva.devotee_brings

    @property
    def effective_benefits(self):
        """Get the effective benefits (override or base)"""
        return self.benefits_override if self.benefits_override else self.seva.benefits

    @property
    def is_past(self):
        """Check if the schedule is in the past"""
        return self.date < timezone.now().date()

    @property
    def is_today(self):
        """Check if the schedule is today"""
        return self.date == timezone.now().date()

    @property
    def is_future(self):
        """Check if the schedule is in the future"""
        return self.date > timezone.now().date()


class SevaBooking(models.Model):
    """Model for booking sevas"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seva_bookings')
    seva_schedule = models.ForeignKey(SevaSchedule, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking details
    booking_date = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    
    # Payment information
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, default='pending')
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Additional information
    special_requests = models.TextField(blank=True)
    number_of_participants = models.PositiveIntegerField(default=1)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Seva Bookings"
        ordering = ['-booking_date']

    def __str__(self):
        return f"{self.user.email} - {self.seva_schedule.seva.name} on {self.scheduled_date}"

    @property
    def seva(self):
        return self.seva_schedule.seva

    @property
    def is_cancellable(self):
        """Check if the booking can be cancelled"""
        return self.status in ['pending', 'confirmed'] and not self.seva_schedule.is_past
