import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminDashboardData {
  statistics: {
    total_users: number;
    total_devotees: number;
    total_admins: number;
    new_users_this_month: number;
    active_users_last_week: number;
    total_family_members: number;
  };
  recent_users: User[];
  current_date?: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('current_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.clearStoredData();
      }
    }
  }

  private clearStoredData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  adminLogin(credentials: AdminLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/admin-login/`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(error => {
          console.error('Admin login error:', error);
          return throwError(() => error);
        })
      );
  }

  getAdminDashboard(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>(`${environment.apiUrl}/admin/dashboard/`)
      .pipe(
        catchError(error => {
          console.error('Admin dashboard error:', error);
          return throwError(() => error);
        })
      );
  }

  getAdminUsers(page: number = 1, pageSize: number = 20, search?: string, userType?: string): Observable<any> {
    let params = `?page=${page}&page_size=${pageSize}`;
    if (search) params += `&search=${search}`;
    if (userType) params += `&user_type=${userType}`;
    
    return this.http.get(`${environment.apiUrl}/admin/users/${params}`)
      .pipe(
        catchError(error => {
          console.error('Admin users error:', error);
          return throwError(() => error);
        })
      );
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/users/`, userData)
      .pipe(
        catchError(error => {
          console.error('Create user error:', error);
          return throwError(() => error);
        })
      );
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/admin/users/${userId}/`, userData)
      .pipe(
        catchError(error => {
          console.error('Update user error:', error);
          return throwError(() => error);
        })
      );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/users/${userId}/`)
      .pipe(
        catchError(error => {
          console.error('Delete user error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register/`, userData)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      this.http.post(`${environment.apiUrl}/auth/logout/`, { refresh_token: refreshToken })
        .subscribe({
          next: () => this.clearStoredData(),
          error: () => this.clearStoredData()
        });
    } else {
      this.clearStoredData();
    }
  }

  private handleAuthentication(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.user_type === 'admin';
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/token/refresh/`, {
      refresh: refreshToken
    }).pipe(
      tap(response => {
        localStorage.setItem('access_token', response.access);
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh);
        }
      }),
      catchError(error => {
        this.clearStoredData();
        return throwError(() => error);
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/profile/`, userData)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem('current_user', JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Profile update error:', error);
          return throwError(() => error);
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile/`)
      .pipe(
        tap(user => {
          this.currentUserSubject.next(user);
          localStorage.setItem('current_user', JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Profile fetch error:', error);
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (token && this.isTokenExpired()) {
      this.clearStoredData();
      return null;
    }
    return token;
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true;
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired();
  }

  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }
}
