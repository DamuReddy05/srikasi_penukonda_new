from rest_framework import serializers
from .models import SevaCategory, Seva, SevaSchedule, SevaBooking
from users.serializers import UserSerializer


class SevaCategorySerializer(serializers.ModelSerializer):
    """Serializer for SevaCategory model"""
    
    class Meta:
        model = SevaCategory
        fields = '__all__'


class SevaSerializer(serializers.ModelSerializer):
    """Serializer for Seva model"""
    category = SevaCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Seva
        fields = [
            'id', 'name', 'seva_type', 'category', 'category_id',
            'description', 'how_performed', 'duration',
            'start_time', 'end_time', 'base_cost', 'currency',
            'temple_provides', 'devotee_brings', 'benefits',
            'images', 'is_active', 'max_participants',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class SevaCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Seva"""
    category_id = serializers.IntegerField()
    
    class Meta:
        model = Seva
        fields = [
            'name', 'seva_type', 'category_id', 'description',
            'how_performed', 'duration', 'start_time', 'end_time',
            'base_cost', 'currency', 'temple_provides', 'devotee_brings',
            'benefits', 'images', 'is_active', 'max_participants'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class SevaScheduleSerializer(serializers.ModelSerializer):
    """Serializer for SevaSchedule model"""
    seva = SevaSerializer(read_only=True)
    seva_id = serializers.IntegerField(write_only=True)
    created_by = UserSerializer(read_only=True)
    
    # Effective values (computed properties)
    effective_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    effective_temple_provides = serializers.CharField(read_only=True)
    effective_devotee_brings = serializers.CharField(read_only=True)
    effective_benefits = serializers.CharField(read_only=True)
    
    # Status properties
    is_past = serializers.BooleanField(read_only=True)
    is_today = serializers.BooleanField(read_only=True)
    is_future = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = SevaSchedule
        fields = [
            'id', 'seva', 'seva_id', 'date', 'start_time', 'end_time',
            'cost_override', 'temple_provides_override', 'devotee_brings_override',
            'benefits_override', 'max_participants', 'is_active', 'is_booked',
            'effective_cost', 'effective_temple_provides', 'effective_devotee_brings',
            'effective_benefits', 'is_past', 'is_today', 'is_future',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class SevaScheduleCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating SevaSchedule"""
    seva_id = serializers.IntegerField()
    
    class Meta:
        model = SevaSchedule
        fields = [
            'seva_id', 'date', 'start_time', 'end_time',
            'cost_override', 'temple_provides_override', 'devotee_brings_override',
            'benefits_override', 'max_participants', 'is_active'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class SevaBookingSerializer(serializers.ModelSerializer):
    """Serializer for SevaBooking model"""
    user = UserSerializer(read_only=True)
    seva_schedule = SevaScheduleSerializer(read_only=True)
    seva_schedule_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = SevaBooking
        fields = [
            'id', 'user', 'seva_schedule', 'seva_schedule_id',
            'booking_date', 'scheduled_date', 'scheduled_time',
            'amount_paid', 'payment_status', 'payment_method', 'transaction_id',
            'status', 'special_requests', 'number_of_participants',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'booking_date', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class SevaBookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating SevaBooking"""
    seva_schedule_id = serializers.IntegerField()
    
    class Meta:
        model = SevaBooking
        fields = [
            'seva_schedule_id', 'scheduled_date', 'scheduled_time',
            'amount_paid', 'payment_method', 'transaction_id',
            'special_requests', 'number_of_participants'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CalendarEventSerializer(serializers.Serializer):
    """Serializer for calendar events"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    seva_type = serializers.CharField()
    category = serializers.CharField()
    cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_booked = serializers.BooleanField()
    is_active = serializers.BooleanField()


class SevaStatisticsSerializer(serializers.Serializer):
    """Serializer for seva statistics"""
    total_sevas = serializers.IntegerField()
    total_pratyaksha_sevas = serializers.IntegerField()
    total_paroksha_sevas = serializers.IntegerField()
    total_schedules = serializers.IntegerField()
    total_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    upcoming_sevas = serializers.IntegerField()
    completed_sevas = serializers.IntegerField()
