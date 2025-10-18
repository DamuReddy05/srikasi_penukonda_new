from django.urls import path
from . import views

urlpatterns = [
    # Darshan slot endpoints
    path('darshan-slots/', views.DarshanSlotListCreateView.as_view(), name='darshan-slot-list-create'),
    path('darshan-slots/<int:pk>/', views.DarshanSlotDetailView.as_view(), name='darshan-slot-detail'),
    
    # Darshan booking endpoints
    path('darshan-bookings/', views.DarshanBookingListCreateView.as_view(), name='darshan-booking-list-create'),
    path('darshan-bookings/<int:pk>/', views.DarshanBookingDetailView.as_view(), name='darshan-booking-detail'),
    path('darshan-bookings/<int:booking_id>/cancel/', views.cancel_darshan_booking_view, name='cancel-darshan-booking'),
    
    # Available slots endpoint
    path('available-slots/', views.available_slots_view, name='available-slots'),
    
    # Statistics endpoint
    path('darshan/statistics/', views.darshan_statistics_view, name='darshan-statistics'),
    
    # Today's slots endpoint
    path('darshan/today/', views.today_slots_view, name='today-darshan-slots'),
]
