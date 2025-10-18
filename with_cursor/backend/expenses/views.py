from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from .models import ExpenseCategory, Expense
from .serializers import (
    ExpenseCategorySerializer, ExpenseSerializer, ExpenseCreateSerializer,
    ExpenseReportSerializer, MonthlyExpenseSerializer
)
from users.permissions import IsAdminUser


class ExpenseCategoryListCreateView(generics.ListCreateAPIView):
    """View for listing and creating expense categories"""
    serializer_class = ExpenseCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = ExpenseCategory.objects.filter(is_active=True)


class ExpenseCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual expense categories"""
    serializer_class = ExpenseCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = ExpenseCategory.objects.all()


class ExpenseListCreateView(generics.ListCreateAPIView):
    """View for listing and creating expenses"""
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        queryset = Expense.objects.all()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Filter by category
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by payment method
        payment_method = self.request.query_params.get('payment_method')
        if payment_method:
            queryset = queryset.filter(payment_method=payment_method)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ExpenseCreateSerializer
        return ExpenseSerializer


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual expenses"""
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = Expense.objects.all()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def expense_statistics_view(request):
    """View for getting expense statistics"""
    # Get date range from query parameters
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    queryset = Expense.objects.all()
    
    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
    
    # Calculate statistics
    total_expenses = queryset.count()
    total_amount = queryset.aggregate(total=Sum('amount'))['total'] or 0
    
    # Category-wise breakdown
    category_stats = queryset.values('category__name').annotate(
        total_amount=Sum('amount'),
        expense_count=Count('id')
    ).order_by('-total_amount')
    
    # Payment method breakdown
    payment_method_stats = queryset.values('payment_method').annotate(
        total_amount=Sum('amount'),
        expense_count=Count('id')
    ).order_by('-total_amount')
    
    statistics = {
        'total_expenses': total_expenses,
        'total_amount': total_amount,
        'category_breakdown': list(category_stats),
        'payment_method_breakdown': list(payment_method_stats),
    }
    
    return Response(statistics)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def monthly_expense_report_view(request):
    """View for getting monthly expense report"""
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
    
    # Get expenses for the specified month
    expenses = Expense.objects.filter(
        date__year=year,
        date__month=month
    )
    
    total_amount = expenses.aggregate(total=Sum('amount'))['total'] or 0
    total_count = expenses.count()
    
    # Category-wise breakdown
    category_breakdown = expenses.values('category__name').annotate(
        total_amount=Sum('amount'),
        expense_count=Count('id')
    ).order_by('-total_amount')
    
    # Calculate percentages
    category_reports = []
    for category in category_breakdown:
        percentage = (category['total_amount'] / total_amount * 100) if total_amount > 0 else 0
        category_reports.append({
            'category_name': category['category__name'],
            'total_amount': category['total_amount'],
            'expense_count': category['expense_count'],
            'percentage': round(percentage, 2)
        })
    
    report = {
        'month': datetime(year, month, 1).strftime('%B'),
        'year': year,
        'total_amount': total_amount,
        'expense_count': total_count,
        'categories': category_reports
    }
    
    serializer = MonthlyExpenseSerializer(report)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def expense_summary_view(request):
    """View for getting expense summary for dashboard"""
    # Current month expenses
    current_month = timezone.now().month
    current_year = timezone.now().year
    
    current_month_expenses = Expense.objects.filter(
        date__year=current_year,
        date__month=current_month
    )
    
    current_month_total = current_month_expenses.aggregate(total=Sum('amount'))['total'] or 0
    current_month_count = current_month_expenses.count()
    
    # Previous month expenses
    if current_month == 1:
        prev_month = 12
        prev_year = current_year - 1
    else:
        prev_month = current_month - 1
        prev_year = current_year
    
    prev_month_expenses = Expense.objects.filter(
        date__year=prev_year,
        date__month=prev_month
    )
    
    prev_month_total = prev_month_expenses.aggregate(total=Sum('amount'))['total'] or 0
    
    # Calculate percentage change
    if prev_month_total > 0:
        percentage_change = ((current_month_total - prev_month_total) / prev_month_total) * 100
    else:
        percentage_change = 0
    
    # Top categories for current month
    top_categories = current_month_expenses.values('category__name').annotate(
        total_amount=Sum('amount')
    ).order_by('-total_amount')[:5]
    
    summary = {
        'current_month_total': current_month_total,
        'current_month_count': current_month_count,
        'previous_month_total': prev_month_total,
        'percentage_change': round(percentage_change, 2),
        'top_categories': list(top_categories)
    }
    
    return Response(summary)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def expense_trend_view(request):
    """View for getting expense trends over time"""
    months = int(request.query_params.get('months', 6))
    
    # Get expenses for the last N months
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=months * 30)
    
    expenses = Expense.objects.filter(
        date__gte=start_date,
        date__lte=end_date
    )
    
    # Group by month
    monthly_trends = expenses.extra(
        select={'month': "EXTRACT(month FROM date)", 'year': "EXTRACT(year FROM date)"}
    ).values('month', 'year').annotate(
        total_amount=Sum('amount'),
        expense_count=Count('id')
    ).order_by('year', 'month')
    
    trends = []
    for trend in monthly_trends:
        month_name = datetime(int(trend['year']), int(trend['month']), 1).strftime('%B %Y')
        trends.append({
            'month': month_name,
            'total_amount': trend['total_amount'],
            'expense_count': trend['expense_count']
        })
    
    return Response(trends)
