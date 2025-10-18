from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q
from .models import Puja, PujaBooking
from .serializers import (
    PujaSerializer, PujaCreateSerializer, PujaBookingSerializer,
    PujaBookingCreateSerializer, CalendarEventSerializer
)
from users.permissions import IsAdminUser, IsOwnerOrAdmin


class PujaListCreateView(generics.ListCreateAPIView):
    """View for listing and creating pujas"""
    serializer_class = PujaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Puja.objects.filter(is_active=True)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by puja type
        puja_type = self.request.query_params.get('puja_type')
        if puja_type:
            queryset = queryset.filter(puja_type=puja_type)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PujaCreateSerializer
        return PujaSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


class PujaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual pujas"""
    serializer_class = PujaSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Puja.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


class PujaBookingListCreateView(generics.ListCreateAPIView):
    """View for listing and creating puja bookings"""
    serializer_class = PujaBookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return PujaBooking.objects.all()
        return PujaBooking.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PujaBookingCreateSerializer
        return PujaBookingSerializer


class PujaBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual puja bookings"""
    serializer_class = PujaBookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return PujaBooking.objects.all()
        return PujaBooking.objects.filter(user=user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def calendar_events_view(request):
    """View for getting calendar events"""
    year = request.query_params.get('year', timezone.now().year)
    month = request.query_params.get('month', timezone.now().month)
    
    try:
        year = int(year)
        month = int(month)
    except ValueError:
        return Response(
            {'error': 'Invalid year or month parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get pujas for the specified month
    pujas = Puja.objects.filter(
        date__year=year,
        date__month=month,
        is_active=True
    ).order_by('date', 'start_time')
    
    events = []
    for puja in pujas:
        events.append({
            'id': puja.id,
            'title': puja.name,
            'date': puja.date,
            'start_time': puja.start_time,
            'end_time': puja.end_time,
            'puja_type': puja.puja_type,
            'price': puja.price,
            'is_full': puja.is_full,
            'available_slots': puja.available_slots,
            'description': puja.description
        })
    
    serializer = CalendarEventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def today_events_view(request):
    """View for getting today's events"""
    today = timezone.now().date()
    pujas = Puja.objects.filter(
        date=today,
        is_active=True
    ).order_by('start_time')
    
    serializer = PujaSerializer(pujas, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def cancel_puja_booking_view(request, booking_id):
    """View for cancelling puja bookings (admin only)"""
    try:
        booking = PujaBooking.objects.get(id=booking_id)
        booking.status = PujaBooking.BookingStatus.CANCELLED
        booking.save()
        
        serializer = PujaBookingSerializer(booking)
        return Response(serializer.data)
    except PujaBooking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def puja_statistics_view(request):
    """View for getting puja statistics (admin only)"""
    if not request.user.is_admin:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    total_pujas = Puja.objects.count()
    active_pujas = Puja.objects.filter(is_active=True).count()
    total_bookings = PujaBooking.objects.count()
    confirmed_bookings = PujaBooking.objects.filter(
        status=PujaBooking.BookingStatus.CONFIRMED
    ).count()
    
    # Monthly statistics
    current_month = timezone.now().month
    current_year = timezone.now().year
    
    monthly_pujas = Puja.objects.filter(
        date__year=current_year,
        date__month=current_month
    ).count()
    
    monthly_bookings = PujaBooking.objects.filter(
        puja__date__year=current_year,
        puja__date__month=current_month
    ).count()
    
    statistics = {
        'total_pujas': total_pujas,
        'active_pujas': active_pujas,
        'total_bookings': total_bookings,
        'confirmed_bookings': confirmed_bookings,
        'monthly_pujas': monthly_pujas,
        'monthly_bookings': monthly_bookings,
    }
    
    return Response(statistics)
