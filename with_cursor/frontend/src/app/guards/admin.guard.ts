import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    console.log('AdminGuard: Checking access for route:', state.url);
    console.log('AdminGuard: Token valid:', this.authService.isTokenValid());
    console.log('AdminGuard: Is admin:', this.authService.isAdmin());
    console.log('AdminGuard: Current user:', this.authService.getCurrentUser());
    
    // Check if user is authenticated
    if (!this.authService.isTokenValid()) {
      console.log('AdminGuard: Token is invalid or expired');
      this.authService.logout();
      this.router.navigate(['/admin'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if user is admin
    if (!this.authService.isAdmin()) {
      console.log('AdminGuard: User is not an admin');
      this.router.navigate(['/admin'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if token is about to expire (within 5 minutes)
    const tokenPayload = this.authService.getTokenPayload();
    if (tokenPayload) {
      const expiryTime = tokenPayload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
      
      if (expiryTime - currentTime < fiveMinutes) {
        console.log('AdminGuard: Token is about to expire, attempting refresh');
        // Token is about to expire, try to refresh it
        this.authService.refreshToken().subscribe({
          next: (response) => {
            console.log('AdminGuard: Token refreshed successfully');
          },
          error: (error) => {
            console.log('AdminGuard: Token refresh failed');
            this.authService.logout();
            this.router.navigate(['/admin'], { queryParams: { returnUrl: state.url } });
          }
        });
      }
    }

    console.log('AdminGuard: Access granted');
    return true;
  }
}
