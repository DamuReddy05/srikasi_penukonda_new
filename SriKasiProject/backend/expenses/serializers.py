from rest_framework import serializers
from .models import ExpenseCategory, Expense
from users.serializers import UserSerializer


class ExpenseCategorySerializer(serializers.ModelSerializer):
    """Serializer for ExpenseCategory model"""
    
    class Meta:
        model = ExpenseCategory
        fields = [
            'id', 'name', 'description', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ExpenseSerializer(serializers.ModelSerializer):
    """Serializer for Expense model"""
    category = ExpenseCategorySerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Expense
        fields = [
            'id', 'category', 'amount', 'date', 'description', 'payment_method',
            'receipt_number', 'vendor_name', 'vendor_contact', 'created_by',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class ExpenseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating Expense"""
    
    class Meta:
        model = Expense
        fields = [
            'category', 'amount', 'date', 'description', 'payment_method',
            'receipt_number', 'vendor_name', 'vendor_contact'
        ]
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ExpenseReportSerializer(serializers.Serializer):
    """Serializer for expense reports"""
    category_name = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    expense_count = serializers.IntegerField()
    percentage = serializers.DecimalField(max_digits=5, decimal_places=2)


class MonthlyExpenseSerializer(serializers.Serializer):
    """Serializer for monthly expense summary"""
    month = serializers.CharField()
    year = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    expense_count = serializers.IntegerField()
    categories = ExpenseReportSerializer(many=True)
