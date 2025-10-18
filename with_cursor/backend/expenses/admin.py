from django.contrib import admin
from .models import ExpenseCategory, Expense


@admin.register(ExpenseCategory)
class ExpenseCategoryAdmin(admin.ModelAdmin):
    """Admin configuration for ExpenseCategory model"""
    list_display = ('name', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    """Admin configuration for Expense model"""
    list_display = ('category', 'amount', 'date', 'payment_method', 'vendor_name', 'created_by')
    list_filter = ('category', 'payment_method', 'date', 'created_by')
    search_fields = ('description', 'vendor_name', 'receipt_number', 'created_by__email')
    ordering = ('-date', '-created_at')
    
    fieldsets = (
        ('Expense Information', {
            'fields': ('category', 'amount', 'date', 'description')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'receipt_number')
        }),
        ('Vendor Information', {
            'fields': ('vendor_name', 'vendor_contact'),
            'classes': ('collapse',)
        }),
        ('Created By', {
            'fields': ('created_by',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
