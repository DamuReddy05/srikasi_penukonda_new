from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class Payment(models.Model):
    """Model for payment records"""
    
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        SUCCESS = 'success', _('Success')
        FAILED = 'failed', _('Failed')
        CANCELLED = 'cancelled', _('Cancelled')
        REFUNDED = 'refunded', _('Refunded')
    
    class PaymentMethod(models.TextChoices):
        RAZORPAY = 'razorpay', _('Razorpay')
        STRIPE = 'stripe', _('Stripe')
        CASH = 'cash', _('Cash')
        BANK_TRANSFER = 'bank_transfer', _('Bank Transfer')
        CHEQUE = 'cheque', _('Cheque')
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    currency = models.CharField(max_length=3, default='INR')
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.RAZORPAY
    )
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING
    )
    description = models.TextField()
    
    # Payment gateway specific fields
    gateway_payment_id = models.CharField(max_length=100, blank=True, null=True)
    gateway_order_id = models.CharField(max_length=100, blank=True, null=True)
    gateway_signature = models.CharField(max_length=500, blank=True, null=True)
    
    # Related booking (if applicable)
    puja_booking = models.ForeignKey(
        'pujas.PujaBooking',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    
    # Additional fields
    receipt_url = models.URLField(blank=True, null=True)
    failure_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')
    
    def __str__(self):
        return f"{self.user.email} - {self.amount} {self.currency} ({self.status})"


class Transaction(models.Model):
    """Model for transaction logs"""
    
    class TransactionType(models.TextChoices):
        PAYMENT = 'payment', _('Payment')
        REFUND = 'refund', _('Refund')
        CHARGEBACK = 'chargeback', _('Chargeback')
    
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    transaction_type = models.CharField(
        max_length=20,
        choices=TransactionType.choices,
        default=TransactionType.PAYMENT
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    gateway_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20)
    description = models.TextField()
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Transaction')
        verbose_name_plural = _('Transactions')
    
    def __str__(self):
        return f"{self.payment.id} - {self.transaction_type} - {self.amount} {self.currency}"
