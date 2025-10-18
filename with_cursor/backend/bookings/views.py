from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Q
from .models import DarshanSlot, DarshanBooking
from .serializers import (
    DarshanSlotSerializer, DarshanSlotCreateSerializer, DarshanBookingSerializer,
    DarshanBookingCreateSerializer, AvailableSlotSerializer
)
from users.permissions import IsAdminUser, IsOwnerOrAdmin


class DarshanSlotListCreateView(generics.ListCreateAPIView):
    """View for listing and creating darshan slots"""
    serializer_class = DarshanSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = DarshanSlot.objects.filter(is_active=True)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by slot type
        slot_type = self.request.query_params.get('slot_type')
        if slot_type:
            queryset = queryset.filter(slot_type=slot_type)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DarshanSlotCreateSerializer
        return DarshanSlotSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


class DarshanSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual darshan slots"""
    serializer_class = DarshanSlotSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = DarshanSlot.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


class DarshanBookingListCreateView(generics.ListCreateAPIView):
    """View for listing and creating darshan bookings"""
    serializer_class = DarshanBookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return DarshanBooking.objects.all()
        return DarshanBooking.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DarshanBookingCreateSerializer
        return DarshanBookingSerializer


class DarshanBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual darshan bookings"""
    serializer_class = DarshanBookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return DarshanBooking.objects.all()
        return DarshanBooking.objects.filter(user=user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_slots_view(request):
    """View for getting available darshan slots"""
    date = request.query_params.get('date')
    slot_type = request.query_params.get('slot_type')
    
    if not date:
        return Response(
            {'error': 'Date parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    queryset = DarshanSlot.objects.filter(
        date=date_obj,
        is_active=True
    )
    
    if slot_type:
        queryset = queryset.filter(slot_type=slot_type)
    
    # Only show slots with available capacity
    available_slots = []
    for slot in queryset:
        if slot.available_capacity > 0:
            available_slots.append({
                'id': slot.id,
                'date': slot.date,
                'slot_type': slot.slot_type,
                'start_time': slot.start_time,
                'end_time': slot.end_time,
                'available_capacity': slot.available_capacity,
                'total_capacity': slot.capacity
            })
    
    serializer = AvailableSlotSerializer(available_slots, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def cancel_darshan_booking_view(request, booking_id):
    """View for cancelling darshan bookings (admin only)"""
    try:
        booking = DarshanBooking.objects.get(id=booking_id)
        booking.status = DarshanBooking.BookingStatus.CANCELLED
        booking.save()
        
        serializer = DarshanBookingSerializer(booking)
        return Response(serializer.data)
    except DarshanBooking.DoesNotExist:
        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def darshan_statistics_view(request):
    """View for getting darshan statistics (admin only)"""
    if not request.user.is_admin:
        return Response(
            {'error': 'Admin access required'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    total_slots = DarshanSlot.objects.count()
    active_slots = DarshanSlot.objects.filter(is_active=True).count()
    total_bookings = DarshanBooking.objects.count()
    confirmed_bookings = DarshanBooking.objects.filter(
        status=DarshanBooking.BookingStatus.CONFIRMED
    ).count()
    
    # Monthly statistics
    current_month = timezone.now().month
    current_year = timezone.now().year
    
    monthly_slots = DarshanSlot.objects.filter(
        date__year=current_year,
        date__month=current_month
    ).count()
    
    monthly_bookings = DarshanBooking.objects.filter(
        slot__date__year=current_year,
        slot__date__month=current_month
    ).count()
    
    statistics = {
        'total_slots': total_slots,
        'active_slots': active_slots,
        'total_bookings': total_bookings,
        'confirmed_bookings': confirmed_bookings,
        'monthly_slots': monthly_slots,
        'monthly_bookings': monthly_bookings,
    }
    
    return Response(statistics)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def today_slots_view(request):
    """View for getting today's darshan slots"""
    today = timezone.now().date()
    slots = DarshanSlot.objects.filter(
        date=today,
        is_active=True
    ).order_by('start_time')
    
    serializer = DarshanSlotSerializer(slots, many=True)
    return Response(serializer.data)
