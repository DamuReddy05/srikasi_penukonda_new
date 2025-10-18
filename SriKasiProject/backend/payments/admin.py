from django.contrib import admin
from .models import Payment, Transaction


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for Payment model"""
    list_display = ('user', 'amount', 'currency', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method', 'currency', 'created_at')
    search_fields = ('user__email', 'gateway_payment_id', 'gateway_order_id', 'description')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('user', 'amount', 'currency', 'payment_method', 'status', 'description')
        }),
        ('Gateway Information', {
            'fields': ('gateway_payment_id', 'gateway_order_id', 'gateway_signature'),
            'classes': ('collapse',)
        }),
        ('Related Booking', {
            'fields': ('puja_booking',),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('receipt_url', 'failure_reason'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Admin configuration for Transaction model"""
    list_display = ('payment', 'transaction_type', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('transaction_type', 'status', 'currency', 'created_at')
    search_fields = ('payment__user__email', 'gateway_transaction_id', 'description')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Transaction Information', {
            'fields': ('payment', 'transaction_type', 'amount', 'currency', 'status', 'description')
        }),
        ('Gateway Information', {
            'fields': ('gateway_transaction_id', 'metadata'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at',)
