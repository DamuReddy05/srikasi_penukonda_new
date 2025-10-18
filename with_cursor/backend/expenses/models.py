from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class ExpenseCategory(models.Model):
    """Model for expense categories"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = _('Expense Category')
        verbose_name_plural = _('Expense Categories')
    
    def __str__(self):
        return self.name


class Expense(models.Model):
    """Model for temple expenses"""
    
    class PaymentMethod(models.TextChoices):
        CASH = 'cash', _('Cash')
        BANK_TRANSFER = 'bank_transfer', _('Bank Transfer')
        CHEQUE = 'cheque', _('Cheque')
        ONLINE = 'online', _('Online Payment')
        OTHER = 'other', _('Other')
    
    category = models.ForeignKey(
        ExpenseCategory,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    date = models.DateField()
    description = models.TextField()
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH
    )
    receipt_number = models.CharField(max_length=50, blank=True, null=True)
    vendor_name = models.CharField(max_length=200, blank=True, null=True)
    vendor_contact = models.CharField(max_length=100, blank=True, null=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_expenses'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = _('Expense')
        verbose_name_plural = _('Expenses')
    
    def __str__(self):
        return f"{self.category.name} - {self.amount} ({self.date})"
