import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SevaCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Seva {
  id: number;
  name: string;
  seva_type: 'pratyaksha' | 'paroksha';
  category: SevaCategory;
  category_id: number;
  description: string;
  how_performed: string;
  duration: string;
  start_time: string;
  end_time: string;
  base_cost: number;
  currency: string;
  temple_provides: string;
  devotee_brings: string;
  benefits: string;
  images: string[];
  is_active: boolean;
  max_participants?: number;
  created_by: any;
  created_at: string;
  updated_at: string;
}

export interface SevaSchedule {
  id: number;
  seva: Seva;
  seva_id: number;
  date: string;
  start_time: string;
  end_time: string;
  cost_override?: number;
  temple_provides_override?: string;
  devotee_brings_override?: string;
  benefits_override?: string;
  max_participants?: number;
  is_active: boolean;
  is_booked: boolean;
  effective_cost: number;
  effective_temple_provides: string;
  effective_devotee_brings: string;
  effective_benefits: string;
  is_past: boolean;
  is_today: boolean;
  is_future: boolean;
  created_by: any;
  created_at: string;
  updated_at: string;
}

export interface SevaBooking {
  id: number;
  user: any;
  seva_schedule: SevaSchedule;
  seva_schedule_id: number;
  booking_date: string;
  scheduled_date: string;
  scheduled_time: string;
  amount_paid: number;
  payment_status: string;
  payment_method?: string;
  transaction_id?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests?: string;
  number_of_participants: number;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  seva_type: string;
  category: string;
  cost: number;
  is_booked: boolean;
  is_active: boolean;
}

export interface SevaStatistics {
  total_sevas: number;
  total_pratyaksha_sevas: number;
  total_paroksha_sevas: number;
  total_schedules: number;
  total_bookings: number;
  total_revenue: number;
  upcoming_sevas: number;
  completed_sevas: number;
}

export interface SevaManagementData {
  recent_sevas: Seva[];
  recent_schedules: SevaSchedule[];
  recent_bookings: SevaBooking[];
  category_stats: SevaCategory[];
}

@Injectable({
  providedIn: 'root'
})
export class SevaService {

  private apiUrl = `${environment.apiUrl}/sevas`;

  constructor(private http: HttpClient) { }

  // Seva Categories
  getCategories(): Observable<SevaCategory[]> {
    console.log('SevaService: Getting categories from', `${this.apiUrl}/categories/`);
    return this.http.get<any>(`${this.apiUrl}/categories/`).pipe(
      map(response => {
        console.log('SevaService: Raw categories response:', response);
        // Handle paginated response
        if (response && response.results) {
          console.log('SevaService: Extracted categories from results:', response.results);
          return response.results;
        }
        // Handle direct array response
        console.log('SevaService: Using direct response:', response);
        return response;
      })
    );
  }

  createCategory(category: Partial<SevaCategory>): Observable<SevaCategory> {
    console.log('SevaService: Creating category', category);
    return this.http.post<SevaCategory>(`${this.apiUrl}/categories/`, category);
  }

