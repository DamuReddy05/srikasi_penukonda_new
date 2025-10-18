from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.conf import settings
from django.shortcuts import get_object_or_404
import razorpay
import stripe
from .models import Payment, Transaction
from .serializers import (
    PaymentSerializer, PaymentCreateSerializer, TransactionSerializer,
    RazorpayOrderSerializer, RazorpayPaymentSerializer, StripePaymentIntentSerializer,
    PaymentStatusSerializer
)
from users.permissions import IsAdminUser, IsOwnerOrAdmin
from django.db import models


class PaymentListCreateView(generics.ListCreateAPIView):
    """View for listing and creating payments"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PaymentCreateSerializer
        return PaymentSerializer


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual payments"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Payment.objects.all()
        return Payment.objects.filter(user=user)


class TransactionListView(generics.ListAPIView):
    """View for listing transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = Transaction.objects.all()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_razorpay_order_view(request):
    """View for creating Razorpay order"""
    serializer = RazorpayOrderSerializer(data=request.data)
    if serializer.is_valid():
        try:
            # Initialize Razorpay client
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            
            # Create order
            order_data = {
                'amount': int(serializer.validated_data['amount'] * 100),  # Convert to paise
                'currency': serializer.validated_data['currency'],
                'receipt': serializer.validated_data['receipt'],
                'notes': serializer.validated_data.get('notes', {})
            }
            
            order = client.order.create(data=order_data)
            
            return Response({
                'order_id': order['id'],
                'amount': order['amount'],
                'currency': order['currency'],
                'receipt': order['receipt']
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to create order: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_razorpay_payment_view(request):
    """View for verifying Razorpay payment"""
    serializer = RazorpayPaymentSerializer(data=request.data)
    if serializer.is_valid():
        try:
            # Initialize Razorpay client
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            
            # Verify payment signature
            params_dict = {
                'razorpay_payment_id': serializer.validated_data['razorpay_payment_id'],
                'razorpay_order_id': serializer.validated_data['razorpay_order_id'],
                'razorpay_signature': serializer.validated_data['razorpay_signature']
            }
            
            client.utility.verify_payment_signature(params_dict)
            
            # Update payment status
            payment = get_object_or_404(Payment, gateway_order_id=serializer.validated_data['razorpay_order_id'])
            payment.status = Payment.PaymentStatus.SUCCESS
            payment.gateway_payment_id = serializer.validated_data['razorpay_payment_id']
            payment.gateway_signature = serializer.validated_data['razorpay_signature']
            payment.save()
            
            # Create transaction record
            Transaction.objects.create(
                payment=payment,
                transaction_type=Transaction.TransactionType.PAYMENT,
                amount=payment.amount,
                currency=payment.currency,
                gateway_transaction_id=serializer.validated_data['razorpay_payment_id'],
                status='success',
                description=f'Payment successful via Razorpay'
            )
            
            # Update related booking payment status if applicable
            if payment.puja_booking:
                payment.puja_booking.payment_status = True
                payment.puja_booking.status = 'confirmed'
                payment.puja_booking.save()
            
            return Response({
                'message': 'Payment verified successfully',
                'payment_id': payment.id
            })
        except Exception as e:
            return Response(
                {'error': f'Payment verification failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_stripe_payment_intent_view(request):
    """View for creating Stripe payment intent"""
    serializer = StripePaymentIntentSerializer(data=request.data)
    if serializer.is_valid():
        try:
            # Initialize Stripe
            stripe.api_key = settings.STRIPE_SECRET_KEY
            
            # Create payment intent
            intent = stripe.PaymentIntent.create(
                amount=int(serializer.validated_data['amount'] * 100),  # Convert to cents
                currency=serializer.validated_data['currency'],
                description=serializer.validated_data['description'],
                metadata=serializer.validated_data.get('metadata', {})
            )
            
            return Response({
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id
            })
        except Exception as e:
            return Response(
                {'error': f'Failed to create payment intent: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def stripe_webhook_view(request):
    """View for handling Stripe webhooks"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return Response({'error': 'Invalid payload'}, status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError as e:
        return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        # Update payment status
        payment = get_object_or_404(Payment, gateway_order_id=payment_intent['id'])
        payment.status = Payment.PaymentStatus.SUCCESS
        payment.gateway_payment_id = payment_intent['id']
        payment.save()
        
        # Create transaction record
        Transaction.objects.create(
            payment=payment,
            transaction_type=Transaction.TransactionType.PAYMENT,
            amount=payment.amount,
            currency=payment.currency,
            gateway_transaction_id=payment_intent['id'],
            status='success',
            description=f'Payment successful via Stripe'
        )
        
        # Update related booking payment status if applicable
        if payment.puja_booking:
            payment.puja_booking.payment_status = True
            payment.puja_booking.status = 'confirmed'
            payment.puja_booking.save()
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        # Update payment status
        payment = get_object_or_404(Payment, gateway_order_id=payment_intent['id'])
        payment.status = Payment.PaymentStatus.FAILED
        payment.failure_reason = payment_intent.get('last_payment_error', {}).get('message', 'Payment failed')
        payment.save()
    
    return Response({'status': 'success'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_statistics_view(request):
    """View for getting payment statistics (admin only)"""
    if not request.user.is_admin:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    total_payments = Payment.objects.count()
    successful_payments = Payment.objects.filter(status=Payment.PaymentStatus.SUCCESS).count()
    total_amount = Payment.objects.filter(status=Payment.PaymentStatus.SUCCESS).aggregate(
        total=models.Sum('amount')
    )['total'] or 0
    
    # Payment method breakdown
    payment_method_stats = Payment.objects.filter(
        status=Payment.PaymentStatus.SUCCESS
    ).values('payment_method').annotate(
        total_amount=models.Sum('amount'),
        payment_count=models.Count('id')
    ).order_by('-total_amount')
    
    statistics = {
        'total_payments': total_payments,
        'successful_payments': successful_payments,
        'total_amount': total_amount,
        'payment_method_breakdown': list(payment_method_stats)
    }
    
    return Response(statistics)
