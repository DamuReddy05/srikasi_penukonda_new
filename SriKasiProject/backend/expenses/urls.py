from django.urls import path
from . import views

urlpatterns = [
    # Expense category endpoints
    path('expense-categories/', views.ExpenseCategoryListCreateView.as_view(), name='expense-category-list-create'),
    path('expense-categories/<int:pk>/', views.ExpenseCategoryDetailView.as_view(), name='expense-category-detail'),
    
    # Expense endpoints
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
    
    # Statistics and reports endpoints
    path('expenses/statistics/', views.expense_statistics_view, name='expense-statistics'),
    path('expenses/monthly-report/', views.monthly_expense_report_view, name='monthly-expense-report'),
    path('expenses/summary/', views.expense_summary_view, name='expense-summary'),
    path('expenses/trends/', views.expense_trend_view, name='expense-trends'),
]
