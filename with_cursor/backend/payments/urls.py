from django.urls import path
from . import views

urlpatterns = [
    # Payment endpoints
    path('payments/', views.PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    
    # Transaction endpoints
    path('transactions/', views.TransactionListView.as_view(), name='transaction-list'),
    
    # Razorpay endpoints
    path('razorpay/create-order/', views.create_razorpay_order_view, name='create-razorpay-order'),
    path('razorpay/verify-payment/', views.verify_razorpay_payment_view, name='verify-razorpay-payment'),
    
    # Stripe endpoints
    path('stripe/create-payment-intent/', views.create_stripe_payment_intent_view, name='create-stripe-payment-intent'),
    path('stripe/webhook/', views.stripe_webhook_view, name='stripe-webhook'),
    
    # Statistics endpoint
    path('payments/statistics/', views.payment_statistics_view, name='payment-statistics'),
]
