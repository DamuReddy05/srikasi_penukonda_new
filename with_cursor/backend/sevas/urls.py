from django.urls import path
from . import views

app_name = 'sevas'

urlpatterns = [
    # Seva Categories
    path('categories/', views.SevaCategoryListCreateView.as_view(), name='seva-category-list'),
    path('categories/<int:pk>/', views.SevaCategoryDetailView.as_view(), name='seva-category-detail'),
    
    # Sevas
    path('sevas/', views.SevaListCreateView.as_view(), name='seva-list'),
    path('<int:pk>/', views.SevaDetailView.as_view(), name='seva-detail'),
    
    # Seva Schedules
    path('schedules/', views.SevaScheduleListCreateView.as_view(), name='seva-schedule-list'),
    path('schedules/<int:pk>/', views.SevaScheduleDetailView.as_view(), name='seva-schedule-detail'),
    
    # Seva Bookings
    path('bookings/', views.SevaBookingListCreateView.as_view(), name='seva-booking-list'),
    path('bookings/<int:pk>/', views.SevaBookingDetailView.as_view(), name='seva-booking-detail'),
    
    # Calendar and Statistics
    path('calendar/', views.calendar_events_view, name='calendar-events'),
    path('statistics/', views.seva_statistics_view, name='seva-statistics'),
    
    # Admin Management
    path('admin/management/', views.AdminSevaManagementView.as_view(), name='admin-seva-management'),
    
    # Public Views (for devotees)
    path('available/', views.available_sevas_view, name='available-sevas'),
    path('available-schedules/', views.available_schedules_view, name='available-schedules'),
]
