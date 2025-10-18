import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="temple-logo">🕉️</div>
          <h1>Sri Kasi Vishweswara Swamy Devasthanam</h1>
          <p>Penukonda</p>
          <h2>Welcome to Our Temple Services</h2>
          <p>Please sign in with your Gmail account to access temple services</p>
        </div>
        
        <div class="login-options">
          <button 
            class="gmail-login-btn"
            (click)="loginWithGmail()"
            [disabled]="isLoading">
            <div class="gmail-icon">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <span>Continue with Gmail</span>
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          </button>

          <div class="divider">
            <span>or</span>
          </div>

          <button 
            class="admin-login-btn"
            (click)="goToAdminLogin()">
            <i class="fas fa-user-shield"></i>
            <span>Admin Login</span>
          </button>
        </div>

        <div class="login-footer">
          <p>By continuing, you agree to our 
            <a href="#" class="terms-link">Terms of Service</a> and 
            <a href="#" class="terms-link">Privacy Policy</a>
          </p>
          <p>Don't have an account? 
            <a routerLink="/register" class="register-link">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      padding: 40px;
      width: 100%;
      max-width: 450px;
      text-align: center;
    }

    .login-header {
      margin-bottom: 40px;
    }

    .temple-logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #FF6B35, #F7931E);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 20px;
    }

    .login-header h1 {
      color: #8B4513;
      margin: 0 0 5px 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .login-header p {
      color: #FF6B35;
      margin: 0 0 20px 0;
      font-weight: 500;
    }

    .login-header h2 {
      color: #333;
      margin: 0 0 10px 0;
      font-size: 1.4rem;
    }

    .login-header p:last-child {
      color: #666;
      margin: 0;
      font-size: 14px;
    }

    .login-options {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;
    }

    .gmail-login-btn {
      background: white;
      color: #333;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      position: relative;
    }

    .gmail-login-btn:hover {
      border-color: #4285F4;
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
    }

    .gmail-login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .gmail-icon {
      display: flex;
      align-items: center;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 20px 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e0e0e0;
    }

    .divider span {
      background: white;
      padding: 0 15px;
      color: #666;
      font-size: 14px;
    }

    .admin-login-btn {
      background: linear-gradient(135deg, #8B4513, #A0522D);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .admin-login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
    }

    .login-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
    }

    .login-footer p {
      color: #666;
      margin: 0 0 10px 0;
      font-size: 14px;
    }

    .terms-link {
      color: #8B4513;
      text-decoration: none;
      font-weight: 500;
    }

    .terms-link:hover {
      text-decoration: underline;
    }

    .register-link {
      color: #FF6B35;
      text-decoration: none;
      font-weight: 500;
    }

    .register-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 30px 20px;
      }
      
      .login-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loginWithGmail(): void {
    this.isLoading = true;
    this.spinner.show();

    // Simulate Gmail login process
    setTimeout(() => {
      this.isLoading = false;
      this.spinner.hide();
      
      // For now, we'll simulate a successful login
      // In real implementation, this would integrate with Google OAuth
      this.snackBar.open('Gmail login feature will be implemented with Google OAuth', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['info-snackbar']
      });
    }, 2000);
  }

  goToAdminLogin(): void {
    this.router.navigate(['/admin']);
  }
}
