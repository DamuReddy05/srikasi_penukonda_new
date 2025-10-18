import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if user is authenticated
    if (!this.authService.isTokenValid()) {
      console.log('AuthGuard: Token is invalid or expired');
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if token is about to expire (within 5 minutes)
    const tokenPayload = this.authService.getTokenPayload();
    if (tokenPayload) {
      const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (expiryTime - currentTime < fiveMinutes) {
        console.log('AuthGuard: Token is about to expire, attempting refresh');
        // Token is about to expire, try to refresh it
        this.authService.refreshToken().subscribe({
          next: (response) => {
            console.log('AuthGuard: Token refreshed successfully');
          },
          error: (error) => {
            console.log('AuthGuard: Token refresh failed');
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          }
        });
      }
    }

    console.log('AuthGuard: Access granted');
    return true;
  }
}
