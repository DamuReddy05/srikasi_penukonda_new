import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SevaService, Seva, SevaSchedule, SevaCategory, SevaStatistics } from '../../../services/seva.service';

interface ScheduleStatistics {
  todaySchedules: number;
  monthSchedules: number;
  todayBookings: number;
  monthBookings: number;
}

interface CalendarEvent {
  date: string;
  schedules: SevaSchedule[];
}

@Component({
  selector: 'app-admin-seva-schedules',
  templateUrl: './admin-seva-schedules.component.html',
  styleUrls: ['./admin-seva-schedules.component.css']
})
export class AdminSevaSchedulesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Statistics
  statistics: ScheduleStatistics = {
    todaySchedules: 0,
    monthSchedules: 0,
    todayBookings: 0,
    monthBookings: 0
  };

  // Calendar
  currentDate = new Date();
  selectedDate: Date | null = null;
  calendarEvents: CalendarEvent[] = [];
  
  // Data
  sevas: Seva[] = [];
  schedules: SevaSchedule[] = [];
  categories: SevaCategory[] = [];

  // Modal
  showAddModal = false;
  showEditModal = false;
  editingSchedule: SevaSchedule | null = null;

  // Form
  scheduleForm!: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private sevaService: SevaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) { 
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadStatistics();
    this.loadSevas();
    this.loadSchedules();
    this.generateCalendarEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.scheduleForm = this.fb.group({
      seva_id: ['', [Validators.required]],
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      cost_override: ['', []],
      max_participants: ['', []],
      temple_provides_override: ['', []],
      devotee_brings_override: ['', []],
      benefits_override: ['', []]
    });
  }

  // Statistics
  loadStatistics(): void {
    this.spinner.show();
    this.sevaService.getStatistics().pipe(takeUntil(this.destroy$)).subscribe({
      next: (stats) => {
        this.statistics = {
          todaySchedules: stats.total_schedules || 0,
          monthSchedules: stats.total_schedules || 0,
          todayBookings: stats.total_bookings || 0,
          monthBookings: stats.total_bookings || 0
        };
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.spinner.hide();
      }
    });
  }

  // Data Loading
  loadSevas(): void {
    console.log('Loading sevas for schedules...');
    this.sevaService.getSevas().pipe(takeUntil(this.destroy$)).subscribe({
      next: (sevas) => {
        console.log('Sevas loaded for schedules:', sevas);
        this.sevas = [...sevas];
      },
      error: (error) => {
        console.error('Failed to load sevas for schedules:', error);
      }
    });
  }

  loadSchedules(): void {
    this.spinner.show();
    this.error = null;

    this.sevaService.getSchedules().pipe(takeUntil(this.destroy$)).subscribe({
      next: (schedules) => {
        this.schedules = [...schedules];
        this.generateCalendarEvents();
        this.spinner.hide();
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to load schedules';
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

  // Calendar Functions
  generateCalendarEvents(): void {
    this.calendarEvents = [];
    
    // Group schedules by date
    const schedulesByDate = new Map<string, SevaSchedule[]>();
    
    this.schedules.forEach(schedule => {
      const dateKey = schedule.date;
      if (!schedulesByDate.has(dateKey)) {
        schedulesByDate.set(dateKey, []);
      }
      schedulesByDate.get(dateKey)!.push(schedule);
    });

    // Convert to calendar events
    schedulesByDate.forEach((schedules, date) => {
      this.calendarEvents.push({
        date,
        schedules
      });
    });
  }

  getSchedulesForDate(date: Date): SevaSchedule[] {
    const dateString = this.formatDate(date);
    const event = this.calendarEvents.find(e => e.date === dateString);
    return event ? event.schedules : [];
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Calendar Navigation
  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }

  // Date Selection
  selectDate(date: Date): void {
    this.selectedDate = date;
  }

  // Modal Functions
  openAddModal(): void {
    this.showAddModal = true;
    this.scheduleForm.reset();
    this.scheduleForm.patchValue({
      date: this.selectedDate ? this.formatDate(this.selectedDate) : this.formatDate(new Date())
    });
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
  }

  openEditModal(schedule: SevaSchedule): void {
    this.editingSchedule = schedule;
    this.showEditModal = true;
    this.scheduleForm.patchValue({
      seva_id: schedule.seva_id,
      date: schedule.date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      cost_override: schedule.cost_override,
      max_participants: schedule.max_participants,
      temple_provides_override: schedule.temple_provides_override,
      devotee_brings_override: schedule.devotee_brings_override,
      benefits_override: schedule.benefits_override
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingSchedule = null;
    this.resetForm();
  }

  // Form Submission
  onSubmit(): void {
    if (this.scheduleForm.valid) {
      this.isLoading = true;
      this.spinner.show();

      const scheduleData = this.scheduleForm.value;

      if (this.editingSchedule) {
        // Update existing schedule
        this.sevaService.updateSchedule(this.editingSchedule.id, scheduleData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (schedule) => {
              this.isLoading = false;
              this.spinner.hide();
              
              // Update the schedule in the list
              const index = this.schedules.findIndex(s => s.id === schedule.id);
              if (index !== -1) {
                this.schedules[index] = schedule;
                this.schedules = [...this.schedules];
              }
              
              this.generateCalendarEvents();
              this.closeEditModal();
              
              this.snackBar.open('Schedule updated successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
            },
            error: (error) => {
              this.handleError(error, 'Failed to update schedule');
            }
          });
      } else {
        // Create new schedule
        this.sevaService.createSchedule(scheduleData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (schedule) => {
              this.isLoading = false;
              this.spinner.hide();
              
              this.schedules = [schedule, ...this.schedules];
              this.generateCalendarEvents();
              this.closeAddModal();
              
              this.snackBar.open('Schedule created successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
            },
            error: (error) => {
              this.handleError(error, 'Failed to create schedule');
            }
          });
      }
    }
  }

  // Delete Schedule
  deleteSchedule(schedule: SevaSchedule): void {
    const sevaName = this.getSevaName(schedule.seva_id);
    if (confirm(`Are you sure you want to delete the schedule for ${sevaName} on ${schedule.date}?`)) {
      this.spinner.show();
      
      this.sevaService.deleteSchedule(schedule.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.spinner.hide();
            
            // Remove from list
            this.schedules = this.schedules.filter(s => s.id !== schedule.id);
            this.generateCalendarEvents();
            
            this.snackBar.open('Schedule deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.handleError(error, 'Failed to delete schedule');
          }
        });
    }
  }

  // Utility Functions
  resetForm(): void {
    this.scheduleForm.reset();
    this.scheduleForm.markAsPristine();
    this.scheduleForm.markAsUntouched();
    this.scheduleForm.updateValueAndValidity();
  }

  handleError(error: any, defaultMessage: string): void {
    this.isLoading = false;
    this.spinner.hide();
    
    const errorMessage = error.error?.message || defaultMessage;
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  getSevaName(sevaId: number): string {
    const seva = this.sevas.find(s => s.id === sevaId);
    return seva ? seva.name : 'Unknown Seva';
  }

  getSevaTypeLabel(sevaType: string): string {
    return this.sevaService.getSevaTypeLabel(sevaType);
  }

  navigateBack(): void {
    this.router.navigate(['/admin/sevas']);
  }

  // Calendar Helper Methods
  getCalendarDays(): Date[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