  updateCategory(id: number, category: Partial<SevaCategory>): Observable<SevaCategory> {
    return this.http.put<SevaCategory>(`${this.apiUrl}/categories/${id}/`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}/`);
  }

  // Sevas
  getSevas(params?: any): Observable<Seva[]> {
    return this.http.get<any>(`${this.apiUrl}/sevas/`, { params }).pipe(
      map(response => {
        console.log('SevaService: Raw sevas response:', response);
        // Handle paginated response
        if (response && response.results) {
          console.log('SevaService: Extracted sevas from results:', response.results);
          return response.results;
        }
        // Handle direct array response
        console.log('SevaService: Using direct response:', response);
        return response;
      })
    );
  }

  getSeva(id: number): Observable<Seva> {
    return this.http.get<Seva>(`${this.apiUrl}/sevas/${id}/`);
  }

  createSeva(seva: Partial<Seva>): Observable<Seva> {
    return this.http.post<Seva>(`${this.apiUrl}/sevas/`, seva);
  }

  updateSeva(id: number, seva: Partial<Seva>): Observable<Seva> {
    return this.http.put<Seva>(`${this.apiUrl}/sevas/${id}/`, seva);
  }

  deleteSeva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sevas/${id}/`);
  }

  // Seva Schedules
  getSchedules(params?: any): Observable<SevaSchedule[]> {
    return this.http.get<any>(`${this.apiUrl}/schedules/`, { params }).pipe(
      map(response => {
        console.log('SevaService: Raw schedules response:', response);
        // Handle paginated response
        if (response && response.results) {
          console.log('SevaService: Extracted schedules from results:', response.results);
          return response.results;
        }
        // Handle direct array response
        console.log('SevaService: Using direct response:', response);
        return response;
      })
    );
  }

  getSchedule(id: number): Observable<SevaSchedule> {
    return this.http.get<SevaSchedule>(`${this.apiUrl}/schedules/${id}/`);
  }

  createSchedule(schedule: Partial<SevaSchedule>): Observable<SevaSchedule> {
    return this.http.post<SevaSchedule>(`${this.apiUrl}/schedules/`, schedule);
  }

  updateSchedule(id: number, schedule: Partial<SevaSchedule>): Observable<SevaSchedule> {
    return this.http.put<SevaSchedule>(`${this.apiUrl}/schedules/${id}/`, schedule);
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/schedules/${id}/`);
  }

  // Seva Bookings
  getBookings(params?: any): Observable<SevaBooking[]> {
    return this.http.get<any>(`${this.apiUrl}/bookings/`, { params }).pipe(
      map(response => {
        console.log('SevaService: Raw bookings response:', response);
        // Handle paginated response
        if (response && response.results) {
          console.log('SevaService: Extracted bookings from results:', response.results);
          return response.results;
        }
        // Handle direct array response
        console.log('SevaService: Using direct response:', response);
        return response;
      })
    );
  }

  getBooking(id: number): Observable<SevaBooking> {
    return this.http.get<SevaBooking>(`${this.apiUrl}/bookings/${id}/`);
  }

  createBooking(booking: Partial<SevaBooking>): Observable<SevaBooking> {
    return this.http.post<SevaBooking>(`${this.apiUrl}/bookings/`, booking);
  }

  updateBooking(id: number, booking: Partial<SevaBooking>): Observable<SevaBooking> {
    return this.http.put<SevaBooking>(`${this.apiUrl}/bookings/${id}/`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${id}/`);
  }

  // Calendar and Statistics
  getCalendarEvents(params?: any): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`${this.apiUrl}/calendar/`, { params });
  }

  getStatistics(params?: any): Observable<SevaStatistics> {
    return this.http.get<SevaStatistics>(`${this.apiUrl}/statistics/`, { params });
  }

  // Admin Management
  getAdminManagementData(): Observable<SevaManagementData> {
    return this.http.get<SevaManagementData>(`${this.apiUrl}/admin/management/`);
  }

  // Public Views (for devotees)
  getAvailableSevas(params?: any): Observable<Seva[]> {
    return this.http.get<Seva[]>(`${this.apiUrl}/available/`, { params });
  }

  getAvailableSchedules(params?: any): Observable<SevaSchedule[]> {
    return this.http.get<SevaSchedule[]>(`${this.apiUrl}/available-schedules/`, { params });
  }

  // Utility methods
  getSevaTypeLabel(sevaType: string): string {
    return sevaType === 'pratyaksha' ? 'Pratyaksha Seva' : 'Paroksha Seva';
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'warning',
      'confirmed': 'primary',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return colorMap[status] || 'secondary';
  }

  formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Booking status update
  updateBookingStatus(bookingId: number, status: string): Observable<SevaBooking> {
    return this.http.patch<SevaBooking>(`${this.apiUrl}/bookings/${bookingId}/status/`, { status });
  }
}
