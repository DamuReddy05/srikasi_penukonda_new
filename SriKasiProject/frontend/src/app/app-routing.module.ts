import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SevasComponent } from './components/sevas/sevas.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { VolunteerComponent } from './components/volunteer/volunteer.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminSevasComponent } from './components/admin/admin-sevas/admin-sevas.component';
import { AdminSevaCategoriesComponent } from './components/admin/admin-seva-categories/admin-seva-categories.component';
import { AdminSevaSchedulesComponent } from './components/admin/admin-seva-schedules/admin-seva-schedules.component';
import { AdminSevaBookingsComponent } from './components/admin/admin-seva-bookings/admin-seva-bookings.component';
import { AdminSevaManagementComponent } from './components/admin/admin-seva-management/admin-seva-management.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent },
  { path: 'sevas', component: SevasComponent },
  { path: 'bookings', component: BookingsComponent },
  { path: 'volunteer', component: VolunteerComponent },
  { path: 'admin', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
            { path: 'admin/sevas', component: AdminSevasComponent, canActivate: [AdminGuard] },
          { path: 'admin/sevas/management', component: AdminSevaManagementComponent, canActivate: [AdminGuard] },
          { path: 'admin/sevas/categories', component: AdminSevaCategoriesComponent, canActivate: [AdminGuard] },
          { path: 'admin/sevas/schedules', component: AdminSevaSchedulesComponent, canActivate: [AdminGuard] },
          { path: 'admin/sevas/bookings', component: AdminSevaBookingsComponent, canActivate: [AdminGuard] },
          // Admin routes - temporarily redirect to dashboard until components are created
          { path: 'admin/users', redirectTo: '/admin/dashboard' },
          { path: 'admin/bookings', redirectTo: '/admin/dashboard' },
          { path: 'admin/expenses', redirectTo: '/admin/dashboard' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
