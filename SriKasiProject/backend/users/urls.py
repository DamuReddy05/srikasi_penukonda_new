from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('auth/login/', views.UserLoginView.as_view(), name='user-login'),
    path('auth/logout/', views.logout_view, name='user-logout'),
    path('auth/google/', views.google_auth_view, name='google-auth'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # Family member endpoints
    path('family-members/', views.FamilyMemberListCreateView.as_view(), name='family-members'),
    path('family-members/<int:pk>/', views.FamilyMemberDetailView.as_view(), name='family-member-detail'),
    
    # Admin endpoints
    path('auth/admin-login/', views.AdminLoginView.as_view(), name='admin-login'),
    path('admin/dashboard/', views.AdminDashboardView.as_view(), name='admin-dashboard'),
    path('admin/users/', views.AdminUserManagementView.as_view(), name='admin-users'),
    path('admin/users/<int:user_id>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]
