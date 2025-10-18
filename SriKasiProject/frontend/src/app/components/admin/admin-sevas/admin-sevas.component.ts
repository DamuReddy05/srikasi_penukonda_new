import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { SevaService, Seva, SevaSchedule, SevaBooking, SevaCategory, SevaStatistics } from '../../../services/seva.service';

@Component({
  selector: 'app-admin-sevas',
  template: `
    <div class="admin-sevas-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-left">
          <h1>🕉️ Seva Management</h1>
          <p>Manage Pratyaksha and Paroksha Sevas</p>
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
      </div>

      <!-- Statistics Cards -->
      <div class="stats-section" *ngIf="statistics">
        <h2>📊 Seva Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🕉️</div>
            <div class="stat-content">
              <h3>{{ statistics?.total_sevas || 0 }}</h3>
              <p>Total Sevas</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👁️</div>
            <div class="stat-content">
              <h3>{{ statistics?.total_pratyaksha_sevas || 0 }}</h3>
              <p>Pratyaksha Sevas</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🙏</div>
            <div class="stat-content">
              <h3>{{ statistics?.total_paroksha_sevas || 0 }}</h3>
              <p>Paroksha Sevas</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <h3>{{ statistics?.total_schedules || 0 }}</h3>
              <p>Total Schedules</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
              <h3>{{ statistics?.total_bookings || 0 }}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3>{{ sevaService.formatCurrency(statistics?.total_revenue || 0) }}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <h2>⚡ Quick Actions</h2>
        <div class="actions-grid">
          <button class="action-card" (click)="navigateToSevaCategories()">
            <div class="action-icon">📂</div>
            <h3>Manage Categories</h3>
            <p>Create and manage seva categories</p>
          </button>
          <button class="action-card" (click)="navigateToSevas()">
            <div class="action-icon">🕉️</div>
            <h3>Manage Sevas</h3>
            <p>Create and manage sevas</p>
          </button>
          <button class="action-card" (click)="navigateToSchedules()">
            <div class="action-icon">📅</div>
            <h3>Manage Schedules</h3>
            <p>Schedule sevas on calendar</p>
          </button>
          <button class="action-card" (click)="navigateToBookings()">
            <div class="action-icon">📋</div>
            <h3>Manage Bookings</h3>
            <p>View and manage bookings</p>
          </button>
        </div>
      </div>

      <!-- Recent Data -->
      <div class="recent-data-section">
        <div class="recent-sevas-section">
          <h2>🕉️ Recent Sevas</h2>
          <div class="data-table" *ngIf="recentSevas.length > 0; else noSevas">
            <div class="table-header">
              <div class="header-cell">Name</div>
              <div class="header-cell">Type</div>
              <div class="header-cell">Category</div>
              <div class="header-cell">Cost</div>
              <div class="header-cell">Status</div>
              <div class="header-cell">Actions</div>
            </div>
            <div class="table-row" *ngFor="let seva of recentSevas">
              <div class="table-cell">{{ seva.name }}</div>
              <div class="table-cell">
                <span class="badge" [class]="seva.seva_type">
                  {{ sevaService.getSevaTypeLabel(seva.seva_type) }}
                </span>
              </div>
              <div class="table-cell">{{ seva.category.name }}</div>
              <div class="table-cell">{{ sevaService.formatCurrency(seva.base_cost) }}</div>
              <div class="table-cell">
                <span class="status-badge" [class]="seva.is_active ? 'active' : 'inactive'">
                  {{ seva.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="table-cell">
                <button class="action-btn" (click)="editSeva(seva.id)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" (click)="viewSeva(seva.id)">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
          <ng-template #noSevas>
            <div class="no-data">
              <p>No sevas created yet</p>
              <button class="btn-primary" (click)="navigateToSevas()">Create First Seva</button>
            </div>
          </ng-template>
        </div>

        <div class="recent-schedules-section">
          <h2>📅 Recent Schedules</h2>
          <div class="data-table" *ngIf="recentSchedules.length > 0; else noSchedules">
            <div class="table-header">
              <div class="header-cell">Seva</div>
              <div class="header-cell">Date</div>
              <div class="header-cell">Time</div>
              <div class="header-cell">Cost</div>
              <div class="header-cell">Status</div>
              <div class="header-cell">Actions</div>
            </div>
            <div class="table-row" *ngFor="let schedule of recentSchedules">
              <div class="table-cell">{{ schedule.seva.name }}</div>
              <div class="table-cell">{{ sevaService.formatDate(schedule.date) }}</div>
              <div class="table-cell">{{ sevaService.formatTime(schedule.start_time) }}</div>
              <div class="table-cell">{{ sevaService.formatCurrency(schedule.effective_cost) }}</div>
              <div class="table-cell">
                <span class="status-badge" [class]="schedule.is_booked ? 'booked' : 'available'">
                  {{ schedule.is_booked ? 'Booked' : 'Available' }}
                </span>
              </div>
              <div class="table-cell">
                <button class="action-btn" (click)="editSchedule(schedule.id)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" (click)="viewSchedule(schedule.id)">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
          <ng-template #noSchedules>
            <div class="no-data">
              <p>No schedules created yet</p>
              <button class="btn-primary" (click)="navigateToSchedules()">Create First Schedule</button>
            </div>
          </ng-template>
        </div>

        <div class="recent-bookings-section">
          <h2>📋 Recent Bookings</h2>
          <div class="data-table" *ngIf="recentBookings.length > 0; else noBookings">
            <div class="table-header">
              <div class="header-cell">Devotee</div>
              <div class="header-cell">Seva</div>
              <div class="header-cell">Date</div>
              <div class="header-cell">Amount</div>
              <div class="header-cell">Status</div>
              <div class="header-cell">Actions</div>
            </div>
            <div class="table-row" *ngFor="let booking of recentBookings">
              <div class="table-cell">{{ booking.user.first_name }} {{ booking.user.last_name }}</div>
              <div class="table-cell">{{ booking.seva_schedule.seva.name }}</div>
              <div class="table-cell">{{ sevaService.formatDate(booking.scheduled_date) }}</div>
              <div class="table-cell">{{ sevaService.formatCurrency(booking.amount_paid) }}</div>
              <div class="table-cell">
                <span class="status-badge" [class]="sevaService.getStatusColor(booking.status)">
                  {{ sevaService.getStatusLabel(booking.status) }}
                </span>
              </div>
              <div class="table-cell">
                <button class="action-btn" (click)="editBooking(booking.id)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" (click)="viewBooking(booking.id)">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </div>
          </div>
          <ng-template #noBookings>
            <div class="no-data">
              <p>No bookings yet</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-sevas-container {
      padding: 30px;
      background: #f5f5f5;
      min-height: 100vh;
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

    .stats-section, .actions-section, .recent-data-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stats-section h2, .actions-section h2 {
      color: #1a237e;
      margin: 0 0 25px 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-content h3 {
      margin: 0 0 5px 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .stat-content p {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .action-card h3 {
      color: #1a237e;
      margin: 0 0 10px 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .action-card p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .recent-data-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
    }

    .recent-sevas-section, .recent-schedules-section, .recent-bookings-section {
      background: white;
      border-radius: 12px;
      padding: 25px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .recent-sevas-section h2, .recent-schedules-section h2, .recent-bookings-section h2 {
      color: #1a237e;
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: bold;
    }

    .data-table {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .table-header {
      background: #f5f5f5;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 10px;
      padding: 12px;
      font-weight: bold;
      color: #1a237e;
    }

    .table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
      gap: 10px;
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      align-items: center;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .table-row:hover {
      background: #f9f9f9;
    }

    .header-cell, .table-cell {
      padding: 8px;
      font-size: 14px;
    }

    .badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge.pratyaksha {
      background: #e3f2fd;
      color: #1976d2;
    }

    .badge.paroksha {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.active {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background: #ffebee;
      color: #c62828;
    }

    .status-badge.available {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.booked {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge.warning {
      background: #fff8e1;
      color: #f57f17;
    }

    .status-badge.primary {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.success {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.danger {
      background: #ffebee;
      color: #c62828;
    }

    .action-btn {
      background: none;
      border: none;
      color: #1a237e;
      cursor: pointer;
      padding: 5px;
      margin: 0 2px;
      border-radius: 4px;
      transition: background 0.3s ease;
    }

    .action-btn:hover {
      background: #e3f2fd;
    }

    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .btn-primary {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      margin-top: 15px;
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
    }

    @media (max-width: 768px) {
      .admin-sevas-container {
        padding: 15px;
      }

      .admin-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .recent-data-section {
        grid-template-columns: 1fr;
      }

      .table-header, .table-row {
        grid-template-columns: 1fr;
        gap: 5px;
      }

      .header-cell, .table-cell {
        padding: 5px;
        font-size: 12px;
      }
    }
  `]
})
export class AdminSevasComponent implements OnInit, OnDestroy {
  currentUser: any;
  statistics: SevaStatistics | null = null;
  recentSevas: Seva[] = [];
  recentSchedules: SevaSchedule[] = [];
  recentBookings: SevaBooking[] = [];
  categoryStats: SevaCategory[] = [];
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public sevaService: SevaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadSevaManagementData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSevaManagementData(): void {
    this.spinner.show();
    this.error = null;

    this.sevaService.getAdminManagementData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.recentSevas = data.recent_sevas;
          this.recentSchedules = data.recent_schedules;
          this.recentBookings = data.recent_bookings;
          this.categoryStats = data.category_stats;
          this.spinner.hide();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to load seva management data';
          this.spinner.hide();
          
          this.snackBar.open(this.error || 'Unknown error occurred', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });

