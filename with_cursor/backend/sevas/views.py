from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Count, Sum, Q
from datetime import datetime, timedelta
from .models import SevaCategory, Seva, SevaSchedule, SevaBooking
from .serializers import (
    SevaCategorySerializer, SevaSerializer, SevaCreateSerializer,
    SevaScheduleSerializer, SevaScheduleCreateSerializer,
    SevaBookingSerializer, SevaBookingCreateSerializer,
    CalendarEventSerializer, SevaStatisticsSerializer
)
from users.permissions import IsAdminUser, IsOwnerOrAdmin


# Seva Category Views
class SevaCategoryListCreateView(generics.ListCreateAPIView):
    """View for listing and creating seva categories"""
    serializer_class = SevaCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = SevaCategory.objects.filter(is_active=True)


class SevaCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual seva categories"""
    serializer_class = SevaCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = SevaCategory.objects.all()


# Seva Views
class SevaListCreateView(generics.ListCreateAPIView):
    """View for listing and creating sevas"""
    serializer_class = SevaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Seva.objects.filter(is_active=True)
        
        # Filter by seva type
        seva_type = self.request.query_params.get('seva_type')
        if seva_type:
            queryset = queryset.filter(seva_type=seva_type)
        
        # Filter by category
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by search term
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SevaCreateSerializer
        return SevaSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


class SevaDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual sevas"""
    serializer_class = SevaSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Seva.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


# Seva Schedule Views
class SevaScheduleListCreateView(generics.ListCreateAPIView):
    """View for listing and creating seva schedules"""
    serializer_class = SevaScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = SevaSchedule.objects.filter(is_active=True)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by seva
        seva_id = self.request.query_params.get('seva_id')
        if seva_id:
            queryset = queryset.filter(seva_id=seva_id)
        
        # Filter by seva type
        seva_type = self.request.query_params.get('seva_type')
        if seva_type:
            queryset = queryset.filter(seva__seva_type=seva_type)
        
        return queryset.select_related('seva', 'seva__category')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SevaScheduleCreateSerializer
        return SevaScheduleSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


class SevaScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual seva schedules"""
    serializer_class = SevaScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SevaSchedule.objects.all()
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]


# Seva Booking Views
class SevaBookingListCreateView(generics.ListCreateAPIView):
    """View for listing and creating seva bookings"""
    serializer_class = SevaBookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return SevaBooking.objects.all()
        return SevaBooking.objects.filter(user=user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SevaBookingCreateSerializer
        return SevaBookingSerializer


class SevaBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual seva bookings"""
    serializer_class = SevaBookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return SevaBooking.objects.all()
        return SevaBooking.objects.filter(user=user)


# Calendar and Statistics Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def calendar_events_view(request):
    """View for getting calendar events"""
    year = request.query_params.get('year', timezone.now().year)
    month = request.query_params.get('month', timezone.now().month)
    seva_type = request.query_params.get('seva_type')
    
    try:
        year = int(year)
        month = int(month)
    except ValueError:
        return Response(
            {'error': 'Invalid year or month parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get schedules for the specified month
    start_date = datetime(year, month, 1).date()
    if month == 12:
        end_date = datetime(year + 1, 1, 1).date()
    else:
        end_date = datetime(year, month + 1, 1).date()
    
    schedules = SevaSchedule.objects.filter(
        date__gte=start_date,
        date__lt=end_date,
        is_active=True
    ).select_related('seva', 'seva__category')
    
    if seva_type:
        schedules = schedules.filter(seva__seva_type=seva_type)
    
    events = []
    for schedule in schedules:
        events.append({
            'id': schedule.id,
            'title': schedule.seva.name,
            'date': schedule.date,
            'start_time': schedule.start_time,
            'end_time': schedule.end_time,
            'seva_type': schedule.seva.seva_type,
            'category': schedule.seva.category.name,
            'cost': schedule.effective_cost,
            'is_booked': schedule.is_booked,
            'is_active': schedule.is_active
        })
    
    serializer = CalendarEventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def seva_statistics_view(request):
    """View for getting seva statistics"""
    # Get date range from query parameters
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    # Base querysets
    sevas = Seva.objects.all()
    schedules = SevaSchedule.objects.all()
    bookings = SevaBooking.objects.all()
    
    # Apply date filters if provided
    if start_date:
        schedules = schedules.filter(date__gte=start_date)
        bookings = bookings.filter(scheduled_date__gte=start_date)
    if end_date:
        schedules = schedules.filter(date__lte=end_date)
        bookings = bookings.filter(scheduled_date__lte=end_date)
    
    # Calculate statistics
    total_sevas = sevas.count()
    total_pratyaksha_sevas = sevas.filter(seva_type='pratyaksha').count()
    total_paroksha_sevas = sevas.filter(seva_type='paroksha').count()
    total_schedules = schedules.count()
    total_bookings = bookings.count()
    total_revenue = bookings.aggregate(total=Sum('amount_paid'))['total'] or 0
    
    # Upcoming and completed sevas
    today = timezone.now().date()
    upcoming_sevas = schedules.filter(date__gte=today).count()
    completed_sevas = schedules.filter(date__lt=today).count()
    
    statistics = {
        'total_sevas': total_sevas,
        'total_pratyaksha_sevas': total_pratyaksha_sevas,
        'total_paroksha_sevas': total_paroksha_sevas,
        'total_schedules': total_schedules,
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'upcoming_sevas': upcoming_sevas,
        'completed_sevas': completed_sevas
    }
    
    serializer = SevaStatisticsSerializer(statistics)
    return Response(serializer.data)


# Admin Dashboard Views
class AdminSevaManagementView(APIView):
    """View for admin seva management dashboard"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        """Get seva management statistics and recent data"""
        # Get recent sevas
        recent_sevas = Seva.objects.filter(is_active=True).order_by('-created_at')[:10]
        
        # Get recent schedules
        recent_schedules = SevaSchedule.objects.filter(is_active=True).order_by('-created_at')[:10]
        
        # Get recent bookings
        recent_bookings = SevaBooking.objects.all().order_by('-booking_date')[:10]
        
        # Get category statistics
        category_stats = SevaCategory.objects.annotate(
            seva_count=Count('sevas'),
            schedule_count=Count('sevas__schedules')
        )
        
        return Response({
            'recent_sevas': SevaSerializer(recent_sevas, many=True).data,
            'recent_schedules': SevaScheduleSerializer(recent_schedules, many=True).data,
            'recent_bookings': SevaBookingSerializer(recent_bookings, many=True).data,
            'category_stats': SevaCategorySerializer(category_stats, many=True).data
        })


# Public Seva Views (for devotees)
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_sevas_view(request):
    """View for getting available sevas for devotees"""
    seva_type = request.query_params.get('seva_type')
    category_id = request.query_params.get('category_id')
    
    queryset = Seva.objects.filter(is_active=True)
    
    if seva_type:
        queryset = queryset.filter(seva_type=seva_type)
    if category_id:
        queryset = queryset.filter(category_id=category_id)
    
    serializer = SevaSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_schedules_view(request):
    """View for getting available schedules for devotees"""
    seva_id = request.query_params.get('seva_id')
    date = request.query_params.get('date')
    
    queryset = SevaSchedule.objects.filter(
        is_active=True,
        is_booked=False,
        date__gte=timezone.now().date()
    ).select_related('seva', 'seva__category')
    
    if seva_id:
        queryset = queryset.filter(seva_id=seva_id)
    if date:
        queryset = queryset.filter(date=date)
    
    serializer = SevaScheduleSerializer(queryset, many=True)
    return Response(serializer.data)
