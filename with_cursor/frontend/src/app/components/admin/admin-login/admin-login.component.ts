import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService, AdminLoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  template: `
    <div class="admin-login-container">
      <div class="admin-login-card">
        <div class="admin-login-header">
          <div class="admin-logo">👑</div>
          <h1>Admin Panel</h1>
          <h2>Sri Kasi Vishweswara Swamy Devasthanam</h2>
          <p>Penukonda - Temple Management System</p>
        </div>
        
        <form [formGroup]="adminLoginForm" (ngSubmit)="onSubmit()" class="admin-login-form">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter admin email">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="adminLoginForm.get('email')?.hasError('required')">
              Email is required
            </mat-error>
            <mat-error *ngIf="adminLoginForm.get('email')?.hasError('email')">
              Please enter a valid email
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" placeholder="Enter admin password">
            <mat-icon matSuffix>lock</mat-icon>
            <mat-error *ngIf="adminLoginForm.get('password')?.hasError('required')">
              Password is required
            </mat-error>
          </mat-form-field>

          <button 
            mat-raised-button 
            type="submit" 
            class="admin-login-button"
            [disabled]="adminLoginForm.invalid || isLoading">
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
            <span *ngIf="!isLoading">Sign In as Admin</span>
          </button>
        </form>

        <div class="admin-login-footer">
          <button class="back-to-main" (click)="goToMain()">
            <i class="fas fa-arrow-left"></i>
            Back to Main Site
          </button>
          <p class="admin-note">
            <i class="fas fa-info-circle"></i>
            Only authorized users can access the admin panel
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
      padding: 20px;
    }

    .admin-login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 450px;
      text-align: center;
    }

    .admin-login-header {
      margin-bottom: 40px;
    }

    .admin-logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #1a237e, #3949ab);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 20px;
    }

    .admin-login-header h1 {
      color: #1a237e;
      margin: 0 0 10px 0;
      font-size: 2rem;
      font-weight: bold;
    }

    .admin-login-header h2 {
      color: #ff9800;
      margin: 0 0 5px 0;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .admin-login-header p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .admin-login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;
    }

    .form-field {
      width: 100%;
    }

    .admin-login-button {
      background: linear-gradient(135deg, #1a237e, #3949ab);
      color: white;
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .admin-login-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 35, 126, 0.3);
    }

    .admin-login-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .admin-login-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .back-to-main {
      background: transparent;
      color: #1a237e;
      border: 2px solid #1a237e;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin: 0 auto 15px;
    }

    .back-to-main:hover {
      background: #1a237e;
      color: white;
    }

    .admin-note {
      color: #666;
      margin: 0;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .admin-note i {
      color: #ff9800;
    }

    @media (max-width: 480px) {
      .admin-login-card {
        padding: 30px 20px;
      }
      
      .admin-login-header h1 {
        font-size: 1.6rem;
      }
    }
  `]
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.adminLoginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if admin is already logged in
    if (this.authService.isTokenValid() && this.authService.isAdmin()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
      this.router.navigate([returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.adminLoginForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const loginData: AdminLoginRequest = this.adminLoginForm.value;

      this.authService.adminLogin(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.spinner.hide();
          
          // Debug logging
          console.log('Admin Login - Response:', response);
          console.log('Admin Login - User Type:', response.user?.user_type);
          console.log('Admin Login - Is Admin:', this.authService.isAdmin());
          console.log('Admin Login - Current User:', this.authService.getCurrentUser());
          
          this.snackBar.open('Admin login successful!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
          
          // Navigate to admin dashboard or return URL
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          this.isLoading = false;
          this.spinner.hide();
          
          const errorMessage = error.error?.error || 'Admin login failed. Please try again.';
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

  goToMain(): void {
    this.router.navigate(['/']);
  }
}