    // Load statistics separately
    this.sevaService.getStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.statistics = stats;
        },
        error: (error) => {
          console.error('Failed to load statistics:', error);
        }
      });
  }

  // Navigation methods
  navigateToSevaCategories(): void {
    this.router.navigate(['/admin/sevas/categories']);
  }

  navigateToSevas(): void {
    this.router.navigate(['/admin/sevas/management']);
  }

  navigateToSchedules(): void {
    this.router.navigate(['/admin/sevas/schedules']);
  }

  navigateToBookings(): void {
    this.router.navigate(['/admin/sevas/bookings']);
  }

  // Seva actions
  editSeva(sevaId: number): void {
    this.router.navigate(['/admin/sevas', sevaId, 'edit']);
  }

  viewSeva(sevaId: number): void {
    this.router.navigate(['/admin/sevas', sevaId]);
  }

  // Schedule actions
  editSchedule(scheduleId: number): void {
    this.router.navigate(['/admin/seva-schedules', scheduleId, 'edit']);
  }

  viewSchedule(scheduleId: number): void {
    this.router.navigate(['/admin/seva-schedules', scheduleId]);
  }

  // Booking actions
  editBooking(bookingId: number): void {
    this.router.navigate(['/admin/seva-bookings', bookingId, 'edit']);
  }

  viewBooking(bookingId: number): void {
    this.router.navigate(['/admin/seva-bookings', bookingId]);
  }

  logout(): void {
    // Implement logout logic
    this.router.navigate(['/admin']);
  }
}
