from rest_framework import serializers
from .models import Puja, PujaBooking
from users.serializers import UserSerializer, FamilyMemberSerializer


class PujaSerializer(serializers.ModelSerializer):
    """Serializer for Puja model"""
    created_by = UserSerializer(read_only=True)
    is_full = serializers.ReadOnlyField()
    available_slots = serializers.ReadOnlyField()
    
    class Meta:
        model = Puja
        fields = [
            'id', 'name', 'description', 'puja_type', 'date', 'start_time', 'end_time',
            'price', 'max_participants', 'current_participants', 'is_active',
            'created_by', 'created_at', 'updated_at', 'is_full', 'available_slots'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at', 'current_participants']


class PujaCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Puja"""
    
    class Meta:
        model = Puja
        fields = [
            'name', 'description', 'puja_type', 'date', 'start_time', 'end_time',
            'price', 'max_participants', 'is_active'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class PujaBookingSerializer(serializers.ModelSerializer):
    """Serializer for PujaBooking model"""
    puja = PujaSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    family_members = FamilyMemberSerializer(many=True, read_only=True)
    
    class Meta:
        model = PujaBooking
        fields = [
            'id', 'puja', 'user', 'family_members', 'number_of_people',
            'total_amount', 'status', 'payment_status', 'special_requests',
            'booked_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'booked_at', 'updated_at']


class PujaBookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating PujaBooking"""
    family_member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = PujaBooking
        fields = [
            'puja', 'family_member_ids', 'number_of_people',
            'special_requests'
        ]
    
    def validate(self, attrs):
        puja = attrs.get('puja')
        number_of_people = attrs.get('number_of_people', 1)
        
        # Check if puja is active
        if not puja.is_active:
            raise serializers.ValidationError("This puja is not active")
        
        # Check if puja is full
        if puja.is_full:
            raise serializers.ValidationError("This puja is full")
        
        # Check if there are enough slots
        if puja.available_slots is not None and number_of_people > puja.available_slots:
            raise serializers.ValidationError(f"Only {puja.available_slots} slots available")
        
        # Calculate total amount
        attrs['total_amount'] = puja.price * number_of_people
        
        return attrs
    
    def create(self, validated_data):
        family_member_ids = validated_data.pop('family_member_ids', [])
        validated_data['user'] = self.context['request'].user
        
        booking = super().create(validated_data)
        
        # Add family members if provided
        if family_member_ids:
            from users.models import FamilyMember
            family_members = FamilyMember.objects.filter(
                id__in=family_member_ids,
                user=self.context['request'].user
            )
            booking.family_members.set(family_members)
        
        return booking


class CalendarEventSerializer(serializers.Serializer):
    """Serializer for calendar events"""
    id = serializers.IntegerField()
    title = serializers.CharField()
    date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    puja_type = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    is_full = serializers.BooleanField()
    available_slots = serializers.IntegerField(allow_null=True)
    description = serializers.CharField()
