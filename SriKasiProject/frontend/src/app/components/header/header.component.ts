import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="header-left">
        <button mat-icon-button (click)="toggleSidebar()" class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="app-title">🕉️ Temple Management</span>
      </div>

      <div class="header-right">
        <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-button">
          <mat-icon [matBadge]="notificationCount" matBadgeColor="warn">notifications</mat-icon>
        </button>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
          <mat-icon>account_circle</mat-icon>
          <span class="user-name">{{ currentUser?.first_name }} {{ currentUser?.last_name }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
      </div>

      <!-- Notification Menu -->
      <mat-menu #notificationMenu="matMenu" class="notification-menu">
        <div class="notification-header">
          <h3>Notifications</h3>
        </div>
        <mat-divider></mat-divider>
        <div class="notification-list">
          <div *ngFor="let notification of notifications" class="notification-item">
            <mat-icon class="notification-icon">{{ notification.icon }}</mat-icon>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ notification.time }}</div>
            </div>
          </div>
          <div *ngIf="notifications.length === 0" class="no-notifications">
            No new notifications
          </div>
        </div>
      </mat-menu>

      <!-- User Menu -->
      <mat-menu #userMenu="matMenu" class="user-menu">
        <button mat-menu-item (click)="navigateToProfile()">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </button>
        <button mat-menu-item (click)="navigateToSettings()">
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      height: 64px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-button {
      display: none;
    }

    .app-title {
      font-size: 1.2rem;
      font-weight: 500;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .notification-button {
      position: relative;
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .user-name {
      font-weight: 500;
    }

    .notification-menu {
      min-width: 300px;
    }

    .notification-header {
      padding: 16px;
      background-color: #f5f5f5;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .notification-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
    }

    .notification-item:hover {
      background-color: #f5f5f5;
    }

    .notification-icon {
      color: #666;
      margin-top: 2px;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 500;
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .notification-message {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 4px;
    }

    .notification-time {
      font-size: 0.7rem;
      color: #999;
    }

    .no-notifications {
      padding: 20px;
      text-align: center;
      color: #666;
      font-style: italic;
    }

    .user-menu {
      min-width: 200px;
    }

    @media (max-width: 768px) {
      .menu-button {
        display: block;
      }

      .user-name {
        display: none;
      }

      .app-title {
        font-size: 1rem;
      }
    }
  `],

})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  notificationCount = 0;
  notifications: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Mock notifications - replace with real notifications from your service
    this.loadNotifications();
  }

  toggleSidebar(): void {
    // Implement sidebar toggle logic
    console.log('Toggle sidebar');
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  navigateToSettings(): void {
    // Implement settings navigation
    console.log('Navigate to settings');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadNotifications(): void {
    // Mock notifications - replace with real API call
    this.notifications = [
      {
        icon: 'event',
        title: 'New Puja Scheduled',
        message: 'A new puja has been scheduled for tomorrow',
        time: '2 hours ago'
      },
      {
        icon: 'payment',
        title: 'Payment Successful',
        message: 'Your payment for Darshan booking has been confirmed',
        time: '1 day ago'
      }
    ];
    this.notificationCount = this.notifications.length;
  }
}
