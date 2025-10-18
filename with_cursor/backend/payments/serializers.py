from rest_framework import serializers
from .models import Payment, Transaction
from users.serializers import UserSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'user', 'amount', 'currency', 'payment_method', 'status',
            'description', 'gateway_payment_id', 'gateway_order_id',
            'puja_booking', 'receipt_url', 'failure_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Payment"""
    
    class Meta:
        model = Payment
        fields = [
            'amount', 'currency', 'payment_method', 'description', 'puja_booking'
        ]
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model"""
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'payment', 'transaction_type', 'amount', 'currency',
            'gateway_transaction_id', 'status', 'description', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class RazorpayOrderSerializer(serializers.Serializer):
    """Serializer for Razorpay order creation"""
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(default='INR')
    receipt = serializers.CharField()
    notes = serializers.JSONField(required=False)


class RazorpayPaymentSerializer(serializers.Serializer):
    """Serializer for Razorpay payment verification"""
    razorpay_payment_id = serializers.CharField()
    razorpay_order_id = serializers.CharField()
    razorpay_signature = serializers.CharField()


class StripePaymentIntentSerializer(serializers.Serializer):
    """Serializer for Stripe payment intent creation"""
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(default='inr')
    description = serializers.CharField()
    metadata = serializers.JSONField(required=False)


class PaymentStatusSerializer(serializers.Serializer):
    """Serializer for payment status update"""
    payment_id = serializers.CharField()
    status = serializers.CharField()
    gateway_payment_id = serializers.CharField(required=False)
    failure_reason = serializers.CharField(required=False)
