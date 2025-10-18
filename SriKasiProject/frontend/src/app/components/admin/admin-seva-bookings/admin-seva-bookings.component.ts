import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, takeUntil } from 'rxjs';
import { SevaService, SevaBooking } from '../../../services/seva.service';

@Component({
  selector: 'app-admin-seva-bookings',
  template: `
    <div class="admin-bookings-container">
      <!-- Header -->
      <div class="admin-header">
        <div class="header-left">
          <h1>📋 Seva Bookings Management</h1>
          <p>Manage and track all seva bookings</p>
        </div>
        <div class="header-right">
          <button class="back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            Back to Sevas
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <h2>🔍 Filters</h2>
        <div class="filters-grid">
          <div class="filter-field">
            <label for="status-filter">Status</label>
            <select id="status-filter" [(ngModel)]="statusFilter" (change)="applyFilters()" class="filter-select">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="filter-field">
            <label for="date-filter">Date Range</label>
            <select id="date-filter" [(ngModel)]="dateFilter" (change)="applyFilters()" class="filter-select">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <div class="filter-field">
            <label for="search-filter">Search</label>
            <input 
              type="text" 
              id="search-filter" 
              [(ngModel)]="searchFilter" 
              (input)="applyFilters()"
              placeholder="Search by devotee name or seva name"
              class="filter-input"
            >
          </div>
        </div>
      </div>

      <!-- Bookings List -->
      <div class="bookings-section">
        <h2>📋 All Bookings</h2>
        <div class="bookings-stats">
          <div class="stat-item">
            <span class="stat-label">Total:</span>
            <span class="stat-value">{{ filteredBookings.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Pending:</span>
            <span class="stat-value pending">{{ getStatusCount('pending') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Confirmed:</span>
            <span class="stat-value confirmed">{{ getStatusCount('confirmed') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Completed:</span>
            <span class="stat-value completed">{{ getStatusCount('completed') }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Cancelled:</span>
            <span class="stat-value cancelled">{{ getStatusCount('cancelled') }}</span>
          </div>
        </div>

        <div class="bookings-grid" *ngIf="filteredBookings.length > 0; else noBookings">
          <div class="booking-card" *ngFor="let booking of filteredBookings">
            <div class="booking-header">
              <h3>{{ booking.seva_schedule.seva.name }}</h3>
              <div class="booking-status">
                <span class="status-badge" [class]="sevaService.getStatusColor(booking.status)">
                  {{ sevaService.getStatusLabel(booking.status) }}
                </span>
              </div>
            </div>
            <div class="booking-content">
              <div class="booking-info">
                <div class="info-row">
                  <span class="info-label">Devotee:</span>
                  <span class="info-value">{{ booking.user.first_name }} {{ booking.user.last_name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Email:</span>
                  <span class="info-value">{{ booking.user.email }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">{{ booking.user.phone_number || 'Not provided' }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Date:</span>
                  <span class="info-value">{{ sevaService.formatDate(booking.scheduled_date) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Time:</span>
                  <span class="info-value">{{ sevaService.formatTime(booking.seva_schedule.start_time) }} - {{ sevaService.formatTime(booking.seva_schedule.end_time) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Amount:</span>
                  <span class="info-value">{{ sevaService.formatCurrency(booking.amount_paid) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Payment Status:</span>
                  <span class="info-value" [class]="booking.payment_status">
                    {{ booking.payment_status === 'paid' ? 'Paid' : 'Pending' }}
                  </span>
                </div>
                <div class="info-row" *ngIf="booking.special_requests">
                  <span class="info-label">Special Requests:</span>
                  <span class="info-value">{{ booking.special_requests }}</span>
                </div>
              </div>
              
              <div class="booking-meta">
                <div class="meta-item">
                  <i class="fas fa-calendar"></i>
                  Booked: {{ sevaService.formatDate(booking.created_at) }}
                </div>
                <div class="meta-item" *ngIf="booking.updated_at !== booking.created_at">
                  <i class="fas fa-clock"></i>
                  Updated: {{ sevaService.formatDate(booking.updated_at) }}
                </div>
              </div>
            </div>
            <div class="booking-actions">
              <button 
                class="action-btn confirm" 
                *ngIf="booking.status === 'pending'"
                (click)="updateBookingStatus(booking.id, 'confirmed')"
              >
                <i class="fas fa-check"></i>
                Confirm
              </button>
              <button 
                class="action-btn complete" 
                *ngIf="booking.status === 'confirmed'"
                (click)="updateBookingStatus(booking.id, 'completed')"
              >
                <i class="fas fa-check-double"></i>
                Complete
              </button>
              <button 
                class="action-btn cancel" 
                *ngIf="booking.status === 'pending' || booking.status === 'confirmed'"
                (click)="updateBookingStatus(booking.id, 'cancelled')"
              >
                <i class="fas fa-times"></i>
                Cancel
              </button>
              <button class="action-btn view" (click)="viewBookingDetails(booking)">
                <i class="fas fa-eye"></i>
                View Details
              </button>
            </div>
          </div>
        </div>
        <ng-template #noBookings>
          <div class="no-data">
            <p>No bookings found</p>
            <p>Try adjusting your filters or check back later</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .admin-bookings-container {
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

    .back-btn {
      background: linear-gradient(135deg, #1a237e, #3949ab);
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

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.3);
    }

    .filters-section, .bookings-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .filters-section h2, .bookings-section h2 {
      color: #1a237e;
      margin: 0 0 25px 0;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-field label {
      color: #1a237e;
      font-weight: 500;
      font-size: 14px;
    }

    .filter-select, .filter-input {
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }

    .filter-select:focus, .filter-input:focus {
      outline: none;
      border-color: #1a237e;
    }

    .bookings-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }

    .stat-item {
      background: #f8f9ff;
      border: 2px solid #e3f2fd;
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .stat-value {
      color: #1a237e;
      font-size: 16px;
      font-weight: bold;
    }

    .stat-value.pending {
      color: #f57c00;
    }

    .stat-value.confirmed {
      color: #1976d2;
    }

    .stat-value.completed {
      color: #2e7d32;
    }

    .stat-value.cancelled {
      color: #c62828;
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
      gap: 20px;
    }

    .booking-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
    }

    .booking-card:hover {
      border-color: #1a237e;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(26, 35, 126, 0.15);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .booking-header h3 {
      color: #1a237e;
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #fff3e0;
      color: #f57c00;
    }

    .status-badge.confirmed {
      background: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.completed {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-badge.cancelled {
      background: #ffebee;
      color: #c62828;
    }

    .booking-content {
      margin-bottom: 20px;
    }

    .booking-info {
      margin-bottom: 15px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .info-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }

    .info-value {
      color: #1a237e;
      font-size: 14px;
      font-weight: 600;
      text-align: right;
      max-width: 60%;
    }

    .info-value.paid {
      color: #2e7d32;
    }

    .info-value.pending {
      color: #f57c00;
    }

    .booking-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }

    .meta-item {
      color: #999;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .booking-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .action-btn {
      flex: 1;
      min-width: 100px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.3s ease;
    }

    .action-btn.confirm {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .action-btn.confirm:hover {
      background: #c8e6c9;
    }

    .action-btn.complete {
      background: #e3f2fd;
      color: #1976d2;
    }

    .action-btn.complete:hover {
      background: #bbdefb;
    }

    .action-btn.cancel {
      background: #ffebee;
      color: #c62828;
    }

    .action-btn.cancel:hover {
      background: #ffcdd2;
    }

    .action-btn.view {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .action-btn.view:hover {
      background: #e1bee7;
    }

    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-data p {
      margin: 0 0 10px 0;
      font-size: 16px;
    }

    .no-data p:last-child {
      font-size: 14px;
      color: #999;
    }

    @media (max-width: 768px) {
      .admin-bookings-container {
        padding: 15px;
      }

      .admin-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .bookings-stats {
        flex-direction: column;
      }

      .bookings-grid {
        grid-template-columns: 1fr;
      }

      .booking-actions {
        flex-direction: column;
      }

      .info-row {
        flex-direction: column;
        gap: 4px;
      }

      .info-value {
        text-align: left;
        max-width: 100%;
      }
    }
  `]
})
export class AdminSevaBookingsComponent implements OnInit, OnDestroy {
  bookings: SevaBooking[] = [];
  filteredBookings: SevaBooking[] = [];
  statusFilter: string = '';
  dateFilter: string = '';
  searchFilter: string = '';
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public sevaService: SevaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookings(): void {
    this.spinner.show();
    this.error = null;

    this.sevaService.getBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings) => {
          this.bookings = bookings;
          this.applyFilters();
          this.spinner.hide();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to load bookings';
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

  applyFilters(): void {
    let filtered = [...this.bookings];

    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(booking => booking.status === this.statusFilter);
    }

    // Date filter
    if (this.dateFilter) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      switch (this.dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => booking.scheduled_date === todayStr);
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.scheduled_date) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(booking => new Date(booking.scheduled_date) >= monthAgo);
          break;
        case 'upcoming':
          filtered = filtered.filter(booking => new Date(booking.scheduled_date) >= today);
          break;
        case 'past':
          filtered = filtered.filter(booking => new Date(booking.scheduled_date) < today);
          break;
      }
    }

    // Search filter
    if (this.searchFilter) {
      const search = this.searchFilter.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.user.first_name.toLowerCase().includes(search) ||
        booking.user.last_name.toLowerCase().includes(search) ||
        booking.user.email.toLowerCase().includes(search) ||
        booking.seva_schedule.seva.name.toLowerCase().includes(search)
      );
    }

    this.filteredBookings = filtered;
  }

  getStatusCount(status: string): number {
    return this.bookings.filter(booking => booking.status === status).length;
  }

  updateBookingStatus(bookingId: number, newStatus: string): void {
    const statusLabel = this.sevaService.getStatusLabel(newStatus);
    
    if (confirm(`Are you sure you want to ${newStatus} this booking?`)) {
      this.spinner.show();

      this.sevaService.updateBookingStatus(bookingId, newStatus)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedBooking) => {
            this.spinner.hide();
            
            // Update the booking in the list
            const index = this.bookings.findIndex(b => b.id === bookingId);
            if (index !== -1) {
              this.bookings[index] = updatedBooking;
              this.applyFilters();
            }
            
            this.snackBar.open(`Booking ${statusLabel.toLowerCase()} successfully!`, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.spinner.hide();
            
            const errorMessage = error.error?.message || `Failed to ${newStatus} booking`;
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  viewBookingDetails(booking: SevaBooking): void {
    // TODO: Implement detailed view modal or navigation
    this.snackBar.open('Detailed view coming soon!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/sevas']);
  }
}
