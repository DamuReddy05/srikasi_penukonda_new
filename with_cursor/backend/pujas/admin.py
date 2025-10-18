from django.contrib import admin
from .models import Puja, PujaBooking


@admin.register(Puja)
class PujaAdmin(admin.ModelAdmin):
    """Admin configuration for Puja model"""
    list_display = ('name', 'puja_type', 'date', 'start_time', 'end_time', 'price', 'is_active', 'created_by')
    list_filter = ('puja_type', 'is_active', 'date', 'created_by')
    search_fields = ('name', 'description', 'created_by__email')
    ordering = ('-date', '-start_time')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'puja_type', 'is_active')
        }),
        ('Schedule', {
            'fields': ('date', 'start_time', 'end_time')
        }),
        ('Pricing & Capacity', {
            'fields': ('price', 'max_participants', 'current_participants')
        }),
        ('Created By', {
            'fields': ('created_by',)
        }),
    )
    
    readonly_fields = ('current_participants', 'created_at', 'updated_at')


@admin.register(PujaBooking)
class PujaBookingAdmin(admin.ModelAdmin):
    """Admin configuration for PujaBooking model"""
    list_display = ('user', 'puja', 'number_of_people', 'total_amount', 'status', 'payment_status', 'booked_at')
    list_filter = ('status', 'payment_status', 'puja__date', 'booked_at')
    search_fields = ('user__email', 'user__username', 'puja__name')
    ordering = ('-booked_at',)
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('puja', 'user', 'number_of_people', 'total_amount')
        }),
        ('Status', {
            'fields': ('status', 'payment_status')
        }),
        ('Additional Information', {
            'fields': ('family_members', 'special_requests')
        }),
        ('Timestamps', {
            'fields': ('booked_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('booked_at', 'updated_at')
    filter_horizontal = ('family_members',)
