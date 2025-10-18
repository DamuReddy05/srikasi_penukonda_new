from django.urls import path
from . import views

urlpatterns = [
    # Puja endpoints
    path('pujas/', views.PujaListCreateView.as_view(), name='puja-list-create'),
    path('pujas/<int:pk>/', views.PujaDetailView.as_view(), name='puja-detail'),
    
    # Puja booking endpoints
    path('puja-bookings/', views.PujaBookingListCreateView.as_view(), name='puja-booking-list-create'),
    path('puja-bookings/<int:pk>/', views.PujaBookingDetailView.as_view(), name='puja-booking-detail'),
    path('puja-bookings/<int:booking_id>/cancel/', views.cancel_puja_booking_view, name='cancel-puja-booking'),
    
    # Calendar and events endpoints
    path('calendar/events/', views.calendar_events_view, name='calendar-events'),
    path('events/today/', views.today_events_view, name='today-events'),
    
    # Statistics endpoint
    path('pujas/statistics/', views.puja_statistics_view, name='puja-statistics'),
]
