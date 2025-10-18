from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import FamilyMember
from .serializers import (
    UserSerializer, UserRegistrationSerializer, FamilyMemberSerializer,
    UserProfileSerializer, GoogleAuthSerializer, AdminLoginSerializer
)
from .permissions import IsAdminUser, IsOwnerOrAdmin

User = get_user_model()


class AdminLoginView(APIView):
    """View for admin login"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            user = authenticate(username=email, password=password)
            
            if user and user.is_admin:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Admin login successful'
                })
            else:
                return Response({
                    'error': 'Invalid admin credentials or insufficient permissions'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminDashboardView(APIView):
    """View for admin dashboard statistics"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        # Get current date and time
        now = timezone.now()
        today = now.date()
        this_month = now.replace(day=1)
        
        # User statistics
        total_users = User.objects.count()
        total_devotees = User.objects.filter(user_type='devotee').count()
        total_admins = User.objects.filter(user_type='admin').count()
        new_users_this_month = User.objects.filter(
            date_joined__gte=this_month
        ).count()
        
        # Recent registrations
        recent_users = User.objects.filter(
            user_type='devotee'
        ).order_by('-date_joined')[:10]
        
        # User activity (last 7 days)
        last_week = now - timedelta(days=7)
        active_users = User.objects.filter(
            last_login__gte=last_week
        ).count()
        
        # Family members statistics
        total_family_members = FamilyMember.objects.count()
        
        dashboard_data = {
            'statistics': {
                'total_users': total_users,
                'total_devotees': total_devotees,
                'total_admins': total_admins,
                'new_users_this_month': new_users_this_month,
                'active_users_last_week': active_users,
                'total_family_members': total_family_members
            },
            'recent_users': UserSerializer(recent_users, many=True).data,
            'current_date': now.isoformat(),
            'user': UserSerializer(request.user).data
        }
        
        return Response(dashboard_data)


class AdminUserManagementView(APIView):
    """View for admin user management"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get(self, request):
        """Get all users with pagination and filtering"""
        users = User.objects.all().order_by('-date_joined')
        
        # Apply filters
        user_type = request.query_params.get('user_type')
        if user_type:
            users = users.filter(user_type=user_type)
        
        # Apply search
        search = request.query_params.get('search')
        if search:
            users = users.filter(
                Q(email__icontains=search) |
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start = (page - 1) * page_size
        end = start + page_size
        
        paginated_users = users[start:end]
        
        return Response({
            'users': UserSerializer(paginated_users, many=True).data,
            'total_count': users.count(),
            'page': page,
            'page_size': page_size,
            'total_pages': (users.count() + page_size - 1) // page_size
        })
    
    def post(self, request):
        """Create a new user (admin only)"""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'user': UserSerializer(user).data,
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserDetailView(APIView):
    """View for managing individual users"""
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get(self, request, user_id):
        """Get user details"""
        user = get_object_or_404(User, id=user_id)
        return Response(UserSerializer(user).data)
    
    def put(self, request, user_id):
        """Update user details"""
        user = get_object_or_404(User, id=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'user': serializer.data,
                'message': 'User updated successfully'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id):
        """Delete user"""
        user = get_object_or_404(User, id=user_id)
        user.delete()
        return Response({
            'message': 'User deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)


class UserRegistrationView(APIView):
    """View for user registration"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    """View for user login"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'error': 'Please provide both email and password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


class UserProfileView(APIView):
    """View for user profile management"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FamilyMemberListCreateView(generics.ListCreateAPIView):
    """View for listing and creating family members"""
    serializer_class = FamilyMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FamilyMember.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FamilyMemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual family members"""
    serializer_class = FamilyMemberSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_queryset(self):
        return FamilyMember.objects.filter(user=self.request.user)


class UserListView(generics.ListAPIView):
    """View for listing users (admin only)"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = User.objects.all()


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for managing individual users (admin only)"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = User.objects.all()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth_view(request):
    """View for Google OAuth authentication"""
    serializer = GoogleAuthSerializer(data=request.data)
    if serializer.is_valid():
        # Here you would implement Google token verification
        # For now, we'll return a placeholder response
        return Response({
            'message': 'Google authentication endpoint - implement token verification'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """View for user logout"""
    try:
        refresh_token = request.data.get('refresh_token')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
