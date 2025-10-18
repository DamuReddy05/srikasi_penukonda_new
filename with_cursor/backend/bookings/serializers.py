from rest_framework import serializers
from .models import DarshanSlot, DarshanBooking
from users.serializers import UserSerializer, FamilyMemberSerializer


class DarshanSlotSerializer(serializers.ModelSerializer):
    """Serializer for DarshanSlot model"""
    created_by = UserSerializer(read_only=True)
    is_full = serializers.ReadOnlyField()
    available_capacity = serializers.ReadOnlyField()
    
    class Meta:
        model = DarshanSlot
        fields = [
            'id', 'date', 'slot_type', 'start_time', 'end_time', 'capacity',
            'current_bookings', 'is_active', 'created_by', 'created_at',
            'updated_at', 'is_full', 'available_capacity'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at', 'current_bookings']


class DarshanSlotCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating DarshanSlot"""
    
    class Meta:
        model = DarshanSlot
        fields = [
            'date', 'slot_type', 'start_time', 'end_time', 'capacity', 'is_active'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class DarshanBookingSerializer(serializers.ModelSerializer):
    """Serializer for DarshanBooking model"""
    slot = DarshanSlotSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    family_members = FamilyMemberSerializer(many=True, read_only=True)
    
    class Meta:
        model = DarshanBooking
        fields = [
            'id', 'slot', 'user', 'family_members', 'number_of_people',
            'status', 'special_requests', 'booked_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'booked_at', 'updated_at']


class DarshanBookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating DarshanBooking"""
    family_member_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )
    
    class Meta:
        model = DarshanBooking
        fields = [
            'slot', 'family_member_ids', 'number_of_people', 'special_requests'
        ]
    
    def validate(self, attrs):
        slot = attrs.get('slot')
        number_of_people = attrs.get('number_of_people', 1)
        
        # Check if slot is active
        if not slot.is_active:
            raise serializers.ValidationError("This slot is not active")
        
        # Check if slot is full
        if slot.is_full:
            raise serializers.ValidationError("This slot is full")
        
        # Check if there are enough spots
        if number_of_people > slot.available_capacity:
            raise serializers.ValidationError(f"Only {slot.available_capacity} spots available")
        
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


class AvailableSlotSerializer(serializers.Serializer):
    """Serializer for available slots"""
    id = serializers.IntegerField()
    date = serializers.DateField()
    slot_type = serializers.CharField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    available_capacity = serializers.IntegerField()
    total_capacity = serializers.IntegerField()
