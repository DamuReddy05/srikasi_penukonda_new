from django.contrib import admin
from .models import DarshanSlot, DarshanBooking


@admin.register(DarshanSlot)
class DarshanSlotAdmin(admin.ModelAdmin):
    """Admin configuration for DarshanSlot model"""
    list_display = ('date', 'slot_type', 'start_time', 'end_time', 'capacity', 'current_bookings', 'is_active', 'created_by')
    list_filter = ('slot_type', 'is_active', 'date', 'created_by')
    search_fields = ('date', 'slot_type', 'created_by__email')
    ordering = ('-date', '-start_time')
    
    fieldsets = (
        ('Slot Information', {
            'fields': ('date', 'slot_type', 'start_time', 'end_time')
        }),
        ('Capacity', {
            'fields': ('capacity', 'current_bookings', 'is_active')
        }),
        ('Created By', {
            'fields': ('created_by',)
        }),
    )
    
    readonly_fields = ('current_bookings', 'created_at', 'updated_at')


@admin.register(DarshanBooking)
class DarshanBookingAdmin(admin.ModelAdmin):
    """Admin configuration for DarshanBooking model"""
    list_display = ('user', 'slot', 'number_of_people', 'status', 'booked_at')
    list_filter = ('status', 'slot__date', 'booked_at')
    search_fields = ('user__email', 'user__username', 'slot__date')
    ordering = ('-booked_at',)
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('slot', 'user', 'number_of_people')
        }),
        ('Status', {
            'fields': ('status',)
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
