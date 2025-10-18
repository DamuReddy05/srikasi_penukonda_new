import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, AdminDashboardData } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <h1>👑 Admin Dashboard</h1>
          <p>Sri Kasi Vishweswara Swamy Devasthanam - Temple Management</p>
        </div>
        <div class="header-right">
          <div class="admin-info">
            <span class="admin-name">{{ currentUser?.first_name }} {{ currentUser?.last_name }}</span>
            <span class="admin-email">{{ currentUser?.email }}</span>
          </div>
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </header>

      <!-- Loading Spinner -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content" *ngIf="!isLoading && dashboardData">
        <!-- Statistics Cards -->
        <section class="stats-section">
          <h2>📊 Temple Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card total-users">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ dashboardData.statistics.total_users }}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div class="stat-card devotees">
              <div class="stat-icon">🙏</div>
              <div class="stat-info">
                <h3>{{ dashboardData.statistics.total_devotees }}</h3>
                <p>Devotees</p>
              </div>
            </div>
            
            <div class="stat-card admins">
              <div class="stat-icon">👑</div>
              <div class="stat-info">
                <h3>{{ dashboardData.statistics.total_admins }}</h3>
                <p>Administrators</p>
              </div>
            </div>
            
            <div class="stat-card new-users">
              <div class="stat-icon">🆕</div>
              <div class="stat-info">
                <h3>{{ dashboardData.statistics.new_users_this_month }}</h3>
                <p>New Users (This Month)</p>
              </div>
            </div>
            
            <div class="stat-card active-users">
              <div class="stat-icon">🟢</div>
              <div class="stat-info">
                <h3>{{ dashboardData.statistics.active_users_last_week }}</h3>
                <p>Active Users (Last Week)</p>
              </div>
            </div>
            
            <div class="stat-card family-members">
              <div class="stat-icon">👨‍👩‍👦</div>
              <div class="stat-info">
                <h3>{{ dashboardData.statistics.total_family_members }}</h3>
                <p>Family Members</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="actions-section">
          <h2>⚡ Quick Actions</h2>
          <div class="actions-grid">
            <button class="action-card" (click)="navigateToUserManagement()">
              <div class="action-icon">👥</div>
              <h3>Manage Users</h3>
              <p>View and manage all temple users</p>
            </button>
            
            <button class="action-card" (click)="navigateToSevas()">
              <div class="action-icon">🕯️</div>
              <h3>Manage Sevas</h3>
              <p>Configure temple services and events</p>
            </button>
            
            <button class="action-card" (click)="navigateToBookings()">
              <div class="action-icon">📅</div>
              <h3>Manage Bookings</h3>
              <p>View and manage darshan bookings</p>
            </button>
            
            <button class="action-card" (click)="navigateToExpenses()">
              <div class="action-icon">💰</div>
              <h3>Manage Expenses</h3>
              <p>Track temple expenses and donations</p>
            </button>
          </div>
        </section>

        <!-- Recent Users -->
        <section class="recent-users-section">
          <h2>🆕 Recent Registrations</h2>
          <div class="users-table" *ngIf="dashboardData.recent_users.length > 0">
            <div class="table-header">
              <div class="header-cell">Name</div>
              <div class="header-cell">Email</div>
              <div class="header-cell">Type</div>
              <div class="header-cell">Joined</div>
              <div class="header-cell">Actions</div>
            </div>
            
            <div class="table-row" *ngFor="let user of dashboardData.recent_users">
              <div class="table-cell">
                <div class="user-info">
                  <div class="user-avatar">{{ (user.first_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase() }}</div>
                  <div class="user-details">
                    <span class="user-name">{{ user.first_name }} {{ user.last_name }}</span>
                    <span class="user-phone" *ngIf="user.phone_number">{{ user.phone_number }}</span>
                  </div>
                </div>
              </div>
              <div class="table-cell">{{ user.email }}</div>
              <div class="table-cell">
                <span class="user-type" [class]="user.user_type">{{ user.user_type }}</span>
              </div>
              <div class="table-cell">{{ formatDate(user.date_joined) }}</div>
              <div class="table-cell">
                <button class="action-btn view-btn" (click)="viewUser(user.id)">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" (click)="editUser(user.id)">
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="no-users" *ngIf="dashboardData.recent_users.length === 0">
            <i class="fas fa-users"></i>
            <p>No recent user registrations</p>
          </div>
        </section>

        <!-- System Info -->
        <section class="system-info-section">
          <h2>ℹ️ System Information</h2>
          <div class="info-grid">
            <div class="info-card">
              <h3>Current Date & Time</h3>
                             <p>{{ formatDateTime(dashboardData.current_date || null) }}</p>
            </div>
            <div class="info-card">
              <h3>Logged in as</h3>
              <p>{{ currentUser?.first_name }} {{ currentUser?.last_name }} ({{ currentUser?.user_type }})</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Error Loading Dashboard</h3>
        <p>{{ error }}</p>
        <button class="retry-btn" (click)="loadDashboard()">
          <i class="fas fa-redo"></i>
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }

    .admin-header {
      background: white;
      border-radius: 12px;
      padding: 20px 30px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-left h1 {
      color: #1a237e;
      margin: 0 0 5px 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .header-left p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .admin-info {
      text-align: right;
    }

    .admin-name {
      display: block;
      color: #1a237e;
      font-weight: 600;
      font-size: 16px;
    }

    .admin-email {
      display: block;
      color: #666;
      font-size: 14px;
    }

    .logout-btn {
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px 20px;
      text-align: center;
    }

    .loading-container p {
      margin-top: 20px;
      color: #666;
      font-size: 16px;
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .stats-section, .actions-section, .recent-users-section, .system-info-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stats-section h2, .actions-section h2, .recent-users-section h2, .system-info-section h2 {
      color: #1a237e;
      margin: 0 0 25px 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card.devotees {
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
    }

    .stat-card.admins {
      background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    }

    .stat-card.new-users {
      background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    }

    .stat-card.active-users {
      background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
    }

    .stat-card.family-members {
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }

    .stat-info h3 {
      margin: 0 0 5px 0;
      font-size: 2rem;
      font-weight: bold;
    }

    .stat-info p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      border-color: #1a237e;
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(26, 35, 126, 0.15);
    }

    .action-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }

    .action-card h3 {
      color: #1a237e;
      margin: 0 0 10px 0;
      font-size: 1.2rem;
    }

    .action-card p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .users-table {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .table-header {
      background: #f5f5f5;
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
      padding: 15px;
      font-weight: 600;
      color: #333;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
      align-items: center;
    }

    .table-row:hover {
      background: #f9f9f9;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 600;
      color: #333;
    }

    .user-phone {
      font-size: 12px;
      color: #666;
    }

    .user-type {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .user-type.admin {
      background: #ffebee;
      color: #c62828;
    }

    .user-type.devotee {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .action-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 5px;
      transition: all 0.3s ease;
    }

    .view-btn {
      color: #1976d2;
    }

    .view-btn:hover {
      background: #e3f2fd;
    }

    .edit-btn {
      color: #ff9800;
    }

    .edit-btn:hover {
      background: #fff3e0;
    }

    .no-users {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-users i {
      font-size: 3rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #1a237e;
    }

    .info-card h3 {
      color: #1a237e;
      margin: 0 0 10px 0;
      font-size: 1rem;
    }

    .info-card p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .error-container {
      text-align: center;
      padding: 100px 20px;
      color: #666;
    }

    .error-container i {
      font-size: 3rem;
      color: #f44336;
      margin-bottom: 20px;
    }

    .error-container h3 {
      color: #333;
      margin: 0 0 10px 0;
    }

    .retry-btn {
      background: #1a237e;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 20px auto 0;
      transition: all 0.3s ease;
    }

    .retry-btn:hover {
      background: #0d47a1;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .admin-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .header-right {
        flex-direction: column;
        gap: 15px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .table-header, .table-row {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .table-header {
        display: none;
      }

      .table-row {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin-bottom: 10px;
        padding: 15px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  dashboardData: AdminDashboardData | null = null;
  currentUser: any = null;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Debug logging
    console.log('Admin Dashboard - Current User:', this.currentUser);
    console.log('Admin Dashboard - Is Admin:', this.authService.isAdmin());
    console.log('Admin Dashboard - Token Valid:', this.authService.isTokenValid());
    console.log('Admin Dashboard - User Type:', this.currentUser?.user_type);
    console.log('Admin Dashboard - localStorage current_user:', localStorage.getItem('current_user'));
    
    if (!this.authService.isAdmin()) {
      console.log('Not admin, redirecting to admin login');
      this.router.navigate(['/admin']);
      return;
    }

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.error = null;
    this.spinner.show();



    this.authService.getAdminDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.isLoading = false;
          this.spinner.hide();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to load dashboard data';
          this.isLoading = false;
          this.spinner.hide();
          
          this.snackBar.open(this.error || 'Unknown error occurred', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin']);
  }

  navigateToUserManagement(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToSevas(): void {
    this.router.navigate(['/admin/sevas']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/admin/bookings']);
  }

  navigateToExpenses(): void {
    this.router.navigate(['/admin/expenses']);
  }

  viewUser(userId: number): void {
    this.router.navigate(['/admin/users', userId]);
  }

  editUser(userId: number): void {
    this.router.navigate(['/admin/users', userId, 'edit']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
